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

class LoginScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      displayPassword: true,
    };
  }

  onPressLogin = () => {
    const {email, password} = this.state;
    if (email.length <= 0 || password.length <= 0) {
      alert('Please fill out the required fields.');
      return;
    }
    this.props.navigation.navigate('App');
    // _signInAsync = async () => {
    //   await AsyncStorage.setItem('userToken', 'abc');
    //   this.props.navigation.navigate('App');
    // };
  };

  onPressSubmitForgotPassword = () => {
    const {email} = this.state;
    if (email.length <= 0) {
      alert('Please fill out the required fields.');
      return;
    }
    // this.props.navigation.navigate('Auth');
    this.setState({
      displayPassword: !this.state.displayPassword,
      password: '',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>
          {this.state.displayPassword ? 'Sign In' : 'Forgot Password'}
        </Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Enter e-mail"
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
            value={this.state.email}
            onChangeText={text => this.setState({email: text})}
          />
        </View>
        {this.state.displayPassword && (
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
              value={this.state.password}
              onChangeText={text => this.setState({password: text})}
            />
          </View>
        )}
        <View>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={
              this.state.displayPassword
                ? () => this.onPressLogin()
                : () => this.onPressSubmitForgotPassword()
            }>
            <Text style={styles.loginText}>
              
              {this.state.displayPassword ? 'Login' : 'Submit'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() =>
              this.setState({displayPassword: !this.state.displayPassword})
            }>
            <Text style={styles.loginText}>
              
              {this.state.displayPassword ? 'Forgot Password' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
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
    height: 42,
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

export default LoginScreen;
