import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
//import FooterButtons from './FooterButtons'; // Adjust the import path as needed

const ResortsScreen = ({ navigation, route }) => {
    const { username } = route.params;
  
    // State to keep track of users and membership status for each resort
    const [resortUsers, setResortUsers] = useState({
      Eldora: [],
      Copper: [],
      'Winter Park': [],
    });
  
    // State to keep track of membership status for each resort
    const [membershipStatus, setMembershipStatus] = useState({
      Eldora: false,
      Copper: false,
      'Winter Park': false,
    });
  
    const addUserToResort = (resortName) => {
      const isUsernameUnique = Object.values(resortUsers).every(
        (resort) => !resort.includes(username)
      );
  
      if (isUsernameUnique) {
        const updatedResortUsers = { ...resortUsers };
        updatedResortUsers[resortName] = [...updatedResortUsers[resortName], username];
  
        const updatedMembershipStatus = { ...membershipStatus };
        updatedMembershipStatus[resortName] = true;
  
        setResortUsers(updatedResortUsers);
        setMembershipStatus(updatedMembershipStatus);
      } else {
        alert('Username already exists in another resort.');
      }
    };
  
    const removeUserFromResort = (resortName) => {
      const updatedResortUsers = { ...resortUsers };
      const updatedMembershipStatus = { ...membershipStatus };
  
      updatedResortUsers[resortName] = updatedResortUsers[resortName].filter(
        (user) => user !== username
      );
  
      updatedMembershipStatus[resortName] = false;
  
      setResortUsers(updatedResortUsers);
      setMembershipStatus(updatedMembershipStatus);
    };
  
    const renderButtonLabel = (resortName) => {
      return membershipStatus[resortName] ? 'Leave' : 'Join';
    };
  
    return (
      <View style={styles.container}>
      {/* Header container */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ski Directory</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home', { username })}
        >
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.ScrollContainer}>
        <View style={styles.resortsListContainer}> 
          <View style={styles.resortItemContainer}>
              <Text style={styles.resortName}>Eldora</Text>
            <View style={styles.userNameContainer}>
              {resortUsers['Eldora'].map((user, index) => (
                <Text key={index} style={styles.userName}>
                  @{user}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.resortButton}
              onPress={() => {
                if (membershipStatus['Eldora']) {
                  removeUserFromResort('Eldora');
                } else {
                  addUserToResort('Eldora');
                }
              }}
            >
              <Text style={styles.resortButtonText}>{renderButtonLabel('Eldora')} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resortItemContainer}>
            <Text style={styles.resortName}>Copper</Text>
            <View style={styles.userNameContainer}>
              {resortUsers['Copper'].map((user, index) => (
                <Text key={index} style={styles.userName}>
                  @{user}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.resortButton}
              onPress={() => {
                if (membershipStatus['Copper']) {
                  removeUserFromResort('Copper');
                } else {
                  addUserToResort('Copper');
                }
              }}
            >
              <Text style={styles.resortButtonText}>{renderButtonLabel('Copper')} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resortItemContainer}>
            <Text style={styles.resortName}>Winter Park</Text>
            <View style={styles.userNameContainer}>
              {resortUsers['Winter Park'].map((user, index) => (
                <Text key={index} style={styles.userName}>
                  @{user}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.resortButton}
              onPress={() => {
                if (membershipStatus['Winter Park']) {
                  removeUserFromResort('Winter Park');
                } else {
                  addUserToResort('Winter Park');
                }
              }}
            >
              <Text style={styles.resortButtonText}>{renderButtonLabel('Winter Park')} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
    );
  };

export default ResortsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Adjust this for status bar height
    paddingHorizontal: 10, // Add some horizontal padding
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#0173f9',
    padding: 10,
    borderRadius: 5,
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ScrollContainer: {
    alignItems: 'center',
  },
  resortsListContainer: { //container for all the resort items
    marginTop: 20,
  },
  resortItemContainer: {
    backgroundColor: 'white',
    width: 400,
    marginTop: 20, // Add margin for the first resort
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 100,
    borderRadius: 5,
  },
  resortName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resortButton: {     //button to join or leave the resort
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5, // Rounded corners of the button
    borderColor: 'black', // Color of the border
    borderWidth: 1, // Width of the border, making it visible
  },
  resortButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  userNameContainer: {
    flex: 1,
    justifyContent: 'center', // Center username text vertically if needed
    alignItems: 'center', // Center username text horizontally
    padding: 10,
    borderRadius: 15,
  },
  userName: {
    color: '#0173f9',
    fontWeight: 'bold',
  },


});
