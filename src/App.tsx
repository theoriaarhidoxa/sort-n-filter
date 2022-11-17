import './App.scss';
import React, {useState, useEffect} from "react";
import axios from "axios";
import Loader from "./templates/loader/Loader";
import Table from "./templates/Table/Table";
import Filter from "./templates/Filter/Filter";
import staticData from './fake';
import {IEntry, ISortOrder} from "./interfaces";

// http://www.filltext.com/?rows=32&fname={firstName}&lname={lastName}&email={email}&phone={phone}&address={addressObject}&description={lorem|32}&pretty=true

// https://bobbyhadz.com/blog/react-call-function-in-child-component
// https://stackoverflow.com/questions/37949981/call-child-method-from-parent

const App = () => {
    const [filterParamName, setFilterParamName] = useState('id');
    const [filterParamValue, setFilterParamValue] = useState('');
    const [rowsLength, setRowsLength] = useState(0);
    const [items, setItems] = useState<IEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [chunk, setChunk] = useState<IEntry[]>([]);
    const [chunkIndex, setChunkIndex] = useState(0);
    const [sortOrder, setSortOrder] = useState<ISortOrder>({id: 0, fname: 0, lname: 0, email: 0, phone: 0});

    const fetchData = async () => {
        // const response = await axios.get<IEntry[]>(`http://www.filltext.com/?rows=${rowsLength}&fname={firstName}&lname={lastName}&email={email}&phone={phone}&address={addressObject}&description={lorem|32}&pretty=true`);
        const cut = Math.max(0, Math.floor(Math.random() * 601 - rowsLength) % rowsLength);
        const fakeResponse = staticData;

        const data = fakeResponse.slice(cut, cut + rowsLength).map((el, i) => ({...el, id: i + 1}));
        setItems(data);
        setChunk(data.slice(0, 20));
    };

    const pages = new Array(Math.ceil(rowsLength / 20)).fill('');

    // typescript dynamic keys: https://jibin.tech/blog/indexable-object-in-typescript/
    const handleTableSort = (colName: string, order: number) => {
        const isNumeric = Number.isInteger(+chunk[0][colName]);

        setSortOrder({
            id: 0,
            fname: 0,
            lname: 0,
            email: 0,
            phone: 0,
            [colName]: (sortOrder[colName] + 1) % 3});

        if (order !== 0 && order !== 1) {
            setChunk(items.slice(chunkIndex * 20, chunkIndex * 20 + 20));
        } else {
            setChunk([...chunk].sort((a, b) => {
                if (order === 0) {
                    return isNumeric ? +a[colName] - +b[colName] : a[colName].toString().localeCompare(b[colName].toString());
                } else {
                    return isNumeric ? +b[colName] - +a[colName] : b[colName].toString().localeCompare(a[colName].toString());
                }
            }));
        }
    };

    const handlePageChange = (pageIndex: number) => {
        setChunkIndex(pageIndex);
        setChunk(items.slice(pageIndex * 20, pageIndex * 20 + 20));
        setSortOrder({id: 0, fname: 0, lname: 0, email: 0, phone: 0});
    };

    const adjustChunkIndex = (shift: number) => {
        let value = chunkIndex + shift, limit = Math.ceil(rowsLength / 20);
        value = value < 0 ? limit - 1 : value >= limit ? 0 : value;
        setChunkIndex(value);
        setChunk(items.slice(value * 20, value * 20 + 20));
        setSortOrder({id: 0, fname: 0, lname: 0, email: 0, phone: 0});
    };

    const receiveFilterParams = (params: string[]) => {
        const [key, value] = params;
        setFilterParamName(key);
        setFilterParamValue(value);
    };

    useEffect(() => {
        if (!rowsLength) {
            const val = prompt('Введите количество рядов (<= 600)', '70') || '70';
            if (+val <= 600) {
                setRowsLength(+val);
            } else {
                setTimeout(() => {
                    setError('Ошибка при вводе, либо превышен допустимый лимит');
                }, 2000);
            }
        }
        fetchData().then();
        receiveFilterParams([filterParamName ? filterParamName : 'id', filterParamValue ? filterParamValue : '']);
    }, [rowsLength]);

    if (error) {
        return <div className='errorHolder'><h3>{error}</h3></div>;
    }

    return (
        <div className="container">
            {error ? error : !chunk.length ? <Loader/> :
                <>
                    <Filter columns={Object.keys(sortOrder)} onFilter={receiveFilterParams}/>
                    <Table onSort={handleTableSort}
                           data={chunk.filter((el: IEntry) => el[filterParamName].toString().toLowerCase().indexOf(filterParamValue.toLowerCase()) >= 0)}
                           sortOrder={sortOrder}/><br/>
                    <nav>
                        <ul className="pagination">
                            <li className="page-item" onClick={() => adjustChunkIndex(-1)}><a className="page-link"
                                                                                              href={`http://yahoo.com`}>&laquo;</a>
                            </li>
                            {pages.map((_, i) => {
                                return (
                                    <li key={i} onClick={() => handlePageChange(i)} className="page-item"><a
                                        href={`http://yahoo.com`}
                                        className={i === chunkIndex ? 'page-link active' : 'page-link'}>{i + 1}</a></li>
                                )
                            })}
                            <li className="page-item" onClick={() => adjustChunkIndex(1)}><a className="page-link"
                                                                                             href={`http://yahoo.com`}>&raquo;</a>
                            </li>
                        </ul>
                    </nav>
                    <br/><br/>
                </>}
        </div>
    );
}

export default App;
