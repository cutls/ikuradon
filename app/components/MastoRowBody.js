import React, { useState, memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { emojiConvert, emojisArrayToObject } from "../util/parser";
import { Image } from "react-native-elements";
import { open as openUrl } from "../util/url";
import HTMLView from 'react-native-htmlview';
import CustomEmoji from "react-native-customemoji";
import t from "../services/I18n";
function MastoRowBody({ content, style, linkStyle, sensitiveButtonColor, emojis, sensitive, spoilerText }) {
    let emojiObject = emojisArrayToObject(emojis);
    content = emojiConvert(content, emojiObject);
    const [sensitiveDisplay, useSensitiveDisplay] = useState(false);
    if (sensitive && spoilerText !== "") {
        return (
            <View>
                <Text style={style}>{spoilerText}</Text>
                {!sensitiveDisplay &&
                    <TouchableOpacity onPress={() => useSensitiveDisplay(true)}>
                        <Text style={[styles.cwButton, { color: sensitiveButtonColor }]}>{t("timeline_cwtext")}</Text>
                    </TouchableOpacity>
                }
                {sensitiveDisplay &&
                    <View emojis={emojiObject}>
                        <HTMLView style={style} value={content} stylesheet={{ a: linkStyle }} onLinkPress={url => openUrl(url)} />
                    </View>
                }
            </View>
        );
    }
    return (
        <View>
            <HTMLView style={style} value={content} stylesheet={{ a: linkStyle }} onLinkPress={url => openUrl(url)} />
        </View>
    );
}

const styles = StyleSheet.create({
    cwButton: {
        paddingTop: 4,
        paddingBottom: 4,
        fontSize: 16,
    },
});
export default memo(MastoRowBody, (p, n) => p.content === n.content);