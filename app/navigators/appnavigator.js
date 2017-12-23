import React from "react";
import {
    connect
} from "react-redux";
import {
    addNavigationHelpers,
    StackNavigator
} from "react-navigation";
import {
    bindActionCreators
} from "redux";

import AuthorizeScreen from "../components/authorize";
import MainScreen from "../components/main";
import LoginScreen from "../components/login";
import TootScreen from "../components/toot";
import MediaViewerScreen from "../components/mediaviewer/mediaviewer";

import * as AppInitActions from "../actions/actioncreators/appinit";

export const AppNavigator = StackNavigator({
    Login: {
        screen: LoginScreen
    },
    Main: {
        screen: MainScreen
    },
    Authorize: {
        screen: AuthorizeScreen
    },
    Toot: {
        screen: TootScreen
    },
    MediaViewer: {
        screen: MediaViewerScreen
    }
});

class AppWithNavigationState extends React.Component {
    constructor(props) {
        super(props);
        props.AppInitActions.appInit();
    }
    render() {
        return <AppNavigator navigation = {
            addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.navReducer
            })
        }
        />;
    }
}

export default connect(state => state,
    (dispatch) => (
        Object.assign({
            dispatch
        }, {
            AppInitActions: bindActionCreators(AppInitActions, dispatch)
        })
    )
)(AppWithNavigationState);