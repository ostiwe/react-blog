import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, Divider, Layout, List, PageHeader, Skeleton, Space, Statistic,
} from 'antd';
import apiBlog from '../../assets/js/BlogApiSettings';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersCount: 0,
      postsCount: 0,
      commentsCount: 0,

      usersCountLoading: true,
      postsCountLoading: true,
      commentsCountLoading: true,

    };
    this.apiBlog = apiBlog;
  }

  componentDidMount() {
    this.apiBlog.getUsersCount()
      .then((response) => this.setState({
        usersCountLoading: false,
        usersCount: response.count,
      }));
    this.apiBlog.getPostsCount()
      .then((response) => this.setState({
        postsCountLoading: false,
        postsCount: response.count,
      }));
    this.apiBlog.getCommentsCount()
      .then((response) => this.setState({
        commentsCountLoading: false,
        commentsCount: response.count,
      }));
  }

  render() {
    const {
      postsCount, usersCountLoading, postsCountLoading,
      usersCount, commentsCountLoading, commentsCount,
    } = this.state;
    return (
      <Layout>
        <PageHeader title="Главная страница" ghost={false}/>
        <Divider style={{ margin: '10px 0' }}/>
        <Space>
          <Card style={{ minWidth: 200 }}>
            <Skeleton active loading={postsCountLoading}>
              <Statistic title="Постов" value={postsCount}/>
            </Skeleton>
          </Card>
          <Card style={{ minWidth: 200 }}>
            <Skeleton active loading={usersCountLoading}>
              <Statistic title="Пользователей" value={usersCount}/>
            </Skeleton>
          </Card>
          <Card style={{ minWidth: 200 }}>
            <Skeleton active loading={commentsCountLoading}>
              <Statistic title="Комментариев" value={commentsCount}/>
            </Skeleton>
          </Card>
        </Space>
        <List header="Последние комментарии"/>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Home);
