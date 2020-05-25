import He from "he";
import DayJS from "dayjs";
export function emojiConvert(body, emojis) {
    for (let [key, value] of Object.entries(emojis)) {
        body = body.replace(new RegExp(':' + key + ':', 'g'), `<img src="${value.uri}" width="20" height="20" />`)
    }
    return body;
}

export function dateFormat(date) {
    return DayJS(date).format("YYYY/MM/DD HH:mm:ss");
}

export function emojisArrayToObject(emojis){
    let emojiObject = {};
    for (const emoji of emojis) {
        emojiObject[emoji.shortcode] = { uri: emoji.url };
    }
    return emojiObject;
}