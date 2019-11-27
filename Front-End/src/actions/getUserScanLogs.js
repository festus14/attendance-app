import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    GET_USER_SCAN_LOGS_STARTED,
    GET_USER_SCAN_LOGS_SUCCESS,
    GET_USER_SCAN_LOGS_FAILURE
} from './types.js';

export const getUserScanLogs = (formData, endPoint, requestMethod) => {
    return async (dispatch) => {
        let token = await dispatch(await getToken());
        try {
            dispatch(getUserScanLogsStarted());
            return dispatch(request(formData, endPoint, requestMethod, token));
        }
        catch (error) {
            console.log(error)
        }

    }
}

export const getUserScanLogsStarted = () => ({
    type: GET_USER_SCAN_LOGS_STARTED
});

export const getUserScanLogsSuccess = details => ({
    type: GET_USER_SCAN_LOGS_SUCCESS,
    payload: {
        ...details
    }
});

export const getUserScanLogsFailure = error => ({
    type: GET_USER_SCAN_LOGS_FAILURE,
    payload: {
        error
    }
});
