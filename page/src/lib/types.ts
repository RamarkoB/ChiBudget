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

type OrdinanceData = { deptNum: string; appropriationAccount: string; fundCode: string } & Record<DataYear, number>;
type DeptsData = { id: string; name: string; category: string };
type FundsData = { id: string; name: string; type: string; category: string };
type AccountsData = { id: string; name: string; category: string };

type DataFileName = 'ordinance' | 'depts' | 'funds' | 'accounts';

type DataOfFile<T extends DataFileName> = T extends 'ordinance' ? OrdinanceData
    : T extends 'depts' ? DeptsData
    : T extends 'funds' ? FundsData
    : AccountsData;

type FileDict<T extends DeptsData | FundsData | AccountsData> = Record<string, Omit<T, 'id'>>;

export { years };
export type { AccountsData, DataFileName, DataOfFile, DataYear, DeptsData, FileDict, FundsData, OrdinanceData };
