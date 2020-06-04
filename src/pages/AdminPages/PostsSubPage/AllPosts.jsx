import React, {Component} from 'react';
import {connect} from 'react-redux';
import apiBlog from "../../../assets/js/BlogApiSettings";
import {Avatar, Button, Divider, List, notification, Popover, Space, Tooltip} from "antd";
import MoreOutlined from "@ant-design/icons/lib/icons/MoreOutlined";

import moment from "moment/min/moment-with-locales.min";
import {UserPopover} from "../../../components";

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

    getPosts = () => {
        const {page, items} = this.state;
        let posts = items;
        this.apiBlog
            .setAccessToken(localStorage.getItem('access_token'))
            .getPosts(page)
            .then(response => {
                if (response.count === 0) {
                    this.setState({hasMore: false})
                    return
                }
                response.items.map(post => posts.push(post));
                this.setState({items: posts, page: page + 1, load: false})
            })
            .catch(error => {
                notification.error({message: "Что-то пошло не так"})
                console.error(error);
            })
    }

    componentDidMount() {
        this.getPosts();
    }

    render() {
        const {load, items, page, hasMore} = this.state;
        return (
            <div>
                <List loading={load} dataSource={items}
                      loadMore={hasMore ? <Divider><Button onClick={this.getPosts}>Загрузить еще</Button></Divider> :
                          <Divider>На этом все</Divider>}
                      renderItem={(item, index) => {
                          const {post, author} = item;
                          return <List.Item key={index} extra={[<Button.Group>
                              <Button><MoreOutlined/></Button>
                              <Button><MoreOutlined/></Button>
                          </Button.Group>]}>
                              <List.Item.Meta avatar={<Avatar>{author.login[0].toUpperCase()}</Avatar>}
                                              title={post.title}
                                              description={<div>
                                                  <Space>
                                                      <UserPopover user={author}>
                                                          Создал: {author.login}
                                                      </UserPopover>
                                                      <Tooltip
                                                          title={moment(parseInt(post.published) * 1000).locale('ru-RU').format('LLLL')}>
                                                          {moment(parseInt(post.published) * 1000).locale('ru-RU').calendar()}
                                                      </Tooltip>
                                                  </Space>
                                              </div>}
                              />
                          </List.Item>
                      }}/>
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
