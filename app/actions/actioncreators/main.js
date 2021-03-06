import * as Main from "../actiontypes/main";
import * as CurrentUser from "../actiontypes/currentuser";
import * as CONST_API from "../../constants/api";
import Networking from "../../services/Networking";
import t from "../../services/I18n";
import DropDownHolder from "../../services/DropDownHolder";
import * as Session from "../../util/session";

import * as RouterName from "../../constants/RouterName";
import NavigationService from "../../services/NavigationService";

const reducerTypeArray = {
    home: CONST_API.GET_TIMELINES_HOME,
    local: CONST_API.GET_TIMELINES_LOCAL,
    federal: CONST_API.GET_TIMELINES_FEDERAL,
    notifications: CONST_API.GET_NOTIFICATIONS,
    favourites: CONST_API.GET_FAVOURITES,
    bookmarks: CONST_API.GET_BOOKMARKS,
    userTimeline: CONST_API.GET_USER_STATUSES
};

export function hide(id) {
    return { type: Main.HIDE_MASTOLIST, id: id };
}

export function deleting(id) {
    return async dispatch => {
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            await Networking.fetch(domain, CONST_API.DELETE_STATUS, id, {}, access_token);
            dispatch({ type: Main.HIDE_MASTOLIST, id: id });
            DropDownHolder.success(t("messages.toot_deleted_success"));
        } catch (e) {
            DropDownHolder.error(t("messages.toot_deleted_failed"),e.message);
        }
    };
}

export function newLoadingTimeline(reducerType, since_id, params, clear = false, limit = 40) {
    return async dispatch => {
        dispatch({ type: Main.REFRESHING_MASTOLIST, reducerType });
        let param = null;
        if(params) {
            if(params.acct) {
                param = params.acct;
            }
        }
        let data;
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            data = await Networking.fetch(domain, reducerTypeArray[reducerType], param, { limit, since_id, max_id: null, pinned: false }, access_token);
            dispatch({ type: Main.NEW_UPDATE_MASTOLIST, data: data, reducerType, clear, streaming: false });
        } catch (e) {
            DropDownHolder.error(t("messages.network_error"),e.message);
            dispatch({ type: Main.STOP_REFRESHING_MASTOLIST, reducerType });
        }
    };
}

export function oldLoadingTimeline(reducerType, max_id, params, limit = 40) {
    return async dispatch => {
        dispatch({ type: Main.LOADING_MASTOLIST, reducerType });
        let param = null;
        if(params) {
            if(params.acct) {
                param = params.acct;
            }
        }
        let data;
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            data = await Networking.fetch(domain, reducerTypeArray[reducerType], param, { limit, since_id: null, max_id, pinned: false  }, access_token);
            dispatch({ type: Main.OLD_UPDATE_MASTOLIST, data: data, reducerType });
        } catch (e) {
            DropDownHolder.error(t("messages.network_error"),e.message);
            dispatch({ type: Main.STOP_LOADING_MASTOLIST, reducerType });
        }
    };
}

//未使用
export function getCurrentUser() {
    return async dispatch => {
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            let user_credentials = await Networking.fetch(domain, CONST_API.GET_CURRENT_USER, null, {}, access_token);
            let instance = await Networking.fetch(domain, CONST_API.GET_INSTANCE, null, {}, access_token);
            dispatch({ type: CurrentUser.UPDATE_CURRENT_USER, user_credentials, domain, access_token, instance });
        } catch (e) {
            DropDownHolder.error(t("messages.network_error"),e.message);
        }
    };
}
