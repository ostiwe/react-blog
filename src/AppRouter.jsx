import React from 'react';
import {connect} from "react-redux";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import {Button, Layout, Result} from "antd";
import {MainPage, CategoryPage, Login, Register, Admin} from "./pages";
import {AppFooter, AppHeader} from "./components";


const {Content} = Layout;

const appRoutes = [
    {
        path: '/',
        ex: true,
        component: MainPage,
    },
    {
        path: '/category/:category',
        component: CategoryPage,
    },

    {
        path: '/admin',
        component: Admin
    },

    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
];

class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        return <Router>
            <Layout>
                <Switch>
                    {appRoutes.map((route, index) =>
                        <Route key={index} exact={route.ex} path={route.path} component={route.component}/>)}

                    {/* 404 handler */}
                    <Route path={'*'}>
                        <AppHeader/>
                        <Content className={'app-content'}>
                            <Result status={404} title={'Мы не нашли необходимую вам страницу'}
                                    extra={<Button>На главную</Button>}/>
                        </Content>
                        <AppFooter/>
                    </Route>
                </Switch>
            </Layout>
        </Router>
    }
}

function stateToProps(state) {
    return state
}

export default connect(stateToProps)(AppRouter);
