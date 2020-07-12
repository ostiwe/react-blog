import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Divider, Drawer, Form, Input, List, message, PageHeader, Tooltip, Typography,
} from 'antd';
import InfoCircleOutlined from '@ant-design/icons/lib/icons/InfoCircleOutlined';
import { apiBlog } from '../../assets/js/BlogApiSettings';

function mapStateToProps(state) {
  return state;
}

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTags: [],
      drawerOpen: false,
    };
    this.formRef = React.createRef();
    this.getTags = this.getTags.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.createTag = this.createTag.bind(this);
  }

  componentDidMount() {
    this.getTags();
  }

  componentWillUnmount() {
    apiBlog.cancelAllRequests();
  }

  getTags() {
    apiBlog.getTagsStats()
      .then((tags) => {
        if (tags.data) {
          this.setState({ allTags: tags.data });
        }
      });
  }

  toggleDrawer() {
    const { drawerOpen } = this.state;
    this.setState({ drawerOpen: !drawerOpen });
  }

  createTag() {
    this.formRef.current.validateFields()
      .then((value) => {
        const tagObject = {
          ru_name: value.ru_name,
          name: value.name,
        };
        apiBlog.createTag(tagObject)
          .then(() => {
            message.success('Тег успешно создан');
            this.getTags();
          })
          .catch((reason) => {
            message.error(`Error #${reason.code}. ${reason.message}`);
          });
      });
  }

  render() {
    const { allTags, drawerOpen } = this.state;
    return (
      <div>
        <Drawer title="Создание нового тега" visible={drawerOpen} onClose={this.toggleDrawer}>
          <Form layout="vertical" onFinish={this.createTag} ref={this.formRef}>
            <Form.Item
              hasFeedback
              required
              label="Название тега на английском"
              name="name"
              rules={[{
                required: true,
                message: 'Придумайте название тега на Английском, только буквы',
                validator: (rule, value) => {
                  const regExp = new RegExp('(^[a-zA-z_]+$)');
                  if (value !== undefined && regExp.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(rule.message);
                },
              }]}
            >
              <Input
                placeholder="Название тега на Английском"
                suffix={(
                  <Tooltip
                    title="Можно использовать большие и маленькие буквы Английского языка, а так же символ подчеркивания '_'"
                  >
                    <InfoCircleOutlined/>
                  </Tooltip>
                )}
              />
            </Form.Item>
            <Form.Item
              hasFeedback
              name="ru_name"
              label="Название тега на Русском"
              rules={[{
                required: false,
                message: 'Придумайте название тега на Русском, только буквы',
                validator: (rule, value) => {
                  if (value !== undefined && value.length > 0) {
                    const regExp = new RegExp('(^[а-яА-я_]+$)');
                    if (regExp.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(rule.message);
                  }
                  return Promise.resolve();
                },
              }]}
            >
              <Input
                placeholder="Название тега на русском"
                suffix={(
                  <Tooltip
                    title="Можно использовать большие и маленькие буквы Русского языка, а так же символ подчеркивания '_'"
                  >
                    <InfoCircleOutlined/>
                  </Tooltip>
                )}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Создать</Button>
            </Form.Item>
          </Form>
        </Drawer>
        <PageHeader
          title="Теги"
          ghost={false}
          subTitle={(
            <div>
              <span>Доступные теги</span>
            </div>
          )}
          extra={[
            <Button onClick={this.toggleDrawer}>Добавить</Button>,
          ]}
        >
          <Typography.Paragraph>
            Тут можно посмотреть все доступные теги в блоге
          </Typography.Paragraph>
        </PageHeader>
        <Divider/>
        <List
          dataSource={allTags}
          renderItem={(item) => (
            <List.Item className="list-item" key={item.id}>
              <span style={{ marginRight: 20 }}>
                #
                {item.id}
              </span>
              <List.Item.Meta
                title={item.ruName ? `${item.name} (${item.ruName})` : item.name}
                description={`Постов с данным тегом: ${item.posts}`}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Tags);
