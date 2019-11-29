import { SET_TOKEN, AUTH_LOADING, AUTH_ERROR } from '../../actions/types';

const initialState = {
    token: null,
    user: {},
    expiry: null,
    refreshToken: null,
    loading: false,
    success: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return {
                ...state,
                ...action.payload,
                loading: false,
                success: true,
            };
        case AUTH_LOADING:
            return {
                ...state,
                loading: true,
                success: false,
            };
        case AUTH_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
}