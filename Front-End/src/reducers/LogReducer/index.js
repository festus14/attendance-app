import { GET_LOGS, POST_LOG, LOG_LOADING } from '../../actions/types';

const initialState = {
    logs: [],
    loading: false,
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_LOGS:
            return {
                ...state,
                logs: action.payload,
                loading: false,
            };
        case POST_LOG:
            return {
                ...state,
                logs: [...state.logs, action.payload],
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