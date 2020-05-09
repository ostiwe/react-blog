import React from "react";
import {Layout} from "antd";

const {Footer} = Layout;
export default function () {
    return <Footer className={'app-footer'}>
        <div className={'app-footer-content'}>
            Footer app
        </div>
    </Footer>
}