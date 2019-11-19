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

export const refreshToken = (refreshToken, token) => async dispatch => {
  try {
    let res = await axios.post(`${APIURL}auth/refresh-token`, {refreshToken, token});
    console.warn(res.data.data);
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
    console.warn('In getToken func', token)
    if (!token) {
        try {
            token = await RNSecureKeyStore.get('token');
            token = token ? JSON.parse(token).token : null;
            console.warn(token)
        } catch (err) {
            console.warn(err);
            token = null
        }
    }
    return token;
};