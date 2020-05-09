import React from "react";
import {Button, Card, Col, Divider, Layout, Row, Tag, Typography} from "antd";
import {AppFooter, AppHeader} from "../components";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";


const {Content} = Layout;

class CategoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    render() {
        const {user_info, match} = this.props;
        console.log(match)
        return <Layout>
            <AppHeader user_info={user_info}/>
            <Content className={'app-content'}>

            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(CategoryPage));