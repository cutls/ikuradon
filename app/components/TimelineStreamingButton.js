import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { ThemeContext } from "react-native-elements";

import { start, stop } from "../actions/actioncreators/streaming";

export default function TimelineStreamingButton({ type }){
    const dispatch = useDispatch();
    dispatch(start(type, false));
    const { theme } = useContext(ThemeContext);
    const [enabled, useEnabled] = useState(true);
    const streamSwitch = () => {
        !enabled ? dispatch(start(type, true)) : dispatch(stop(type));
        useEnabled(!enabled);
    };
    return (
        <View>
            <TouchableOpacity onPress={() => streamSwitch()} style={styles.view}>
                <FontAwesome name="feed" size={24} color={enabled === true ? theme.customColors.primaryComplementary : theme.customColors.primaryBackground} />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    view: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 12,
        paddingRight: 4
    }
});