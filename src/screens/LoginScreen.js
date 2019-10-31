import React, {Component} from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';
import {AppStyles} from '../AppStyles';

class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
  };

  onPressLogin = () => {
    console.log('Im Logged In');
  };

  render() {
    return (
      <View style={styles.container}>
        <Text> Sign In </Text>{' '}
        <View>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            placeholder="Enter Name"
          />
        </View>{' '}
        <View>
          <TextInput secureTextEntry={true} placeholder="Password" />
        </View>{' '}
        <View>
          <Button title="Log in" onPress={() => this.onPressLogin()} />{' '}
        </View>{' '}
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
});

export default LoginScreen;
