import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { Provider, useDispatch } from 'react-redux';

import store from './store';

import "./styles/reset.scss"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

