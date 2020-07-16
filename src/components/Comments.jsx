import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Avatar, Comment, Divider, Empty, List, message, Result, Tooltip,
} from 'antd';
import moment from 'moment';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LockOutlined from '@ant-design/icons/lib/icons/LockOutlined';
import Viewer from 'react-viewer';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import ClockCircleOutlined from '@ant-design/icons/lib/icons/ClockCircleOutlined';
import InfoCircleOutlined from '@ant-design/icons/lib/icons/InfoCircleOutlined';
import QueueAnim from 'rc-queue-anim';
import { apiBlog, APIHOST } from '../assets/js/BlogApiSettings';
import lang from '../assets/js/lang';
import { ContentEditor } from './index';

// dont work, lol
const parseHtml = htmlParser({});

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      editorState: '',
      commentSending: false,
      postId: null,
      imageViewerVisible: false,
      imageSelected: [],
      moderatedComments: 0,
    };
    this.updateCommentsIntervalId = null;
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getComments = this.getComments.bind(this);
    this.selectImage = this.selectImage.bind(this);
  }

  componentDidMount() {
    const { postId, type } = this.props;
    this.setState({ postId });
    this.getComments(postId, type);
    this.updateCommentsIntervalId = setInterval(() => this.getComments(postId, type), 20000);
    document.addEventListener('click', this.selectImage);
  }

  componentWillUnmount() {
    clearInterval(this.updateCommentsIntervalId);
    document.removeEventListener('click', this.selectImage);
  }

  onSubmit() {
    const { editorState, postId } = this.state;
    const { locale } = this.props;
    this.setState({ commentSending: true });
    apiBlog.createComment(postId, editorState)
      .then(() => {
        message.success(lang.comment_create_success[locale]);
        this.setState({
          commentSending: false,
          editorState: '',
        });
        this.getComments(postId, 'post');
      })
      .catch(() => {
        message.error(lang.comment_create_error[locale]);
      });
  }

  onChange(editorState) {
    this.setState({ editorState });
  }

  getComments(postId, type) {
    if (type === 'post') {
      apiBlog.getComments(postId)
        .then((response) => {
          if (!response.success && response.success !== false) {
            let count = 0;
            // eslint-disable-next-line no-return-assign
            response.filter((item) => item.moderated && (count += 1));
            this.setState({
              comments: response,
              moderatedComments: count,
            });
          }
        });
    }
    this.setState({ loading: false });
  }

  selectImage(e) {
    if (e.type === 'click' && e.target.localName === 'img' && e.target.offsetParent.className === 'ant-comment-content') {
      this.setState({
        imageSelected: [{
          src: e.target.src,
          alt: '',
        }],
      }, () => this.setState({ imageViewerVisible: true }));
    }
  }

  render() {
    const {
      comments, editorState, commentSending,
      imageSelected, loading, imageViewerVisible,
      moderatedComments,
    } = this.state;
    const { userInfo, locale } = this.props;

    const commentEditor = (
      <ContentEditor
        onSubmit={this.onSubmit}
        commentSending={commentSending}
        onChange={this.onChange}
        editorState={editorState}
        buttonText={lang.comments_add_button[locale]}
      />
    );

    const viewerProps = {
      drag: false,
      rotatable: false,
      changeable: false,
      visible: imageViewerVisible,
      images: imageSelected,
      onClose: () => this.setState({
        imageViewerVisible: false,
        imageSelected: [],
      }),
      onMaskClick: () => this.setState({
        imageViewerVisible: false,
        imageSelected: [],
      }),
      loop: false,
      downloadUrl: imageSelected[0] && imageSelected[0].src,
      noNavbar: true,
      downloadable: true,
      showTotal: false,
      scalable: false,
    };

    return (
      <div>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Viewer {...viewerProps}/>

        <List
          header={lang.comments[locale]}
          className="comments-list"
          itemLayout="horizontal"
          loading={loading}
        >
          <QueueAnim>
            {comments.length > 0 && comments.map((item) => {
              const commentItem = (
                <Comment
                  author={item.creator.login}
                  datetime={moment(parseInt(item.createdAt, 10) * 1000)
                    .locale(locale === 'ru' ? 'ru' : 'en')
                    .calendar()}
                  avatar={(
                    <Avatar
                      className="img-reset"
                      src={`${APIHOST}/avatar/${item.creator.avatar}`}
                    >
                      {item.creator.login[0].toUpperCase()}
                    </Avatar>
                  )}
                  content={(
                    <div>
                      <ReactMarkdown
                        escapeHtml={false}
                        astPlugins={[parseHtml]}
                        source={item.text}
                      />
                    </div>
                  )}
                />
              );

              if (item.deleted) {
                return (
                  <List.Item
                    key={item.id}
                    className="post-comment-item"
                    extra={(userInfo && userInfo.id === item.creator.id)
                      ? (
                        <Tooltip
                          placement="left"
                          title={lang.deleted_post_msg[locale]}
                        >
                          <InfoCircleOutlined style={{ color: '#ff5555' }}/>
                        </Tooltip>
                      ) : null}
                  >
                    <Comment content={lang.comment_deleted[locale]}/>
                  </List.Item>
                );
              }
              if (item.moderated) {
                return (
                  <List.Item key={item.id} className="post-comment-item">
                    {commentItem}
                  </List.Item>
                );
              }
              if (!item.moderated && (userInfo && userInfo.id === item.creator.id)) {
                return (
                  <List.Item
                    extra={(
                      <Tooltip placement="left" title={lang.moderated_post_msg[locale]}>
                        <ClockCircleOutlined style={{ color: '#ffba55' }}/>
                      </Tooltip>
                    )}
                    key={item.id}
                    className="post-comment-item post-comment-item__moderate"
                  >
                    {commentItem}
                  </List.Item>
                );
              }
              return null;
            })}
          </QueueAnim>
          {((comments.length === 0 || moderatedComments === 0) && !loading)
          && <Empty description={lang.comments_empty[locale]}/>}
        </List>
        <Divider/>
        {((userInfo && parseInt(userInfo.mask, 10)) & 16)
          ? (
            <Comment
              className="post-comment-editor"
              avatar={(
                <Avatar
                  src={`${APIHOST}/avatar/${userInfo.avatar}`}
                >
                  {userInfo && userInfo.login[0].toUpperCase()}
                </Avatar>
              )}
              content={commentEditor}
            />
          )
          : <Result icon={<LockOutlined/>} subTitle={lang.comments_write_prohibited[locale]}/>}
      </div>
    );
  }
}

Comments.defaultProps = {
  userInfo: null,
};

Comments.propTypes = {
  type: PropTypes.oneOf(['post']).isRequired,
  postId: PropTypes.number.isRequired,
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

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Comments);
