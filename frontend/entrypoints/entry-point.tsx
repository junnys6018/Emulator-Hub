import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/src/app';
import '@/public/base.css';
import installScrollbar from '@/src/components/util/install-scrollbar';
import { initializeDatabase } from '@/src/storage/storage';

installScrollbar();
initializeDatabase();
ReactDOM.render(<App />, document.getElementById('root'));
