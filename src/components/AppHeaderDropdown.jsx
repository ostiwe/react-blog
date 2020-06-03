import React from "react";
import {Button, Dropdown, Menu, Space} from "antd";
import {DownOutlined, UserOutlined, MenuOutlined, DashboardOutlined, LogoutOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

export default function ({user_info}) {
    const menu = user_info && <Menu>
        <Menu.Item key="1">
            <Link to={'/profile'}>
                <UserOutlined/> Профиль
            </Link>
        </Menu.Item>
        {user_info.mask ? (user_info.mask & 16) &&
            <Menu.Item key="2">
                <Link to={'/admin'}>
                    <DashboardOutlined/> Админка
                </Link>
            </Menu.Item> : null
        }
        <Menu.Item key="3">
            <LogoutOutlined/> Выйти
        </Menu.Item>
    </Menu>;

    const authMenu = <Menu>
        <Menu.Item key="register">
            <Link to={'/register'}>
                Регистрация
            </Link>
        </Menu.Item>
        <Menu.Item key="login">
            <Link to={'/login'}>
                Вход
            </Link>
        </Menu.Item>
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