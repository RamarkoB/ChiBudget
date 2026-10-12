import { BudgetData, DeptData, FileDict, FundsData } from '../lib/types.ts';
import { appendOption } from '../lib/utils.ts';
import { graphAnnualTrends } from './graph.ts';

const initAnnualTrends = (
    budgetData: BudgetData[],
    deptsData: DeptData[],
    deptsDict: FileDict<DeptData>,
    fundsDict: FileDict<FundsData>,
    categories: string[],
) => {
    console.log('Initalizing Annual Trends');
    const categorySelector = document
        .getElementsByTagName('select')
        .namedItem('categories');
    const deptSelector = document
        .getElementsByTagName('select')
        .namedItem('departments');
    if (!categorySelector || !deptSelector) return;

    const annualTrends = document.getElementById('annualTrendsGraph');
    if (!annualTrends) return;

    appendOption(categorySelector, 'All', 'All');
    categories.forEach((category) => appendOption(categorySelector, category, category));
    categorySelector.addEventListener('change', () => {
        graphAnnualTrends(annualTrends, budgetData, deptsDict, fundsDict, { category: categorySelector?.value, department: 'All' });
        deptSelector.value = 'All';
    });

    appendOption(deptSelector, 'All', 'All');
    deptsData.forEach((dept) => appendOption(deptSelector, `${dept.id} - ${dept.name}`, dept.id));

    deptSelector.addEventListener('change', () => {
        graphAnnualTrends(annualTrends, budgetData, deptsDict, fundsDict, { category: 'All', department: deptSelector?.value });
        categorySelector.value = 'All';
    });

    graphAnnualTrends(annualTrends, budgetData, deptsDict, fundsDict, { category: 'All', department: 'All' });
};

export default initAnnualTrends;
