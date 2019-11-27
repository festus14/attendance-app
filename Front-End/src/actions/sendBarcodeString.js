import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    SEND_BARCODE_STRING_STARTED,
    SEND_BARCODE_STRING_SUCCESS,
    SEND_BARCODE_STRING_FAILURE
} from './types.js';

export const sendBarcodeString = (formData, endPoint, requestMethod) => {
    return async (dispatch) => {
        let token = await dispatch(await getToken());
        try {
            dispatch(sendBarcodeStringStarted());
            return dispatch(request(formData, endPoint, requestMethod, token));
        }
        catch (error) {
            console.log(error)
        }

    }
}

export const sendBarcodeStringStarted = () => ({
    type: SEND_BARCODE_STRING_STARTED
});

export const sendBarcodeStringSuccess = details => ({
    type: SEND_BARCODE_STRING_SUCCESS,
    payload: {
        ...details
    }
});

export const sendBarcodeStringFailure = error => ({
    type: SEND_BARCODE_STRING_FAILURE,
    payload: {
        error
    }
});
