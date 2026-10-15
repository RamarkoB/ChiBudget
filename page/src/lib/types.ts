type DataFileName = 'ordinance' | 'depts' | 'funds';

type DataOfFile<T extends DataFileName> = T extends 'ordinance' ? BudgetData
    : T extends 'depts' ? DeptData
    : FundsData;

const years = [
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
    2025,
    2026,
] as const;

type DataYear = (typeof years)[number];

type BudgetData = { deptNum: string; appropriationAccount: string; fundCode: string } & Record<DataYear, number>;
type DeptData = { id: string; name: string; category: string };
type FundsData = { id: string; name: string; type: string; category: string };

type FileDict<T extends DeptData | FundsData> = Record<string, Omit<T, 'id'>>;

export { years };
export type { BudgetData, DataFileName, DataOfFile, DataYear, DeptData, FileDict, FundsData };
