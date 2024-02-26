import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FooterButtons from './FooterButtons'; // Adjust the import path as needed

const ProfileScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Welcome to Profile, {route.params.username}!</Text>
      <FooterButtons />
    </View>
  );
};


export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  