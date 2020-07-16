import React from 'react';
import {
  Avatar, Button, Card, Col, Divider, Form, Input, Row, Space, Tag, Typography,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import QueueAnim from 'rc-queue-anim';

import moment from 'moment';
import 'moment/min/locales';
import PropTypes from 'prop-types';
import lang from '../assets/js/lang';
import { UserPopover } from './index';

function RenderColumnItems({
  items, searchInput, tags, loading,
  loadData, searchOnPage, postsEnd, locale, onSelectCategory,
}) {
  const sidebarForm = (
    <Form>
      <Input
        value={searchInput}
        onChange={searchOnPage}
        suffix={<SearchOutlined/>}
        placeholder={lang.search_box_text[locale]}
      />
      <Divider type="horizontal"/>
      <p>{lang.categories[locale]}</p>
      <QueueAnim>
        {tags.map((tag) => {
          if (locale === 'ru') {
            return (
              <Tag key={`tag_${tag.id}`} onClick={onSelectCategory}>
                <Link to={`/tag/${tag.id}`}>{tag.ruName ?? tag.name}</Link>
              </Tag>
            );
          }
          return (
            <Tag key={`tag_${tag.id}`} onClick={onSelectCategory}>
              <Link to={`/tag/${tag.id}`}>{tag.name}</Link>
            </Tag>
          );
        })}
      </QueueAnim>
    </Form>
  );
  return (
    <>
      <Row gutter={[0, 48]}>
        <Col xl={0} lg={0} md={0} sm={48} xs={48}>
          {sidebarForm}
        </Col>
      </Row>
      <Row gutter={[48, 16]}>
        <Col xl={19} lg={19} md={17} sm={48} xs={48} style={{ width: '100%' }}>
          {items.map((item) => (
            <QueueAnim
              key={item.id}
              type="bottom"
              duration={700}
            >
              <Card
                className="app-main-card"
                title={(
                  <Space className="app-main-card-meta__top">
                    <Avatar
                      size="small"
                      shape="circle"
                      src={`http://api.symf.loc/avatar/${item.creator.avatar}`}
                    >
                      {item.creator.login[0].toUpperCase()}
                    </Avatar>
                    <span>
                      <UserPopover user={item.creator}>
                        <Link to={`/user/${item.creator.id}`}>
                          <Space size={5}>
                            <span>Пост от</span>
                            <span>{item.creator.login}</span>
                          </Space>
                        </Link>
                      </UserPopover>
                    </span>
                  </Space>
                )}
                key={item.id}
                extra={(
                  <Space className="app-main-card-meta__top">
                    {moment(parseInt(item.published, 10) * 1000)
                      .locale(locale === 'ru' ? 'ru' : 'en')
                      .calendar()}
                  </Space>
                )}
              >
                <Typography.Title level={3}>{item.title}</Typography.Title>
                {item.description}
                <Divider/>
                <div className="app-main-card-footer">
                  <div className="app-main-card-footer__tags">
                    {item.tags.map((tag) => {
                      if (locale === 'ru') {
                        return <Tag key={tag.id}>{tag.ruName ?? tag.name}</Tag>;
                      }
                      return <Tag key={tag.id}>{tag.name}</Tag>;
                    })}
                  </div>
                  <div className="app-main-card-footer__button">
                    <Link to={`/post/${item.id}`}>{lang.post_show_full[locale]}</Link>
                  </div>
                </div>
                {/* <Card.Meta description={<div> */}
                {/*    <Tag>{item.category}</Tag> */}
                {/* </div>}/> */}
              </Card>
            </QueueAnim>
          ))}
          <div className="load-more-button-place">
            {!postsEnd
            && <Button loading={loading} onClick={loadData}>{lang.load_more[locale]}</Button>}
            {postsEnd && (
              <Divider>{lang.no_more_posts[locale]}</Divider>
            )}
          </div>
        </Col>

        <Col xl={5} lg={5} md={7} sm={0} xs={0} className="app-main-sidebar">
          {sidebarForm}
        </Col>
      </Row>
    </>
  );
}

function stateToProps(state) {
  return {
    searchInput: state.searchInput,
    locale: state.locale,
  };
}

RenderColumnItems.defaultProps = {
  items: [],
  tags: [],
  searchInput: '',
  loading: false,
  postsEnd: false,
  onSelectCategory: () => {
  },
};

RenderColumnItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    published: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    creator: PropTypes.shape({
      id: PropTypes.number,
      login: PropTypes.string,
    }),
    tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      ruName: PropTypes.string,
      name: PropTypes.string,
    })),
  })),
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    ruName: PropTypes.string,
    name: PropTypes.string,
  })),
  searchInput: PropTypes.string,
  loading: PropTypes.bool,
  loadData: PropTypes.func.isRequired,
  searchOnPage: PropTypes.func.isRequired,
  postsEnd: PropTypes.bool,
  onSelectCategory: PropTypes.func,
};

export default connect(stateToProps)(RenderColumnItems);
