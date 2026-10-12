import { BudgetData, DeptData, FileDict, FundsData } from '../lib/types.ts';
import { appendOption, years } from '../lib/utils.ts';
import createCompareTable from './table.ts';

type Selectors = [
    HTMLSelectElement,
    HTMLSelectElement,
    HTMLSelectElement,
    HTMLSelectElement,
];

const initCompare = (
    budgetData: BudgetData[],
    deptsData: DeptData[],
    fundsDict: FileDict<FundsData>,
) => {
    const selectElements = document.getElementsByTagName('select');
    const compareYear1 = selectElements.namedItem('compareYear1');
    const compareYear2 = selectElements.namedItem('compareYear2');
    const compareDept1 = selectElements.namedItem('compareDept1');
    const compareDept2 = selectElements.namedItem('compareDept2');
    if (!compareYear1 || !compareYear2) return;
    if (!compareDept1 || !compareDept2) return;

    years.forEach((year) => {
        const yearString = year.toString();
        appendOption(compareYear1, yearString, yearString);
        appendOption(compareYear2, yearString, yearString);
    });

    deptsData.forEach((dept) => {
        appendOption(compareDept1, `${dept.id} - ${dept.name}`, dept.id);
        appendOption(compareDept2, `${dept.id} - ${dept.name}`, dept.id);
    });

    compareYear1.value = '2025';
    compareYear2.value = '2026';
    const selectors: Selectors = [compareYear1, compareYear2, compareDept1, compareDept2];
    selectors.forEach((selector) => selector.addEventListener('change', () => handleSelectors(budgetData, fundsDict, selectors)));

    handleSelectors(budgetData, fundsDict, selectors);
};

const handleSelectors = (
    budgetData: BudgetData[],
    fundsDict: FileDict<FundsData>,
    [compareYear1, compareYear2, compareDept1, compareDept2]: Selectors,
) => createCompareTable(budgetData, fundsDict, {
    fstYear: Number(compareYear1.value) as (typeof years)[number],
    fstDept: compareDept1.value,
    sndYear: Number(compareYear2.value) as (typeof years)[number],
    sndDept: compareDept2.value,
});

export default initCompare;
