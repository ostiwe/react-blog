import React from "react";
import {Button, Dropdown, Menu, Modal, Space} from "antd";
import {DashboardOutlined, DownOutlined, LogoutOutlined, MenuOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import lang from "../assets/js/lang";

function showInfoModal() {
    Modal.info({
        title: "Информация",
        maskClosable: true,
        content: <div>Для работы, необходимо запустить API сервер на локальной машине. Репозиторий с API <a
            href='https://vk.cc/av6Ww7' target='_blank'>https://vk.cc/av6Ww7</a></div>
    });
}

function logOut() {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
}

export default function ({user_info, locale}) {

    const menu = user_info && <Menu>
        <Menu.Item key="1">
            <Link to={'/profile'}>
                <UserOutlined/> {lang.profile_link[locale]}
            </Link>
        </Menu.Item>
        {user_info.mask ? (user_info.mask & 16) &&
            <Menu.Item key="2">
                <Link to={'/admin'}>
                    <DashboardOutlined/> {lang.admin_panel_link[locale]}
                </Link>
            </Menu.Item> : null
        }
        <Menu.Item key="3" onClick={logOut}>
            <LogoutOutlined/> {lang.logout_link[locale]}
        </Menu.Item>
    </Menu>;

    const authMenu = <Menu>
        <Menu.Item key="register">
            <Link to={'/register'}>
                {lang.sign_up_link[locale]}
            </Link>
        </Menu.Item>
        <Menu.Item key="login">
            <Link to={'/login'}>
                {lang.sign_in_link[locale]}
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
                <Button onClick={showInfoModal}><InfoCircleOutlined/></Button>
                <Link to={'/register'}>
                    <Button>
                        {lang.sign_up_link[locale]}
                    </Button>
                </Link>
                <Link to={'/login'}>
                    <Button>
                        {lang.sign_in_link[locale]}
                    </Button>
                </Link>
            </Space>
        </div>}
    </div>
}