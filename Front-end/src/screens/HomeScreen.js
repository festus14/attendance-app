import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {AppStyles} from '../AppStyles';

import {connect} from 'react-redux';

export default class HomeScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  _showUserDetails = () => {
    this.props.navigation.navigate('UserDetails');
  };

  _signOutAsync = async () => {
    // await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>
          This is the App Home
        </Text>
        <Text style={styles.body}>
          This Page Should be where the barcode will show for admin tab and bar
          code scanner will show for employees after sign in
        </Text>
        <TouchableOpacity
          onPress={this._showUserDetails}
          style={styles.loginContainer}>
          <Text style={styles.loginText}>Go to user details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this._signOutAsync}
          style={styles.loginContainer}>
          <Text style={styles.loginText}>Sign Out</Text>
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