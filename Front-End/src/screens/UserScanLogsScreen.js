import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
	BackHandler,
	Modal,
	Picker,
	ScrollView,
	RefreshControl,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationEvents } from 'react-navigation';
import { AppStyles } from '../utility/AppStyles';
import { getAllRegisteredUsers, getScanLogsPerUser } from "../actions/index";
import { Card, Title, Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';


const mapDispatchToProps = dispatch => {
	return {
		getLogsPerUser: (formData) => {
			let param = formData.from + "&to=" + formData.to + "&user_id=" + formData.user_id + "&param="
			return dispatch(getScanLogsPerUser(null, 'logs/user_logs/?from=' + param, 'get'))
		},
		getUsers: () => {
			return dispatch(getAllRegisteredUsers('users', 'get'))
		}
	}
}

const mapStateToProps = state => ({
	userLogs: state.getUserScanLogs,
	allUsers: state.getAllUsers
})

class UserScanLogsScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			startDate: new Date(),
			endDate: new Date(),
			mode: 'date',
			showStart: false,
			showEnd: false,
			users: [{ "name": "user", "id": 0 }],
			getReportSubmitted: false,
			modalVisible: false,
			userId: 1,
			reportGotten: false,
			usersLog: { "name": "User user", "present": 0, "absent": 0, "hoursWorked": 0 },
			startDateText: new Date().toDateString(),
			endDateText: new Date().toDateString(),
			startTimeText: new Date().toLocaleTimeString(),
			endTimeText: new Date().toLocaleTimeString(),
			type: "start",
			startDateToSend: new Date().getTime(),
			endDateToSend: new Date().getTime(),
			refreshing: false
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
		else {
			alert("An error occured while getting users: " + "\n" + this.props.allUsers.error.toString())
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
		this.show('date', dateType);
	}

	timepicker = (dateType) => {
		this.show('time', dateType);
	}

	getReport = async () => {
		this.setState({
			getReportSubmitted: true
		})
		let formData = {
			"from": new Date(this.state.startDateText + " " + this.state.startTimeText + " GMT+0100 (WAT)").getTime(),
			"to": new Date(this.state.endDateText + " " + this.state.endTimeText + " GMT+0100 (WAT)").getTime(),
			"user_id": this.state.userId
		}
		let userReport = await this.props.getLogsPerUser(formData);
		if (userReport) {
			this.setState({
				reportGotten: true,
				usersLog: {
					"name": this.capitalizeFirstLetter(this.props.userLogs.userScanLogs.user.firstName) + " " +
						this.capitalizeFirstLetter(this.props.userLogs.userScanLogs.user.lastName),
					"present": this.props.userLogs.userScanLogs.presentDays,
					"absent": this.props.userLogs.userScanLogs.absentDays,
					"hoursWorked": this.props.userLogs.userScanLogs.hours
				}
			});
			console.log(this.props.userLogs.userScanLogs)
		}
		else {
			alert("An error occured " + "\n" + "\n" + this.props.userLogs.error)
		}
	}

	closeReport = () => {
		this.setState({
			getReportSubmitted: false,
			reportGotten: false
		})
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

	waitForRefresh = (timeout) => {
		return new Promise(resolve => {
			setTimeout(resolve, timeout);
		});
	}

	_onRefresh = () => {
		this.setState({ refreshing: true });
		this.componentHasMounted();
		this.waitForRefresh(3000).then(() => {
			this.setState({ refreshing: false });
		});
	}

	render() {
		const { showStart, showEnd, startDate, endDate, mode, getReportSubmitted, reportGotten } = this.state;
		return (
			<ScrollView contentContainerStyle={{ justifyContent: "center", flex: 1 }}
				refreshControl={
					<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
				}>
				<View style={{ flex: 1 }}>
					<NavigationEvents onWillFocus={this.componentHasMounted} />
					{<View>
						<View style={{ display: "flex", margin: 3, justifyContent: 'center', marginVertical: "5%" }}>
							<Text style={{ textAlign: "center", color: "#800020", fontWeight: "bold", fontSize: 20 }}>
								Select start date and time
              </Text>
							<TouchableOpacity onPress={() => { this.datepicker("start") }} style={{
								marginVertical: "2%",
								textDecorationLine: "underline", padding: 3, textDecorationColor: "black", alignSelf: "center"
							}}>
								<Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
									{this.state.startDateText}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.timepicker("start") }} style={{
								padding: 3, alignSelf: "center"
							}}>
								<Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
									{this.state.startTimeText}
								</Text>
							</TouchableOpacity>
						</View>
						<Text style={{ textAlign: "center", color: "#800020", fontWeight: "bold", fontSize: 20 }}>Select end date and time</Text>
						<View style={{ display: "flex", margin: 3, justifyContent: 'center' }}>
							<TouchableOpacity onPress={() => { this.datepicker("end") }} style={{
								marginVertical: "2%",
								textDecorationLine: "underline", padding: 3, textDecorationColor: "black", alignSelf: "center"
							}}>
								<Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
									{this.state.endDateText}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => { this.timepicker("end") }} style={{
								padding: 3, alignSelf: "center"
							}}>
								<Text style={{ borderBottomColor: "black", borderBottomWidth: 1 }}>
									{this.state.endTimeText}
								</Text>
							</TouchableOpacity>
						</View>

						<Text style={{ textAlign: "center", color: "#800020", fontWeight: "bold", fontSize: 20, marginVertical: "5%" }}>Select user</Text>
						<Picker
							selectedValue={this.state.userId}
							style={{ height: "20%", width: "100%" }}
							onValueChange={(value) => {
								this.setState({ userId: value })
							}
							}>
							{this.state.users.map((user, index) => {
								return (
									<Picker.Item label={this.capitalizeFirstLetter(user.name)} value={user.id} key={user.id} />
								);
							})}
						</Picker>
						<TouchableOpacity style={styles.ButtonContainer} onPress={this.getReport}>
							<Text style={{ color: "white", textAlign: "center" }}>Get Report</Text>
						</TouchableOpacity>
					</View>


					}
					{showStart && <DateTimePicker value={startDate}
						mode={mode}
						is24Hour={true}
						display="default"
						onChange={this.setStartDate}
						maximumDate={new Date()}
					/>
					}
					{showEnd && <DateTimePicker value={endDate}
						mode={mode}
						is24Hour={true}
						display="default"
						onChange={this.setEndDate}
						maximumDate={new Date()}
					/>
					}
					{
						this.props.userLogs.loading && getReportSubmitted &&
						<View style={{ position: "absolute", backgroundColor: "rgba(0,0,0,0.1)", width: '100%', height: '100%' }}>
							<ActivityIndicator size="large" style={{ flex: 1 }} color="#800020" />
						</View>
					}
					{
						this.props.userLogs.success && reportGotten &&
						<View style={{ position: "absolute", backgroundColor: "rgba(0,0,0,0.2)", width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
							<Card style={{ backgroundColor: "#800020", elevation: 5, position: "absolute", width: "85%", borderRadius: 20 }}>
								<Card.Content>
									<TouchableOpacity onPress={this.closeReport}>
										<Paragraph style={{ color: "white", textAlign: "right", fontSize: 20 }}>X</Paragraph>
									</TouchableOpacity>
									<Title style={{ color: "white", fontSize: 25, padding: "2%" }}>{this.state.usersLog.name}</Title>
									<Paragraph style={{ color: "white", padding: "2%" }}>{"Number of Present Days: " + this.state.usersLog.present}</Paragraph>
									<Paragraph style={{ color: "white", padding: "2%" }}>{"Number of Absent Days: " + this.state.usersLog.absent}</Paragraph>
									<Paragraph style={{ color: "white", padding: "2%" }}>{"Number of Hours Worked: " + this.state.usersLog.hoursWorked}</Paragraph>
								</Card.Content>
							</Card>
						</View>
					}
				</View>
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
		marginTop: "3%"
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(UserScanLogsScreen);