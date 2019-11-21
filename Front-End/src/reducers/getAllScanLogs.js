const initialState = {
    scanLog: [],
    loading: false,
};

export default function getAllScanLog(state = initialState, action) {
    switch (action.type) {
        case "GET_ALL_SCAN_LOG_STARTED":
            return {
                ...state,
                loading: true,
            };
        case "GET_ALL_SCAN_LOG_SUCCESS":
            return {
                ...state,
                loading: false,
                scanLog: action.payload
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