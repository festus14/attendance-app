const initialState = {
    userScanLogs: [],
    loading: false,
    success: false
};

export default function getUserScanLogs(state = initialState, action) {
    switch (action.type) {
        case "GET_USER_SCAN_LOGS_STARTED":
            return {
                ...state,
                loading: true,
                success: false
            };
        case "GET_USER_SCAN_LOGS_SUCCESS":
            return {
                ...state,
                loading: false,
                success: true,
                userScanLogs: action.payload
            };
        case "GET_USER_SCAN_LOGS_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
}