import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    GET_ALL_USERS_STARTED,
    GET_ALL_USERS_SUCCESS,
    GET_ALL_USERS_FAILURE
} from './types.js';

export const getAllUsers = (formData, endPoint, requestMethod) => {
    return async (dispatch) => {
        let token = await dispatch(await getToken());
        try {
            dispatch(getAllUsersStarted());
            return dispatch(request(formData, endPoint, requestMethod, token, 'application/json'));
        }
        catch (error) {
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
