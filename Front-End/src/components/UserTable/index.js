import React from 'react'
import {StyleSheet, Text, View} from 'react-native';

export default function index({firstName, lastName, email, gender, roles}) {
    return (
      <View style={styles.textContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.textStyles}>
            Name: {firstName} {lastName}
          </Text>
        </View>
        <View>
          <Text style={styles.textStyles}>Email: {email}</Text>
        </View>
        <View>
          <Text style={styles.textStyles}>Gender: {gender}</Text>
        </View>
        <View>
          <Text style={styles.textStyles}>Role: {gender}</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  textStyles: {
    color: 'white',
    marginBottom: '3%',
    width: '100%',
    fontSize: 14,
    display: 'flex'
  },
});
