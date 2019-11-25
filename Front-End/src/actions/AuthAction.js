import { SET_TOKEN, AUTH_LOADING } from './types';
import axios from 'axios';
import { APIURL } from '../utility/config';
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import NavigationService from '../navigations/NavigationService';
import moment from 'moment'

export const logIn = ({ email, password }) => async dispatch => {
    
    dispatch(authLoading());
    try {
        let res = await axios.post(`${APIURL}auth/`, { email, password });
        console.warn(res.data)
        if (!res.data.success) {
            return res.data.message;
        }
        await dispatch(setAuth(res.data.data));
        return '';
    } catch (error) {
        console.warn(error);
        return error.data.message;
    }
};

export const refreshToken = (refreshToken, oldAccessToken) => async dispatch => {
    try {
        let res = await axios.post(`${APIURL}auth/refresh-token`, { refreshToken, oldAccessToken });
        console.warn(res.data);
        if (!res.data.success) {
            return null;
        }
        return res.data.data;
    } catch (error) {
        console.log(error, 33);
        return null;
    }
};

export const logOut = () => async dispatch => {
    dispatch(authLoading());
    try {
        let token = await dispatch(getToken());
        let res = await axios.delete(`${APIURL}auth/`, { headers: { 'Authorization': `Bearer ${token}` } });
        console.warn('res', res);

        if (!res.data.success) {
            return res.data.message;
        }
        await dispatch(setAuth({}));
        NavigationService.navigate('Auth')
        return '';
    } catch (error) {
        console.warn(error, 51);
        return error.response ? error.response.data.message : error;
    }
};

export const setAuth = payload => async (dispatch) => {
    try {
        await RNSecureKeyStore.set('token', JSON.stringify(payload), {
            accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
        });
        console.warn('Saved!')
        
        dispatch(() => ({
            type: SET_TOKEN,
            payload,
        }));
        return true
    } catch (error) {
        console.warn('error ', error)
        return false
    }
};

export const authLoading = () => {
    return {
        type: AUTH_LOADING,
    };
};

export const getToken = () => async(dispatch, getState) => {

    let token = getState().authReducer.token;
    let expiry = getState().authReducer.expiry;
    let refresh = getState().authReducer.refreshToken;
    console.warn(expiry)
    if (!token || (expiry && moment(expiry).isBefore(moment()))) {
        try {
            if (expiry && moment(expiry).isBefore(moment())) {
                console.warn('refresh');
                token = await dispatch(refreshToken(refresh, token));
            } else {
                let tokenObject = await RNSecureKeyStore.get('token');
                tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
                token = tokenObject.token;
                expiry = tokenObject.expiry;
                refresh = tokenObject.refreshToken;

                if (expiry && moment(expiry).isBefore(moment())) {
                    token = await dispatch(refreshToken(refresh, token));
                }
            }
        } catch (err) {
            console.warn(err, 99);
            token = null
        }
    }
    return token;
};