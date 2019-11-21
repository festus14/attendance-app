import CheckAlert from 'react-native-awesome-alert';
import { successResponse, failureResponse } from './response.js';

export const alertNotification = () => {
    onPressSimpleAlert = () => {
        CheckAlert.alert('Hello!!', SimpleView, [
            { text: 'OK', onPress: () => console.log('OK touch') },
            { text: 'Cancel', onPress: () => console.log('Cancel touch') },
        ]);
    };
};

export function request(formData, endPoint, requestMethod, token, contentType) {

    return async (dispatch) => {
        try {
            let response = await axios({
                method: requestMethod,
                url: '/api/v1/' + endPoint + '/',
                data: formData,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'Access-Control-Allow-Credentials': true,
                    'Content-Type': contentType,
                    'Cross-Origin': true,
                    'Accept': 'application/json',
                    'CORS': true,
                    'Authorization': "Bearer " + token
                }
            })
            await dispatch(successResponse(response, endPoint, requestMethod));
            return true;
        }
        catch (error) {
            let errorMessage;
            if (error.response === undefined) {
                errorMessage = error;
            }
            else if (error.response.data === undefined) {
                errorMessage = error.response;
            }
            else if (error.response.data.message === undefined) {
                errorMessage = error.response.data;
            }
            else {
                errorMessage = error.response.data.message;
            }

            await dispatch(failureResponse(errorMessage, endPoint, requestMethod));
            return false;
        }
    }
}