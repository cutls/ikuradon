import React, { useState, useContext, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "react-native-elements";
import { getUserProf, getUserPinned } from "../util/userProf";
import { bodyFormat, bodySearchUrl, emojisArrayToObject } from "../util/parser";
import CustomEmoji from "react-native-customemoji";
import t from "../services/I18n";
import NavigationService from "../services/NavigationService";
import * as RouterName from "../constants/RouterName";
import { open as openImageViewerAction, close as closeImageViewerAction } from "../actions/actioncreators/imageviewer";
import MastoRow from "../components/MastoRow";

export default function UserProf({ acct, current }) {
    const { theme } = useContext(ThemeContext);
    const [loading, useLoading] = useState(true);
    const dispatch = useDispatch();
    const [data, useUserProf] = useState(null);
    const [pinned, useUserPinned] = useState([]);
    useEffect(() => {
        getUserProf(acct)
            .then(({ data, error }) => useUserProf(data))
            .finally(() => useLoading(false));
        getUserPinned(acct)
            .then(({ data, error }) => useUserPinned(data))
            .finally(() => useLoading(false));
    }, [])
    if (!data) return false;
    let emojiObject = emojisArrayToObject(data.emojis);
    let pinnedUI = [];
    const actions = {
        ReplyAction: (id, tootid, user, acct, image, body) => NavigationService.navigate({ name: RouterName.Toot, params: { id, tootid, user, acct, image, body } }),

        BoostAction: (id, tootid, boosted) => { dispatch(BoostAction(id, tootid, boosted)) },
        FavouriteAction: (id, tootid, favourited) => { dispatch(FavouriteAction(id, tootid, favourited)) },
        BookmarkAction: (id, tootid, bookmarked) => { dispatch(BookmarkAction(id, tootid, bookmarked)) },
        HideAction: (id) => { dispatch(HideAction(id)) },
        DeleteAction: (id) => { dispatch(DeleteAction(id)) },
        openImageViewerAction: (media, index) => { dispatch(openImageViewerAction(media, index)) },
        closeImageViewerAction: () => { dispatch(closeImageViewerAction()) },
    };
    for (var i in pinned) {
        pinnedUI.push(<MastoRow item={pinned[i]} current={current} actions={actions} />);
    }
    return (
        <ScrollView style={styles.container}>
            <ImageBackground source={{ uri: data.header }} style={styles.header}>
                <Image
                    source={{ uri: data.avatar }}
                    style={styles.photo} />
                <CustomEmoji emojis={emojiObject} >
                    <Text style={styles.text}>{data.display_name}</Text>
                </CustomEmoji>
            </ImageBackground>
            <CustomEmoji emojis={emojiObject} style={{ padding: 10 }}>
                <Text>{bodyFormat(data.note)}</Text>
            </CustomEmoji>
            <View style={styles.basic}>
                <TouchableOpacity style={styles.basicContent} onPress={() => NavigationService.navigate({ name: RouterName.UserTimeline, params: { acct: acct } })}>
                    <Text style={{ textAlign: 'center' }}>{t("profiles.statuses")}</Text>
                    <Text style={{ textAlign: 'center' }}>{data.statuses_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.basicContent}>
                    <Text style={{ textAlign: 'center' }}>{t("profiles.following")}</Text>
                    <Text style={{ textAlign: 'center' }}>{data.following_count}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.basicContent}>
                    <Text style={{ textAlign: 'center' }}>{t("profiles.followers")}</Text>
                    <Text style={{ textAlign: 'center' }}>{data.followers_count}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.subText}>{t("profiles.pinned_toots")}</Text>
            <View style={styles.pinned}>
                {pinnedUI}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    loading: {
        paddingBottom: 10
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 5
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        height: 200
    },
    text: {
        backgroundColor: '#000',
        height: 30,
        fontSize: 20,
        color: '#fff'
    },
    basic: {
        flexDirection: 'row',
        padding: 10
    },
    basicContent: {
        flex: 1
    },
    pinned: {
        flex: 1
    },
    subText: {
        fontSize: 15,
        color: '#7a7a7a',
        paddingLeft: 2
    }
});