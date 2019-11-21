import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Linking,
} from 'react-native';
<<<<<<< HEAD
import {AppStyles} from '../utility/AppStyles';
=======
>>>>>>> 78cff1a168a1c7b9ce3308690170b4e1f4b24063
import QRCodeScanner from 'react-native-qrcode-scanner';
import {connect} from 'react-redux';

export default class BarCodeScanner extends Component {
  onSuccess = e => {
    console.log(e);
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err),
    );
  };

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = async () => {
    await this.props.navigation.goBack();
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        bottomContent={
          <Text style={styles.buttonText}>
            
            Scan the barcode on the screen
          </Text>
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: '#800020',
  },
  buttonTouchable: {
    padding: 16,
  },
});
