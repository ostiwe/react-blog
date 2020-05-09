const initialState = {
    user_info: null,
    // user_info: {login:'kedo'},
    search_input: '',
    test: 'test!',
};


function mainReducer(state = initialState, action) {
    console.log(action);
    switch (action.type) {
        case 'CHANGE_SEARCH_INPUT':
            return {
                ...state,
                search_input: action.payload
            }
        default:
            return state;
    }
}

export default mainReducer