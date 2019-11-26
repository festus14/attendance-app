import React from 'react';

import AppNavigation from './src/navigations/AppNavigation';
import NavigationService from './src/navigations/NavigationService';

import {Provider} from 'react-redux';
import store from './src/store';

const App = () => {

  return (
    <Provider store={store}>
      <AppNavigation ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }} />
    </Provider>
  );
};


export default App;
