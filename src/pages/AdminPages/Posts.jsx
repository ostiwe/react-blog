import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Layout, PageHeader, Tabs } from 'antd';
import { AllPosts, NewPost } from './PostsSubPage';

const { Content } = Layout;
const { TabPane } = Tabs;

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'load',
    };
    this.changeHeaderTab = this.changeHeaderTab.bind(this);
    this.selectTabItemByUrl = this.selectTabItemByUrl.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;

    if (match.params.section) {
      this.setState({ activeTab: match.params.section });
    }
    this.selectTabItemByUrl();
  }

  selectTabItemByUrl() {
    const { location, history } = this.props;
    let url = location.pathname.split('/');
    const tab = url[url.length - 1];
    if (tab === '' || tab === 'posts') {
      url = 'all';
      history.push(`${location.pathname}/all`);
    } else {
      url = tab;
    }
    this.setState({ activeTab: url });
  }

  changeHeaderTab(e) {
    const { history } = this.props;
    history.push(`/admin/posts/${e}`);
    this.setState({ activeTab: e });
  }

  render() {
    const { activeTab } = this.state;
    return (
      <Layout>
        <Content>
          <PageHeader
            title="Записи в блоге"
            ghost={false}
            footer={(
              <Tabs
                activeKey={activeTab}
                defaultActiveKey={activeTab}
                onChange={this.changeHeaderTab}
              >
                <TabPane key="all" tab="Все записи"/>
                <TabPane key="new" tab="Новая запись"/>
              </Tabs>
            )}
          />

          {activeTab === 'all' && <AllPosts/>}
          {activeTab === 'new' && <NewPost/>}
        </Content>
      </Layout>
    );
  }
}

function stateToProps(props) {
  return props;
}

export default withRouter(connect(stateToProps)(Posts));
