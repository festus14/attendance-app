const initialState = {
    scanLog: [],
    loading: false,
    success: false
};

export default function getAllScanLog(state = initialState, action) {
    switch (action.type) {
        case "GET_ALL_SCAN_LOG_STARTED":
            return {
                ...state,
                loading: true,
                success: false
            };
        case "GET_ALL_SCAN_LOG_SUCCESS":
            return {
                ...state,
                loading: false,
                success: true,
                scanLog: action.payload.timeLogs
            };
        case "GET_ALL_SCAN_LOG_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
}