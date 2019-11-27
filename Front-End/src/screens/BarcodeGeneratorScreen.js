import React from 'react';
import { View, Text, ActivityIndicator } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import { getNewBarcodeString } from '../actions/index';
import { getErrorMessage } from "../actions/errorMessages";
import SockJsClient from 'react-stomp';
import { APIURL } from "../utility/config";
import { getToken } from "../actions/AuthAction";


const mapDispatchToProps = dispatch => {
    return {
        getBarcodeString: () => {
            return dispatch(getNewBarcodeString('barcode/current', 'get'))
        }
    }
}

const mapStateToProps = state => ({
    barcodeString: state.getBarcodeString
})

class BarcodeGeneratorScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            barcodeString: " ",
            doNotFetchBarcode: false,
            clientRef: null,
            barcodeMessage: {},
            token: ""
        }
    }


    async componentDidMount() {
        let token = await dispatch(await getToken());
        this.setState({
            token: token
        })
        if (!this.state.doNotFetchBarcode) {
            let barcodeString = await this.props.getBarcodeString();
            if (barcodeString) {
                await this.setState({
                    barcodeString: this.props.barcodeString.barcodeString.barString,
                    doNotFetchBarcode: true
                });
            }
            else {
                alert("An error occured, please check your network and try again.")
            }
        }
    }

    handleMessage = async (message) => {
        await this.setState({
            barcodeMessage: message,
            barcodeMessageChanged: true,
            barcodeString: message.barString
        });
    }

    render() {
        return (
            <View style={{ margin: "10%", flex: 1 }}>
                <SockJsClient
                    url={APIURL + "attendance-websocket/"}
                    topics={['/topics/latest-barcode']}
                    onConnect={console.log("Connection established!")}
                    onDisconnect={console.log("Disconnected!")}
                    onMessage={(message) => this.handleMessage(message)}
                    debug={true}
                    ref={(client) => {
                        this.state.clientRef = client;
                    }}
                    autoReconnect={false}
                    headers={{
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                        'Access-Control-Allow-Credentials': true,
                        'Content-Type': 'application/json',
                        'Cross-Origin': true,
                        'Accept': 'application/json',
                        'CORS': true,
                        'Authorization': "Bearer " + this.state.token
                    }}
                />
                {
                    this.props.barcodeString.loading && <View>
                        <Text style={{ color: "#800020", marginBottom: "20%", fontWeight: "bold", fontSize: 30 }}>Loading barcode to scan</Text>
                        <ActivityIndicator size="large" style={{ flex: 1 }} color="#800020" />
                    </View>

                }
                {
                    this.props.barcodeString.success && <View>
                        <Text style={{ color: "#800020", marginBottom: "20%", fontWeight: "bold", fontSize: 30 }}>Scan this barcode</Text>
                        <QRCode
                            size={300}
                            value={this.state.barcodeString}
                        />
                    </View>
                }
                {
                    this.props.barcodeString.error !== null && this.props.barcodeString.loading === false && this.props.barcodeString.error !== undefined &&
                    <View style={{ justifyContent: "center", marginVertical: "60%" }}>
                        <Text style={{ fontSize: 21, color: '#800020', alignSelf: "center", textAlign: "center" }}>{getErrorMessage(this.props.barcodeString.error.toString()) + ", please try again."}</Text>
                    </View>
                }
            </View>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeGeneratorScreen);
