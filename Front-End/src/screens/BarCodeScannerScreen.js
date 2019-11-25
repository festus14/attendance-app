import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  BackHandler
} from 'react-native';
import {AppStyles} from '../utility/AppStyles';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { sendScannedBarcodeString } from '../actions/index';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => {
  return {
    sendBarcodeString: (barcodeString) => {
      let formData = { "barString": barcodeString }
      return dispatch(sendScannedBarcodeString(formData, 'barcode/scan', 'post'))
    }
  }
}

const mapStateToProps = state => ({
  scanResponse: state.sendBarcodeString
});


class BarCodeScanner extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      cameraInitiated: true,
      textToShow: "Signing Attendance..."
    }
  }

  onSuccess = async (result) => {
    await this.setState({
      cameraInitiated: false
    });
    let scannedResponse = await this.props.sendBarcodeString(result.data);
    if (scannedResponse) {
      await this.setState({
        textToShow: "Attendance signed."
      });
    }
    else{
      alert("An error occured, please try again later.")
    }
  }

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
      <View style={{ flex: 1 }}>
        {this.state.cameraInitiated &&
          <QRCodeScanner
            onRead={this.onSuccess}
            showMarker={true}
            bottomContent={
              <Text style={styles.buttonText}>Scan the barcode on the screen</Text>
            }
          />
        }
        {
          !this.state.cameraInitiated && this.props.scanResponse.loading &&
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{fontSize: 21, color: '#800020', marginTop: "50%"}}>{this.state.textToShow}</Text>
            <ActivityIndicator size="large" color="#800020" />
          </View>
        }
        {
          !this.state.cameraInitiated && this.props.scanResponse.success &&
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{fontSize: 21, color: '#800020', marginTop: "50%"}}>{this.state.textToShow}</Text>
          </View>
        }
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScanner);

