import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Layout } from './Layout';

const rootNode = document.getElementById('root');
const vNode = (
  <React.StrictMode>
    <Layout />
  </React.StrictMode>
);

ReactDOM.render(vNode, rootNode);
