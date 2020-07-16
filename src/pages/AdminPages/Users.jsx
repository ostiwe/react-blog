import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Avatar,
  Button, Divider, Empty, Form, Input, List, PageHeader,
} from 'antd';
import DownCircleOutlined from '@ant-design/icons/lib/icons/DownCircleOutlined';
import QueueAnim from 'rc-queue-anim';
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
      search: false,
      extraSearch: false,
      searchItems: [],
    };
    this.formRef = React.createRef();
    this.getUsers = this.getUsers.bind(this);
    this.searchByName = this.searchByName.bind(this);
    this.toggleExtraSearch = this.toggleExtraSearch.bind(this);
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

  searchByName(name) {
    const { users } = this.state;
    if (name.length !== 0) {
      this.setState({
        search: true,
        searchItems: users.filter((item) => item.login.indexOf(name) !== -1),
      });
      return;
    }
    this.setState({
      search: false,
      searchItems: [],
    });
  }

  toggleExtraSearch() {
    const { extraSearch } = this.state;
    this.setState({ extraSearch: !extraSearch });
  }

  render() {
    const { users, search, searchItems, extraSearch } = this.state;

    const listItems = search ? searchItems : users;
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
              <Input.Search onSearch={this.searchByName}/>
            </Form.Item>
            <QueueAnim type={['right', 'left']} leaveReverse>
              {extraSearch ? [
                <Form.Item key={'1_s1'}>
                  <Input.Search onSearch={this.searchByName}/>
                </Form.Item>,
                <Form.Item key={'1_sds'}>
                  <Input.Search onSearch={this.searchByName}/>
                </Form.Item>,
              ] : null}
            </QueueAnim>
            <Divider>
              <div className={extraSearch ? 'flip-180' : 'flip-0'}>
                <DownCircleOutlined
                  style={{
                    fontSize: 20,
                    color: '#9e9e9e',
                  }}
                  onClick={this.toggleExtraSearch}
                />
              </div>
            </Divider>
          </Form>
        </PageHeader>
        <List>
          <QueueAnim>
            {listItems.length > 0 ? listItems.map((user) => (
              <List.Item key={user.id} className="list-item">
                <List.Item.Meta
                  avatar={<Avatar src={`http://api.symf.loc/avatar/${user.avatar}`}/>}
                  title={user.login}
                />
              </List.Item>
            )) : <Empty key="list-empty"/>}
          </QueueAnim>
        </List>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(Users);
