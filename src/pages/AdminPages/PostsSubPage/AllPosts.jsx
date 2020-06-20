import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Avatar, Button, Divider, List, notification, Space, Tooltip,
} from 'antd';
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined';

import moment from 'moment';
import apiBlog from '../../../assets/js/BlogApiSettings';
import 'moment/min/locales';

import { UserPopover } from '../../../components';

class AllPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      items: [],
      load: true,
      hasMore: true,
    };
    this.apiBlog = apiBlog;
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts() {
    this.setState({ load: true });
    const { page, items } = this.state;
    const posts = items;
    this.apiBlog
      .setAccessToken(localStorage.getItem('access_token'))
      .getPosts(page)
      .then((response) => {
        if (response.items.length === 0) {
          this.setState({ hasMore: false });
          return;
        }
        response.items.map((post) => posts.push(post));
        this.setState({
          items: posts,
          page: page + 1,
          load: false,
        });
      })
      .catch((error) => {
        notification.error({ message: 'Что-то пошло не так' });
        console.error(error);
        this.setState({ load: false });
      });
  }

  render() {
    const {
      load, items, hasMore,
    } = this.state;
    return (
      <div>
        <List
          loading={load}
          dataSource={items}
          loadMore={hasMore
            ? (
              <Divider>
                <Button loading={load} disabled={load} onClick={this.getPosts}>
                  Загрузить
                  еще
                </Button>
              </Divider>
            )
            : <Divider>На этом все</Divider>}
          renderItem={(item) => (
            <List.Item
              className="post-row"
              key={item.id}
              extra={[
                <Button.Group key={`btn_group_${item.id}`}>
                  <Button><MoreOutlined/></Button>
                  <Button><MoreOutlined/></Button>
                </Button.Group>,
              ]}
            >
              <List.Item.Meta
                key={`meta_${item.id}`}
                avatar={<Avatar>{item.creator.login[0].toUpperCase()}</Avatar>}
                title={item.title}
                description={(
                  <div>
                    <Space>
                      <UserPopover user={item.creator}>
                        Создал:
                        {' '}
                        {item.creator.login}
                      </UserPopover>
                      <Tooltip
                        title={moment(parseInt(item.published, 10) * 1000)
                          .locale('ru-RU')
                          .format('LLLL')}
                      >
                        {moment(parseInt(item.published, 10) * 1000)
                          .locale('ru-RU')
                          .calendar()}
                      </Tooltip>
                    </Space>
                  </div>
                )}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(
  mapStateToProps,
)(AllPosts);
