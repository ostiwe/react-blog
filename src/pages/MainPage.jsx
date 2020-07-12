import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { BackTop, Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import { changeSearchInput } from '../redux/actions/mainActions';
import { AppFooter, AppHeader, RenderColumnItems } from '../components';
import { apiBlog } from '../assets/js/BlogApiSettings';

const { Content } = Layout;

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      tags: [],
      page: 1,
      search: false,
      filteredData: [],
      loading: false,
      postsEnd: false,
    };

    this.searchOnPage = this.searchOnPage.bind(this);
    this.getTags = this.getTags.bind(this);
    this.getPosts = this.getPosts.bind(this);
  }

  componentDidMount() {
    this.getTags();
    this.getPosts();
  }

  getTags() {
    apiBlog.getTags()
      .then((tags) => {
        if (tags.items) {
          this.setState({ tags: tags.items });
        }
      });
  }

  getPosts() {
    this.setState({ loading: true });
    const { page, data } = this.state;
    let posts = [];
    apiBlog.getPosts(page)
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
        setTimeout(() => this.setState({ loading: false }), 650);
      })
      .catch(() => setTimeout(() => this.setState({ loading: false }), 650));
  }

  searchOnPage(e) {
    const { dispatch } = this.props;
    const { data } = this.state;
    const search = e.target.value.toLowerCase();
    dispatch(changeSearchInput(search));

    const filtered = data.filter((item) => item.title.toLowerCase()
      .indexOf(search) !== -1);

    const isSearch = search.length > 0;

    this.setState({
      filteredData: filtered,
      search: isSearch,
    });
  }

  render() {
    const {
      data, search, filteredData, loading, tags, postsEnd,
    } = this.state;

    const items = search ? filteredData : data;

    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          <BackTop/>
          <RenderColumnItems
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

const defProps = {
  history: PropTypes.shape({
    action: PropTypes.string,
    block: PropTypes.func,
    createHref: PropTypes.func,
    go: PropTypes.func,
    goBack: PropTypes.func,
    goForward: PropTypes.func,
    length: PropTypes.number,
    listen: PropTypes.func,
    location: PropTypes.shape({
      hash: PropTypes.string,
      pathname: PropTypes.string,
      search: PropTypes.string,
      state: PropTypes.string,
    }),
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  location: PropTypes.shape({
    hash: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.string,
  }),
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.instanceOf(Object),
    path: PropTypes.string,
    url: PropTypes.string,
  }),
  dispatch: PropTypes.func,
};

MainPage.defaultProps = defProps;

MainPage.propTypes = {
  ...defProps,
};

function stateToProps(state) {
  return state;
}

export default withRouter(connect(stateToProps)(MainPage));
