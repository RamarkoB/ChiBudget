// external imports
import * as d3 from 'npm:d3';

// internal imports
import { BudgetData, DeptData, FileDict, FundsData } from '../lib/types.ts';
import { years } from '../lib/utils.ts';

const createAnnualTrendsGraph = (
    budgetData: BudgetData[],
    fundsDict: FileDict<FundsData>,
) => {
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 40;

    const budgets = years.flatMap((year) => {
        const { local, grants } = budgetData.reduce(
            (acc, row) =>
                fundsDict[row.fundCode].type === 'LOCAL'
                    ? { grants: acc.grants, local: acc.local + row[year] }
                    : { grants: acc.grants + row[year], local: acc.local },
            { local: 0, grants: 0 },
        );

        return { year, local, grants };
    });

    const budgetsTidy = years.flatMap((year) => {
        const yearBudget = budgets.find((budgetRow) => budgetRow.year === year);
        return [
            { year, type: 'local', value: yearBudget?.local ?? 0 },
            { year, type: 'grants', value: yearBudget?.grants ?? 0 },
        ];
    });

    // Declare the x (horizontal position) scale.
    const x = d3
        .scaleLinear()
        .domain(d3.extent(years) as [number, number])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(budgets, (d) => d.local + d.grants)] as [
            number,
            number,
        ])
        .range([height - marginBottom, marginTop]);

    const series = d3
        .stack()
        .keys(['local', 'grants'])
        .value(([, group], key) => group.get(key).value)(
            d3.index(
                budgetsTidy,
                (d) => d.year,
                (d) => d.type,
            ),
        );

    const color = d3
        .scaleOrdinal()
        .domain(series.map((d) => d.key))
        .range(d3.schemeTableau10);

    // Construct an area shape.
    const area = d3
        .area()
        .x((d) => x(d.data[0]))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

    // Create the SVG annualTrends.
    const annualTrends = d3
        .create('svg')
        .attr('width', width)
        .attr('height', height);

    // Add the x-axis.
    annualTrends
        .append('g')
        .attr('transform', `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    // Add the y-axis.
    annualTrends
        .append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(
            d3
                .axisLeft(y)
                .tickFormat((s) => d3.format('.2s')(s).replace('G', 'B')),
        );

    annualTrends
        .append('g')
        .selectAll()
        .data(series)
        .join('path')
        .attr('fill', (d) => color(d.key))
        .attr('d', area)
        .append('title')
        .text((d) => d.key);

    // Append the SVG element.
    return annualTrends.node();
};

const graphAnnualTrends = (
    annualTrends: HTMLElement,
    budgetData: BudgetData[],
    deptsDict: FileDict<DeptData>,
    fundsDict: FileDict<FundsData>,
    options: { category: string; department: string },
) => {
    const data = options.category === 'All' && options.department === 'All'
        ? budgetData
        : options.category !== 'All'
        ? budgetData.filter((row) => deptsDict[row.deptNum].category === options.category)
        : budgetData.filter((row) => row.deptNum === options.department);

    const graphNode = createAnnualTrendsGraph(data, fundsDict);
    if (!graphNode) return;

    annualTrends.replaceChildren(graphNode);
};

export { graphAnnualTrends };
