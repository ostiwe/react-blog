import React from "react";
import {connect} from "react-redux";
import {Route, withRouter, Switch, Link} from "react-router-dom";
import {Col, Layout, Menu, Row} from "antd";
import {AppFooter, AppHeader} from "../components";


const {Content} = Layout;


class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {user_info, history} = this.props;

        if (!user_info) {
            history.push('/');
        }
    }

    render() {
        const {match} = this.props;
        const adminPages = [
            {
                path: `${match.url}`,
                component: () => <>Home Admin Page</>,
                ex: true
            },
            {
                path: `${match.url}/posts`,
                component: () => <>Posts Admin Page</>
            },
            {
                path: `${match.url}/users`,
                component: () => <>Users Admin Page</>
            }
        ];
        return <Layout>
            <AppHeader/>
            <Content className={'app-content'}>

                <Row gutter={[20, 0]} className={'app-content-side'}>
                    <Col xl={5} lg={5} md={5} sm={10} xs={0}>
                        <Menu defaultSelectedKeys={['home']}>
                            <Menu.Item key={'home'}>
                                <Link to={match.url}>
                                    Главная
                                </Link>
                            </Menu.Item>
                            <Menu.Item key={'posts'}>
                                <Link to={match.url + '/posts'}>
                                    Посты
                                </Link>
                            </Menu.Item>
                            <Menu.Item key={'users'}>
                                <Link to={match.url + '/users'}>
                                    Пользователи
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col>
                        <Switch>
                            {adminPages.map(route => <Route path={route.path} exact={route.ex}
                                                            component={route.component}/>)}
                            <Route path={'*'}>
                                Not found
                            </Route>
                        </Switch>
                    </Col>
                </Row>

            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(Admin));