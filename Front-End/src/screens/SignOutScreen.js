import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {AppStyles} from '../utility/AppStyles';

import {logOut} from '../actions/AuthAction';
import {connect} from 'react-redux';

class SignOutScreen extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Sign Out </Text>
        <View>
          <Text> Are you sure you want to sign out ? </Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={this.props.logOut}>
            <Text style={styles.loginText}>Sign Out</Text>
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
});

const mapDispatchToProps = dispatch => ({
  logOut: () => dispatch(logOut()),
});

export default connect(null, mapDispatchToProps)(SignOutScreen);

