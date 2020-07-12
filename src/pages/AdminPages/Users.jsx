import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Avatar,
  Button, Form, Input, List, PageHeader,
} from 'antd';
import { apiBlog } from '../../assets/js/BlogApiSettings';

function mapStateToProps(state) {
  return state;
}

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      limit: 10,
      users: [],
    };
    this.formRef = React.createRef();
    this.getUsers = this.getUsers.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  componentWillUnmount() {
    apiBlog.cancelAllRequests();
  }

  getUsers() {
    const { page, limit } = this.state;
    apiBlog.getUsers(page, { limit })
      .then((users) => {
        this.setState({ users: users.items });
      });
  }

  render() {
    const { users } = this.state;
    return (
      <div>
        <PageHeader
          title="Пользователи"
          ghost={false}
          subTitle={`(${users.length})`}
          extra={[
            <Button>Добавить</Button>,
          ]}
        >
          <Form ref={this.formRef}>
            <Form.Item>
              <Input.Search/>
            </Form.Item>
          </Form>
        </PageHeader>
        <List
          dataSource={users}
          renderItem={(user) => (
            <List.Item key={user.id} className="list-item">
              <List.Item.Meta
                avatar={<Avatar src={`http://api.symf.loc/avatar/${user.avatar}`}/>}
                title={user.login}
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
)(Users);
