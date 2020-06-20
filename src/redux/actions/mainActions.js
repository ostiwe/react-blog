export function testAction(action) {
  return {
    type: 'TEST_ACTION',
    payload: action,
  };
}

export function changeSearchInput(value) {
  return {
    type: 'CHANGE_SEARCH_INPUT',
    payload: value,
  };
}

export function setUserInfo(userInfo) {
  return {
    type: 'SET_USER_INFO',
    payload: userInfo,
  };
}

export function setLocale(locale) {
  return {
    type: 'SET_LOCALE',
    payload: locale,
  };
}
