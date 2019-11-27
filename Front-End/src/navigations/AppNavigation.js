import { createSwitchNavigator, createAppContainer } from 'react-navigation';

import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignOutScreen from '../screens/SignOutScreen';
import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';

const HomeSwitch = createSwitchNavigator({
  Home: HomeScreen,
  BarCodeScanner: BarCodeScannerScreen,
});

const AppStack = createStackNavigator({
    Home: HomeSwitch,
    UserDetails: UserDetailsScreen,
    SignOut: SignOutScreen,
});

const AuthStack = createStackNavigator({ LogIn: LoginScreen });

export default createAppContainer(
    createSwitchNavigator({
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    }, {
        initialRouteName: 'Auth',
    }, ),
);