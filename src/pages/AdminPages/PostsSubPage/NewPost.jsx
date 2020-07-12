import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  message,
  notification,
  Select,
  Space,
  Switch,
} from 'antd';
import moment from 'moment';
import 'moment/locale/ru';
import ruRU from 'antd/es/locale/ru_RU';
import { ContentEditor } from '../../../components';
import { apiBlog } from '../../../assets/js/BlogApiSettings';

const { Option } = Select;

moment.locale('ru', {
  week: {
    dow: 1,
  },
});

function mapStateToProps(state) {
  return state;
}

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: '',
      post: {
        tags: [],
        publishTime: 0,
        publishNow: false,
      },
      allTags: [],
      momentTime: null,
      contentValidateStatus: '',
      contentValidateMessage: null,
    };
    this.formRef = React.createRef();
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.getTags = this.getTags.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.changePublishTime = this.changePublishTime.bind(this);
    this.changeTags = this.changeTags.bind(this);
    this.setMomentTime = this.setMomentTime.bind(this);
  }

  componentDidMount() {
    // this.setState({ momentTime: moment() });
    this.getTags();
  }

  componentWillUnmount() {
    this.formRef = null;
    apiBlog.cancelAllRequests();
  }

  getTags() {
    apiBlog.getTags()
      .then((tags) => {
        if (tags.items) {
          this.setState({ allTags: tags.items });
        }
      });
  }

  setMomentTime() {
    return new Promise((resolve) => {
      this.setState({ momentTime: moment() }, resolve);
    });
  }

  toggleSwitch(e) {
    const { stateMomentTime } = this.state;
    if (!stateMomentTime) {
      this.setMomentTime()
        .then(() => {
          const { post, momentTime } = this.state;
          const time = momentTime ? momentTime.unix() : moment()
            .unix();

          const postState = {
            ...post,
            publishTime: time,
            publishNow: e,
          };

          this.setState({
            post: postState,
          });
        });
    }
  }

  changePublishTime(m) {
    const { post } = this.state;
    if (m) {
      this.setState({
        post: {
          ...post,
          publishTime: m.unix(),
        },
        momentTime: m,
      });
    } else {
      this.setState({
        post: {
          ...post,
          publishTime: 0,
        },
        momentTime: null,
      });
    }
  }

  changeTags(tags, options) {
    const { post } = this.state;
    const tagsId = options.map((item) => parseInt(item.key, 10));

    this.setState({
      post: {
        ...post,
        tags: tagsId,
      },
    });
  }

  submitPost() {
    const { editorState, post } = this.state;
    this.formRef.current.validateFields()
      .then((value) => {
        if (editorState.length >= 100) {
          this.setState({
            contentValidateStatus: '',
            contentValidateMessage: null,
          });

          const submittedPost = {
            title: value.post_title,
            description: value.post_description,
            published: post.publishTime,
            publish_now: post.publishNow,
            content: editorState,
            tags: post.tags,
          };
          apiBlog.createPost(submittedPost)
            .then(() => {
              message.success('Пост успешно создан');
              this.formRef.current.resetFields();
              this.setState({
                editorState: '',
                momentTime: null,
                post: {
                  tags: [],
                  publishTime: 0,
                  publishNow: false,
                },
              });
            })
            .catch((reason) => {
              notification.error({
                description: reason.message,
                message: `Error #${reason.code}`,
              });
            });
          return;
        }

        this.setState({
          contentValidateStatus: 'error',
          contentValidateMessage: `Необходимо как минимум 100 символов, осталось ${100 - editorState.length}`,
        });
      });
  }

  render() {
    const {
      editorState, post, allTags, momentTime, contentValidateStatus,
      contentValidateMessage,
    } = this.state;
    return (
      <div>
        <ConfigProvider locale={ruRU}>
          <Form layout="vertical" ref={this.formRef}>
            <div className="post-comment-editor">
              <Form.Item
                name="post_title"
                hasFeedback
                rules={[{
                  required: true,
                  message: 'Введите название поста',
                }]}
                label="Название поста"
              >
                <Input/>
              </Form.Item>
              <Form.Item name="post_description" label="Описание поста">
                <Input.TextArea/>
              </Form.Item>
              <Form.Item
                name="post_publish"
                hasFeedback
                rules={[{
                  required: true,
                  message: 'Выберие корректную дату',
                  validator: (rule) => {
                    if (post.publishTime === 0) {
                      return Promise.reject(rule.message);
                    }
                    return Promise.resolve();
                  },
                }]}
                label="Дата публикации"
              >
                <Input hidden readOnly value={post.publishTime}/>
                <Space>
                  <DatePicker
                    disabled={post.publishNow}
                    showTime
                    format="MMMM Do YYYY, HH:mm"
                    value={momentTime}
                    onChange={this.changePublishTime}
                  />
                  <span>или сразу</span>
                  <Switch onChange={this.toggleSwitch}/>
                </Space>
              </Form.Item>
              <Form.Item
                rules={[{
                  required: true,
                  message: 'Выберите хотя бы 1 тег',
                }]}
                name="post_tags"
                hasFeedback
                label="Теги"
              >
                <Select mode="tags" placeholder="Выберите теги" onChange={this.changeTags}>
                  {allTags.map((item) => (
                    <Option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Контент"
                required
                name="post_content"
                validateStatus={contentValidateStatus}
                help={contentValidateMessage}
              >
                <ContentEditor
                  onSubmit={this.submitPost}
                  commentSending={false}
                  onChange={(e) => this.setState({ editorState: e })}
                  editorState={editorState}
                  buttonText="Создать пост"
                />
              </Form.Item>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(NewPost);
