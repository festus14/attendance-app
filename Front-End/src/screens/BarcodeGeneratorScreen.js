import React from 'react';
import { View, Text, ActivityIndicator } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { connect } from 'react-redux';
import { getNewBarcodeString } from '../actions/index';


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
            doNotFetchBarcode: false
        }
    }

    async componentDidMount() {
        if (!this.state.doNotFetchBarcode) {
            let barcodeString = await this.props.getBarcodeString();
            if (barcodeString) {
                console.log(this.props.barcodeString.barcodeString.barString)
                await this.setState({
                    barcodeString: this.props.barcodeString.barcodeString.barString,
                    doNotFetchBarcode: true
                });
            }
            else {
                alert("An error occured, please check your network and try again.")
            }
        }

        // setInterval(async () => {
        //     let barcodeString = await this.props.getBarcodeString();
        //     if (barcodeString) {
        //         if (this.props.barcodeString.barcodeString.barString !== this.state.barcodeString) {
        //             await this.setState({
        //                 barcodeString: this.props.barcodeString.barcodeString.barString,
        //             });
        //         }
        //     }
        //     else {
        //         alert("An error occured, please check your network and try again")
        //     }
        // }, 10000);

    }

    render() {
        return (
            <View style={{ margin: "10%", flex: 1 }}>
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
                        <Text style={{ fontSize: 21, color: '#800020', alignSelf: "center", textAlign: "center" }}>{this.props.barcodeString.error.toString() + ", please try again."}</Text>
                    </View>
                }
            </View>
        );
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BarcodeGeneratorScreen);
