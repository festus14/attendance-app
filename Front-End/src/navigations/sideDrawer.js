import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppStyles } from '../AppStyles';


export const Drawer = props => {

  _showUserDetails = () => {
    props.navigation.navigate('UserDetails');
  };

  _signOutAsync = async () => {
    // await AsyncStorage.clear();
    props.navigation.navigate('Auth');
  };

  _goToBarCodeScanner = () => {
    props.navigation.navigate('BarCodeScanner');
  };

  _goToViewUserReport = () => {
    props.navigation.navigate('ViewUserReport');
  };

  _goToGeneratorPage = () => {
    props.navigation.navigate('GeneratorScreen')
  }

  return (
    <View style={{ backgroundColor: '#800020', height: '100%', width: '100%' }}>
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
          marginTop: '3%',
          marginBottom: '7%',
        }}>
        Menu
      </Text>
      <TouchableOpacity
        onPress={_goToBarCodeScanner}
        style={styles.loginContainer}>
        <Text style={styles.loginText}>Scan barcode</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_goToViewUserReport}
        style={styles.loginContainer}>
        <Text style={styles.loginText}>Users report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_showUserDetails}
        style={styles.loginContainer}>
        <Text style={styles.loginText}>User details</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={_goToGeneratorPage}
        style={styles.loginContainer}>
        <Text style={styles.loginText}>Go to Generator Screen</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={_signOutAsync} style={styles.loginContainer}>
        <Text style={styles.loginText}> Sign Out </Text>
      </TouchableOpacity>
    </View>
  );
};

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
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: '90%',
    padding: 10,
    marginTop: 30,
    height: 40,
    marginLeft: '3%',
    marginRight: '3%',
    backgroundColor: 'grey',
  },
  loginText: {
    color: AppStyles.color.white,
    textAlign: 'center',
    fontWeight: 'bold',
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
