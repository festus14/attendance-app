const initialState = {
    roles: [],
    loading: false,
    error: null,
    success: false
};

export default function getRoles(state = initialState, action) {
    switch (action.type) {
        case "GET_ROLES_STARTED":
            return {
                ...state,
                loading: true,
                success: false
            };
        case "GET_ROLES_SUCCESS":
            return {
                ...state,
                loading: false,
                success: true,
                roles: action.payload
            };
        case "GET_ROLES_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error               
            };
        default:
            return state;
    }
}