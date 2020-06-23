import React from 'react';
import {
  Button, Dropdown, Layout, Menu,
} from 'antd';
import GlobalOutlined from '@ant-design/icons/lib/icons/GlobalOutlined';
import { connect } from 'react-redux';
import { setLocale } from '../redux/actions/mainActions';

const { Footer } = Layout;

function AppFooter({ locale, dispatch }) {
  const menu = (
    <Menu className="locale_changer_menu" selectedKeys={[locale]}>
      <Menu.Item key="ru" onClick={() => dispatch(setLocale('ru'))}>RU (Русский)</Menu.Item>
      <Menu.Item key="en" onClick={() => dispatch(setLocale('en'))}>EN (English)</Menu.Item>
    </Menu>
  );
  return (
    <Footer className="app-footer">
      <div className="app-footer-content">
        Footer app
        <Dropdown className="locale_changer" overlay={menu}>
          <Button><GlobalOutlined/></Button>
        </Dropdown>
      </div>
    </Footer>
  );
}

function stateToProps(state) {
  return {
    locale: state.locale,
  };
}

export default connect(stateToProps)(AppFooter);
