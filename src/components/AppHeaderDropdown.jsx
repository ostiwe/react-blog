import React from 'react';
import {
  Button, Dropdown, Menu, Space,
} from 'antd';
import {
  DashboardOutlined, DownOutlined, LogoutOutlined, MenuOutlined, UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import lang from '../assets/js/lang';
import apiBlog from '../assets/js/BlogApiSettings';

function logOut() {
  localStorage.clear();
  sessionStorage.clear();
  apiBlog.logout();
  window.location.reload();
}

function AppHeaderDropdown({ userInfo, locale }) {
  const menu = userInfo && (
    <Menu>
      <Menu.Item key="1">
        <Link to={`/user/${userInfo.id}`}>
          <Space>
            <UserOutlined/>
            {lang.profile_link[locale]}
          </Space>
        </Link>
      </Menu.Item>
      {userInfo.mask ? (userInfo.mask & 16)
        && (
          <Menu.Item key="2">
            <Link to="/admin">
              <Space>
                <DashboardOutlined/>
                {lang.admin_panel_link[locale]}
              </Space>
            </Link>
          </Menu.Item>
        ) : null}
      <Menu.Item key="3" onClick={logOut}>
        <Space>
          <LogoutOutlined/>
          {lang.logout_link[locale]}
        </Space>
      </Menu.Item>
    </Menu>
  );

  const authMenu = (
    <Menu>
      <Menu.Item key="register">
        <Link to="/register">
          {lang.sign_up_link[locale]}
        </Link>
      </Menu.Item>
      <Menu.Item key="login">
        <Link to="/login">
          {lang.sign_in_link[locale]}
        </Link>
      </Menu.Item>
    </Menu>
  );

  const AuthDropdown = (
    <Dropdown
      className="app-header-auth-dropdown"
      placement="bottomLeft"
      overlay={authMenu}
    >
      <Button icon={<MenuOutlined/>}/>
    </Dropdown>
  );

  return (
    <div className="app-header-dropdown">
      {userInfo ? (
        <Dropdown overlay={userInfo && menu} placement="bottomLeft">
          <Button>
            {userInfo.login}
            <DownOutlined/>
          </Button>
        </Dropdown>
      ) : (
        <div>
          {AuthDropdown}
          <Space className="app-header-auth-buttons">
            <Link to="/register">
              <Button>
                {lang.sign_up_link[locale]}
              </Button>
            </Link>
            <Link to="/login">
              <Button>
                {lang.sign_in_link[locale]}
              </Button>
            </Link>
          </Space>
        </div>
      )}
    </div>
  );
}

AppHeaderDropdown.defaultProps = {
  userInfo: null,
};

AppHeaderDropdown.propTypes = {
  locale: PropTypes.string.isRequired,
  userInfo: PropTypes.shape({
    login: PropTypes.string,
    mask: PropTypes.number,
    email: PropTypes.string,
    id: PropTypes.number,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    locale: PropTypes.string,
    accessToken: PropTypes.string,
  }),
};

export default AppHeaderDropdown;
