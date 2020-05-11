import React from "react";
import {Button, Card, Form, Input, Layout} from "antd";
import {AppFooter, AppHeader} from "../../components";
import Reaptcha from "reaptcha";
import {connect} from "react-redux";
import {emulateLogin} from "../../redux/actions/mainActions";
import {withRouter} from "react-router-dom";

const {Content} = Layout;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            robotCheck: false,
        };
        this.formRef = React.createRef();
    }

    login = () => {
        this.props.dispatch(emulateLogin(this.formRef.current.getFieldValue('login')))
        this.props.history.push('/')
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
                                    }}/>
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