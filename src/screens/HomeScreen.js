import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {AppStyles} from '../AppStyles';

export default class HomeScreen extends Component {
  
  _showUserDetails = () => {
    this.props.navigation.navigate('UserDetails');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the App Home</Text>
        <Text>
          This Page Should be where the barcode will show for admin tab and bar
          code scanner will show for employees after sign in
        </Text>
        <TouchableOpacity
          onPress={this._showUserDetails}
          style={styles.loginContainer}>
          <Text style={styles.loginText}>Go to user details</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this._signOutAsync}>
          <Text style={styles.loginText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
    textAlign: 'center',
  },
});
