import * as Streaming from "../actiontypes/streaming";
import * as Main from "../actiontypes/main";
import * as CONST_API from "../../constants/api";
import Stream from "../../services/Stream";
import t from "../../services/I18n";
import DropDownHolder from "../../services/DropDownHolder";
import * as Session from "../../util/session";
import { bodyFormat } from "../../util/parser";

export function start(reducerType, showMessage) {
    return async dispatch => {
        try {
            let { domain, access_token } = await Session.getDomainAndToken();
            await Stream.open(domain, CONST_API.STREAMING, access_token, reducerType);
            if (showMessage) {
                DropDownHolder.success(t("messages.streaming_enabled"));
            }
            dispatch({ type: Streaming.STREAM_START, reducerType });
            Stream.receive(streamMessage => {
                if (streamMessage.event === "update" && streamMessage.payload) {
                    dispatch({ type: Main.NEW_UPDATE_MASTOLIST, data: [JSON.parse(streamMessage.payload)], reducerType, streaming: true });
                } else if (streamMessage.event === "notification" && streamMessage.payload) {
                    let data = JSON.parse(streamMessage.payload);
                    let name = data.account.display_name !== "" ? data.account.display_name : data.account.username;
                    let title = "";
                    let message = "";
                    switch (data.type) {
                        case "follow":
                            title = name + t("notifications.followed");
                            message = null;
                            break;
                        case "favourite":
                            title = name + t("notifications.favourited");
                            message = bodyFormat(data.status.content);
                            break;
                        case "reblog":
                            title = name + t("notifications.boosted");
                            message = bodyFormat(data.status.content);
                            break;
                        case "mention":
                            title = name + t("notifications.mentioned");
                            message = bodyFormat(data.status.content);
                            break;
                        default:
                            return;
                    }
                    DropDownHolder.info(title, message);
                    dispatch({ type: Main.NEW_UPDATE_MASTOLIST, data: [data], reducerType: "notifications", streaming: true });
                } else if (streamMessage.event === "delete" && streamMessage.payload) {
                    //いつか実装します
                }
            }, reducerType);
        } catch (e) {
            DropDownHolder.error(t("messages.streaming_failed"), e.message);
            dispatch({ type: Streaming.STREAM_STOP, reducerType });
            return;
        }
    };
}

export function stop(reducerType, showMessage, temp) {
    return async dispatch => {
        try {
            let closeCode = await Stream.close(reducerType);
            if (closeCode < 1000 && closeCode > 1015) {
                //不明な切断
                return;
            }
            if (showMessage) DropDownHolder.info(t("messages.streaming_disabled"));
        } catch (e) {
            DropDownHolder.error(t("messages.streaming_failed"));
            return;
        }
        if(!temp) {
            dispatch({ type: Streaming.STREAM_STOP, reducerType });
        }
    };
}