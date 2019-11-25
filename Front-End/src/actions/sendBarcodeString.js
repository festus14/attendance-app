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
        let t = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBzdHJhbnNhY3QuY29tIiwiZXhwIjoxNTc2MjM3ODk1LCJpYXQiOjE1NzM2NDU4OTUsInJlZnJlc2hJZCI6ImV5SmhiR2NpT2lKSVV6VXhNaUo5LmV5SnpkV0lpT2lKaFpHMXBia0J6ZEhKaGJuTmhZM1F1WTI5dE1UVTNNelkwTlRnNU5UTXlOeUlzSW1WNGNDSTZNVFUzTXpneE9EWTVOU3dpYVdGMElqb3hOVGN6TmpRMU9EazFmUS5HWjZ3VzBCVEYtN0dYbnNibnc1SUtmQVk2Yll2NHFYM2pRaHNRMWJ4U3BCNDUyQUhFV3BBVHJQRWtkWm9nUUJIZERZYzQtYllfb0Jqc0U5MmNZWTc5dyJ9.v4MvJ3gf1Re14JlyQvs3vdDKXZ1aSrQsYsNnhpbX95JXwleRon-XJT1Rqm_IRJatrPdf9eE59ySmJjGiP0Fsyg"
        try {
            dispatch(sendBarcodeStringStarted());
            return dispatch(request(formData, endPoint, requestMethod, t));
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
