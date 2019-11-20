const initialState = {
    users: [],
    loading: false,
};

export default function getAllUsers(state = initialState, action) {
    switch (action.type) {
        case "GET_ALL_USERS_STARTED":
            return {
                ...state,
                loading: true,
            };
        case "GET_ALL_USERS_SUCCESS":
            return {
                ...state,
                loading: false,
                users: action.payload
            };
        case "GET_ALL_USERS_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
}