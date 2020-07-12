import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import {
  Avatar, Col, Layout, message, Result, Row, Space, Tooltip, Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { apiBlog, APIHOST } from '../assets/js/BlogApiSettings';
import lang from '../assets/js/lang';
import { AppFooter, AppHeader } from '../components';

const { Content } = Layout;

class UserProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadedUserInfo: null,
    };
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    const { match } = this.props;
    apiBlog.getUserById(match.params.user)
      .then((response) => {
        this.setState({ loadedUserInfo: response });
      });
  }

  render() {
    const { loadedUserInfo } = this.state;
    const { locale, userInfo } = this.props;

    const uploadSettings = {
      accept: '.jpg,.png,.jpeg',
      method: 'POST',
      action: 'http://api.symf.loc/file',
      previewFile: () => {
      },
      showUploadList: false,
      beforeUpload: () => {
        message.loading(lang.upload_msg[locale], 90);
        return true;
      },
      onChange: (file) => {
        if (file.file.status === 'done') {
          message.destroy();
          message.success(lang.success_upload_msg[locale], 5);
          this.getUserData();
        }
      },
    };

    const uploader = (
      <ImgCrop shape="round">
        <Upload
          {...uploadSettings}
          headers={{ Token: userInfo && userInfo.accessToken }}
        >
          <Tooltip placement="bottom" title={lang.change_avatar[locale]}>
            {loadedUserInfo && (
              <Avatar
                src={`${APIHOST}/avatar/${loadedUserInfo && loadedUserInfo.avatar}`}
                className="user-profile__avatar"
                size={150}
              />
            )}
          </Tooltip>
        </Upload>
      </ImgCrop>
    );
    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          {loadedUserInfo ? (
            <Row>
              <Col span={10}>
                <Space direction="vertical" align="center">
                  {(userInfo && userInfo.id) === loadedUserInfo.id ? uploader : (
                    <Avatar
                      src={`${APIHOST}/avatar/${loadedUserInfo.avatar}`}
                      className="user-profile__avatar user-profile__avatar-no-action"
                      size={150}
                    />
                  )}
                  <span>{loadedUserInfo.login}</span>
                </Space>
              </Col>
              <Col>sds 2</Col>
            </Row>
          ) : <Result icon={<LoadingOutlined/>} title={lang.user_loading[locale]}/>}
        </Content>
        <AppFooter/>
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

export default withRouter(connect(stateToProps)(UserProfile));
