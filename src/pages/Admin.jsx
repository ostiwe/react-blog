import React from 'react';
import { connect } from 'react-redux';
import {
  Link, Route, Switch, withRouter,
} from 'react-router-dom';
import {
  Col, Divider, Layout, Menu, Row, Spin,
} from 'antd';
import { AppFooter, AppHeader } from '../components';
import apiBlog from '../assets/js/BlogApiSettings';
import { Home, Posts } from './AdminPages';

const { Content } = Layout;

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      selectedMenu: '/admin',
    };
    this.apiBlog = apiBlog;

    this.getUserData = this.getUserData.bind(this);
    this.selectMenuItemByUrl = this.selectMenuItemByUrl.bind(this);
    this.selectMenuItem = this.selectMenuItem.bind(this);
  }

  componentDidMount() {
    this.selectMenuItemByUrl();
    this.getUserData();
  }

  getUserData() {
    const { history } = this.props;
    const token = localStorage.getItem('access_token');
    if (token) {
      this.apiBlog
        .setAccessToken(token)
        .getUserInfo()
        .then((info) => {
          if (info.success) {
            if (!(parseInt(info.data.userInfo.mask, 10) & 16)) {
              history.push('/');
              return;
            }
            this.setState({
              loading: false,
            });
            return;
          }
          history.push('/');
        });
      return;
    }
    history.push('/');
  }

  selectMenuItemByUrl() {
    const { location } = this.props;
    let url = location.pathname.split('/');

    if (url.length > 3) {
      const arr = url.splice(0, url.length - 1);
      url = arr.join('/');
    } else {
      url = url.join('/');
    }

    this.setState({ selectedMenu: url });
  }

  selectMenuItem(e) {
    this.setState({ selectedMenu: e.key });
  }

  render() {
    const { loading, selectedMenu } = this.state;
    const adminPages = [
      {
        path: '/admin',
        component: Home,
        ex: true,
      },
      {
        path: ['/admin/posts', '/admin/posts/:section'],
        component: Posts,
      },
      {
        path: '/admin/users',
        component: () => <>Users Admin Page</>,
      },
    ];
    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          {!loading
            ? (
              <Row gutter={[20, 0]} className="app-content-side">
                <Col xl={5} lg={5} md={5} sm={10} xs={0}>
                  <Menu onSelect={this.selectMenuItem} selectedKeys={[selectedMenu]}>
                    <Menu.Item key="/admin">
                      <Link to="/admin">
                        Главная
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/posts">
                      <Link to="/admin/posts/all">
                        Посты
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/users">
                      <Link to="/admin/users">
                        Пользователи
                      </Link>
                    </Menu.Item>
                  </Menu>
                </Col>
                <Col xl={19} lg={19} md={19} sm={14} xs={24}>
                  <Switch>
                    {adminPages.map((route) => (
                      <Route
                        key={route.path}
                        path={route.path}
                        exact={route.ex}
                        component={route.component}
                      />
                    ))}
                    <Route path="*">
                      Not found
                    </Route>
                  </Switch>
                </Col>
              </Row>
            ) : (
              <Divider>
                <Spin size="large" spinning/>
              </Divider>
            )}

        </Content>
        <AppFooter/>
      </Layout>
    );
  }
}

function stateToProps(state) {
  return {
    userInfo: state.userInfo,
  };
}

export default withRouter(connect(stateToProps)(Admin));
