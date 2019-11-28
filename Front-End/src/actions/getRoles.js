import { request } from './index.js';
import { getToken } from "./AuthAction";
import {
    GET_ROLES_STARTED,
    GET_ROLES_SUCCESS,
    GET_ROLES_FAILURE
} from './types.js';

export const getRoles = (endPoint, requestMethod) => {
    return async (dispatch) => {
        let token = await dispatch(await getToken());
        try {
            dispatch(getRolesStarted());
            return dispatch(request(null, endPoint, requestMethod, token));
        }
        catch (error) {
            console.log(error)
        }

    }
}

export const getRolesStarted = () => ({
    type: GET_ROLES_STARTED
});

export const getRolesSuccess = details => ({
    type: GET_ROLES_SUCCESS,
    payload: {
        ...details
    }
});

export const getRolesFailure = error => ({
    type: GET_ROLES_FAILURE,
    payload: {
        error
    }
});
