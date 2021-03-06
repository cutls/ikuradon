import React, { useContext, useMemo, memo } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import PropTypes from "prop-types";
import { FontAwesome } from "@expo/vector-icons";
import { bodyFormat, dateFormat, bodySearchUrl, emojisArrayToObject } from "../util/parser";
import CustomEmoji from "react-native-customemoji";
import * as RouterName from "../constants/RouterName";

import t from "../services/I18n";

import Reply from "./item/Reply";
import Boost from "./item/Boost";
import Favourite from "./item/Favourite";
import Bookmark from "./item/Bookmark";
import Action from "./item/Action";

import { ThemeContext } from "react-native-elements";
import MastoRowBody from "./MastoRowBody";
import MastoRowImage from "./MastoRowImage";

const MastoRow = ({ navigation, item, current, actions }) => {
    // Toot data
    let { id, created_at, sensitive, spoiler_text, reblog, account, media_attachments, content, reblogged, reblogs_count, favourited, bookmarked, uri, url, favourites_count, visibility, emojis} = item;
    // current
    let { user_credentials, domain, access_token, notification_count, instance } = current;
    // Actions
    let { ReplyAction, BoostAction, FavouriteAction, BookmarkAction, HideAction, DeleteAction, openImageViewerAction, closeImageViewerAction } = actions;
    // Theme
    const { theme } = useContext(ThemeContext);
    let reblogFlag = false;
    let rebloggedName = "";
    let reblogEmojis = [];
    let tootID = id;
    if(reblog){
        reblogFlag = true;
        rebloggedName = account.display_name !== "" ? account.display_name : account.username;
        reblogEmojis = account.emojis;
        tootID = reblog.id;
        ({ created_at, sensitive, reblog, account, media_attachments, content, reblogged, reblogs_count, favourited, bookmarked, uri, url, favourites_count, visibility, emojis} = reblog);
    }
    let myself = user_credentials && user_credentials.acct === account.acct;
    let acct = account.acct;
    let acct_id = account.id;
    return (
        <View key={id} style={[styles.container,{backgroundColor: theme.customColors.charBackground}]}>
            { reblogFlag && useMemo(() =>
                <View style={styles.isReplyContainer}>
                    <View style={{flex:0.18, borderWidth:0, alignItems:"flex-end"}}>
                        <FontAwesome name={"retweet"} size={16} color={theme.customColors.item.boost} style={{marginRight:5}}/>
                    </View>
                    <CustomEmoji style={{flex:0.82}} emojis={emojisArrayToObject(reblogEmojis)}>
                        <Text style={{color: theme.colors.grey0}} ellipsizeMode="tail" numberOfLines={1}>{rebloggedName + t("notifications.boosted")} </Text>
                    </CustomEmoji>
                </View>
            , [rebloggedName])}
            <View style={styles.date}><Text style={{fontSize:12, color: theme.colors.grey2, textAlign: "right" }}>{dateFormat(created_at)}</Text></View>
            <View style={styles.innerContainer}>
                <View style={styles.photoContainer}>
                    { useMemo(() =>
                        <View style={styles.innerPhotoContainer}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(RouterName.UserProf, {acct: acct, acct_id: acct_id})}>
                                <Image
                                    source={{uri: account.avatar}}
                                    style={styles.photo}/>
                            </TouchableOpacity>
                        </View>
                    , [account])}
                </View>
                <View style={styles.info}>
                    { useMemo(() =>
                        <View style={styles.userDetails}>
                            <CustomEmoji emojis={emojisArrayToObject(account.emojis)}>
                                <Text style={styles.userName} ellipsizeMode="tail" numberOfLines={1}>{account.display_name !== "" ? account.display_name : account.username}
                                    <Text style={[styles.userHandleAndTime,{color: theme.colors.grey2}]}>{" @"+account.acct}</Text>
                                </Text>
                            </CustomEmoji>
                        </View>
                    , [account])
                    }
                    <View style={styles.tootContainer}>
                        <MastoRowBody content={content} linkStyle={{color: theme.customColors.link}} style={styles.tootText} sensitiveButtonColor={theme.colors.primary} emojis={emojis} sensitive={sensitive} spoilerText={spoiler_text} />
                    </View>
                    { media_attachments && media_attachments.length > 0 &&
                    <View style={styles.tootContainer}>
                        <MastoRowImage mediaAttachments={media_attachments} openImageViewer={openImageViewerAction} closeImageViewer={closeImageViewerAction} />
                    </View>
                    }
                    <View style={styles.item}>
                        <Reply
                            id={id}
                            tootid={tootID}
                            user={account.display_name !== "" ? account.display_name : account.username}
                            acct={account.acct}
                            image={account.avatar}
                            body={content}
                            style={styles.itemFlex}
                            onReply={ReplyAction}
                        />
                        <Boost
                            id={id}
                            tootid={tootID}
                            reblogged={reblogged}
                            count={reblogs_count}
                            style={styles.itemFlex}
                            onBoost={BoostAction}
                            disabled={visibility === "private" || visibility === "direct"}
                        />
                        <Favourite
                            id={id}
                            tootid={tootID}
                            favourited={favourited}
                            count={favourites_count}
                            style={styles.itemFlex}
                            onFavourite={FavouriteAction}
                        />
                        <Bookmark
                            id={id}
                            tootid={tootID}
                            bookmarked={bookmarked}
                            style={styles.itemFlex}
                            onBookmark={BookmarkAction}
                        />
                        <Action
                            id={id}
                            tootid={tootID}
                            style={styles.itemFlex}
                            url={url}
                            account_url={account.url}
                            user={account.display_name !== "" ? account.display_name : account.username}
                            acct={account.acct}
                            image={account.avatar}
                            body={content}
                            myself={myself}
                            onReply={ReplyAction}
                            onHide={HideAction}
                            onDeleting={DeleteAction}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
MastoRow.propTypes = {
    navigation: PropTypes.any,
    item: PropTypes.shape(
        {
            id: PropTypes.string.isRequired,
            created_at: PropTypes.string,
            in_reply_to_id: PropTypes.string,
            in_reply_to_account_id: PropTypes.string,
            sensitive: PropTypes.bool,
            spoiler_text: PropTypes.string,
            visibility: PropTypes.string,
            uri: PropTypes.string,
            url: PropTypes.string,
            replies_count: PropTypes.number,
            reblogs_count: PropTypes.number,
            favourites_count: PropTypes.number,
            favourited: PropTypes.bool,
            reblogged: PropTypes.bool,
            muted: PropTypes.bool,
            bookmarked: PropTypes.bool,
            content: PropTypes.string,
            reblog: PropTypes.any,
            application: PropTypes.object,
            account: PropTypes.object,
            media_attachments: PropTypes.array,
            mentions: PropTypes.array,
            tags: PropTypes.array,
            emojis: PropTypes.array,
            card: PropTypes.object,
            poll: PropTypes.any,
        }
    ),
    current: PropTypes.shape(
        {
            user_credentials: PropTypes.object,
            domain: PropTypes.string,
            access_token: PropTypes.string,
            notification_count: PropTypes.number,
            instance: PropTypes.object
        }
    ),
    actions: PropTypes.object
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingBottom: 5
    },
    isReplyContainer: {
        flex: 1,
        flexDirection: "row",
        borderWidth: 0,
        height: 20,
        marginTop: 2
    },
    date: {
        marginRight: 10,
    },
    innerContainer: {
        flex: 1,
        borderColor: "green",
        flexDirection: "row",
        borderWidth: 0,
        height: "auto"
    },
    photoContainer: {
        flex: 0.18,
        borderColor: "yellow",
        flexDirection: "column",
        borderWidth: 0
    },
    innerPhotoContainer: { 
        height: 50,
        alignItems: "center"
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 5
    },
    info: {
        flex: 0.82,
        borderColor: "yellow",
        flexDirection: "column",
        borderWidth: 0
    },
    userDetails: {
        borderWidth: 0
    },
    userName: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
    },
    userHandleAndTime: {
        fontWeight: "normal",
        fontSize: 15,
    },
    tootContainer: { 
        flex: 1, 
        borderWidth: 0,
        marginTop:2,
    },
    tootText: {
        color: "black",
        paddingTop: 2,
        paddingRight: 10,
        fontSize: 16,
    },
    tootActionsContainer: {
        flex: 1,
        borderColor: "blue",
        borderWidth: 0,
        marginTop: 5,
        flexDirection: "row",
        paddingBottom: 5
    },
    item: {
        flex: 1,
        paddingRight:10,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: "row"
    },
    itemFlex: {
        flex: 1,
        paddingRight: 10,
    }
});
export default memo(MastoRow, (p, n) => {
    // TODO: boostもmemoしたい
    return p.item.id === n.item.id &&
    p.item.reblogged === n.item.reblogged &&
    p.item.reblogs_count === n.item.reblogs_count &&
    p.item.favourited === n.item.favourited &&
    p.item.favourites_count === n.item.favourites_count &&
    p.item.reblog === null;
});