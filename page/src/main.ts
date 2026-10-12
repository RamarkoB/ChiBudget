import initCompare from './compare/index.ts';
import { getDict, getUnique, importData } from './lib/utils.ts';
import initTimeSeries from './timeSeries/index.ts';

const main = async () => {
    const budgetData = await importData('ordinance');
    const deptsData = await importData('depts');
    const fundsData = await importData('funds');

    const deptsDict = getDict(deptsData);
    const fundsDict = getDict(fundsData);
    const categories = getUnique(deptsData, 'category');

    initTimeSeries(budgetData, deptsData, deptsDict, fundsDict, categories);
    initCompare(budgetData, deptsData, fundsDict);
};

main();
