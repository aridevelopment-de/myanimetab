import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import getUserSettings from './utils/settings';

getUserSettings().loadSettings();
getUserSettings().registerSetting("selected_image", 0);
getUserSettings().registerSetting("images", ["https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp"]);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
