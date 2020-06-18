import React from "react";
import {BackTop, Layout, PageHeader} from "antd";
import {AppFooter, AppHeader, RenderColumnItems} from "../components";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import apiBlog from "../assets/js/BlogApiSettings";


const {Content} = Layout;

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
        }
        this.apiBlog = apiBlog;
    }

    componentDidMount() {
        const {match} = this.props;
        this.getTags().then(() => {
            let tags = this.state.tags;

            let tag = tags.filter(tag => {
                if (tag.id === parseInt(match.params.tag)) {
                    return tag
                }
            })
            this.setState({currentTag: tag[0]})
        })

        this.getPosts(match.params.tag)
    }

    getPosts = (tag) => {
        this.setState({loading: true})
        const {page, data, currentTag} = this.state;
        let _tag;
        let _items = [];

        typeof tag !== 'object' ? _tag = tag : _tag = currentTag.id;


        this.apiBlog.getPostsByCategory(_tag, page).then(items => {
            if (items.items.length === 0) {
                this.setState({postsEnd: true})
                return;
            }
            _items = data.concat(items.items);

            this.setState({data: _items, page: page + 1})
        });

        setTimeout(() => this.setState({loading: false}), 650)
    }

    getTags = () => {
        return new Promise(resolve => {
            this.apiBlog.getTags().then(tags => {
                if (tags.items) {
                    this.setState({tags: tags.items})
                    resolve();
                }
            });
        })

    }
    onSelectCategory = () => {
        this.forceUpdate(() => {
            this.setState({page: 1, data: []}, () => {
                let tags = this.state.tags;

                let tag = tags.filter(tag => {
                    if (tag.id === parseInt(this.props.match.params.tag)) {
                        return tag
                    }
                })
                this.setState({currentTag: tag[0]})
                this.getPosts(this.props.match.params.tag);
            });
        });
    }

    render() {
        const {data, search, filteredData, loading, tags, postsEnd, currentTag} = this.state;

        const items = search ? filteredData : data;

        const tag = currentTag ? '"' + (currentTag.ru_name ?? currentTag.name) + '"' : "";
        return <Layout>
            <AppHeader/>
            <Content className={'app-content'}>
                <PageHeader title={<div>Поиск по тегу {tag}</div>}/>
                <BackTop/>
                <RenderColumnItems onSelectCategory={this.onSelectCategory} postsEnd={postsEnd} loading={loading}
                                   items={items} tags={tags}
                                   loadData={this.getPosts} searchOnPage={this.searchOnPage}/>
            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(CategoryPage));