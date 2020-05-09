import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from "./AppRouter.jsx";
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store";

import "antd/dist/antd.min.css";
import "./assets/styles/main.css";


ReactDOM.render(
    <Provider store={store}>
        <AppRouter/>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
