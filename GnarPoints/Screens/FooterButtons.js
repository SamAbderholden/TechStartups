// FooterButtons.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const FooterButtons = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateOrReplace = (screenName) => {
    if (route.name !== screenName) {
      navigation.replace(screenName, { username: route.params.username });
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Home')}>
        <FontAwesome name="home" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Create')}>
        <FontAwesome name="plus" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Profile')}>
        <FontAwesome name="user" size={35} color="black" />
      </TouchableOpacity>
    </View>
  );
};



export default FooterButtons;


const styles = StyleSheet.create({
    resortContainer: {
      alignItems: 'center',
      paddingVertical: 20, // Adjust as needed
    },
    resortsContainer: {
      marginTop: 90
    },
    resort: {
      backgroundColor: 'black',
      width: 400,
      marginTop: 20, // Add margin for the first resort
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      height: 100,
      borderRadius: 5,
    },
    boldResortName: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
    },
    resortButton: {
      backgroundColor: 'gray',
      padding: 10,
      borderRadius: 5,
    },
    people: {
      marginTop: 10, // Add margin to separate from the resort name
      padding: 10,
      borderRadius: 5,
    },
    person: {
      color: 'black',
      marginBottom: 5,
    },
    buttonText: {
      color: 'white',
    },
    resortsButton: {
      position: 'absolute',
      top: 60,
      right: 20,
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginBottom: 20,
      width: 200,
    },
    button: {
      backgroundColor: 'black',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    uploadButton: {
      backgroundColor: 'black', // Change color as needed
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    buttons: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      paddingBottom: 26,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      color: 'black',
      marginLeft: 10,
    },
  });
  