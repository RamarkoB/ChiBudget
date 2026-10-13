import { BudgetData, DeptData } from '../lib/types.ts';
import { appendOption, fmtMoney, years } from '../lib/utils.ts';

const createTableCell = (value: string) => {
    const cell = document.createElement('td');
    cell.innerText = value;
    return cell;
};

const createDeptTable = (budgetData: BudgetData[], deptsData: DeptData[], year: (typeof years)[number], deptTable: HTMLElement) => {
    const deptSumDict = budgetData.reduce<Record<string, number>>((acc, row) => {
        acc[row.deptNum] = (acc[row.deptNum] ?? 0) + row[year];
        return acc;
    }, {});

    const tableRows = deptsData.flatMap((dept) => {
        const tableRow = document.createElement('tr');

        const deptSum = deptSumDict[dept.id];
        if (!deptSum || deptSum === 0) return [];

        tableRow.append(createTableCell(`${dept.id} - ${dept.name}`), createTableCell(fmtMoney(deptSum)));
        return [tableRow];
    });

    deptTable.replaceChildren(...tableRows);
};

const initDeptTable = (budgetData: BudgetData[], deptsData: DeptData[]) => {
    const yearSelector = document.getElementsByTagName('select').namedItem('deptTableYear');
    const deptTable = document.getElementById('deptTable');
    if (!yearSelector || !deptTable) return;

    years.forEach((year) => {
        const yearString = year.toString();
        appendOption(yearSelector, yearString, yearString);
    });
    yearSelector.value = '2026';
    yearSelector.addEventListener('change', () => {
        createDeptTable(budgetData, deptsData, Number(yearSelector.value) as (typeof years)[number], deptTable);
    });

    createDeptTable(budgetData, deptsData, 2026, deptTable);
};

export default initDeptTable;
