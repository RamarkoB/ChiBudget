// internal imports
import { BudgetData, DataFileName, DataOfFile, DeptData, FileDict, FundsData } from './types.ts';

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtMoney = (num: number) => moneyFormatter.format(num);

const parseFileData = <T extends DataFileName>(fileName: T) => (row: string): DataOfFile<T> => {
    const split = row.split(',');

    switch (fileName) {
        case 'ordinance':
            return {
                deptNum: split[0],
                appropriationAccount: split[1],
                fundCode: split[2],
                2011: Number(split[3]),
                2012: Number(split[4]),
                2013: Number(split[5]),
                2014: Number(split[6]),
                2015: Number(split[7]),
                2016: Number(split[8]),
                2017: Number(split[9]),
                2018: Number(split[10]),
                2019: Number(split[11]),
                2020: Number(split[12]),
                2021: Number(split[13]),
                2022: Number(split[14]),
                2023: Number(split[15]),
                2024: Number(split[16]),
                2025: Number(split[17]),
                2026: Number(split[18]),
            } as BudgetData as DataOfFile<T>;

        case 'depts':
            return { id: split[0], name: split[1], category: split[2] } as DeptData as DataOfFile<T>;

        case 'funds':
            return { id: split[0], type: split[1], name: split[2], category: split[3] } as FundsData as DataOfFile<T>;
    }
};

const importData = async <T extends DataFileName>(fileName: T) => {
    const response = await fetch(`./data/${fileName}.csv`);
    const textData = await response.text();
    return textData.split('\n').slice(1, -1).map(parseFileData(fileName));
};

const getUnique = <T extends keyof U, U extends DataOfFile<DataFileName>>(
    data: U[],
    key: T,
) => {
    const budgetYearSet = data.reduce<Set<U[typeof key]>>((acc, row) => {
        acc.add(row[key]);
        return acc;
    }, new Set());

    return [...budgetYearSet];
};

const getDict = <T extends DeptData | FundsData>(data: T[]) =>
    data.reduce<FileDict<T>>(
        (acc, { id, ...row }) => ({ ...acc, [id]: { ...row } }),
        {},
    );

const appendOption = (
    categorySelector: HTMLElement,
    text: string,
    value: string,
) => {
    const option = document.createElement('option');
    option.innerText = text;
    option.value = value;
    categorySelector.append(option);
    return option;
};

export { appendOption, fmtMoney, getDict, getUnique, importData };
