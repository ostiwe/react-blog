import React from "react";
import {Button, Card, Form, Input, Layout} from "antd";
import {AppFooter, AppHeader} from "../../components";
import Reaptcha from "reaptcha";

const {Content} = Layout;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Layout>
                <AppHeader/>
                <Content className={'app-content'}>
                    <div className="app-auth-wrapper">
                        <Card >
                            <Form layout={"vertical"}>
                                <Form.Item name={'login'} label={'Ваш логин'}>
                                    <Input/>
                                </Form.Item>
                                <Form.Item name={'password'} label={'Ваш пароль'}>
                                    <Input.Password/>
                                </Form.Item>
                                <Form.Item label={'Проверим, что вы не робот'}>
                                    <Reaptcha sitekey={'6LdEz_QUAAAAAJ1K93ruihvsy0QtWTP98lWYBPW4'} onVerify={() => {
                                        console.log('ok')
                                    }}/>
                                </Form.Item>
                                <Form.Item>
                                    <Button>Войти</Button>
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

export default Login;