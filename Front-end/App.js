import React from 'react';
import {StyleSheet, View} from 'react-native';

// import LoginScreen from './src/screens/LoginScreen';
// import HomeScreen from './src/screens/HomeScreen';
import AppNavigation from './src/navigations/AppNavigation';

import {Provider} from 'react-redux';
import store from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigation style={styles.container} />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    
  },
});

export default App;
