import React, {Component} from 'react';
import {StyleSheet, Text, View, BackHandler} from 'react-native';
import {AppStyles} from '../utility/AppStyles';
import UserTable from '../components/UserTable';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {connect} from 'react-redux';
import {NavigationEvents} from 'react-navigation';
import {getUserInfo} from '../actions/AuthAction';
import { getRolesById } from '../actions/getDetailsById';
import {getDepartments} from '../actions/getDepartments';

class UserDetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state= {
      componentJustMounted: false,
      roles: [],
    }
  }

  componentHasMounted = async () => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    let tokenObject = await RNSecureKeyStore.get('token');
    tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
    userId = tokenObject.user.id;
    this.props.getUserInfo(userId);

    let roles = getRolesById(
      this.props.user.roleIds,
      this.props.allRoles,
    ); 

      this.setState({
        componentJustMounted: true,
        roles: roles,
      });

      departments = this.props.getDepartments();
  }

  async componentDidMount(){
    console.warn('props here ', this.props.departments)
    if (!this.state.componentJustMounted){
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.handleBackButtonClick,
      );
    }

    let tokenObject = await RNSecureKeyStore.get('token');
    tokenObject = tokenObject ? JSON.parse(tokenObject) : {};
    userId = tokenObject.user.id;
    this.props.getUserInfo(userId);
    let roles = getRolesById(this.props.user.roleIds, this.props.allRoles);
    this.setState({componentJustMounted: true, roles: roles});

    departments = this.props.getDepartments()
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
    const {user} = this.props;
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={this.componentHasMounted}/>
        <View style={styles.body}>
          <Text style={styles.title}>User Details</Text>
          <View style={styles.textContainer}>
            <UserTable
              firstName={user.firstName}
              email={user.email}
              gender={user.gender}
              lastName={user.lastName}
              roles={this.state.roles}
              department={this.state.department}
              key={user.id}
            />
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
  allRoles: state.getRoles.roles,
  departments: state.getDepartments.departments,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetailsScreen);
