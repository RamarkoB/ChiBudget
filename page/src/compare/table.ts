import { BudgetData, FileDict, FundsData } from '../lib/types.ts';
import { years } from '../lib/utils.ts';

type BudgetComparison = {
    fstYear: (typeof years)[number];
    fstDept: string;
    sndYear: (typeof years)[number];
    sndDept: string;
};

type ComparisonMatch = {
    deptNum: string;
    appropriationAccount: string;
    appropriationAuthority: string;
    fundCode: string;
    fundType: string;
    amount: number;
};

type ComparisonData = {
    fst: ComparisonMatch[];
    snd: ComparisonMatch[];
    indices: Set<Omit<ComparisonMatch, 'deptNum' | 'amount'>>;
};

const getComparisons = (
    budgetData: BudgetData[],
    fundsDict: FileDict<FundsData>,
    { fstYear, fstDept, sndYear, sndDept }: BudgetComparison,
) => budgetData.reduce<ComparisonData>(
    (acc, row) => {
        const fstMatch = row.deptNum == fstDept && row[fstYear] !== 0;
        const sndMatch = row.deptNum == sndDept && row[sndYear] !== 0;
        if (!fstMatch && !sndMatch) return acc;

        const index = {
            appropriationAccount: row.appropriationAccount,
            fundCode: row.fundCode,
            fundType: fundsDict[row.fundCode].type,
            appropriationAuthority: row.appropriationAuthority,
        };

        acc.indices.add(index);
        if (fstMatch) acc.fst.push({ ...index, deptNum: fstDept, amount: row[fstYear] });
        if (sndMatch) acc.snd.push({ ...index, deptNum: sndDept, amount: row[sndYear] });
        return acc;
    },
    { fst: [], snd: [], indices: new Set() },
);

const findComparisonMatch = (
    matches: ComparisonMatch[],
    index: Omit<ComparisonMatch, 'deptNum' | 'amount'>,
) => {
    return matches.find((match) =>
        match.fundCode === index.fundCode &&
        match.appropriationAccount === index.appropriationAccount &&
        match.appropriationAuthority === index.appropriationAuthority
    )?.amount ?? 0;
};

const createTableHeader = () => {
    const tableHeader = document.createElement('tr');

    ['Appropriation Account', 'Fund Type', 'Fund Code', 'Appropriation Authority', 'Selection One', 'Selection Two'].forEach((value) => {
        const cell = document.createElement('th');
        cell.innerText = value;
        tableHeader.appendChild(cell);
    });

    return tableHeader;
};

const createTableCell = (value: string) => {
    const cell = document.createElement('td');
    cell.innerText = value;
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
    const tableRows = [...comparisonData.indices].map((index) => {
        const tableRow = document.createElement('tr');

        const account = createTableCell(index.appropriationAccount);
        const fundType = createTableCell(index.fundType);
        const fundCode = createTableCell(index.fundCode);
        const authority = createTableCell(index.appropriationAuthority);
        const fstMatch = createTableCell(findComparisonMatch(comparisonData.fst, index).toString());
        const sndMatch = createTableCell(findComparisonMatch(comparisonData.snd, index).toString());

        tableRow.append(account, fundType, fundCode, authority, fstMatch, sndMatch);
        return tableRow;
    });

    compareTable.replaceChildren(createTableHeader(), ...tableRows);
};

export default createCompareTable;
