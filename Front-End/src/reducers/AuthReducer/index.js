import { SET_TOKEN, AUTH_LOADING, SET_USER } from '../../actions/types';

const initialState = {
    token: null,
    user: {},
    expiry: null,
    refreshToken: null,
    loading: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TOKEN:
            return {
                ...state,
                ...action.payload,
                loading: false,
            };
        case AUTH_LOADING:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};