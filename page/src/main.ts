import { getDict, getUnique, importData } from '@/lib/utils.ts';
import initAnnualTrends from '@/views/annualTrends/index.ts';
import initCompare from '@/views/compare/index.ts';
import initDeptTable from '@/views/deptTable/index.ts';
import initSankey from './views/sankey/index.ts';

enum View {
    AnnualTrends = 'annualTrends',
    Compare = 'compare',
    DeptList = 'deptsList',
    FundsFlow = 'fundsFlow',
}

const viewUpdate = (view: View) => {
    [...document.getElementsByClassName('view')].forEach((element) => {
        if (element.id === view) element.classList.add('selected');
        else element.classList.remove('selected');
    });
};

const main = async () => {
    const budgetData = await importData('ordinance');
    const deptsData = await importData('depts');
    const fundsData = await importData('funds');

    const deptsDict = getDict(deptsData);
    const fundsDict = getDict(fundsData);
    const categories = getUnique(deptsData, 'category');

    const radios = document.getElementsByTagName('input');
    [...radios].forEach((radio) => {
        radio.addEventListener('change', () => {
            viewUpdate(radio.value as View);
        });
    });

    initAnnualTrends(budgetData, deptsData, deptsDict, fundsDict, categories);
    initCompare(budgetData, deptsData, fundsDict);
    initDeptTable(budgetData, deptsData);
    initSankey(budgetData);
};

main();
