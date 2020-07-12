import React from 'react';
import { BackTop, Layout, PageHeader } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AppFooter, AppHeader, RenderColumnItems } from '../components';
import { apiBlog } from '../assets/js/BlogApiSettings';

const { Content } = Layout;

class CategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      tags: [],
      currentTag: null,
      page: 1,
      search: false,
      filteredData: [],
      loading: false,
      postsEnd: false,
    };

    this.onSelectCategory = this.onSelectCategory.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.getTags = this.getTags.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.getTags()
      .then(() => {
        const { tags } = this.state;
        const tag = tags.filter((item) => item.id === parseInt(match.params.tag, 10));
        this.setState({ currentTag: tag[0] });
      });
    this.getPosts(match.params.tag);
  }

  onSelectCategory() {
    const { tags } = this.state;
    this.forceUpdate(() => {
      this.setState({
        page: 1,
        data: [],
      }, () => {
        const { match } = this.props;
        const tag = tags.filter((item) => item.id === parseInt(match.params.tag, 10));
        this.setState({ currentTag: tag[0] });
        this.getPosts(match.params.tag);
      });
    });
  }

  getPosts(postTag) {
    this.setState({ loading: true });
    const { page, data, currentTag } = this.state;
    let tag;
    let posts = [];

    if (typeof tag !== 'object') {
      tag = postTag;
    } else {
      tag = currentTag.id;
    }

    apiBlog.getPostsByCategory(tag, page)
      .then((items) => {
        if (items.items.length === 0) {
          this.setState({ postsEnd: true });
          return;
        }
        posts = data.concat(items.items);

        this.setState({
          data: posts,
          page: page + 1,
        });
      });

    setTimeout(() => this.setState({ loading: false }), 650);
  }

  getTags() {
    return new Promise((resolve) => {
      apiBlog.getTags()
        .then((tags) => {
          if (tags.items) {
            this.setState({ tags: tags.items }, resolve);
          }
        });
    });
  }

  render() {
    const {
      data, search, filteredData, loading, tags, postsEnd, currentTag,
    } = this.state;

    const items = search ? filteredData : data;

    const tag = currentTag ? `"${currentTag.ruName ?? currentTag.name}"` : '';
    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          <PageHeader title={(
            <div>
              Поиск по тегу
              {' '}
              {tag}
            </div>
          )}
          />
          <BackTop/>
          <RenderColumnItems
            onSelectCategory={this.onSelectCategory}
            postsEnd={postsEnd}
            loading={loading}
            items={items}
            tags={tags}
            loadData={this.getPosts}
            searchOnPage={this.searchOnPage}
          />
        </Content>
        <AppFooter/>
      </Layout>
    );
  }
}

function stateToProps(state) {
  return state;
}

export default withRouter(connect(stateToProps)(CategoryPage));
