import React from 'react';
import {
  Avatar, List, Popover, Space,
} from 'antd';
import PropTypes from 'prop-types';

function UserPopover(props) {
  const { user, children } = props;
  return (
    <Popover content={(
      <Space>
        <div>
          <Avatar>{user.login[0].toUpperCase()}</Avatar>
          {user.login}
        </div>
        <List size="small">
          <List.Item>as</List.Item>
          <List.Item>ass</List.Item>
          <List.Item>a2</List.Item>
        </List>
      </Space>
    )}
    >
      {children}
    </Popover>
  );
}

UserPopover.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default UserPopover;
