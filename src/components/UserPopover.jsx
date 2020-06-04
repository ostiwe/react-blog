import React from 'react';
import {Avatar, Card, List, Popover, Space} from "antd";

function UserPopover(props) {
    const {user} = props;
    return (
        <Popover content={<Space>
            <div>
                <Avatar>{user.login[0].toUpperCase()}</Avatar>
                {user.login}
            </div>
            <List size={'small'}>
                <List.Item>as</List.Item>
                <List.Item>ass</List.Item>
                <List.Item>a2</List.Item>
            </List>
            {/*<Card.Meta title={user.login} */}
            {/*           avatar={<Avatar>{user.login[0].toUpperCase()}</Avatar>}/>*/}
        </Space>}>
            {props.children}
        </Popover>
    );
}

export default UserPopover;