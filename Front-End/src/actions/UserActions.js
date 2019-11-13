import { GET_USER_DETAIL, USER_LOADING } from './types';
import axios from 'axios';

export const getUserDetail = () => dispatch => {
    dispatch(userLoading());
    axios.get('api/user_details').then(res =>
        dispatch({
            type: GET_USER_DETAIL,
            payload: res.data,
        }),
    );
};

export const userLoading = () => {
    return {
        type: USER_LOADING,
    };
};