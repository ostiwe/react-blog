import React from 'react';
import {
  Avatar, Layout, PageHeader, Space, Tag,
} from 'antd';
import PropTypes from 'prop-types';

import moment from 'moment';
import EyeOutlined from '@ant-design/icons/lib/icons/EyeOutlined';
import { connect } from 'react-redux';
import { Comments } from './index';

const { Content } = Layout;
const Post = ({ post, locale }) => (
  <Layout>
    <PageHeader
      title={post.title}
      ghost={false}
      extra={moment(parseInt(post.published, 10) * 1000)
        .locale(locale === 'ru' ? 'ru' : 'en')
        .calendar()}
      footer={(
        <Space style={{ marginBottom: 16 }}>
          <Avatar>{post.creator.login[0].toUpperCase()}</Avatar>
          {post.creator.login}
        </Space>
      )}
    />
    <Content className="post-content">
      <div className="post-content-body">{post.content}</div>
      <div className="post-content-footer">
        <Space>
          {post.tags.map((tag) => {
            if (locale === 'ru') {
              return <Tag key={tag.id}>{tag.ruName ?? tag.name}</Tag>;
            }
            return <Tag key={tag.id}>{tag.name}</Tag>;
          })}
        </Space>
        <Space>
          <span className="post-content-footer-stats-item">
            <EyeOutlined
              className="app-icon"
            />
            {post.views}
          </span>
        </Space>
      </div>
    </Content>
    <Comments type="post" postId={post.id}/>
  </Layout>
);

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    published: PropTypes.number,
    views: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.string,
    creator: PropTypes.shape({
      id: PropTypes.number,
      login: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      ruName: PropTypes.string,
      name: PropTypes.string,
    })),
  }).isRequired,
};

function stateToProps(state) {
  return {
    locale: state.locale,
  };
}

export default connect(stateToProps)(Post);
