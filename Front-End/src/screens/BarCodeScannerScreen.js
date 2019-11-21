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
import {AppStyles} from '../utility/AppStyles';
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
