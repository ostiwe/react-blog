import React, {Component} from 'react';
import {connect} from 'react-redux';
import apiBlog from "../../assets/js/BlogApiSettings";
import {Card, Divider, Layout, List, PageHeader, Space, Statistic} from "antd";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.apiBlog = apiBlog;
    }

    componentDidMount() {
    }

    render() {
        return <Layout>
            <PageHeader title={"Главная страница"} ghost={false}/>
            <Divider style={{margin: "10px 0"}}/>
            <Space>
                <Card style={{minWidth: 200}}>
                    <Statistic title={'Постов'} value={30}/>
                </Card>
                <Card style={{minWidth: 200}}>
                    <Statistic title={'Пользователей'} value={15}/>
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
