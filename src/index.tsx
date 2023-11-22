import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { Provider } from 'react-redux';

import store from './store';

import "./styles/reset.scss"

import { employees } from './data/Employees';
import { allOptions } from './data/DropdownOptions';
import { projects } from './data/Projects';

//init Employees to Local Storage
localStorage.staff = JSON.stringify(employees);
//init Options to Local Storage
localStorage.options = JSON.stringify(allOptions);
//init Projects to Local Storage
localStorage.projects = JSON.stringify(projects);

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

