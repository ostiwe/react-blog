import React from 'react';
import {connect} from "react-redux";
import {Route, Switch, withRouter,} from "react-router-dom";

import {Button, Layout, message, notification, Result} from "antd";
import {Admin, CategoryPage, Login, MainPage, PostPage, Register} from "./pages";
import {AppFooter, AppHeader} from "./components";
import apiBlog from "./assets/js/BlogApiSettings";
import {setLocale, setUserInfo} from "./redux/actions/mainActions";
import Websocket from "./assets/js/websocket";
import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined";

import lang from "./assets/js/lang";

const {Content} = Layout;

const appRoutes = [
    {
        path: '/',
        ex: true,
        component: MainPage,
    },
    {
        path: '/tag/:tag',
        component: CategoryPage,
    },
    {
        path: '/post/:id',
        component: PostPage
    },

    {
        path: ['/admin/:section', '/admin'],
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
        this.ws = null;
    }

    componentDidMount() {
        const {user_info, history, location, dispatch, locale} = this.props;
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
                if (!response.success && !is_auth_page) {
                    notification.warn({
                        key: 'auth_expired',
                        message: lang.auth_expire[locale],
                        btn: <Button onClick={goAuth}>{lang.auth_expire_try_btn[locale]}</Button>
                    })
                }
                if (response.success) {
                    let host = "ws://127.0.0.1:9909";
                    let token = response.data.access_token.value;

                    this.ws = new Websocket(host, token)
                    this.ws.setOnMessage(ev => this.notificationHandler(ev))
                    this.ws.setOnSocketError(ev => this.wsError(ev))


                    let user_info = {
                        ...response.data.user_info,
                        access_token: token
                    };

                    dispatch(setUserInfo(user_info));
                    dispatch(setLocale(response.data.user_info.locale.toLowerCase()));
                    this.forceUpdate();
                }
            });
        }
    }

    notificationHandler(ev) {
        let event = JSON.parse(ev.data);
        if (event.type === 'service') return this.serviceNotification(event);
    }

    wsError(ev) {
        const {locale} = this.props;
        console.error(ev);
        message.error(lang.ws_error_connect[locale]);
    }

    serviceNotification(event) {
        notification.open({
            type: event.payload.notification_type,
            message: event.payload.notification_message
        });
    }


    render() {
        const {locale} = this.props;
        return <Layout>
            <Switch>
                {appRoutes.map((route, index) =>
                    <Route key={index} exact={route.ex} path={route.path} component={route.component}/>)}

                {/* 404 handler */}
                <Route path={'*'}>
                    <AppHeader/>
                    <Content className={'app-content'}>
                        <Result status={404} title={lang.page_not_found[locale].title}
                                extra={<Button icon={<HomeOutlined/>}
                                               onClick={() => this.props.history.push('/')}>
                                    {lang.page_not_found[locale].button}
                                </Button>}/>
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
