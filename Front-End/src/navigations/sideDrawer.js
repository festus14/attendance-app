import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppStyles } from '../utility/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import { getToken } from "../actions/AuthAction";
import { getRolesById } from "../actions/getDetailsById";
import { connect } from 'react-redux';


const mapStateToProps = state => ({
  userLogs: state.getUserScanLogs,
  allRoles: state.getRoles,
  user: state.authReducer.user
});


const Drawer = (props) => {
  const _showUserDetails = () => {
    has_admin_rights();
    // console.log(props.allRoles.roles, "ihiohoihih")
    props.propss.navigation.navigate('UserDetails');
  };

  const _goToBarCodeScanner = () => {
    props.propss.navigation.navigate('BarCodeScanner');
  };

  const _goToViewUserReport = () => {
    props.propss.navigation.navigate('ViewUserReport');
  };

  const _goToSignOut = () => {
    props.propss.navigation.navigate('SignOut');
  };

  const _goToGeneratorPage = () => {
    props.propss.navigation.navigate('GeneratorScreen')
  }

  const has_admin_rights = async() => {
    return async (dispatch) => {
      let token = dispatch(await getToken());
      if (token !== null){
        console.log(RNSecureKeyStore.get("token"), "qaekfvnl")
      }
    }
  }

  return (
    <View style={{ backgroundColor: '#800020', height: '100%', width: '100%', paddingTop: "15%" }}>
      <Text style={{
        color: "white", fontSize: 26, textAlign: "left",
        paddingLeft: "5%", borderBottomWidth: 0.5, borderBottomColor: "grey",
        paddingBottom: "5%", fontWeight: "bold", marginBottom: "10%"
      }}>
        Attendance</Text>
      <TouchableOpacity
        onPress={_goToBarCodeScanner}
        style={styles.loginContainer}>
        <Icon style={{ color: AppStyles.color.white, textAlign: 'left', fontSize: 20, paddingRight: "10%" }}
          name="camera" size={40}></Icon>
        <Text style={styles.loginText}>Scan barcode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_goToViewUserReport}
        style={styles.loginContainer}>
        <Icon style={{ color: AppStyles.color.white, textAlign: 'left', fontSize: 20, paddingRight: "10%" }}
          name="retweet" size={40}></Icon>
        <Text style={styles.loginText}>Users report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_showUserDetails}
        style={styles.loginContainer}>
        <Icon style={{ color: AppStyles.color.white, textAlign: 'left', fontSize: 20, paddingRight: "10%" }}
          name="user" size={40}></Icon>
        <Text style={styles.loginText}>User details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_goToGeneratorPage}
        style={styles.loginContainer}>
        <Icon style={{ color: AppStyles.color.white, textAlign: 'left', fontSize: 20, paddingRight: "10%" }}
          name="barcode" size={40}></Icon>
        <Text style={styles.loginText}>Barcode Generator</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_goToSignOut} style={styles.loginContainer}>
        <Icon style={{ color: AppStyles.color.white, textAlign: 'left', fontSize: 20, paddingRight: "10%" }}
          name="power-off" size={40}></Icon>
        <Text style={styles.loginText}> Sign Out </Text>
      </TouchableOpacity>
    </View>
  );
}

export default connect(mapStateToProps, null)(Drawer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  or: {
    fontFamily: AppStyles.fontName.main,
    color: 'black',
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 0,
    marginBottom: 0,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'left',
    marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'left',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: '100%',
    padding: 10,
    marginTop: 15,
    height: 40,
    display: "flex",
    flexDirection: "row"
  },
  loginText: {
    color: AppStyles.color.white,
    textAlign: 'left',
    fontSize: 16,
    paddingRight: "5%"

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
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
});





