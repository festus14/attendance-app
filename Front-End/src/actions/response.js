import { getAllScanLogSuccess, getAllScanLogFailure } from './getAllScanLog.js';
import { setBarcodeStringSuccess, setBarcodeStringFailure } from './sendBarcodeString.js';
import { getBarcodeStringSuccess, getBarcodeStringFailure } from './getBarcodeString.js';



export function successResponse(response, endPoint, requestMethod) {
    let endPointPrefix = endPoint.split('/')[0];
    let endPointSuffix = endPoint.split('/')[1];
    console.log(endPointSuffix)
    if (endPointSuffix !== "department" && endPointSuffix !== "dashboard" && endPointPrefix === "modules" && requestMethod === "get" && endPointSuffix !== undefined) {
        endPointSuffix = parseInt(endPointSuffix, 10);
    }
    console.log(endPointPrefix + " " + endPointSuffix);
    switch (endPointPrefix) {
        case 'auth':
            if (requestMethod === "delete") {
                return async (dispatch) => {
                    dispatch(deleteSessionSuccess(response.data.data));
                    dispatch(deleteCurrentSession());
                }
            }

            return async (dispatch) => {
                console.log(response.data.data.refreshToken)
                dispatch(authSuccess(response.data));
                await dispatch(startSession(response.data.data.token, response.data.data.refreshToken, response.data.data.expiry, response.data.data.user.id));
            }

        case 'users':
            if (!endPoint.startsWith("users/") && requestMethod === "get") {
                return (dispatch) => {
                    dispatch(getStaffDetailsSuccess(response.data.data));
                }
            }
            else if (endPoint.startsWith("users/") && requestMethod === "get") {
                return (dispatch) => {
                    dispatch(getUserDetailsSuccess(response.data.data));
                }
            }
            else if (requestMethod === "patch") {
                return (dispatch) => {
                    dispatch(editUserSuccess(response.data))
                }
            }
            else if (requestMethod === "delete") {
                return (dispatch) => {
                    dispatch(deleteUserSuccess(response.data));
                }
            }
            else if (requestMethod === "post") {
                return (dispatch) => {
                    dispatch(createUserSuccess(response.data))
                }
            }
        default:
            return (dispatch) => { }


    }
}

export function failureResponse(error, endPoint, requestMethod) {
    let endPointPrefix = endPoint.split('/')[0];
    let endPointSuffix = endPoint.split('/')[1];
    if (endPointSuffix !== "department" && endPointPrefix === "modules" && requestMethod === "get" && endPointSuffix !== undefined) {
        endPointSuffix = parseInt(endPointSuffix, 10);
    }
    switch (endPointPrefix) {
        case 'auth':
            if (requestMethod === "post") {
                return (dispatch) => {
                    dispatch(authFailure(error));
                }
            }
            else if (requestMethod === "delete") {
                return (dispatch) => {
                    dispatch(deleteSessionFailure(error));
                }
            }

        case 'users':
            return (dispatch) => {
                if (requestMethod === "post") {
                    dispatch(createUserFailure(error));
                }
                else if (!endPoint.startsWith("users/") && requestMethod === "get") {
                    dispatch(getStaffDetailsFailure(error));
                }
                else if (endPoint.startsWith("users/") && requestMethod === "get") {
                    dispatch(getUserDetailsFailure(error));
                }
                else if (requestMethod === "patch") {
                    dispatch(editUserFailure(error));
                }
                else if (requestMethod === "delete") {
                    dispatch(deleteUserFailure(error));
                }
            }
        default:
            return error;
    }
}

