import React from 'react';
import {Avatar, Layout, PageHeader, Space, Tag} from "antd";
import moment from "moment";
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined";
import {Comments} from "./index";

const {Content} = Layout;
const Post = ({post}) => {
    return <Layout>
        <PageHeader title={post.title} ghost={false}
                    extra={moment(parseInt(post.published) * 1000).locale('ru-RU').calendar()}
                    footer={<Space style={{marginBottom: 16}}>
                        <Avatar>{post.creator.login[0].toUpperCase()}</Avatar>
                        {post.creator.login}
                    </Space>}/>
        <Content className={"post-content"}>
            <div className="post-content-body">{post.content}</div>
            <div className="post-content-footer">
                <Space>
                    {post.tags.map(tag => <Tag key={tag.id}>{tag.ru_name ?? tag.name}</Tag>)}
                </Space>
                <Space>
                    <span className={'post-content-footer-stats-item'}><EyeOutlined
                        className={"app-icon"}/> {post.views}</span>
                </Space>
            </div>
        </Content>
        <Comments type={"post"} postid={post.id}/>
    </Layout>
};

export default Post;
