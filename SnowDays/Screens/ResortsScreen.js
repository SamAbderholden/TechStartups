import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
//import FooterButtons from './FooterButtons'; // Adjust the import path as needed

const ResortsScreen = ({ navigation, route }) => {
    const { username } = route.params;
  
    // State to keep track of users and membership status for each resort
    const [resortUsers, setResortUsers] = useState({
      'Eldora': [],
      'Copper': [],
      'Winter Park': [],
    });
  
    // State to keep track of membership status for each resort
    const [membershipStatus, setMembershipStatus] = useState({
      'Eldora': false,
      'Copper': false,
      'Winter Park': false,
    });
    const renderResortItem = (resortName) => (
      <View style={styles.resortNameContainer}>
        <Text style={styles.resortName}>{resortName}</Text>
        <View style={styles.userNameContainer}>
            {resortUsers[resortName].map((user) => (
              <Text key={`${resortName}-${user}`} style={styles.userName}>
                @{user}
              </Text>
            ))}
          </View>
        <TouchableOpacity
          style={styles.resortButtonContainer}
          onPress={() => {
            if (membershipStatus[resortName]) {
              removeUserFromResort(resortName);
            } else {
              addUserToResort(resortName);
            }
          }}
        >
          <Text style={styles.resortButtonText}>{renderButtonLabel(resortName)}</Text>
        </TouchableOpacity>
      </View>
    );
  
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
            {Object.keys(resortUsers).map((resortName) => renderResortItem(resortName))}
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
  resortNameContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: 380,
    marginTop: 20, // Add margin for the first resort
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 100,
    borderRadius: 7,
    marginLeft: 5,
  },
  resortName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userNameContainer: {
    justifyContent: 'center', // Center username text vertically if needed
    alignItems: 'center', // Center username text horizontally
    padding: 10,
    borderRadius: 15,
  },
  userName: {
    color: '#0173f9',
    fontWeight: 'bold',
  },
  resortButtonContainer: {
    alignItems: 'right',
    backgroundColor: 'white',
    padding: 9,
    borderRadius: 5, // Rounded corners of the button
    borderColor: 'black', // Color of the border
    borderWidth: 1, // Width of the border, making it visible
    marginRight: 5,
  },
  resortButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },



});
