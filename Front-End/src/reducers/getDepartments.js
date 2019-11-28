import { GET_DEPARTMENTS, DEPARTMENT_LOADING } from '../actions/types';

const initialState = {
    departments: [],
    loading: false,
    success: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_DEPARTMENTS:
            return {
                ...state,
                ...action.payload,
                loading: false,
                success: true
            };
        case DEPARTMENT_LOADING:
            return {
                ...state,
                loading: true,
                success: false
            };
        default:
            return state;
    }
}