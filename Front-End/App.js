import React from 'react';

import AppNavigation from './src/navigations/AppNavigation';

import {Provider} from 'react-redux';
import store from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};


export default App;
