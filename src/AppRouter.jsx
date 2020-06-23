import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';

import {
  Button, Layout, message, notification, Result,
} from 'antd';
import HomeOutlined from '@ant-design/icons/lib/icons/HomeOutlined';
import PropTypes from 'prop-types';
import {
  Admin, CategoryPage, Login, MainPage, PostPage, Register, UserProfile,
} from './pages';
import { AppFooter, AppHeader } from './components';
import apiBlog from './assets/js/BlogApiSettings';
import { setLocale, setUserInfo } from './redux/actions/mainActions';
import Websocket from './assets/js/websocket.ts';
import lang from './assets/js/lang';

const { Content } = Layout;

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
    component: PostPage,
  },
  {
    path: '/user/:user',
    component: UserProfile,
  },

  {
    path: ['/admin/:section', '/admin'],
    component: Admin,
  },

  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
];

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.apiBlog = apiBlog;
    this.ws = null;

    this.notificationHandler = this.notificationHandler.bind(this);
    this.wsError = this.wsError.bind(this);
  }

  componentDidMount() {
    const {
      userInfo, history, location, dispatch, locale,
    } = this.props;
    const accessToken = localStorage.getItem('access_token');
    const hasAccessToken = accessToken !== null && accessToken !== '' && accessToken !== undefined;
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    const goAuth = () => {
      history.push('/login');
      notification.close('auth_expired');
    };

    if (userInfo === null && hasAccessToken) {
      this.apiBlog.setAccessToken(accessToken);
      this.apiBlog.getUserSelfInfo()
        .then((response) => {
          const host = 'ws://127.0.0.1:9909';
          const token = response.data.accessToken.value;

          this.ws = new Websocket(host, token);
          this.ws.setOnMessage((ev) => this.notificationHandler(ev));
          this.ws.setOnSocketError((ev) => this.wsError(ev));

          const dispatchUserInfo = {
            ...response.data.userInfo,
            accessToken: token,
          };
          const userLocale = response.data.userInfo.locale.toLowerCase();

          if (userLocale === 'ru') {
            this.apiBlog.setLang(this.apiBlog.getLangList().ru);
          } else {
            this.apiBlog.setLang(this.apiBlog.getLangList().en);
          }
          dispatch(setUserInfo(dispatchUserInfo));
          dispatch(setLocale(userLocale));
          this.forceUpdate();
        })
        .catch(() => {
          if (!isAuthPage) {
            notification.warn({
              key: 'auth_expired',
              message: lang.auth_expire[locale],
              btn: <Button onClick={goAuth}>{lang.auth_expire_try_btn[locale]}</Button>,
            });
          }
        });
    }

    const browserLang = window.navigator.language || window.navigator.userLanguage;

    if (browserLang !== 'ru-RU') {
      notification.info({
        message: 'Change language to English?',
        duration: 10,
        key: 'change_lang',
        btn: () => (
          <Button.Group>
            <Button onClick={() => {
              this.apiBlog.setLang(this.apiBlog.getLangList().en);
              dispatch(setLocale('en'));
              notification.close('change_lang');
            }}
            >
              Yes, please
            </Button>
          </Button.Group>
        ),
      });
    }
  }

  notificationHandler(ev) {
    const event = JSON.parse(ev.data);
    if (event.type === 'service') return this.serviceNotification(event);
    return null;
  }

  serviceNotification(event) {
    notification.open({
      type: event.payload.notification_type,
      message: event.payload.notification_message,
    });
  }

  wsError(ev) {
    const { locale } = this.props;
    // eslint-disable-next-line no-console
    console.error(ev);
    message.error(lang.ws_error_connect[locale]);
  }

  render() {
    const { locale, history } = this.props;
    return (
      <Layout>
        <Switch>
          {appRoutes.map((route) => (
            <Route
              key={route.path}
              exact={route.ex}
              path={route.path}
              component={route.component}
            />
          ))}

          {/* 404 handler */}
          <Route path="*">
            <AppHeader/>
            <Content className="app-content">
              <Result
                status={404}
                title={lang.page_not_found[locale].title}
                extra={(
                  <Button
                    icon={<HomeOutlined/>}
                    onClick={() => history.push('/')}
                  >
                    {lang.page_not_found[locale].button}
                  </Button>
                )}
              />
            </Content>
            <AppFooter/>
          </Route>
        </Switch>
      </Layout>
    );
  }
}

function stateToProps(state) {
  return {
    locale: state.locale,
    userInfo: state.userInfo,
  };
}

AppRouter.defaultProps = {
  userInfo: null,
};
AppRouter.propTypes = {
  userInfo: PropTypes.shape({
    login: PropTypes.string,
    mask: PropTypes.number,
    email: PropTypes.string,
    id: PropTypes.number,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    locale: PropTypes.string,
    accessToken: PropTypes.string,
  }),

};

export default withRouter(connect(stateToProps)(AppRouter));
