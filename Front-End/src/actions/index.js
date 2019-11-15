import CheckAlert from 'react-native-awesome-alert';

export const alertNotification = () => {
    onPressSimpleAlert = () => {
        CheckAlert.alert('Hello!!', SimpleView, [
            { text: 'OK', onPress: () => console.log('OK touch') },
            { text: 'Cancel', onPress: () => console.log('Cancel touch') },
        ]);
    };
};