import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from "./AppRouter.jsx";
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import {BrowserRouter as Router,} from "react-router-dom";


ReactDOM.render(
    <Provider store={store}>
        <Router>
            <AppRouter/>
        </Router>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
