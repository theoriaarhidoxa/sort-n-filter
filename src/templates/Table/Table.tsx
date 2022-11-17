import React, {FC, useState} from 'react';
import {ITableProps} from "../../interfaces";

const Table: FC<ITableProps> = (props) => {
    const {data, onSort, sortOrder} = props;

    const [activeRow, setActiveRow] = useState(null);

    const handleColumnSort = (sortValue: string, order: number) => {
        onSort(sortValue, order);
        setActiveRow(null);
    };

    const handleInfoUpdate = (el: any) => {
        setActiveRow(activeRow === el.id ? null : el.id);
    };

    return (
        <table className='table'>
            <caption>Простая таблица с фильтром, сортировкой и пагинацией</caption>
            <thead>
            <tr>
                <th className={sortOrder.id === 1 ? 'asc' : sortOrder.id === 2 ? 'dsc' : ''}
                    onClick={() => handleColumnSort('id', sortOrder.id)}><span>id</span>
                </th>
                <th className={sortOrder.fname === 1 ? 'asc' : sortOrder.fname === 2 ? 'dsc' : ''}
                    onClick={() => handleColumnSort('fname', sortOrder.fname)}><span>first name</span>
                </th>
                <th className={sortOrder.lname === 1 ? 'asc' : sortOrder.lname === 2 ? 'dsc' : ''}
                    onClick={() => handleColumnSort('lname', sortOrder.lname)}><span>last name</span>
                </th>
                <th className={sortOrder.email === 1 ? 'asc' : sortOrder.email === 2 ? 'dsc' : ''}
                    onClick={() => handleColumnSort('email', sortOrder.email)}><span>email</span>
                </th>
                <th className={sortOrder.phone === 1 ? 'asc' : sortOrder.phone === 2 ? 'dsc' : ''}
                    onClick={() => handleColumnSort('phone', sortOrder.phone)}><span>phone</span>
                </th>
            </tr>
            </thead>
            <tbody>
            {data.map(row => {
                const {id, fname, lname, email, phone, description} = row;
                return (
                    <tr className={activeRow === id ? 'selected' : ''} key={email}
                        onClick={() => handleInfoUpdate(row)}>
                        <td>{id}</td>
                        <td>{fname}</td>
                        <td>{lname}</td>
                        <td>{email}</td>
                        <td>{phone}</td>
                        {activeRow === id && <td className='wide' colSpan={5}><p>
                            <b>Address:</b> {row.address.city}, {row.address.streetAddress}</p><p>
                            <b>More:</b> {description}</p></td>}
                    </tr>
                )
            })}
            </tbody>
        </table>
    );
};

export default Table;
