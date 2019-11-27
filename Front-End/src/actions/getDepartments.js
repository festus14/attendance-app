import { GET_DEPARTMENTS, DEPARTMENT_LOADING } from './types';
import axios from 'axios';
import { APIURL } from '../utility/config';
import { getToken } from './AuthAction';

export const getDepartments = () => async dispatch => {
    dispatch(departmentLoading());
    try {
        let token = await dispatch(getToken());
        console.warn('hererer', token)
        let res = await axios.post(`${APIURL}departments/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.warn(res.data);
        if (!res.data.success) {
            return res.data.message;
        }
        await dispatch(setDepartment(res.data.data));
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