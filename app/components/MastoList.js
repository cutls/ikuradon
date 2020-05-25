import React, { useState, useRef } from "react";
import { StyleSheet, View, FlatList, RefreshControl, Modal, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-elements";
import ImageViewer from "react-native-image-zoom-viewer";
import MastoRow from "../components/MastoRow";
import { hide as HideAction, deleting as DeleteAction } from "../actions/actioncreators/main";
import { boost as BoostAction, favourite as FavouriteAction, bookmark as BookmarkAction } from "../actions/actioncreators/mastorow";
import { open as openImageViewerAction, close as closeImageViewerAction } from "../actions/actioncreators/imageviewer";
import * as RouterName from "../constants/RouterName";
import { start, stop } from "../actions/actioncreators/streaming";

import NavigationService from "../services/NavigationService";
import { oldLoadingTimeline, newLoadingTimeline } from "../actions/actioncreators/main";
const reducerSelector = state => ({
    current: state.currentUserReducer,
    main: state.mainReducer,
    streaming: state.streamingReducer,
    imageviewer: state.imageViewerReducer,
});

const REFRESH_TIME = 300;

function MastoList({ navigation, type, params }) {
    const dispatch = useDispatch();
    const [init, setInit] = useState(false);
    const [scroll, setScroll] = useState(false);
    const { current, main, streaming, imageviewer } = useSelector(reducerSelector);
    const listdata = main[type];
    const streamingType = streaming[type];
    if (!init && listdata && listdata.data instanceof Array && listdata.data.length < 1) {
        setInit(true);
        dispatch(newLoadingTimeline(type, listdata.maxId, params, true));
    }
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
    const refresh = () => {
        console.log('refresh')
        const time = Math.floor(new Date().getTime() / 1000);
        if (time - listdata.lastUpdate >= REFRESH_TIME) {
            dispatch(newLoadingTimeline(type, listdata.maxId, params, true));
        } else {
            dispatch(newLoadingTimeline(type, listdata.maxId, params));
        }
    }
    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={data => data.id}
                data={listdata.data}
                onScroll={event => {
                    //console.log(event.nativeEvent.contentOffset.y)
                    if(event.nativeEvent.contentOffset.y > 100) {
                        if(!scroll) {
                            //stopStr
                            if (streamingType) {
                                dispatch(stop(type, false, true));
                            }
                        }
                        setScroll(true)
                    } else {
                        console.log(streamingType)
                        if(scroll) {
                            //startStr/Refresh

                            if (streamingType) {
                                console.log('start ws')
                                dispatch(start(type, false));
                            }
                            refresh();
                        }
                        setScroll(false)
                    }
                }}
                refreshControl={
                    <RefreshControl
                        enabled={!streamingType}
                        refreshing={listdata.refreshing}
                        onRefresh={refresh}
                    />}
                renderItem={({ item }) => <MastoRow navigation={navigation} item={item} current={current} actions={actions} />}
                ItemSeparatorComponent={() => <Divider />}
                onEndReachedThreshold={1.5}
                ListFooterComponent={() =>
                    !listdata.refreshing && listdata.loading &&
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" />
                    </View>
                }
                onEndReached={() => {
                    if (init && listdata && listdata.data instanceof Array && listdata.data.length >= 10 && !listdata.loading) {
                        dispatch(oldLoadingTimeline(type, listdata.minId, params));
                    }
                }}
            />
            <Modal visible={imageviewer.visible} transparent={true} onRequestClose={() => actions.closeImageViewerAction()}>
                <ImageViewer imageUrls={imageviewer.data} index={imageviewer.index}
                    enableSwipeDown={true}
                    loadingRender={() => <ActivityIndicator size="large" color={"#FFFFFF"} />}
                    onSwipeDown={() => { actions.closeImageViewerAction() }} />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        paddingTop: 10,
        paddingBottom: 10
    }
});


export default MastoList;