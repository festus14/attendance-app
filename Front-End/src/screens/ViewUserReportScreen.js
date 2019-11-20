import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {AppStyles} from '../utility/AppStyles';

export default class HomeScreen extends Component {
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

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
  };

  _showUserDetails = async () => {
    this.props.navigation.navigate('UserDetails');
  };

  _signOutAsync = async () => {
    // await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _goToBarCodeScanner = () => {
    this.props.navigation.navigate('BarCodeScanner');
  };

  _goToViewUserReport = () => {
    this.props.navigation.navigate('ViewUserReport');
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>Reports </Text>
        <TouchableOpacity
          onPress={this._goToBarCodeScanner}
          style={styles.loginContainer}>
          <Text style={styles.loginText}> Report by time </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._goToViewUserReport}
          style={styles.loginContainer}>
          <Text style={styles.loginText}> Absentism in a period </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._showUserDetails}
          style={styles.loginContainer}>
          <Text style={styles.loginText}> Present employees in a period </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._signOutAsync}
          style={styles.loginContainer}>
          <Text style={styles.loginText}> Number of </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  or: {
    fontFamily: AppStyles.fontName.main,
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: 250,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
    textAlign: 'center',
  },
  placeholder: {
    fontFamily: AppStyles.fontName.text,
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  body: {
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  facebookContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.facebook,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  facebookText: {
    color: AppStyles.color.white,
  },
});