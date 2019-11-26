import {SET_TOKEN, AUTH_LOADING} from './types';
import axios from 'axios';
import {APIURL} from '../utility/config';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import NavigationService from '../navigations/NavigationService';
import moment from 'moment';

export const logIn = ({email, password}) => async dispatch => {
  dispatch(authLoading());
  try {
    let res = await axios.post(`${APIURL}auth/`, {email, password});
    console.warn(res.data);
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

export const refreshToken = (
  refreshToken,
  oldAccessToken,
) => async dispatch => {
  try {
    let res = await axios.post(`${APIURL}auth/refresh-token`, {
      refreshToken,
      oldAccessToken,
    });
    console.warn(res.data);
    if (!res.data.success) {
      return null;
    }
    await dispatch(setAuth(res.data.data));
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
    await dispatch(setAuth({}));
    let res = await axios.delete(`${APIURL}auth/`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    console.warn('res', res);

    if (!res.data.success) {
      return res.data.message;
    }
    await dispatch(setAuth({}));
    NavigationService.navigate('Auth');
    return '';
  } catch (error) {
    console.warn(error.response);
    return error.response ? error.response.data.message : error;
  }
};

export const setAuth = payload => async dispatch => {
  try {
    await RNSecureKeyStore.set('token', JSON.stringify(payload), {
      accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
    });
    dispatch(setUser(payload))
  } catch (error) {
    console.warn('error ', error);
    return false;
  }
};

export const setUser = payload => ({
  type: SET_TOKEN,
  payload,
})

export const authLoading = () => {
  return {
    type: AUTH_LOADING,
  };
};

export const getToken = () => async (dispatch, getState) => {
  let token = getState().authReducer.token;
  let expiry = getState().authReducer.expiry;
  let refresh = getState().authReducer.refreshToken;
  if (!token || (expiry && moment(expiry).isBefore(moment()))) {
    try {
      let tokenObject = {};
      if (expiry && moment(expiry).isBefore(moment())) {
        tokenObject = await dispatch(refreshToken(refresh, token));
        token = tokenObject.token;
      } else {
        tokenObject = await RNSecureKeyStore.get('token');
        tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
        token = tokenObject.token;
        expiry = tokenObject.expiry;
        refresh = tokenObject.refreshToken;

        if (expiry && moment(expiry).isBefore(moment())) {
          tokenObject = await dispatch(refreshToken(refresh, token));
          token = tokenObject.token
        }
      }
    } catch (err) {
      console.warn(err, 99);
      token = null;
    }
  }
  return token;
};

export const getUserInfo = userId => async dispatch => {
  dispatch(authLoading());
  try {
    let token = await dispatch(getToken());
    let res = await axios.get(`${APIURL}users/${userId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (!res.data.success) {
      return res.data.message;
    }
    dispatch(setUser(res.data.data));
    return '';
  } catch (error) {
    console.warn(error.response);
    return error.response ? error.response.data.message : error;
  }
};
