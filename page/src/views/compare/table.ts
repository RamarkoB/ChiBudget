import { BudgetData, FileDict, FundsData } from '@/lib/types.ts';
import { fmtMoney, years } from '@/lib/utils.ts';

type BudgetComparison = {
    fstYear: (typeof years)[number];
    fstDept: string;
    sndYear: (typeof years)[number];
    sndDept: string;
};

type ComparisonMatch = {
    deptNum: string;
    appropriationAccount: string;
    fundType: string;
    fundCode: string;
    amount: number;
};

type ComparisonData = {
    fst: ComparisonMatch[];
    snd: ComparisonMatch[];
    indices: Set<Omit<ComparisonMatch, 'deptNum' | 'amount'>>;
};

type ComparisonRow = {
    appropriationAccount: string;
    fundTypes: { fundType: string; fundCodes: { fundCode: string; fst: number; snd: number }[] }[];
};

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const getComparisons = (
    budgetData: BudgetData[],
    fundsDict: FileDict<FundsData>,
    { fstYear, fstDept, sndYear, sndDept }: BudgetComparison,
) => budgetData.reduce<ComparisonData>(
    (acc, row) => {
        const fstMatch = row.deptNum == fstDept && row[fstYear] !== 0;
        const sndMatch = row.deptNum == sndDept && row[sndYear] !== 0;
        if (!fstMatch && !sndMatch) return acc;

        const index = { appropriationAccount: row.appropriationAccount, fundCode: row.fundCode, fundType: fundsDict[row.fundCode].type };
        acc.indices.add(index);

        if (fstMatch) acc.fst.push({ ...index, deptNum: fstDept, amount: row[fstYear] });
        if (sndMatch) acc.snd.push({ ...index, deptNum: sndDept, amount: row[sndYear] });
        return acc;
    },
    { fst: [], snd: [], indices: new Set() },
);

const getTotal = (matches: ComparisonMatch[]) => matches.reduce((acc, match) => acc + match.amount, 0);

const findComparisonMatch = (
    matches: ComparisonMatch[],
    index: Omit<ComparisonMatch, 'deptNum' | 'amount'>,
) => {
    return matches.find((match) =>
        match.fundCode === index.fundCode &&
        match.appropriationAccount === index.appropriationAccount
    )?.amount ?? 0;
};

const createTableHeader = () => {
    const tableHeader = document.createElement('tr');

    ['Appropriation Account', 'Fund Type', 'Fund Code', 'Selection One', 'Selection Two'].forEach((value) => {
        const cell = document.createElement('th');
        cell.innerText = value;
        tableHeader.appendChild(cell);
    });

    return tableHeader;
};

const createTableFooter = (total1: number, total2: number) => {
    const tableFooter = document.createElement('tr');

    const titleCell = createTableCell('Total', undefined, 3);
    const total1Cell = createTableCell(moneyFormatter.format(total1));
    const total2Cell = createTableCell(moneyFormatter.format(total2));
    titleCell.className = 'totalTitle';

    tableFooter.append(titleCell, total1Cell, total2Cell);
    return tableFooter;
};

const createTableCell = (value: string, rowspan?: number, colspan?: number) => {
    const cell = document.createElement('td');
    cell.innerText = value;
    if (rowspan) cell.rowSpan = rowspan;
    if (colspan) cell.colSpan = colspan;
    return cell;
};

const createCompareTable = (
    budgetData: BudgetData[],
    fundsDict: FileDict<FundsData>,
    selectedComparison: BudgetComparison,
) => {
    const compareTable = document.getElementById('compareTable');
    if (!compareTable) return;

    const comparisonData = getComparisons(budgetData, fundsDict, selectedComparison);

    const tableHeader = createTableHeader();
    const tableRows = [...comparisonData.indices].reduce<ComparisonRow[]>((acc, index) => {
        const lastAccount = acc.at(-1);
        if (!lastAccount || index.appropriationAccount !== lastAccount.appropriationAccount) {
            acc.push({
                appropriationAccount: index.appropriationAccount,
                fundTypes: [{
                    fundType: index.fundType,
                    fundCodes: [{
                        fundCode: index.fundCode,
                        fst: findComparisonMatch(comparisonData.fst, index),
                        snd: findComparisonMatch(comparisonData.snd, index),
                    }],
                }],
            });
            return acc;
        }

        const lastFundType = lastAccount?.fundTypes.at(-1);
        if (!lastFundType || lastFundType.fundType !== index.fundType) {
            lastAccount?.fundTypes.push({
                fundType: index.fundType,
                fundCodes: [{
                    fundCode: index.fundCode,
                    fst: findComparisonMatch(comparisonData.fst, index),
                    snd: findComparisonMatch(comparisonData.snd, index),
                }],
            });
            return acc;
        }

        lastFundType?.fundCodes.push({
            fundCode: index.fundCode,
            fst: findComparisonMatch(comparisonData.fst, index),
            snd: findComparisonMatch(comparisonData.snd, index),
        });
        return acc;
    }, []).flatMap(({ appropriationAccount, fundTypes }) => {
        const fundTypesLength = fundTypes.reduce((acc, { fundCodes }) => acc + fundCodes.length, 0);
        return fundTypes.flatMap(({ fundType, fundCodes }, fundTypeIndex) => {
            const fundCodesLength = fundCodes.length;
            return fundCodes.map(({ fundCode, fst, snd }, fundCodeIndex) => {
                const tableRow = document.createElement('tr');

                if (fundTypeIndex === 0 && fundCodeIndex === 0) {
                    tableRow.appendChild(createTableCell(appropriationAccount, fundTypesLength));
                }
                if (fundCodeIndex === 0) tableRow.appendChild(createTableCell(fundType, fundCodesLength));

                const fundCodeCell = createTableCell(fundCode);
                const fstCell = createTableCell(fmtMoney(fst));
                const sndCell = createTableCell(fmtMoney(snd));

                tableRow.append(fundCodeCell, fstCell, sndCell);
                return tableRow;
            });
        });
    });
    const tableFooter = createTableFooter(getTotal(comparisonData.fst), getTotal(comparisonData.snd));

    compareTable.replaceChildren(tableHeader, ...tableRows, tableFooter);
};

export default createCompareTable;
