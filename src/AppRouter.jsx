import React from 'react';
import {connect} from "react-redux";
import {Route, Switch, withRouter,} from "react-router-dom";

import {Button, Layout, notification, Result} from "antd";
import {Admin, CategoryPage, Login, MainPage, Register} from "./pages";
import {AppFooter, AppHeader} from "./components";
import apiBlog from "./assets/js/BlogApiSettings";
import {setUserInfo} from "./redux/actions/mainActions";

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
        path: ['/admin/:section','/admin'],
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
        this.apiBlog = apiBlog;
    }

    componentDidMount() {
        const {user_info, history, location, dispatch} = this.props;
        const access_token = localStorage.getItem('access_token')
        const has_access_token = access_token !== null && access_token !== '' && access_token !== undefined;
        const is_auth_page = location.pathname === '/login' || location.pathname === '/register';


        const goAuth = () => {
            history.push('/login');
            notification.close('auth_expired');
        }

        if (user_info === null && has_access_token) {
            this.apiBlog.setAccessToken(access_token);
            this.apiBlog.getUserInfo().then(response => {
                if (response.status === 'bad_request' && !is_auth_page) {
                    notification.warn({
                        key: 'auth_expired',
                        message: "Ваша сессия устарела, необходимо повторить вход",
                        btn: <Button onClick={goAuth}>Повторить вход</Button>
                    })
                }
                if (response.status === 'success') {
                    let user_info = {
                        login: response.user_info.login,
                        uid: response.user_info.uid,
                        mask: response.user_info.mask,
                        access_token: response.access_token.access_token
                    };
                    dispatch(setUserInfo(user_info));
                    this.forceUpdate();
                }
            });
        }
    }

    render() {
        return <Layout>
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
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(AppRouter));
