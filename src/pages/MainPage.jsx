import React from "react";
import {connect} from "react-redux";
import {BackTop, Layout} from "antd";
import {changeSearchInput} from "../redux/actions/mainActions";
import {withRouter} from "react-router-dom";
import {AppFooter, AppHeader, RenderColumnItems} from "../components";
import apiBlog from "../assets/js/BlogApiSettings";

const {Content} = Layout;

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
        }
        this.apiBlog = apiBlog;
    }

    componentDidMount() {
        this.getTags();
        this.getPosts();
    }

    getTags = () => {
        this.apiBlog.getTags().then(tags => {
            if (tags.items) {
                this.setState({tags: tags.items})
            }
        });
    }

    getPosts = () => {
        this.setState({loading: true})
        const {page, data} = this.state;
        let _items = [];
        this.apiBlog.getPosts(page).then(items => {
            if (items.items.length === 0) {
                this.setState({postsEnd: true})
                return;
            }
            _items = data.concat(items.items);

            this.setState({data: _items, page: page + 1})
            setTimeout(() => this.setState({loading: false}), 650)
        }).catch(() => setTimeout(() => this.setState({loading: false}), 650));

    }

    searchOnPage = (e) => {
        let search = e.target.value.toLowerCase();
        this.props.dispatch(changeSearchInput(search));

        let filtered = this.state.data.filter(item => item.title.toLowerCase().indexOf(search) !== -1);

        let isSearch = search.length > 0;

        this.setState({filteredData: filtered, search: isSearch});
    }

    render() {
        const {data, search, filteredData, loading, tags, postsEnd} = this.state;

        const items = search ? filteredData : data;

        return <Layout>
            <AppHeader/>

            <Content className={'app-content'}>
                <BackTop/>
                <RenderColumnItems postsEnd={postsEnd} loading={loading} items={items} tags={tags}
                                   loadData={this.getPosts} searchOnPage={this.searchOnPage}/>
            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(MainPage));