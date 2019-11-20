const initialState = {
    alreadySentBarcodeString: [],
    loading: false,
};

export default function setBarcodeString(state = initialState, action) {
    switch (action.type) {
        case "SEND_BARCODE_STRING_STARTED":
            return {
                ...state,
                loading: true,
            };
        case "SEND_BARCODE_STRING_SUCCESS":
            return {
                ...state,
                loading: false,
                alreadySentBarcodeString: action.payload
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