const initialState = {
  userInfo: null,
  // userInfo: {
  //     login: 'ostiwe',
  //     uid: 'adkoiau-asda313-dssds3-32e',
  //     accessToken:'skmsadsasd',
  // },
  locale: 'ru',
  searchInput: '',
};

function mainReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case 'CHANGE_SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload,
      };
    case 'SET_USER_INFO':
      return {
        ...state,
        userInfo: action.payload,
      };
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.payload.toLowerCase(),
      };
    default:
      return state;
  }
}

export default mainReducer;
