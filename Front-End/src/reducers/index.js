import { combineReducers } from 'redux';
import logReducer from './LogReducer';
import userDetailReducer from './UserDetailReducer'
import authReducer from './AuthReducer';
import getAllScanLogs from './getAllScanLogs';
import getBarcodeString from './getBarcodeString';
import sendBarcodeString from './sendBarcodeString';
import getAllUsers from './getAllUsers';
import getUserScanLogs from './getUserScanLogs';
import getRoles from './getRoles';

export default combineReducers({
    authReducer,
    logReducer,
    userDetailReducer,
    getAllScanLogs,
    getBarcodeString,
    sendBarcodeString,
    getAllUsers,
    getUserScanLogs,
    getRoles
});