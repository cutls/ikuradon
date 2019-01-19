import { createStackNavigator, createAppContainer } from "react-navigation";

import { createMiddleware } from "../middleware";

import AppInitScreen from "../components/appinit";
import AuthorizeScreen from "../components/authorize";
import MainScreen from "../components/main";
import LoginScreen from "../components/login";
import TootScreen from "../components/toot";
import DetailScreen from "../components/detail";
import MediaViewerScreen from "../components/mediaviewer/mediaviewer";

import I18n from "../i18n";
import * as RouterName from "../constants/routername";

export const middleware = createMiddleware();
export const AppNavigator = createStackNavigator(
    {
        [RouterName.AppInit]: AppInitScreen,
        [RouterName.Login]: LoginScreen,
        [RouterName.Main]: MainScreen,
        [RouterName.Authorize]: AuthorizeScreen,
        [RouterName.Toot]: TootScreen,
        [RouterName.Detail]: DetailScreen,
        [RouterName.MediaViewer]: MediaViewerScreen
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            let routeName = navigation.state.routeName;
            if (RouterName.Main === navigation.state.routeName) {
                return { header: null };
            }
            return {
                title: I18n.t(`${routeName}_title`)
            };
        }
    }
);
const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
