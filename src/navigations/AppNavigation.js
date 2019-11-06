import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const AppStack = createStackNavigator({
  Home: HomeScreen,
  UserDetails: UserDetailsScreen,
});
const AuthStack = createStackNavigator({LogIn: LoginScreen});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
