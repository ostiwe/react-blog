import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import {Layout, PageHeader, Tabs} from 'antd';
import {AllPosts} from "./PostsSubPage";

const {Content} = Layout;
const {TabPane} = Tabs;

class Posts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 'all',
        };
    }

    changeHeaderTab = (e) => {
        const {history} = this.props;
        history.push(`/admin/posts/${e}`)
        this.setState({activeTab: e})
    }

    componentDidMount() {
        const {match} = this.props;

        if (match.params.section) {
            this.setState({activeTab: match.params.section})
        }

    }

    render() {
        const {activeTab} = this.state;
        return <Layout>
            <Content>
                <PageHeader title={'Записи в блоге'} ghost={false}
                            footer={<Tabs activeKey={activeTab} defaultActiveKey={activeTab}
                                          onChange={this.changeHeaderTab}>
                                <TabPane key={'all'} tab={'Все записи'}/>
                                <TabPane key={'filter'} tab={'Фильтр'}/>
                                <TabPane key={'new'} tab={'Новая запись'}/>
                            </Tabs>}/>
                {activeTab === 'all' && <AllPosts/>}
                {activeTab === 'filter' && "SDL"}
            </Content>
        </Layout>
    }
}

function stateToProps(props) {
    return props
}

export default withRouter(connect(stateToProps)(Posts));