import React, {useState, useEffect, FC} from 'react';
import {useSearchParams, useLocation} from "react-router-dom";
import {IFilterProps} from "../../interfaces";

const Filter: FC<IFilterProps> = (props) => {
    const {columns, onFilter} = props;
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [field, setField] = useState(location.search ? location.search.split('=')[0].substring(1) : columns[0]);
    const [query, setQuery] = useState(searchParams.get(field) || '');

    const handleSearch = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        setSearchParams({[field]: query});
        onFilter([field, query]);
    };

    const handleFormReset = () => {
        setQuery('');
        setField(columns[0]);
        setSearchParams({});
        onFilter([columns[0], '']);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <form className='container__filter' onSubmit={(e: React.FormEvent) => handleSearch(e)}>
            <div className="row">
                <div className="col">
                    <label>Поле</label>
                </div>
                <div className='col'>
                    <select value={field} className='form-control' onChange={e => setField(e.target.value)}>
                        {columns.map(el => {
                            return (
                                <option key={el} value={el}>{el}</option>
                            )
                        })}
                    </select>
                </div>
                <div className='col'>
                    <label>содержит</label>
                </div>
                <div className='col'>
                    <input className='form-control' id='searchField' type='search' value={query}
                           onChange={e => setQuery(e.target.value)}/>
                </div>
                <div className='col'>
                    <input type='submit' value='Найти' className='btn btn-primary'/>
                </div>
                <div className='col'>
                    <input type='button' value='Сбросить' className='btn btn-danger' onClick={handleFormReset}/>
                </div>
            </div>
        </form>
    );
};

export default Filter;
