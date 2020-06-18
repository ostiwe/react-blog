import React from "react";
import {Layout} from "antd";
import {AppHeaderDropdown} from "./index";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

const {Header} = Layout;

function AppHeader({user_info, locale}) {
    return <Header className={'app-header'}>
        <Link to={'/'} className={"app-logo"}>
            <div>
                <span>Блог программиста</span>
            </div>
        </Link>
        <AppHeaderDropdown user_info={user_info} locale={locale}/>
    </Header>
}

function toProps(state) {
    return state;
}

export default connect(toProps)(AppHeader);