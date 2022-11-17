export interface IEntry {
    id: number;
    fname: string;
    lname: string;
    email: string;
    phone: string;
    address: {
        streetAddress: string;
        city: string;
        state: string;
        zip: string;
    },
    description: string;
    [key: string]: string | number | object;
}

export interface IFilterProps {
    columns: string[];
    onFilter: (arr: string[]) => void;
}

export interface ITableProps {
    data: IEntry[];
    onSort: (value: string, order: number) => void;
    sortOrder: any;
}

export interface ISortOrder {
    id: number;
    fname: number;
    lname: number;
    email: number;
    phone: number;
    [key: string]: number;
}
