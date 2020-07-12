import React from 'react';
import {
  Card, Descriptions, Popover,
} from 'antd';
import PropTypes from 'prop-types';
import { APIHOST } from '../assets/js/BlogApiSettings';

function UserPopover(props) {
  const { user, children } = props;
  return (
    <Popover
      overlayClassName="popover-no-padding"
      content={(
        <Card
          style={{ width: 250 }}
          cover={<img alt="us" src={`${APIHOST}/avatar/${user.avatar}`}/>}
        >
          <Card.Meta
            title={user.login}
            description={(
              <Descriptions size="small" column={1}>
                <Descriptions.Item label="Постов">
                  {user.posts}
                </Descriptions.Item>
                <Descriptions.Item label="Комментариев">
                  {user.comments}
                </Descriptions.Item>
              </Descriptions>
            )}
          />
        </Card>
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
    avatar: PropTypes.string,
    posts: PropTypes.number,
    comments: PropTypes.number,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default UserPopover;
