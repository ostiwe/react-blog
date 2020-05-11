const initialState = {
    user_info: null,
    // user_info: {
    //     login: 'ostiwe',
    //     role: 'admin',
    // },
    search_input: '',
};


function mainReducer(state = initialState, action) {
    console.log(action);
    switch (action.type) {
        case 'CHANGE_SEARCH_INPUT':
            return {
                ...state,
                search_input: action.payload
            }
        case 'EMULATE_LOGIN':
            return {
                ...state,
                user_info: {
                    login: action.payload,
                    role: 'admin'
                }
            }
        default:
            return state;
    }
}

export default mainReducer