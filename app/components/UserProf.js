import React, { useState, useContext, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "react-native-elements";
import {getUserProf} from "../util/userProf";
const reducerSelector = state => ({
    user: state.userProfileReducer
});
import t from "../services/I18n";

export default function UserProf({ acct }) {
    const { theme } = useContext(ThemeContext);
    const [loading, useLoading] = useState(true);
    const { user } = useSelector(reducerSelector);
    const dispatch = useDispatch();
    const [data, useUserProf] = useState(null);
    useEffect(() => {
        console.log('call' + acct)
        getUserProf(acct)
            .then(({ data, error }) => useUserProf(data))
            .finally(() => useLoading(false));
        //console.log(data)
    }, [])
    if (!data) return false;
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: data.avatar }}
                style={styles.photo} />
            <Text>{data.display_name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    loading: {
        paddingBottom: 10
    },
    photo: {
        width: 100,
        height: 100,
        borderRadius: 5
    }
});