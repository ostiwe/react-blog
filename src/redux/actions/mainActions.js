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