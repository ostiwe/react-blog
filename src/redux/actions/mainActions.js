export function testAction(payload) {
    return {
        type: 'TEST_ACTION',
        payload: payload
    }
}

export function changeSearchInput(payload) {
    return {
        type: 'CHANGE_SEARCH_INPUT',
        payload: payload
    }
}

export function emulateLogin(login) {
    return {
        type: 'EMULATE_LOGIN',
        payload: login
    }
}

export function setUserInfo(userInfo) {
    return {
        type: 'SET_USER_INFO',
        payload: userInfo
    }
}