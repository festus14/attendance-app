import { combineReducers } from 'redux';
import logReducer from './LogReducer';
import userDetailReducer from './UserDetailReducer'
import authReducer from './AuthReducer';


export default combineReducers({
    authReducer,
    logReducer,
    userDetailReducer,
});