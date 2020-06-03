import React from "react";
import {Button, Card, Form, Input, Layout, notification} from "antd";
import {AppFooter, AppHeader} from "../../components";
import Reaptcha from "reaptcha";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {setUserInfo} from "../../redux/actions/mainActions";
import apiBlog from "../../assets/js/BlogApiSettings";

const {Content} = Layout;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            robotCheck: false,
        };
        this.formRef = React.createRef();
        this.blogApi = apiBlog;
    }

    login = () => {
        const fieldData = this.formRef.current.getFieldsValue()
        this.blogApi.login(fieldData).then(data => {
            if (data.status === 'success') {
                this.props.dispatch(setUserInfo(data.data.user_info));
                localStorage.setItem('access_token', data.data.user_info.access_token)
                this.props.history.push('/')
                return;
            }
            if (data.status === 'auth_error') {
                notification.error({
                    message: data.message
                });

            }
        }).catch(null);
        // this.props.dispatch(emulateLogin(this.formRef.current.getFieldValue('login')))
    }

    render() {

        const {robotCheck} = this.state;
        return (
            <Layout>
                <AppHeader/>
                <Content className={'app-content'}>
                    <div className="app-auth-wrapper">
                        <Card>
                            <Form ref={this.formRef} layout={"vertical"}>
                                <Form.Item name={'login'} label={'Ваш логин'}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name={'password'} label={'Ваш пароль'}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item label={'Проверим, что вы не робот'}>
                                    <Reaptcha sitekey={'6LdEz_QUAAAAAJ1K93ruihvsy0QtWTP98lWYBPW4'} onVerify={() => {
                                        this.setState({robotCheck: true})
                                    }} onExpire={() => this.setState({robotCheck: false})}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        onClick={this.login}
                                        disabled={!robotCheck}>{robotCheck ? 'Войти' : 'Докажите что вы не робот'}</Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Content>
                <AppFooter/>
            </Layout>
        )
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(Login));