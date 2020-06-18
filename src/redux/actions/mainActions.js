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

export function setUserInfo(userInfo) {
    return {
        type: 'SET_USER_INFO',
        payload: userInfo
    }
}

export function setLocale(locale) {
    return {
        type: 'SET_LOCALE',
        payload: locale
    }
}