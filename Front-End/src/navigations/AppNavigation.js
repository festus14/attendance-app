import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import SignOutScreen from '../screens/SignOutScreen';
import BarCodeScannerScreen from '../screens/BarCodeScannerScreen';
import ViewUserReportScreen from '../screens/ViewUserReportScreen';
import ReportsByTimeScreen from "../screens/ReportsByTimeScreen";
import AbsentismReportScreen from "../screens/AbsentismReportScreen";
import PresentTimesReportScreen from "../screens/PresentTimesReportScreen";
import HoursWorkedScreen from "../screens/HoursWorkedScreen";
import BarcodeGeneratorScreen from "../screens/BarcodeGeneratorScreen";

const AppStack = createStackNavigator({
    Home: HomeScreen,
    BarCodeScanner: BarCodeScannerScreen,
    Home: HomeScreen,
    UserDetails: UserDetailsScreen,
    Home: HomeScreen,
    ViewUserReport: ViewUserReportScreen,
    SignOut: SignOutScreen,
    ReportByTime: ReportsByTimeScreen,
    NumberOfAbsentTimes: AbsentismReportScreen,
    NumberOfPresentTimes: PresentTimesReportScreen,
    NumberOfHoursWorkedInAPeriod: HoursWorkedScreen,
    GeneratorScreen: BarcodeGeneratorScreen
});


const AuthStack = createStackNavigator({ LogIn: LoginScreen });

export default createAppContainer(
    createSwitchNavigator({
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    }, {
        initialRouteName: 'AuthLoading',
    }, ),
);