import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "react-redux";
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
//import * as Sentry from "@sentry/react";
// import i18n from "./i18n";

//Sentry.init({ dsn: "YOUR_SENTRY_DSN" });

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  
  // <React.StrictMode>
  <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </React.StrictMode>
  // </React.StrictMode>
);
// </React.StrictMode>
reportWebVitals();

