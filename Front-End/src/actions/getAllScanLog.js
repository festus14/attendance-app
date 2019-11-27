import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    GET_ALL_SCAN_LOG_STARTED,
    GET_ALL_SCAN_LOG_SUCCESS,
    GET_ALL_SCAN_LOG_FAILURE
} from './types.js';

export const getAllScanLog = (formData, endPoint, requestMethod) => {
    return async (dispatch) => {
        let token = await dispatch(await getToken());
        try {
            dispatch(getAllScanLogStarted());
            return dispatch(request(formData, endPoint, requestMethod, token));
        }
        catch (error) {
            console.log(error)
        }

    }
}

export const getAllScanLogStarted = () => ({
    type: GET_ALL_SCAN_LOG_STARTED
});

export const getAllScanLogSuccess = details => ({
    type: GET_ALL_SCAN_LOG_SUCCESS,
    payload: {
        ...details
    }
});

export const getAllScanLogFailure = error => ({
    type: GET_ALL_SCAN_LOG_FAILURE,
    payload: {
        error
    }
});
