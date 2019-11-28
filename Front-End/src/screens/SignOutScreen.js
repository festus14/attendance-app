import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { AppStyles } from '../utility/AppStyles';

import { logOut } from '../actions/AuthAction';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';

class SignOutScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      singOutButtonPressed: false
    }
  }

  signOut = async () => {
    this.setState({ singOutButtonPressed: true });
    let signOut = await this.props.logOut();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Sign Out </Text>
        <View>
          <Text> Are you sure you want to sign out ? </Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={this.signOut}>
            <Text style={styles.loginText}>Sign Out</Text>
            {this.state.singOutButtonPressed &&
              <View style={{justifyContent: "center"}}>
                <ActivityIndicator size="large" color="#800020" style={{ flex: 1, alignSelf: "center" }} />
              </View>
            }
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

