import React from 'react'
import {StyleSheet} from 'react-native';

export default function index({name, age}) {
    return (
      <div textStyle={styles.textStyles}>
        <p>
          <span>Name: </span>
          <span>{name}</span>
        </p>
        <p>
          <span>Age: </span>
          <span>{age}</span>
        </p>
      </div>
    );
}

const styles = StyleSheet.create({
  textStyles: {
    margin: 10,
    color: 'white',
    paddingLeft: 20,
    paddingTop: 10,
    width: '100%',
  },
});
