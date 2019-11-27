import { combineReducers } from 'redux';
import logReducer from './LogReducer/';
import userDetailReducer from './UserDetailReducer/'


export default combineReducers({
    logReducer,
    userDetailReducer,
});