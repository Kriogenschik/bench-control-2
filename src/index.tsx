import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./components/App/App";
import {NavTipsProvider} from "./context/NavTipsProvider";

import store from "./store";

import "./styles/reset.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NavTipsProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NavTipsProvider>
  </React.StrictMode>
);
