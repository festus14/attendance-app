/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';

const App = () => {
  return (
    <>
      <View>
        <LoginScreen />
      </View>{' '}
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
