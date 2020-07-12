import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Card, Form, Input, InputNumber, Layout, notification, Select, Space, Steps, Tooltip,
} from 'antd';
import QuestionCircleOutlined from '@ant-design/icons/lib/icons/QuestionCircleOutlined';
import Reaptcha from 'reaptcha';
import { withRouter } from 'react-router-dom';
import { AppFooter, AppHeader } from '../../components';
import { apiBlog } from '../../assets/js/BlogApiSettings';

const lodash = require('lodash/fp/object');

const { Content } = Layout;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      login: '',
      email: '',
      firstName: '',
      lastName: '',
      age: 16,
      sex: 0,
      formData: {},
      robotCheck: false,
    };
    this.formRef = React.createRef();

    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.ageEdit = this.ageEdit.bind(this);
    this.formEdit = this.formEdit.bind(this);
  }

  nextStep() {
    const { formData, step } = this.state;
    this.formRef.current.validateFields()
      .then(() => {
        const data = {};
        const tmpFormData = formData;
        const currentFormData = this.formRef.current.getFieldsValue();
        Object.keys(currentFormData)
          // eslint-disable-next-line no-return-assign
          .map((key) => data[key] = currentFormData[key]);
        const ob = lodash.merge(tmpFormData, data);
        const current = step + 1;
        this.setState({
          step: current,
          formData: ob,
        });
      })
      .catch(() => {
      });
  }

  prevStep() {
    const { step } = this.state;
    const current = step - 1;
    this.setState({
      step: current,
      robotCheck: false,
    });
  }

  formSubmit() {
    const { formData, sex } = this.state;
    const { history } = this.props;
    this.formRef.current.validateFields()
      .then(() => {
        const data = {};
        const currentFormData = this.formRef.current.getFieldsValue();
        Object.keys(currentFormData)
          .map((key) => {
            data[key] = currentFormData[key];
            return true;
          });
        const mergedData = lodash.merge(formData, data);
        Object.keys(mergedData)
          // eslint-disable-next-line no-return-assign
          .map((key) => mergedData[key] === undefined && (mergedData[key] = null));
        if (mergedData.sex === null) mergedData.sex = sex;
        this.setState({ formData: mergedData });
        apiBlog.register(mergedData)
          .then(() => {
            notification.success({
              message: 'Успешная регистрация',
              description: 'Теперь для завершения регистрации выполните вход',
            });
            history.push('/login');
          });
      })
      .catch((reason) => {
        notification.error({
          message: reason.message,
        });
      });
  }

  ageEdit(age) {
    this.setState({ age });
  }

  formEdit(e) {
    const { target } = e;
    this.setState({ [target.id]: target.value });
  }

  render() {
    const {
      step, email, login, firstName, lastName, age, sex, robotCheck,
    } = this.state;
    const registerSteps = [
      {
        title: 'Самое важное',
        content: (
          <>
            <Form.Item
              hasFeedback
              rules={[{
                required: true,
                message: 'Неверный формат логина',
                pattern: new RegExp('^[a-zA-Z][a-zA-Z0-9-_.]{1,20}$'),
              }]}
              required
              name="login"
              label={(
                <span>
                  Придумайте логин&nbsp;
                  <Tooltip
                    title="Придуманный вами логин будет использоваться во всех разделах блога"
                  >
                    <QuestionCircleOutlined/>
                  </Tooltip>
                </span>
              )}
            >
              <Input onChange={this.formEdit} value={login}/>
            </Form.Item>
            <Form.Item
              hasFeedback
              name="email"
              rules={[{
                required: true,
                message: 'Неверный формат почты',
                pattern: new RegExp('^[-\\w.]+@([A-z0-9][-A-z0-9]+\\.)+[A-z]{2,4}$'),
                type: 'email',
              }]}
              required
              label="Укажите вашу почту"
            >
              <Input onChange={this.formEdit} value={email}/>
            </Form.Item>

          </>
        ),
      },
      {
        title: 'Немного о себе',
        content: (
          <>
            <Form.Item
              onChange={this.formEdit}
              value={firstName}
              name="firstName"
              label="Ваше имя"
            >
              <Input/>
            </Form.Item>
            <Form.Item
              onChange={this.formEdit}
              value={lastName}
              name="lastName"
              label="Ваша фамилия"
            >
              <Input/>
            </Form.Item>
            <Space>
              <Form.Item required onChange={this.formEdit} name="sex" label="Ваш пол">
                <Select defaultValue={sex} value={sex} placeholder="Выберите">
                  <Select.Option value={0}>Мужской</Select.Option>
                  <Select.Option value={1}>Женский</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="age"
                required
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Укажите реальный возраст',
                  },
                ]}
                label="Ваш возраст"
              >
                <InputNumber value={age} onChange={this.ageEdit} min={16}/>
              </Form.Item>
            </Space>
          </>
        ),
      },
      {
        title: 'Безопасность',
        content: (
          <>
            <Form.Item
              name="password"
              required
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Вам нужен пароль',
                },
              ]}
              label="Придумайте пароль"
            >
              <Input.Password/>
            </Form.Item>
            <Form.Item required label="Давайте проверим, что вы не робот">
              <Reaptcha
                sitekey="6LdEz_QUAAAAAJ1K93ruihvsy0QtWTP98lWYBPW4"
                onExpire={() => {
                  this.setState({ robotCheck: false });
                }}
                onVerify={() => {
                  this.setState({ robotCheck: true });
                }}
              />
            </Form.Item>
          </>
        ),
      },
    ];
    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          <div className="app-auth-wrapper">
            <Card>
              <Form
                scrollToFirstError
                ref={this.formRef}
                className="app-auth-form"
                layout="vertical"
              >
                <Steps size="small" current={step}>
                  {registerSteps.map((item) => (
                    <Steps.Step
                      key={item.title}
                      title={item.title}
                    />
                  ))}
                </Steps>
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
                      <Button type="primary" disabled={!robotCheck} onClick={this.formSubmit}>
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
    );
  }
}

function stateToProps(state) {
  return state;
}

export default withRouter(connect(stateToProps)(Register));
