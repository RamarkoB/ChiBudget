import { DeptsData, FileDict, FundsData, OrdinanceData } from '@/lib/types.ts';
import { appendOption } from '@/lib/utils.ts';
import { graphAnnualTrends } from './graph.ts';

const initAnnualTrends = (
    ordinanceData: OrdinanceData[],
    deptsData: DeptsData[],
    deptsDict: FileDict<DeptsData>,
    fundsDict: FileDict<FundsData>,
    categories: string[],
) => {
    const categorySelector = document.getElementsByTagName('select').namedItem('annualTrendCategories');
    const deptSelector = document.getElementsByTagName('select').namedItem('annualTrendDepts');
    const annualTrends = document.getElementById('annualTrendsGraph');
    if (!categorySelector || !deptSelector || !annualTrends) return;

    appendOption(categorySelector, 'All', 'All');
    categories.forEach((category) => appendOption(categorySelector, category, category));
    categorySelector.addEventListener('change', () => {
        graphAnnualTrends(annualTrends, ordinanceData, deptsDict, fundsDict, { category: categorySelector?.value, department: 'All' });
        deptSelector.value = 'All';
    });

    appendOption(deptSelector, 'All', 'All');
    deptsData.forEach((dept) => appendOption(deptSelector, `${dept.id} - ${dept.name}`, dept.id));
    deptSelector.addEventListener('change', () => {
        graphAnnualTrends(annualTrends, ordinanceData, deptsDict, fundsDict, { category: 'All', department: deptSelector?.value });
        categorySelector.value = 'All';
    });

    graphAnnualTrends(annualTrends, ordinanceData, deptsDict, fundsDict, { category: 'All', department: 'All' });
};

export default initAnnualTrends;
