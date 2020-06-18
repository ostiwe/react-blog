import React, {Component} from 'react';
import {connect} from 'react-redux';
import apiBlog from "../../assets/js/BlogApiSettings";
import {Card, Divider, Layout, List, PageHeader, Skeleton, Space, Statistic} from "antd";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users_count: 0,
            posts_count: 0,

            users_count_loading: true,
            posts_count_loading: true,
        }
        this.apiBlog = apiBlog;
    }

    componentDidMount() {
        this.apiBlog.getUsersCount().then(response => this.setState({
            users_count_loading: false,
            users_count: response.count
        }));
        this.apiBlog.getPostsCount().then(response => this.setState({
            posts_count_loading: false,
            posts_count: response.count
        }));
    }

    render() {
        const {posts_count, users_count_loading, posts_count_loading, users_count} = this.state;
        return <Layout>
            <PageHeader title={"Главная страница"} ghost={false}/>
            <Divider style={{margin: "10px 0"}}/>
            <Space>
                <Card style={{minWidth: 200}}>
                    <Skeleton active loading={users_count_loading}>
                        <Statistic title={'Постов'} value={posts_count}/>
                    </Skeleton>
                </Card>
                <Card style={{minWidth: 200}}>
                    <Skeleton active loading={posts_count_loading}>
                        <Statistic title={'Пользователей'} value={users_count}/>
                    </Skeleton>
                </Card>
            </Space>
            <List header={"Последние комментарии"}>
            </List>
        </Layout>
    }
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(Home);
