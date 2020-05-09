import React from "react";
import {Button, Dropdown, Menu, Space} from "antd";
import {DownOutlined, UserOutlined, MenuOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

export default function ({user_info}) {
    const menu = user_info && <Menu>
        <Menu.Item key="1">
            <UserOutlined/> Профиль
        </Menu.Item>
        <Menu.Item key="2">
            <UserOutlined/> 2nd menu item
        </Menu.Item>
        <Menu.Item key="3">
            <UserOutlined/> Выйти
        </Menu.Item>
    </Menu>;

    const authMenu = <Menu>
        <Link to={'/register'}>
            <Menu.Item key="register">
                Регистрация
            </Menu.Item>
        </Link>
        <Link to={'/login'}>
            <Menu.Item key="login">
                Вход
            </Menu.Item>
        </Link>
    </Menu>;

    const AuthDropdown = <Dropdown className={'app-header-auth-dropdown'} placement={'bottomLeft'} overlay={authMenu}>
        <Button icon={<MenuOutlined/>}/>
    </Dropdown>;

    return <div className={'app-header-dropdown'}>
        {user_info ? <Dropdown overlay={user_info && menu} placement={'bottomLeft'}>
            <Button>
                {user_info.login} <DownOutlined/>
            </Button>
        </Dropdown> : <div>
            {AuthDropdown}
            <Space className={'app-header-auth-buttons'}>
                <Link to={'/register'}>
                    <Button>Регистрация</Button>
                </Link>
                <Link to={'/login'}>
                    <Button>Войти</Button>
                </Link>
            </Space>
        </div>}
    </div>
}