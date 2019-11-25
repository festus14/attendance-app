import React, {Component} from 'react';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import { connect } from 'react-redux';
import { getToken } from '../actions/AuthAction';

class AuthLoadingScreen extends Component {
  async componentDidMount() {
    let token = await this.props.getToken();
    this.props.navigation.navigate(token ? 'App' : 'Auth');
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getToken: () => dispatch(getToken()),
})

export default connect(null, mapDispatchToProps)(AuthLoadingScreen)