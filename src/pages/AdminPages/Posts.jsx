import React from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import {Layout, PageHeader, Tabs} from 'antd';

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
    }

    componentDidMount() {
        // const {history, location} = this.props;
        // console.log(history);
        // console.log(location);
    }

    render() {
        const {activeTab} = this.state;
        return <Layout>
            <Content>
                <PageHeader title={'Записи в блоге'} ghost={false}
                            footer={<Tabs defaultActiveKey={activeTab} onChange={this.changeHeaderTab}>
                                <TabPane key={'all'} tab={'Все записи'}/>
                                <TabPane key={'filter'} tab={'Фильтр'}/>
                                <TabPane key={'new'} tab={'Новая запись'}/>
                            </Tabs>}
                />
            </Content>
        </Layout>
    }
}

function stateToProps(props) {
    return props
}

export default withRouter(connect(stateToProps)(Posts));