export function getErrorMessage(type) {
    console.log(type)
    switch (type) {
        case "BARCODE_NOT_LATEST":
            return "This barcode is not the latest, try refreshing the barcode generator screen."
        case "PASSWORD":
            return "Passwords do not match."
        case "INVALID_CREDENTIALS":
            return "Invalid Credentials."
        case "USER_NOT_FOUND":
            return "This account does not exist."
        case "INVALID_FIRSTNAME":
            return "Firstname cannot contain numbers or special characters."
        case "UNAUTHORIZED":
            return "Unauthorized! Login again";
        case "Error: Network Error":
            return "Network Error"
        default:
            return "An unknown error occured, please try again later."
    }

}