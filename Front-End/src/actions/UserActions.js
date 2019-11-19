import { SET_USER_DETAIL, USER_LOADING } from './types';
import axios from 'axios';

export const getUserDetail = () => async dispatch => {
    dispatch(userLoading());
    try {
        let res = await axios.get('api/user_details');
        dispatch(setUserDetails(res.data));
    } catch (error) {
        console.log(error);
    }
};

export const setUserDetails = payload => ({
    type: SET_USER_DETAIL,
    payload,
});

export const userLoading = () => {
    return {
        type: USER_LOADING,
    };
};