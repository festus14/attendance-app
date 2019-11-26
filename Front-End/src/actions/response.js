import { getAllScanLogSuccess, getAllScanLogFailure } from './getAllScanLog.js';
import { sendBarcodeStringFailure, sendBarcodeStringSuccess } from './sendBarcodeString.js';
import { getBarcodeStringSuccess, getBarcodeStringFailure } from './getBarcodeString.js';
import { getAllUsersSuccess, getAllUsersFailure } from './getAllUsers.js';
import { getUserScanLogsSuccess, getUserScanLogsFailure } from './getUserScanLogs.js';
import { getRolesSuccess, getRolesFailure } from './getRoles.js';



export function successResponse(response, endPoint, requestMethod) {
    let endPointPrefix = endPoint.split('/')[0];
    let endPointSuffix = endPoint.split('/')[1];
    console.log(endPointSuffix)
    if (endPointSuffix !== "department" && endPointSuffix !== "dashboard" && endPointPrefix === "modules" && requestMethod === "get" && endPointSuffix !== undefined) {
        endPointSuffix = parseInt(endPointSuffix, 10);
    }
    console.log(endPointPrefix + " " + endPointSuffix);
    switch (endPointPrefix) {
        case 'barcode':
            return async (dispatch) => {
                if (requestMethod === "get") {
                    dispatch(getBarcodeStringSuccess(response.data.data));
                }
                else if (requestMethod === "post") {
                    dispatch(sendBarcodeStringSuccess(response.data.data));
                }
            }
        case 'logs':
            return (dispatch) => {
                if (requestMethod === "post") {
                    dispatch(getAllScanLogSuccess(response.data.data));
                }
                else if (requestMethod === "get") {
                    dispatch(getUserScanLogsSuccess(response.data.data));
                }

            }
        case 'users':
            return (dispatch) => {
                if (requestMethod === "get") {
                    dispatch(getAllUsersSuccess(response.data.data));
                }
            }
        case 'roles':
            return (dispatch) => {
                if (requestMethod === "get") {
                    dispatch(getRolesSuccess(response.data.data));
                }
            }
        default:
            return (dispatch) => { }


    }
}

export function failureResponse(error, endPoint, requestMethod) {
    // alert("7")
    let endPointPrefix = endPoint.split('/')[0];
    let endPointSuffix = endPoint.split('/')[1];
    if (endPointSuffix !== "department" && endPointPrefix === "modules" && requestMethod === "get" && endPointSuffix !== undefined) {
        endPointSuffix = parseInt(endPointSuffix, 10);
    }
    switch (endPointPrefix) {
        case 'barcode':
            return async (dispatch) => {
                if (requestMethod === "get") {
                    alert(error)
                    dispatch(getBarcodeStringFailure(error));
                }
                else if (requestMethod === "post") {
                    console.warn(error)
                    dispatch(sendBarcodeStringFailure(error));
                }
            }

        case 'logs':
            return async (dispatch) => {
                if (requestMethod === "post") {
                    dispatch(getAllScanLogFailure(error));
                }
                else if (endPointSuffix === "user_logs") {
                    dispatch(getUserScanLogsFailure(error));
                }
            }
        case 'users':
            return (dispatch) => {
                if (requestMethod === "get") {
                    dispatch(getAllUsersFailure(error));
                }
            }
        case 'roles':
            return (dispatch) => {
                if (requestMethod === "get") {
                    dispatch(getRolesFailure(error));
                }
            }
        default:
            return error;
    }
}

