import { SET_TOKEN, AUTH_LOADING } from './types';
import axios from 'axios';
import { APIURL } from '../utility/config';
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import NavigationService from '../navigations/NavigationService';

export const logIn = ({ email, password }) => async dispatch => {
    dispatch(authLoading());
    try {
        let res = await axios.post(`${APIURL}auth/`, { email, password });
        console.warn(res.data.data)
        if (!res.data.success) {
            return res.data.message;
        }
        await setAuthAsync(res.data.data);
        return '';
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const refreshToken = (refreshToken, oldAccessToken) => async dispatch => {
  try {
    let res = await axios.post(`${APIURL}auth/refresh-token`, {refreshToken, oldAccessToken});
    console.warn(res.data.data);
    if (!res.data.success) {
      return null;
    }
    return res.data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logOut = () => async dispatch => {
    console.warn('AuthAction logOut Worked')
    dispatch(authLoading());
    try {
        let token = await dispatch(getToken());
        let res = await axios.delete(`${APIURL}auth/`, { headers: { 'Authorization': `Bearer ${token}` } });
        console.warn('res', res);

        if (!res.success) {
            return res.message;
        }
        await dispatch(setAuth({}));
        NavigationService.navigate('Auth')
        return ''
    } catch (error) {
        console.log(error);
        return error.response.data.message;
    }
};

export const setAuth = async payload => {
    try {
        await RNSecureKeyStore.set('token', JSON.stringify(payload), {
          accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
        });
        console.log('Saved!')
    } catch (error) {
        console.log('error ', error)
    }
    return {
        type: SET_TOKEN,
        payload,
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
    let refresh = getState().authReducer.refreshToken
    if (!token || (expiry && new Date(expiry).getTime() < new Date().getTime())) {
        try {
            if (expiry && new Date(expiry).getTime() < new Date().getTime()) {
              token = await dispatch(refreshToken(refresh, token));
            } else {
                let tokenObject = await RNSecureKeyStore.get('token');
                tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
                token = tokenObject.token;
                expiry = tokenObject.expiry;
                refresh = tokenObject.refreshToken;

                if (expiry && new Date(expiry).getTime() < new Date().getTime()) {
                    token = await dispatch(refreshToken(refresh, token));
                }
            }
            console.warn(token)
        } catch (err) {
            console.warn(err);
            token = null
        }
    }
    return token;
};