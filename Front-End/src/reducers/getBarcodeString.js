const initialState = {
    barcodeString: [],
    loading: false,
    error: null,
    success: false
};

export default function getBarcodeString(state = initialState, action) {
    switch (action.type) {
        case "GET_BARCODE_STRING_STARTED":
            return {
                ...state,
                loading: true,
                success: false
            };
        case "GET_BARCODE_STRING_SUCCESS":
            return {
                ...state,
                loading: false,
                success: true,
                barcodeString: action.payload.barcode
            };
        case "GET_BARCODE_STRING_FAILURE":
            return {
                ...state,
                loading: false,
                error: action.payload.error               
            };
        default:
            return state;
    }
}