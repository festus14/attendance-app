import { SET_LOGS, LOG_LOADING } from '../../actions/types';

const initialState = {
    logs: [],
    loading: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_LOGS:
            return {
                ...state,
                logs: action.payload,
                loading: false,
            };
        case LOG_LOADING:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
}