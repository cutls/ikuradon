import * as Config from "../actiontypes/config";
import * as Permission from "../../util/permission";
import { ImagePicker } from "expo";
import * as Session from "../../util/session";
import DropDownHolder from "../../services/DropDownHolder";
import t from "../../services/I18n";

import * as RouterName from "../../constants/RouterName";
import NavigationService from "../../services/NavigationService";
import * as Main from "../actiontypes/main";
import * as Streaming from "../actiontypes/streaming";

export function allClear() {
    return async dispatch => {
        await dispatch({ type: Config.CONFIG_RESET });
        await dispatch({ type: Streaming.STREAM_ALLSTOP });
        await Session.deleteAll();
        await dispatch({ type: Main.ALLCLEAR_MASTOLIST });
        NavigationService.resetAndNavigate({ name: RouterName.Login });
    };
}

export function setBackground() {
    return async dispatch => {
        try {
            await Permission.getBeforeAsk(Permission.CAMERA_ROLL);
            let fileData = await ImagePicker.launchImageLibraryAsync();
            if (!fileData || !fileData.uri || fileData.cancelled) {
                return;
            }
            dispatch({ type: Config.SET_BACKGROUNDIMAGE, backgroundImage: fileData.uri });
            NavigationService.resetAndNavigate({ name: RouterName.Main });
        } catch (e) {
            DropDownHolder.error(t("messages.network_error"), e.message);
        }
    };
}

export function setInvisibleTimeline(type, value) {
    return async dispatch => {
        let invisible = {};
        invisible[type] = value;
        dispatch({ type: Config.INVISIBLE_SETTING, invisible });
    };
}

export function setSmartMode(value) {
    return async dispatch => {
        dispatch({ type: Config.SMART_MODE, smartMode: value });
        NavigationService.resetAndNavigate({ name: RouterName.Main });
    };
}

export function setTimelinePerform(value) {
    return async dispatch => {
        dispatch({ type: Config.TIMELINE_PERFORM, timelinePerform: value });
        NavigationService.resetAndNavigate({ name: RouterName.Main });
    };
}
