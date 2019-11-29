import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { AppStyles } from '../utility/AppStyles';
import RNSecureKeyStore from 'react-native-secure-key-store';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { getUserInfo } from '../actions/AuthAction';
import { getRolesById, getDepartmentById } from '../actions/getDetailsById';
import { getDepartments } from '../actions/getDepartments';

class UserDetailsScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      componentJustMounted: true
    }
  }

  capitalizeFirstLetter = input => {
    let result = input.charAt(0).toUpperCase() + input.slice(1);
    return result;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentHasMounted();
    this.waitForRefresh(3000).then(() => {
      this.setState({ refreshing: false });
    });
  }

  componentHasMounted = async () => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    let tokenObject = await RNSecureKeyStore.get('token');
    tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
    let userId = tokenObject.user.id
    this.props.getUserInfo(userId);

    let departments = await this.props.getDepartments();
    if (departments !== "success") {
      alert("An unknown error occured!")
    }

    this.setState({ componentJustMounted: true })
  }

  waitForRefresh = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  async componentDidMount() {
    if (!this.state.componentJustMounted) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );

      let tokenObject = await RNSecureKeyStore.get('token');
      tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
      let userId = tokenObject.user.id
      this.props.getUserInfo(userId);

      this.setState({ componentJustMounted: true })
    }

    let departments = await this.props.getDepartments();
    if (departments !== "success") {
      alert("An unknown error occured!")
    }
  }


  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
  };

  render() {
    const { user } = this.props;
    return (
      <ScrollView
        contentContainerStyle={{ justifyContent: 'center', flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            colors={['#800020']}
          />
        }>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <NavigationEvents onWillFocus={this.componentHasMounted} />
          {this.props.userProps.success && this.props.allRolesProps.success && this.props.allDepartmentsProps.success &&
            <View
              style={{
                width: '100%',
                backgroundColor: '#800020',
                alignSelf: 'center',
                position: 'absolute',
                marginHorizontal: '15%',
                marginBottom: '10%',
                borderRadius: 20,
                paddingLeft: '3%',
                paddingRight: '3%',
                paddingTop: '5%',
                paddingBottom: '10%',
                zIndex: 5,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  textAlign: 'center',
                  borderBottomColor: 'white',
                  borderBottomWidth: 0.5,
                  paddingBottom: '2%',
                  fontWeight: 'bold',
                  marginBottom: '5%',
                  marginTop: '10%',
                  marginLeft: '4%',
                  marginRight: '4%',
                }}>
                {this.capitalizeFirstLetter(this.props.user.firstName) +
                  ' ' +
                  this.capitalizeFirstLetter(this.props.user.lastName)}
              </Text>
              <View style={{ padding: '5%', marginTop: '5%' }}>
                <Text style={{ fontSize: 14, marginBottom: '3%', color: 'white' }}>
                  {'Email: ' + this.props.user.email}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: '3%', color: 'white' }}>
                  {'Gender: ' +
                    this.capitalizeFirstLetter(this.props.user.gender)}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: '3%', color: 'white' }}>
                  {'Department: ' + this.capitalizeFirstLetter(getDepartmentById(
                    this.props.user.departmentId,
                    this.props.allDepartments,
                  ))
                  }
                </Text>
                <View
                  style={{
                    fontSize: 14,
                    marginBottom: '3%',
                    flexDirection: 'row',
                  }}>
                  <Text style={{ fontSize: 14, color: 'white' }}>Role(s):</Text>
                  {getRolesById(this.props.user.roleIds, this.props.allRoles).map(
                    (role, index) => {
                      return (
                        <Text style={{ marginLeft: '3%', color: 'white' }} key={role}>
                          {index !== this.props.user.roleIds.length - 1
                            ? role + ','
                            : role}
                        </Text>
                      );
                    },
                  )}
                </View>

                <Text style={{ fontSize: 14, marginBottom: '3%', color: 'white' }}>
                  {this.props.inside
                    ? 'Current Location: In office'
                    : 'Current Location: Out of office'}
                </Text>
              </View>
            </View>
          }
          {this.props.userProps.loading || this.props.allDepartmentsProps.loading || this.props.allRolesProps.loading &&
            <View
              style={{ justifyContent: 'center', flex: 1, position: 'absolute' }}>
              <ActivityIndicator
                size="large"
                style={{ flex: 1, marginLeft: "50%" }}
                color="#800020"
              />
            </View>
          }
          {this.props.user.error !== null &&
            this.props.user.loading === false &&
            this.props.user.error !== undefined && (
              <View
                style={{
                  justifyContent: 'center',
                  marginVertical: 0,
                  position: 'absolute',
                  margin: '10%',
                }}>
                <Text
                  style={{
                    fontSize: 21,
                    color: '#800020',
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  {getErrorMessage(this.props.user.error.toString()) +
                    ', please try again.'}
                </Text>
              </View>
            )}
        </View>
      </ScrollView>
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
  },
});

const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: userId => dispatch(getUserInfo(userId)),
    getDepartments: () => dispatch(getDepartments()),
  };
};

const mapStateToProps = state => ({
  user: state.authReducer.user,
  userProps: state.authReducer,
  allRoles: state.getRoles.appRoles,
  allRolesProps: state.getRoles,
  allDepartments: state.getDepartments.departments,
  allDepartmentsProps: state.getDepartments
})

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsScreen);
