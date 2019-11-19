import React, { Component } from 'react';
import {View, Text} from "react-native";
import QRCode from 'react-native-qrcode-svg';


export default class BarcodeGeneratorScreen extends Component {
    render() {
        return (
            <View style={{margin: "10%"}}>
                <Text style={{color: "#800020",  marginBottom: "20%", fontWeight:"bold", fontSize: 30}}>Scan this barcode</Text>
                <QRCode
                    size={300}
                    value="5"
                />
            </View>
        );
    };
}