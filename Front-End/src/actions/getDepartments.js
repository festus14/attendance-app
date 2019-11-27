import { GET_DEPARTMENTS, DEPARTMENT_LOADING } from './types';
import axios from 'axios';
import { APIURL } from '../utility/config';
import { getToken } from './AuthAction';

export const getDepartments = () => async dispatch => {
    dispatch(departmentLoading());
    try {
        let token = await dispatch(getToken());
        let res = await axios.get(`${APIURL}departments/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.warn('departments obj', res.data.data.departments);
        if (!res.data.success) {
            return res.data.message;
        }
        if (res.data.data !== undefined) {
            await dispatch(setDepartment(res.data.data));
        }
        return '';
    } catch (error) {
        console.warn(error);
        return error.data.message;
    }
};

export const setDepartment = payload => ({
    type: GET_DEPARTMENTS,
    payload,
});

export const departmentLoading = () => {
    return {
        type: DEPARTMENT_LOADING,
    };
};