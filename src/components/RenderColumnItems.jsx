import React from "react";
import {Avatar, Button, Card, Col, Divider, Form, Input, Row, Space, Tag, Typography} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import moment from 'moment';
import 'moment/min/locales';

function RenderColumnItems({
                               items, search_input, tags, loading,
                               loadData, searchOnPage, postsEnd, onSelectCategory
                           }) {
    const sidebarForm = (
        <Form>
            <Input value={search_input} onChange={searchOnPage} suffix={<SearchOutlined/>}
                   placeholder={'Что ищем?'}/>
            <Divider type={"horizontal"}/>
            <p>Категории</p>
            {tags.map(item => <Tag key={item.id}>
                <Link to={`/tag/${item.id}`} onClick={onSelectCategory}>{item.ru_name ?? item.name}</Link>
            </Tag>)}
        </Form>
    );
    return <>
        <Row gutter={[0, 48]}>
            <Col xl={0} lg={0} md={0} sm={48} xs={48}>
                {sidebarForm}
            </Col>
        </Row>
        <Row gutter={[48, 16]}>
            <Col xl={19} lg={19} md={17} sm={48} xs={48} style={{width: '100%'}}>
                {items.map((item) => {
                    return <Card className={'app-main-card'} title={
                        <Space className={'app-main-card-meta__top'}>
                            <Avatar size={"small"} shape={"circle"}>{item.creator.login[0]}</Avatar>
                            <span>Пост от {item.creator.login}</span>
                        </Space>} key={item.id}
                                 extra={<Space className={'app-main-card-meta__top'}>
                                     {moment(parseInt(item.published) * 1000).locale('ru-RU').calendar()}
                                 </Space>}>
                        <Typography.Title level={3}>{item.title}</Typography.Title>
                        {item.description ?? item.content.substring(0, 200) + '...'}
                        <Divider/>
                        <div className={'app-main-card-footer'}>
                            <div className="app-main-card-footer__tags">
                                {item.tags.map(tag => {
                                    return <Tag key={tag.id}>{tag.ru_name ?? tag.name}</Tag>
                                })}
                            </div>
                            <div className="app-main-card-footer__button">
                                <Link to={`/post/${item.id}`}>Подробнее</Link>
                            </div>
                        </div>
                        {/*<Card.Meta description={<div>*/}
                        {/*    <Tag>{item.category}</Tag>*/}
                        {/*</div>}/>*/}
                    </Card>
                })}
                <div className={'load-more-button-place'}>
                    {!postsEnd && <Button loading={loading} onClick={loadData}>Загрузить еще</Button>}
                    {postsEnd && (
                        <Divider>Записей больше нет</Divider>
                    )}
                </div>
            </Col>

            <Col xl={5} lg={5} md={7} sm={0} xs={0} className={'app-main-sidebar'}>
                {sidebarForm}
            </Col>
        </Row>
    </>
}

function stateToProps(state) {
    return state
}

export default connect(stateToProps)(RenderColumnItems);