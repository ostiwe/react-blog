import PropTypes from 'prop-types';
import React from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppHeaderDropdown } from './index';

const { Header } = Layout;

function AppHeader({ userInfo, locale }) {
  return (
    <Header className="app-header">
      <Link to="/" className="app-logo">
        <div>
          <span>Блог программиста</span>
        </div>
      </Link>
      <AppHeaderDropdown userInfo={userInfo} locale={locale}/>
    </Header>
  );
}

function toProps(state) {
  return {
    userInfo: state.userInfo,
    locale: state.locale,
  };
}

AppHeader.defaultProps = {
  locale: 'ru',
  userInfo: null,
};
AppHeader.propTypes = {
  locale: PropTypes.string,
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

export default connect(toProps)(AppHeader);
