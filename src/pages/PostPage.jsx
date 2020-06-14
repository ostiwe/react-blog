import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import apiBlog from "../assets/js/BlogApiSettings";
import {Button, Layout, Result} from "antd";
import {AppFooter, AppHeader, Post} from "../components";
import FrownOutlined from "@ant-design/icons/lib/icons/FrownOutlined";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";
import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";

const {Content} = Layout;

class PostPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            notFound: false,
            load: true,
        };
        this.apiBlog = apiBlog;
    }

    componentDidMount() {
        const {match} = this.props;

        const postId = match.params.id;

        this.apiBlog.getPostById(postId).then(response => {
            if (response.success && !response.success) {
                this.setState({notFound: true});
                return;
            }
            this.setState({post: response, load: false})
        })

    }

    render() {
        const {load, notFound, post} = this.state;
        return <Layout>
            <AppHeader/>
            <Content className={'app-content'}>
                {notFound && <Result icon={<FrownOutlined/>} title={'Такого поста нет'}
                                     subTitle={'Или, возможно, произошла ошибка при загрузке данных'} extra={<Button
                    onClick={this.props.history.goBack} className={'back-btn-animated'}
                    icon={<ArrowLeftOutlined className={'back-btn-animated-icon'}/>}>Назад</Button>}/>}
                {load && <Result icon={<LoadingOutlined/>} title={'Ищу пост...'}/>}
                {(!notFound && !load) && <Post post={post}/>}
            </Content>
            <AppFooter/>
        </Layout>
    }
}

function mapStateToProps(state) {
    return state;
}

export default withRouter(connect(mapStateToProps)(PostPage));
