import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  StatusBar,
  BackHandler,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppStyles } from '../utility/AppStyles';
import { getAllLogsOfScannedUsers } from '../actions/index';
import { connect } from 'react-redux';
import moment from "moment";
import { getAllRegisteredUsers } from "../actions/index";
import { Card, Title, Paragraph } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import { getErrorMessage } from '../actions/errorMessages';


const mapDispatchToProps = dispatch => {
  return {
    getLogs: (formData) => {
      return dispatch(getAllLogsOfScannedUsers(formData, 'logs/users', 'post'))
    },
    getUsers: () => {
      return dispatch(getAllRegisteredUsers('users', 'get'))
    }
  }
}

const mapStateToProps = state => ({
  scanLogs: state.getAllScanLogs,
  allUsers: state.getAllUsers
})

class ReportsByTimeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      mode: 'date',
      showStart: false,
      showEnd: false,
      listViewData: [],
      getReportSubmitted: false,
      modalVisible: false,
      users: [],
      userLog: "",
      startDateText: new Date().toDateString(),
      endDateText: new Date().toDateString(),
      startTimeText: new Date().toLocaleTimeString(),
      endTimeText: new Date().toLocaleTimeString(),
      type: "start",
      startDateToSend: new Date().getTime(),
      endDateToSend: new Date().getTime()
    }
  }


  componentHasMounted = async () => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );

    let allUsers = await this.props.getUsers();
    if (allUsers) {
      let userInfo = this.props.allUsers.users.users.map((user, index) => {
        return {
          "name": this.capitalizeFirstLetter(user.firstName) + " " + this.capitalizeFirstLetter(user.lastName),
          "id": user.id
        }
      })
      await this.setState({
        users: userInfo
      });
    }
  }

  capitalizeFirstLetter = input => {
    let result = input.charAt(0).toUpperCase() + input.slice(1);
    return result;
  }


  setStartDate = (event, startDate) => {
    startDate = startDate || this.state.startDate;
    this.setState({
      showStart: !this.state.showStart,
      startDate,
    });

    if (this.state.mode === "date") {
      this.setState({
        startDateText: this.state.startDate.toDateString()
      });
    }
    else if (this.state.mode === "time") {
      this.setState({
        startTimeText: this.state.startDate.toLocaleTimeString()
      });
    }
  }

  setEndDate = (event, endDate) => {
    endDate = endDate || this.state.endDate;
    this.setState({
      showEnd: !this.state.showEnd,
      endDate,
    });

    if (this.state.mode === "date") {
      this.setState({
        endDateText: this.state.endDate.toDateString()
      });
    }
    else if (this.state.mode === "time") {
      this.setState({
        endTimeText: this.state.endDate.toLocaleTimeString()
      });
    }
  }

  show = (mode, dateType) => {
    if (dateType === "start") {
      this.setState({
        showStart: true,
        mode: mode,
      });
    }
    else {
      this.setState({
        showEnd: true,
        mode: mode,
      });
    }

  }

  datepicker = (dateType) => {
    this.setState({
      type: dateType
    })
    this.show('date', dateType);
  }

  timepicker = (dateType) => {
    this.setState({
      type: dateType
    })
    this.show('time', dateType);
  }


  getReport = async () => {
    let listOfUsers = []
    await this.setState({
      getReportSubmitted: true
    });
    if (this.state.users.length === 0) {
      await this.componentHasMounted();
    }
    let scanLogs = await this.props.getLogs(
      {
        "from": new Date(this.state.startDateText + " " + this.state.startTimeText + " GMT+0100 (WAT)").getTime(),
        "to": new Date(this.state.endDateText + " " + this.state.endTimeText + " GMT+0100 (WAT)").getTime()
      });
    if (scanLogs) {
      alert(this.state.users.length)
      console.log(this.props.scanLogs.scanLog)
      this.props.scanLogs.scanLog.forEach((log, index) => {
        return this.state.users.forEach((user, index) => {
          if (log.userId === user.id) {
            listOfUsers.push({
              "id": log.id,
              "name": user.name,
              "officeLocation": (log.inside) ? "In the office" : "Out of the office",
              "log": "Last sign time: " + moment(log.createdAt).toString()

            });
          }
        });
      })
      await this.setState({
        listViewData: listOfUsers
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = async () => {
    await this.props.navigation.goBack();
  };

  render() {
    const { showStart, showEnd, startDate, endDate, mode, getReportSubmitted, modalVisible } = this.state;
    return (
      <ScrollView>
        <View style={{flex: 1}}>
          <NavigationEvents onWillFocus={() => this.componentHasMounted()} />
          {!getReportSubmitted && <View>
            <View style={{ display: "flex", margin: "2%", justifyContent: 'center', marginVertical: "10%" }}>
              <Text style={{ textAlign: "center", color: "#800020", fontWeight: "bold", fontSize: 20 }}>
                Select start date and time
              </Text>
              <TouchableOpacity onPress={() => { this.datepicker("start") }} style={{
                marginVertical: "2%",
                textDecorationLine: "underline", padding: "2%", textDecorationColor: "black", alignSelf: "center"
              }}>
                <Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
                  {this.state.startDateText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.timepicker("start") }} style={{
                padding: "2%", alignSelf: "center"
              }}>
                <Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
                  {this.state.startTimeText}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ textAlign: "center", color: "#800020", fontWeight: "bold", fontSize: 20 }}>Select end date and time</Text>
            <View style={{ display: "flex", margin: "2%", justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => { this.datepicker("end") }} style={{
                marginVertical: "2%",
                padding: "2%", alignSelf: "center"
              }}>
                <Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
                  {this.state.endDateText}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.timepicker("end") }} style={{
                padding: "2%", alignSelf: "center"
              }}>
                <Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
                  {this.state.endTimeText}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.ButtonContainer} onPress={this.getReport}>
              <Text style={{ color: "white", textAlign: "center" }}>Get Report</Text>
            </TouchableOpacity>
          </View>

          }
          {
            getReportSubmitted && this.props.scanLogs.loading &&
            <View>
              <Text style={{ color: "#800020", marginBottom: "20%", fontWeight: "bold", fontSize: 30 }}>Getting Report</Text>
              <ActivityIndicator size="large" color="#800020" />
            </View>
          }
          {
            getReportSubmitted && this.props.scanLogs.success && this.state.listViewData.length === 0 &&
            <View>
              <Text style={{ color: "#800020", marginBottom: "20%", fontWeight: "bold", fontSize: 30 }}>No reports to show</Text>
            </View>
          }
          {getReportSubmitted && this.props.scanLogs.success &&
            this.state.listViewData.map((log, index) => {
              return (
                  <View style={{ margin: "5%", backgroundColor: "#800020", borderRadius: 15 }}>
                    <Card style={{ backgroundColor: "#800020" }}>
                      <Card.Content>
                        <Title style={{ color: "white", fontSize: 25 }}>{log.name}</Title>
                        <Title style={{ color: "white", fontSize: 16 }}>{log.log}</Title>
                        <Paragraph style={{ color: "white" }}>{"Present Location: " + " " + log.officeLocation}</Paragraph>
                      </Card.Content>
                    </Card>
                  </View>
              );
            })
          }
          {
            getReportSubmitted && this.props.scanLogs.error !== null && this.props.scanLogs.error !== undefined &&
            <View style={{ justifyContent: "center" }}>
              <Text style={{ fontSize: 21, color: '#800020', marginTop: "50%", textAlign: "center" }}>{getErrorMessage(this.props.scanLogs.error.toString()) + ", please try again."}</Text>
            </View>
          }
          {
            showStart && <DateTimePicker value={startDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={this.setStartDate}
              maximumDate={new Date()}
            />
          }
          {
            showEnd && <DateTimePicker value={endDate}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={this.setEndDate}
              maximumDate={new Date()}
            />
          }
        </View >
      </ScrollView>

    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: '#800020',
  },
  buttonTouchable: {
    padding: 16,
  },
  ButtonContainer: {
    width: 250,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    margin: "10%",
    alignSelf: "center"
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#800020',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    marginBottom: "4%",
    marginTop: "2%"
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportsByTimeScreen);
