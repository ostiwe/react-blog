import React from "react";
import {connect} from "react-redux";
import {Button, Card, Form, Input, Layout, Space, Steps, Tooltip} from "antd";
import {AppFooter, AppHeader} from "../../components";
import QuestionCircleOutlined from "@ant-design/icons/lib/icons/QuestionCircleOutlined";

const {Header, Content, Footer} = Layout;

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            login: '',
            email: '',
        };


        this.formRef = React.createRef();
    }


    nextStep = () => {
        this.formRef.current.validateFields()
            .then(done => {
                const current = this.state.step + 1;
                this.setState({step: current})
            })
            .catch(s => {
            });


    }

    prevStep = () => {
        const current = this.state.step - 1;
        this.setState({step: current});
    }

    formSubmit = () => {
    }

    formEdit = (e) => {
        const target = e.target;
        this.setState({[target.id]: target.value});
    }


    render() {
        const {step, email, login} = this.state;
        const registerSteps = [
            {
                title: "Самое важное",
                content: <>
                    <Form.Item hasFeedback rules={[{
                        required: true,
                        message: 'Неверный формат логина',
                        pattern: new RegExp('^[a-zA-Z][a-zA-Z0-9-_\\.]{1,20}$')
                    }]} required name={'login'}
                               label={<span>Придумайте логин&nbsp;
                                   <Tooltip title="Придуманный вами логин будет использоваться во всех разделах блога">
                                        <QuestionCircleOutlined/>
                                    </Tooltip>
                               </span>}>
                        <Input  onChange={this.formEdit} value={login}/>
                    </Form.Item>
                    <Form.Item hasFeedback name={'email'} rules={[{
                        required: true,
                        message: 'Неверный формат почты',
                        pattern: new RegExp('^[-\\w.]+@([A-z0-9][-A-z0-9]+\\.)+[A-z]{2,4}$'),
                        type: 'email'
                    }]} required
                               label={'Укажите вашу почту'}>
                        <Input onChange={this.formEdit} value={email}/>
                    </Form.Item>
                </>
            },
            {
                title: "Немного о себе",
                content: <>
                    <Form.Item label={'Ваше имя'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={'Ваша фамилия'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={'Ваш возраст'}>
                        <Input/>
                    </Form.Item>
                </>
            },
            {
                title: "Безопасность",
                content: <>
                    3asdlsjda
                </>
            },
        ];
        return <Layout>
            <AppHeader/>
            <Content className={'app-content'}>
                <div className="app-auth-wrapper">
                    <Card>
                        <Form ref={this.formRef} className="app-auth-form" layout={'vertical'}>
                            <Steps size={'small'} current={step}>
                                {registerSteps.map((item, key) => <Steps.Step
                                    key={key}
                                    title={item.title}/>)}</Steps>
                            <div className="app-auth-form-stepContent">
                                {registerSteps[step].content}
                            </div>
                            <div className="steps-action">
                                <Space>
                                    {step < registerSteps.length - 1 && (
                                        <Button type="primary" onClick={() => this.nextStep()}>
                                            Далее
                                        </Button>
                                    )}
                                    {step === registerSteps.length - 1 && (
                                        <Button type="primary" onClick={this.formSubmit}>
                                            Готово
                                        </Button>
                                    )}
                                    {step > 0 && (
                                        <Button onClick={() => this.prevStep()}>
                                            Назад
                                        </Button>
                                    )}
                                </Space>
                            </div>

                        </Form>
                    </Card>
                </div>
            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return state
}

export default connect(stateToProps)(Register);