import React, { Component } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import { getToken } from '../actions/AuthAction';

class AuthLoadingScreen extends Component {
  async componentDidMount() {
    let token = await this.props.getToken();
    try {
      this.props.navigation.navigate(token ? 'App': 'Auth');
    }
    catch (error) {
      console.log(error)
    }

  }

  render() {
    return (
      <View style={{ flex: 1, alignSelf: "center", position: "absolute", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#800020" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getToken: () => dispatch(getToken()),
})

export default connect(null, mapDispatchToProps)(AuthLoadingScreen)