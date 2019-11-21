const initialState = {
    barcodeString: [],
    loading: false,
};

export default function getBarcodeString(state = initialState, action) {
    switch (action.type) {
        case "GET_BARCODE_STRING_STARTED":
            return {
                ...state,
                loading: true,
            };
        case "GET_BARCODE_STRING_SUCCESS":
            return {
                ...state,
                loading: false,
                barcodeString: action.payload
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