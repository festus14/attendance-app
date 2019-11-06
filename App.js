import React from 'react';
import {StyleSheet, View} from 'react-native';

// import LoginScreen from './src/screens/LoginScreen';
// import HomeScreen from './src/screens/HomeScreen';
import AppNavigation from './src/navigations/AppNavigation';

const App = () => {
  return <AppNavigation />;
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
});

export default App;
