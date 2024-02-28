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
      <ScrollView contentContainerStyle={styles.resortContainer}>
        <TouchableOpacity
          style={styles.resortsButton}
          onPress={() => navigation.navigate('Home', { username })}
        >
          <Text style={{ color: 'white' }}>Home</Text>
        </TouchableOpacity>
        <View style={styles.resortsContainer}> 
          <View style={styles.resort}>
            <Text style={styles.boldResortName}>Eldora</Text>
            <View style={styles.people}>
              {resortUsers['Eldora'].map((user, index) => (
                <Text key={index} style={{ color: 'white' }}>
                  {user}
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
              <Text style={styles.buttonText}>{renderButtonLabel('Eldora')} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resort}>
            <Text style={styles.boldResortName}>Copper</Text>
            <View style={styles.people}>
              {resortUsers['Copper'].map((user, index) => (
                <Text key={index} style={{ color: 'white' }}>
                  {user}
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
              <Text style={styles.buttonText}>{renderButtonLabel('Copper')} </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resort}>
            <Text style={styles.boldResortName}>Winter Park</Text>
            <View style={styles.people}>
              {resortUsers['Winter Park'].map((user, index) => (
                <Text key={index} style={{ color: 'white' }}>
                  {user}
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
              <Text style={styles.buttonText}>{renderButtonLabel('Winter Park')} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  export default ResortsScreen;


const styles = StyleSheet.create({
  resortContainer: {
    alignItems: 'center',
    paddingVertical: 20, // Adjust as needed
  },
  resortsContainer: {
    marginTop: 90,
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
});
