import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {StatCard} from "../../components";
import {Col, Row, Space} from "antd";

const exampleData = {
    data: {
        labels: ['one', 'two', 'three', 'four'],
        datasets: [
            {
                label: 'My First dataset',
                data: [12, 3, 33, 2]
            }
        ]
    },
    options: {
        responsive: false
    }
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {
    }


    render() {
        return (
            <>
                <Row>
                    <Col span={24}>
                        <StatCard chartData={exampleData.data} chartID={'testssd'} chartOptions={exampleData.options}
                                  chartType={"line"}/>
                        <StatCard chartData={exampleData.data} chartID={'sds'} chartOptions={exampleData.options}
                                  chartType={"line"}/>
                        <StatCard chartData={exampleData.data} chartID={'dvd'} chartOptions={exampleData.options}
                                  chartType={"line"}/>
                    </Col>
                </Row>
                <Row>
                    <Col>sd</Col>
                </Row>
            </>
        );
    }
}


function stateToProps(state) {
    return state
}

export default withRouter(connect(stateToProps)(Home));
