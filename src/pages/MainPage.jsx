import React from "react";
import {connect} from "react-redux";
import {BackTop, Layout} from "antd";
import faker from 'faker';
import {changeSearchInput} from "../redux/actions/mainActions";
import {withRouter} from "react-router-dom";
import {AppFooter, AppHeader, RenderColumnItems} from "../components";

const {Content} = Layout;

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            categories: [],

            search: false,
            filteredData: [],
            loading: false,
        }
    }

    componentDidMount() {
        let cat = [];
        for (let i = 1; i < 6; i++) {

            cat.push({
                id: i,
                title: faker.lorem.slug(1),


            });
        }
        this.setState({categories: cat})
        this.generateData()
    }

    generateData = () => {
        this.setState({loading: true})
        setTimeout(() => {
            let data = this.state.data;
            for (let i = 0; i < 6; i++) {

                data.push({
                    title: faker.lorem.slug(3),
                    subtitle: faker.lorem.slug(10),
                    creator: faker.name.firstName(),
                    small_text: faker.lorem.paragraph(),
                    category: faker.lorem.slug(1),

                });
            }
            this.setState({data: data, loading: false})
        }, 2000)
    }

    searchOnPage = (e) => {
        let search = e.target.value;
        this.props.dispatch(changeSearchInput(search));

        let filtered = this.state.data.filter(item => item.title.indexOf(search) !== -1);

        let isSearch = search.length > 0;

        this.setState({filteredData: filtered, search: isSearch});
    }

    render() {
        const {user_info, search_input} = this.props;
        const {data, search, filteredData, loading, categories} = this.state;

        const items = search ? filteredData : data;


        return <Layout>
            <AppHeader/>

            <Content className={'app-content'}>
                <BackTop/>
                <RenderColumnItems loading={loading} items={items} categories={categories}
                                   loadData={this.generateData} searchOnPage={this.searchOnPage}/>
            </Content>
            <AppFooter/>
        </Layout>
    }
}

function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(MainPage));