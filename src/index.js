import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Settings from './utils/settings';

Settings.checkSettings();
Settings.loadSettings();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
