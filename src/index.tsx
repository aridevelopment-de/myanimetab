import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { metaDb } from './utils/db';
import { addMissing } from './utils/registry/fixmissing';

metaDb.registerMeta("selected_image", 0);
metaDb.registerMeta("images", ["https://best-extension.extfans.com/theme/wallpapers/pmafipeoccakjnacdojijhgmelhjbk/df23e73165204f223d080cbd0b4bc4.webp", "https://i.pinimg.com/originals/f2/7d/7e/f27d7ec85dedb8148919b237cd4ea3e8.jpg"]);
addMissing();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);