import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
} from 'react-native';
import {AppStyles} from '../utility/AppStyles';
import UserTable from '../components/UserTable';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {connect} from 'react-redux';
import { getUserInfo } from '../actions/AuthAction';

class UserDetailsScreen extends Component {

  constructor(props){
    super(props);
  }

  async componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    let tokenObject = await RNSecureKeyStore.get('token');
    tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
    userId = tokenObject.user.id
    this.props.getUserInfo(userId);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }


  render() {
    const { user } = this.props;
    console.warn('Props here', user);
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={styles.title}>User Details</Text>
          <View style={styles.textContainer}>
            <UserTable firstName={user.firstName} email={user.email} gender={user.gender} lastName={user.lastName} roles={user.roleIds} key={user.id} />
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
    fontSize: 23,
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
  textContainer: {
    marginLeft: 20,
  }
});


const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: userId => dispatch(getUserInfo(userId)),
  };
}

const mapStateToProps = state => ({
  user: state.authReducer.user
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsScreen);
