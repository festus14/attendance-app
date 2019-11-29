import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import { AppStyles } from '../utility/AppStyles';
import { connect } from 'react-redux';
import { logIn } from '../actions/AuthAction';
import AuthLoadingScreen from './AuthLoadingScreen';
import { getToken } from "../actions/AuthAction";


const mapDispatchToProps = dispatch => ({
  logIn: (data) => dispatch(logIn(data)),
  getToken: () => dispatch(getToken()),
});


const mapStateToProps = state => ({
  auth: state.authReducer,
});

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
      error: ''
    };
  }

  componentDidMount() {
    this.props.navigation.navigate("Auth")
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

  changeDisplay = () => {
    this.setState({
      displayPassword: !this.state.displayPassword,
      password: '',
    });
  };

  handleBackButtonClick = () => {
    if (!this.state.displayPassword) {
      this.changeDisplay();
      return true;
    }
  };

  onPressLogin = async () => {

    const { email, password } = this.state;

    if (email.length <= 0 || password.length <= 0) {
      alert('Please fill out the required fields.');
      return;
    }

    let data = {
      email,
      password,
    };

    let error = await this.props.logIn(data);

    switch (error) {
      case '':
        this.props.navigation.navigate('App');
      case 'INVALID_CREDENTIALS':
        this.openError('Email and password does not match');
      case 'USER_NOT_FOUND':
        this.openError('Email does not exist');
      default:
        this.openError('Unknown error occured')
    }
  };

  openError = (error) => {
    this.setState({ error })
  }

  onPressSubmitForgotPassword = () => {
    const { email } = this.state;
    if (email.length <= 0) {
      alert('Please fill out the required fields.');
      return;
    }
    this.changeDisplay;
  };

  render() {
    const { email, password, displayPassword, error } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Image
            style={styles.logo}
            source={require('../../assets/icons/Logo2.png')}
          />
        </View>
        <Text style={{ color: 'red' }}>{error}</Text>
        <Text style={styles.title}>
          Sign In
        </Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Enter e-mail"
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
            value={email}
            onChangeText={text => this.setState({ email: text })}
          />
        </View>
        {this.props.auth.loading && <View>
          <AuthLoadingScreen propss ={this.props}/>
        </View>}
        {displayPassword && (
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
              value={password}
              onChangeText={text => this.setState({ password: text })}
            />
          </View>
        )}
        <View>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={ () => this.onPressLogin()
            }>
            <Text style={styles.loginText}>
              Login
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
    marginBottom: 5,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
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
  logo: {
    marginBottom: 10,
    marginTop: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
