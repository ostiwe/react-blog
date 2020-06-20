import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Layout, Result } from 'antd';
import FrownOutlined from '@ant-design/icons/lib/icons/FrownOutlined';
import ArrowLeftOutlined from '@ant-design/icons/lib/icons/ArrowLeftOutlined';
import LoadingOutlined from '@ant-design/icons/lib/icons/LoadingOutlined';
import { AppFooter, AppHeader, Post } from '../components';
import apiBlog from '../assets/js/BlogApiSettings';
import lang from '../assets/js/lang';

const { Content } = Layout;

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
    const { match } = this.props;

    const postId = match.params.id;

    this.apiBlog.getPostById(postId)
      .then((response) => {
        if (response.success === false) {
          this.setState({
            notFound: true,
            load: false,
          });
          return;
        }
        this.setState({
          post: response,
          load: false,
        });
      });
  }

  render() {
    const { load, notFound, post } = this.state;
    const { locale, history } = this.props;
    return (
      <Layout>
        <AppHeader/>
        <Content className="app-content">
          {notFound && (
            <Result
              icon={<FrownOutlined/>}
              title={lang.post_not_found[locale].title}
              subTitle={lang.post_not_found[locale].subtitle}
              extra={(
                <Button
                  onClick={history.goBack}
                  className="back-btn-animated"
                  icon={<ArrowLeftOutlined className="back-btn-animated-icon"/>}
                >
                  {lang.back[locale]}
                </Button>
              )}
            />
          )}
          {load && <Result icon={<LoadingOutlined/>} title={lang.post_loading[locale]}/>}

          {(!notFound && !load) && <Post post={post}/>}
        </Content>
        <AppFooter/>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default withRouter(connect(mapStateToProps)(PostPage));
