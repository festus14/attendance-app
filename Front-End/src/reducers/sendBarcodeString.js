const initialState = {
    scanResponse: [],
    loading: false,
    success: false
};

export default function sendBarcodeString(state = initialState, action) {
    switch (action.type) {
        case "SEND_BARCODE_STRING_STARTED":
            return {
                ...state,
                loading: true,
                success: false
            };
        case "SEND_BARCODE_STRING_SUCCESS":
            return {
                ...state,
                loading: false,
                success: true,
                scanResponse: action.payload
            };
        case "SEND_BARCODE_STRING_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        default:
            return state;
    }
}