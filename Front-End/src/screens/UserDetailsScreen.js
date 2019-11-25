import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
} from 'react-native';
import {AppStyles} from '../utility/AppStyles';
import UserTable from '../components/UserTable';
import {alertNotification} from '../actions/index';

import {connect} from 'react-redux';

class UserDetailsScreen extends Component {

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


  render() {
    const state = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.title}>User Details</Text>
          <View>
            <UserTable name={state.user.name} key={state.user.id} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 10,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
  },
  body: {
    height: '90%',
    backgroundColor: AppStyles.color.tint,
    borderRadius: 50,
    padding: 0,
  },
});


const mapStateToProps = state => ({
  user: state.authReducer.user
});

export default connect(mapStateToProps)(UserDetailsScreen);
