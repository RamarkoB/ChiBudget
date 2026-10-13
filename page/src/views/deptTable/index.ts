import { BudgetData, DeptData } from '@/lib/types.ts';
import { fmtMoney, years } from '@/lib/utils.ts';

const createTableCell = (value: string) => {
    const cell = document.createElement('td');
    cell.innerText = value;
    return cell;
};

const createDeptTable = (budgetData: BudgetData[], deptsData: DeptData[], deptTable: HTMLElement) => {
    const deptSumDict = budgetData.reduce<Record<string, Record<string, number>>>(
        (acc, row) => {
            years.forEach((year) => {
                if (acc[row.deptNum]) acc[row.deptNum][year] = (acc[row.deptNum][year] ?? 0) + row[year];
                else acc[row.deptNum] = { [year]: row[year] };

                if (acc['total']) acc['total'][year] = (acc['total'][year] ?? 0) + row[year];
                else acc['total'] = { [year]: row[year] };
            });

            return acc;
        },
        {},
    );

    const tableHeader = document.createElement('tr');
    ['Department', ...years.map((year) => year.toString())].forEach((value) => {
        const cell = document.createElement('th');
        cell.innerText = value;
        tableHeader.appendChild(cell);
    });

    const tableRows = deptsData.map((dept) => {
        const tableRow = document.createElement('tr');

        tableRow.appendChild(createTableCell(`${dept.id} - ${dept.name}`));
        years.forEach((year) => tableRow.append(createTableCell(fmtMoney(deptSumDict[dept.id][year] ?? 0))));
        return tableRow;
    });

    const tableFooter = document.createElement('tr');
    const titleCell = createTableCell('Total');
    titleCell.className = 'totalTitle';
    tableFooter.appendChild(titleCell);
    years.forEach((year) => tableFooter.append(createTableCell(fmtMoney(deptSumDict['total'][year]))));

    deptTable.replaceChildren(tableHeader, ...tableRows, tableFooter);
};

const initDeptTable = (budgetData: BudgetData[], deptsData: DeptData[]) => {
    const deptTable = document.getElementById('deptTable');
    if (!deptTable) return;

    createDeptTable(budgetData, deptsData, deptTable);
};

export default initDeptTable;
