// external imports
import * as d3 from 'npm:d3';
import * as d3Sankey from 'npm:d3-sankey';

// internal imports
import { appendOption } from '@/lib/utils.ts';
import { DataYear, DeptsData, FileDict, FundsData, OrdinanceData, years } from '@/lib/types.ts';

type SankeyRecord = Record<string, Record<string, number>>;

const width = 1020;
const height = 600;

const margin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30,
};

const deptCategories = [
    'Public Safety',
    'Infrastructure Services',
    'General Financing',
    'Finance & Administration',
    'Community Services',
    'City Development',
    'Regulatory',
    'Legislative & Elections',
];

const fundCategories = [
    'Corporate Funds',
    'Enterprise Funds',
    'Pension Funds',
    'Special Revenue Funds',
    'Debt Service Funds',
    'Grant Funds',
];

const initFundsFlow = (ordinanceData: OrdinanceData[], deptDict: FileDict<DeptsData>, fundsDict: FileDict<FundsData>) => {
    const yearSelector = document.getElementsByTagName('select').namedItem('fundsFlowYear');
    if (!yearSelector) return;

    years.forEach((year) => {
        const yearString = year.toString();
        appendOption(yearSelector, yearString, yearString);
    });

    yearSelector.value = '2026';
    yearSelector.addEventListener('change', () => {
        const value = Number(yearSelector.value) as DataYear;
        graphFundsFlow(ordinanceData, deptDict, fundsDict, value);
    });

    graphFundsFlow(ordinanceData, deptDict, fundsDict, 2026);
};

const graphFundsFlow = (ordinanceData: OrdinanceData[], deptDict: FileDict<DeptsData>, fundsDict: FileDict<FundsData>, year: DataYear) => {
    const linksDict = ordinanceData.reduce<SankeyRecord>((acc, row) => {
        const fundCategory = fundsDict[row.fundCode].category;
        const deptCategory = deptDict[row.deptNum].category;

        if (acc[fundCategory]) acc[fundCategory][deptCategory] = (acc[fundCategory][deptCategory] ?? 0) + row[year];
        else acc[fundCategory] = { [deptCategory]: row[year] };

        return acc;
    }, {});

    const nodes = [...deptCategories, ...fundCategories].map((category) => ({ name: category }));
    const links = fundCategories.flatMap((fundCategory) =>
        deptCategories.map((deptCategory) => ({
            source: fundCategory,
            target: deptCategory,
            value: linksDict[fundCategory][deptCategory] ?? 0,
        }))
    );

    const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height);

    const sankey = d3Sankey.sankey()
        .nodeId((d) => d.name)
        .nodeWidth(200)
        .nodePadding(10)
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const graph = sankey({ nodes, links });

    svg.selectAll('path')
        .data(graph.links)
        .join('path')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('fill', 'none')
        .attr('stroke', 'rgba(70, 130, 180, 0.5)')
        .attr('stroke-width', (d) => d.width ?? null)
        .on('mouseover', (e, d) => {
            console.log(`${d.source.name} -> ${d.target.name}: ${d.value}`);
        });

    svg.selectAll('rect')
        .data(graph.nodes)
        .join('rect')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('fill', 'steelblue')
        .on('mouseover', (e, d) => {
            console.log(`${d.name}: ${d.value}`);
        });

    svg.selectAll('text')
        .data(graph.nodes)
        .join('text')
        .attr('x', (d) => (d.x0 + d.x1) / 2)
        .attr('y', (d) => (d.y0 + d.y1) / 2)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .text((d) => d.name);

    document.getElementById('fundsFlowGraph')?.replaceChildren(svg.node()!);
};

export default initFundsFlow;
