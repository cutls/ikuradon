import React, { useState, useContext } from "react";
import { Text, Button, StyleSheet, View } from "react-native";
import { Header, ThemeContext } from "react-native-elements";
import { useSelector } from "react-redux";
import t from "../services/I18n";
import UserProf from "../components/UserProf";
import TimelineLeftHeader from "../components/TimelineLeftHeader";
import TimelineCenterHeader from "../components/TimelineCenterHeader";
const reducerSelector =  state => ({
    current: state.currentUserReducer
});
function UserProfScreen({ route, navigation }) {
    let acct = route.params.acct;
    let acct_id = route.params.acct_id;
   
    const { current } = useSelector(reducerSelector);
    const { theme } = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <Button onPress={()=> navigation.goBack()} color="#7a7a7a" title="back" />
            <UserProf acct={acct_id} current={current} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default UserProfScreen;