import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  BackHandler,
  DrawerLayoutAndroid,
  Image,
} from 'react-native';
import {HomeHeader} from '../components/Headers/HomeHeader';
import Drawer from '../navigations/sideDrawer';

export default class HomeScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);

    this.state = {
      drawerOpen: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
  };

  toggleDrawer = () => {
    if (this.state.drawerOpen) {
      this.refs['DRAWER'].closeDrawer();
      this.setState({
        drawerOpen: false,
      });
    } else {
      this.refs['DRAWER'].openDrawer();
      this.setState({
        drawerOpen: true,
      });
    }
  };

  propss = () => {
    return this.props;
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <HomeHeader
          onLeftPress={this.toggleDrawer}
          componentProps={this.props}
        />
        <DrawerLayoutAndroid
          drawerWidth={250}
          drawerPosition="left"
          style={{flex: 1}}
          ref={'DRAWER'}
          renderNavigationView={() => Drawer(this.props)}
        />
      </View>
    );
  }
}
