
import * as CONST_API from "../constants/api";
import Networking from "../services/Networking";
import * as Session from "../util/session";

export async function getUserProf(acct_id){
    try {
        let { domain, access_token } = await Session.getDomainAndToken();
        console.log(acct_id)
        let data = await Networking.fetch(domain, CONST_API.GET_USER_PROF, acct_id, null, access_token);
        return {data, error: null};
    }catch(e){
        return {data: null, error: e.message};
    }
}
export async function getUserPinned(acct_id){
    try {
        let { domain, access_token } = await Session.getDomainAndToken();
        console.log('status' + acct_id)
        let data = await Networking.fetch(domain, CONST_API.GET_USER_STATUSES, acct_id, {pinned: true}, access_token);
        return {data, error: null};
    }catch(e){
        return {data: null, error: e.message};
    }
}