import { BudgetData, DeptData } from '@/lib/types.ts';

// external imports
import * as d3 from 'npm:d3';
import * as d3Sankey from 'npm:d3-sankey';

const width = 640;
const height = 400;

const margin = {
    top: 30,
    right: 100,
    bottom: 30,
    left: 100,
};

const year = 2011;

const initSankey = (budgetData: BudgetData[], deptData: DeptData[]) => {
    const categories = deptData.reduce<Set<string>>((acc, row) => acc.add(row.category), new Set());

    const data = {
        nodes: [...categories].map((category) => ({ name: category })),
        links: [
            { source: 'A', target: 'C', value: 10 },
            { source: 'A', target: 'D', value: 5 },
            { source: 'B', target: 'C', value: 5 },
            { source: 'B', target: 'D', value: 10 },
        ],
    };

    const sankeyDiv = document.getElementById('fundsFlow');
    const svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height);
    sankeyDiv?.replaceChildren(svg.node()!);

    const sankey = d3Sankey.sankey()
        .nodeId((d) => d.name)
        .nodeWidth(20)
        .nodePadding(10)
        .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const graph = sankey({
        nodes: data.nodes.map((d) => ({ ...d })),
        links: data.links.map((d) => ({ ...d })),
    });

    svg.selectAll('path')
        .data(graph.links)
        .join('path')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('fill', 'none')
        .attr('stroke', '#999')
        .attr('stroke-width', (d) => d.width);

    svg.selectAll('rect')
        .data(graph.nodes)
        .join('rect')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('fill', 'steelblue');

    svg.selectAll('text')
        .data(graph.nodes)
        .join('text')
        .attr('x', (d) => d.x0 - 5)
        .attr('y', (d) => (d.y0 + d.y1) / 2)
        .attr('text-anchor', 'end')
        .attr('dy', '0.35em')
        .text((d) => d.name);
};

export default initSankey;
