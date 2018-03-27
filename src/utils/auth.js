/**
 * Created by Administrator on 2017/12/24.
 */
const TokenKey = 'Meiluocanxue-Token';

export function getToken() {
    return sessionStorage.getItem(TokenKey) || '';
}

export function setToken(token) {
    return sessionStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return sessionStorage.removeItem(TokenKey);
}