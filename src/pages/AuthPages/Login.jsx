import React from 'react';
import {
  Button, Card, Form, Input, Layout, notification,
} from 'antd';
import Reaptcha from 'reaptcha';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AppFooter, AppHeader } from '../../components';
import { setLocale, setUserInfo } from '../../redux/actions/mainActions';
import apiBlog from '../../assets/js/BlogApiSettings';
import lang from '../../assets/js/lang';

const { Content } = Layout;
const runType = process.env.NODE_ENV;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      robotCheck: runType === 'development',
    };
    this.formRef = React.createRef();
    this.blogApi = apiBlog;
    this.login = this.login.bind(this);
  }

  login() {
    const { dispatch, history } = this.props;
    const fieldData = this.formRef.current.getFieldsValue();
    this.blogApi.login(fieldData)
      .then((data) => {
        dispatch(setUserInfo(data.data.userInfo));
        dispatch(setLocale(data.data.userInfo.locale));
        localStorage.setItem('access_token', data.data.accessToken.value);
        history.push('/');
      })
      .catch((response) => {
        notification.error({
          message: response.message,
        });
      });
    // this.props.dispatch(emulateLogin(this.formRef.current.getFieldValue('login')))
  }

  render() {
    const { robotCheck } = this.state;
    const { locale } = this.props;
    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          <div className="app-auth-wrapper">
            <Card>
              <Form ref={this.formRef} layout="vertical">
                <Form.Item name="login" label={lang.login_username[locale]}>
                  <Input/>
                </Form.Item>
                <Form.Item name="password" label={lang.login_password[locale]}>
                  <Input.Password/>
                </Form.Item>
                {runType !== 'development' && (
                  <Form.Item label={lang.captcha[locale]}>
                    <Reaptcha
                      sitekey="6LdEz_QUAAAAAJ1K93ruihvsy0QtWTP98lWYBPW4"
                      onVerify={() => this.setState({ robotCheck: true })}
                      onExpire={() => this.setState({ robotCheck: false })}
                    />
                  </Form.Item>
                )}
                <Form.Item>
                  <Button
                    onClick={this.login}
                    disabled={!robotCheck}
                  >
                    {robotCheck ? lang.login_btn[locale] : lang.button_need_captcha[locale]}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Content>
        <AppFooter/>
      </Layout>
    );
  }
}

function stateToProps(state) {
  return state;
}

export default withRouter(connect(stateToProps)(Login));
