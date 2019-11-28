import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    GET_BARCODE_STRING_STARTED,
    GET_BARCODE_STRING_SUCCESS,
    GET_BARCODE_STRING_FAILURE
} from './types.js';

export const getBarcodeString = (endPoint, requestMethod) => {
    return async (dispatch) => {
        let token = await dispatch(await getToken());
        try {
            dispatch(getBarcodeStringStarted());
            return dispatch(request(null, endPoint, requestMethod, token));
        }
        catch (error) {
            console.log(error)
        }

    }
}

export const getBarcodeStringStarted = () => ({
    type: GET_BARCODE_STRING_STARTED
});

export const getBarcodeStringSuccess = details => ({
    type: GET_BARCODE_STRING_SUCCESS,
    payload: {
        ...details
    }
});

export const getBarcodeStringFailure = error => ({
    type: GET_BARCODE_STRING_FAILURE,
    payload: {
        error
    }
});
