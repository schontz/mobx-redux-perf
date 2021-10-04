import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppMobx from './AppMobx';
import AppRedux from './AppRedux';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', padding: '10px', borderRight: '1px solid' }}>
        <AppMobx />
      </div>
      <div style={{ width: '50%', padding: '10px' }}>
        <AppRedux />
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
