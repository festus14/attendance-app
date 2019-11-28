import axios from 'axios';
import { APIURL } from '../utility/config';
import { successResponse, failureResponse } from './response.js';
import { getBarcodeString } from './getBarcodeString.js';
import { sendBarcodeString } from './sendBarcodeString';
import { getAllScanLog } from './getAllScanLog';
import { getAllUsers } from './getAllUsers';
import { getUserScanLogs } from './getUserScanLogs';
import { getRoles } from './getRoles';

export const getNewBarcodeString = (endPoint, requestMethod) => {
    try {
        return (dispatch) => dispatch(getBarcodeString(endPoint, requestMethod));
    }
    catch (error) {
       console.log(error)
    }
}

export const getAllRegisteredUsers = (endPoint, requestMethod) => {
    try {
        return (dispatch) => dispatch(getAllUsers(endPoint, requestMethod));
    }
    catch (error) {
        console.log(error)
    }
}

export const sendScannedBarcodeString = (formData, endPoint, requestMethod) => {
    try {
        return (dispatch) => dispatch(sendBarcodeString(formData, endPoint, requestMethod));
    }
    catch (error) {
        console.log(error)
    }
}

export const getAllLogsOfScannedUsers = (formData, endPoint, requestMethod) => {
    try {
        return (dispatch) => dispatch(getAllScanLog(formData, endPoint, requestMethod));
    }
    catch (error) {
        console.log(error)
    }
}

export const getScanLogsPerUser = (formData, endPoint, requestMethod) => {
    try {
        return (dispatch) => dispatch(getUserScanLogs(formData, endPoint, requestMethod));
    }
    catch (error) {
        console.log(error)
    }
}

export const getAllRoles = (endPoint, requestMethod) => {
    try {
        return (dispatch) => dispatch(getRoles(endPoint, requestMethod));
    }
    catch (error) {
        console.log(error)
    }
}


export function request(formData, endPoint, requestMethod, token) {
    return async (dispatch) => {
        try {
            let response = await axios({
                method: requestMethod,
                url: APIURL + endPoint + '/',
                data: formData,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': 'application/json',
                    'Cross-Origin': true,
                    'Accept': 'application/json',
                    'CORS': true,
                    'Authorization': "Bearer " + token
                }
            })
            await dispatch(successResponse(response, endPoint, requestMethod));
            return true;
        }
        catch (error) {
            let errorMessage;
            if (error.response === undefined) {
                errorMessage = error;
            }
            else if (error.response.data === undefined) {
                errorMessage = error.response;
            }
            else if (error.response.data.message === undefined) {
                errorMessage = error.response.data;
            }
            else {
                errorMessage = error.response.data.message;
            }

            await dispatch(failureResponse(errorMessage, endPoint, requestMethod));
            return false;
        }
    }
}