import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    GET_ALL_USERS_STARTED,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILURE
} from './types.js';

export const getAllUsers = (endPoint, requestMethod) => {
    return async(dispatch) => {
        let token = await dispatch(getToken());
        try {
            dispatch(getAllUsersStarted());
            return dispatch(request(null, endPoint, requestMethod, token));
        } catch (error) {
            console.log(error)
        }

    }
}

export const getAllUsersStarted = () => ({
    type: GET_ALL_USERS_STARTED
});

export const getAllUsersSuccess = details => ({
    type: GET_ALL_USERS_SUCCESS,
    payload: {
        ...details
    }
});

export const getAllUsersFailure = error => ({
    type: GET_ALL_USERS_FAILURE,
    payload: {
        error
    }
});