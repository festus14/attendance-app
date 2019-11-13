import { GET_LOGS, POST_LOG, LOG_LOADING } from './types';
import axios from 'axios';

export const getLogs = () => dispatch => {
    dispatch(logLoading());
    axios.get('api/logs').then(res =>
        dispatch({
            type: GET_LOGS,
            payload: res.data,
        }),
    );
};

export const postLog = log => {
    return {
        type: POST_LOG,
        payload: log,
    };
};

export const logLoading = () => {
    return {
        type: LOG_LOADING,
    };
};