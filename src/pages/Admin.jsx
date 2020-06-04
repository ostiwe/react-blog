import React from "react";
import {connect} from "react-redux";
import {Link, Route, Switch, withRouter} from "react-router-dom";
import {Col, Divider, Layout, Menu, Row, Spin} from "antd";
import {AppFooter, AppHeader} from "../components";
import apiBlog from "../assets/js/BlogApiSettings";
import {Posts} from "./AdminPages";


const {Content} = Layout;


class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_info: {},
            loading: true,
            selectedMenu: '/admin/posts',
        };
        this.apiBlog = apiBlog;
    }

    getUserData = () => {
        const {history} = this.props;
        let token = localStorage.getItem('access_token');
        if (token) {
            this.apiBlog
                .setAccessToken(token)
                .getUserInfo().then(info => {
                if (info.status === 'success') {
                    if (!(parseInt(info.user_info.mask) & 16)) {
                        history.push('/');
                        return;
                    }
                    let userInfo = {
                        login: info.user_info.login,
                        uid: info.user_info.uid,
                        mask: info.user_info.mask,
                        access_token: info.access_token.access_token
                    }
                    this.setState({userInfo: userInfo, loading: false});
                    return;
                }
                history.push('/');
            });
            return
        }
        history.push('/');

    }

    componentDidMount() {
        const {history, match, location} = this.props;

        if (!match.params.section) {
            history.push('/admin/posts/all');
        }

        let url = location.pathname.split('/');

        if (url.length > 3) {
            let arr = url.splice(0, url.length - 1)
            url = arr.join('/')
        } else url = url.join('/');


        this.setState({selectedMenu: url});

        this.getUserData();

    }

    selectMenuItem = (e) => {
        this.setState({selectedMenu: e.key})
    }

    render() {
        // const {match, location} = this.props;
        const {loading, selectedMenu} = this.state;
        const adminPages = [
            // {
            //     path: `${match.url}`,
            //     component: Home,
            //     ex: true
            // },
            {
                path: '/admin/posts/:section',
                component: Posts
            },
            {
                path: '/admin/users',
                component: () => <>Users Admin Page</>
            }
        ];
        return <Layout>
            <AppHeader/>
            <Content className={'app-content'}>

                {!loading ?
                    <Row gutter={[20, 0]} className={'app-content-side'}>
                        <Col xl={5} lg={5} md={5} sm={10} xs={0}>
                            <Menu onSelect={this.selectMenuItem} selectedKeys={[selectedMenu]}>
                                {/*<Menu.Item key={'home'}>*/}
                                {/*    <Link to={match.url}>*/}
                                {/*        Главная*/}
                                {/*    </Link>*/}
                                {/*</Menu.Item>*/}
                                <Menu.Item key={`/admin/posts`}>
                                    <Link to={'/admin/posts'}>
                                        Посты
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key={`/admin/users`}>
                                    <Link to={'/admin/users'}>
                                        Пользователи
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Col>
                        <Col xl={19} lg={19} md={19} sm={14} xs={24}>
                            <Switch>
                                {adminPages.map((route, index) =>
                                    <Route
                                        key={index} path={route.path} exact={route.ex}
                                        component={route.component}/>)}
                                <Route path={'*'}>
                                    Not found
                                </Route>
                            </Switch>
                        </Col>
                    </Row> : <Divider>
                        <Spin size={"large"} spinning/>
                    </Divider>}

            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return {
        user_info: state.user_info
    }
}

export default withRouter(connect(stateToProps)(Admin));