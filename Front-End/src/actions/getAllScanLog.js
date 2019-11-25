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
        let t = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBzdHJhbnNhY3QuY29tIiwiZXhwIjoxNTc2MjM3ODk1LCJpYXQiOjE1NzM2NDU4OTUsInJlZnJlc2hJZCI6ImV5SmhiR2NpT2lKSVV6VXhNaUo5LmV5SnpkV0lpT2lKaFpHMXBia0J6ZEhKaGJuTmhZM1F1WTI5dE1UVTNNelkwTlRnNU5UTXlOeUlzSW1WNGNDSTZNVFUzTXpneE9EWTVOU3dpYVdGMElqb3hOVGN6TmpRMU9EazFmUS5HWjZ3VzBCVEYtN0dYbnNibnc1SUtmQVk2Yll2NHFYM2pRaHNRMWJ4U3BCNDUyQUhFV3BBVHJQRWtkWm9nUUJIZERZYzQtYllfb0Jqc0U5MmNZWTc5dyJ9.v4MvJ3gf1Re14JlyQvs3vdDKXZ1aSrQsYsNnhpbX95JXwleRon-XJT1Rqm_IRJatrPdf9eE59ySmJjGiP0Fsyg"
        try {
            dispatch(getAllScanLogStarted());
            return dispatch(request(formData, endPoint, requestMethod, t));
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
