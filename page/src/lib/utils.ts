// external
import Papa from 'npm:papaparse';

// internal imports
import {  DataFileName, DataOfFile, DeptsData, FileDict, FundsData } from './types.ts';

const moneyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtMoney = (num: number) => moneyFormatter.format(num);

const importData = async <T extends DataFileName>(fileName: T) => {
    const response = await fetch(`./data/${fileName}.csv`);
    const textData = await response.text();
    const parsed = Papa.parse(textData, { header: true, dynamicTyping: true, skipEmptyLines: 'greedy' }).data;
    return parsed as DataOfFile<T>[];
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

const getDict = <T extends DeptsData | FundsData>(data: T[]) =>
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
