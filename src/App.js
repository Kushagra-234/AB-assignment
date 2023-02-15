import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'antd/dist/antd.css';

import Table from './component/table';
import Header from './component/header';

import Search from './component/Search';
import { loadApp } from './library/slices/state';
import './index.scss';



export default () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadApp());  
  }, [])

  return <>
    <div className='app'>
      <Header />
      <Search/>
      <Table />
    
    </div>
  </>;
};