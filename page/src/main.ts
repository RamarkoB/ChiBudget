import { getDict, getUnique, importData } from './lib/utils.ts';
import initAnnualTrends from './annualTrends/index.ts';
import initCompare from './compare/index.ts';

const main = async () => {
    const budgetData = await importData('ordinance');
    const deptsData = await importData('depts');
    const fundsData = await importData('funds');

    const deptsDict = getDict(deptsData);
    const fundsDict = getDict(fundsData);
    const categories = getUnique(deptsData, 'category');

    initAnnualTrends(budgetData, deptsData, deptsDict, fundsDict, categories);
    initCompare(budgetData, deptsData, fundsDict);
};

main();
