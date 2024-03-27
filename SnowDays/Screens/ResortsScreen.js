import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FooterButtons from './FooterButtons'; 
import { firestore } from '../firebase.js';
import { getDoc, doc, getDocs, collection, updateDoc, arrayUnion, arrayRemove, onSnapshot} from 'firebase/firestore';
//import FooterButtons from './FooterButtons'; // Adjust the import path as needed

const ResortsScreen = ({route }) => {
    const navigation = useNavigation();
    const [resortData, setResortData] = useState([]) // Receive the pre-fetched data

    // State to keep track of users and membership status for each resort
    const [resortUsers, setResortUsers] = useState({
      'Copper': [],
      'Winter Park': [],
      'Eldora': [],
      'Vail': [],
      'Breckenridge': [],
      'Keystone': [],
      'Arapahoe Basin': [],
      'Steamboat': [],
    });
  
    // State to keep track of membership status for each resort
    const [membershipStatus, setMembershipStatus] = useState({
      'Copper': false,
      'Winter Park': false,
      'Eldora': false,
      'Vail': false,
      'Breckenridge': false,
      'Keystone': false,
      'Arapahoe Basin': false,
      'Steamboat': false,
    });

    useEffect(() => {
      const unsubscribeList = []; // To hold unsubscribe functions for each listener
    
      const fetchResortData = (resortName) => {
        const resortDocRef = doc(firestore, 'resorts', resortName);
    
        const unsubscribe = onSnapshot(resortDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const resortInfo = docSnapshot.data();
            setResortData(prev => ({...prev, [resortName]: resortInfo}));
          } else {
            console.log(`${resortName} document does not exist.`);
          }
        }, (error) => {
          console.error('Error fetching resort data:', error);
        });
    
        unsubscribeList.push(unsubscribe); // Add unsubscribe function to the list
      };
    
      const resorts = ['Copper', 'Winter Park', 'Eldora', 'Vail', 'Breckenridge', 'Keystone', 'Arapahoe Basin', 'Steamboat'];
      resorts.forEach(fetchResortData);
    
      // Cleanup function to unsubscribe from all listeners when the component unmounts
      return () => {
        unsubscribeList.forEach(unsubscribe => unsubscribe());
      };
    }, []);

    useEffect(() => {
      // Initialize your state here based on the passed resortData
      // This assumes resortData contains all necessary info
      // Adjust according to the actual structure of your data
      if (resortData) {
        // Process and set your state based on the received data
        Object.keys(resortData).forEach(resortName => {
          const usersArray = resortData[resortName].users || [];
          // Assuming you have a way to determine membership status, adjust as necessary
          // For example, if you need the username from route.params
          setResortUsers(prev => ({ ...prev, [resortName]: usersArray }));
          setMembershipStatus(prev => ({
            ...prev,
            [resortName]: usersArray.includes(route.params.username)
          }));
        });
      }
    }, [resortData]);
  
    const addUserToResort = async (resortName) => {
      try {
        const isUsernameUnique = Object.values(resortUsers).every(
          (resort) => !resort.includes(route.params.username)
        );
    
        if (isUsernameUnique) {
          const resortDocRef = doc(firestore, 'resorts', resortName);
          // Update local state to reflect the change
          setResortUsers((prevResortUsers) => ({
            ...prevResortUsers,
            [resortName]: [...prevResortUsers[resortName], route.params.username],
          }));
          setMembershipStatus((prevMembershipStatus) => ({
            ...prevMembershipStatus,
            [resortName]: true,
          }));
          await updateDoc(resortDocRef, {
            users: arrayUnion(route.params.username),
          });
        } else {
          alert('Username already exists in another resort.');
        }
      } catch (error) {
        console.error('Error adding user to resort:', error);
      }
    };
    
  
    const removeUserFromResort = async (resortName) => {
      try {
        const resortDocRef = doc(firestore, 'resorts', resortName);
        setResortUsers((prevResortUsers) => ({
          ...prevResortUsers,
          [resortName]: prevResortUsers[resortName].filter((user) => user !== route.params.username),
        }));
        setMembershipStatus((prevMembershipStatus) => ({
          ...prevMembershipStatus,
          [resortName]: false,
        }));
        await updateDoc(resortDocRef, {
          users: arrayRemove(route.params.username),
        });
      } catch (error) {
        console.error('Error removing user from resort:', error);
      }
    };


    const renderResortItem = (resortName) => (
      <View key={resortName} style={styles.resortContainer}>
        <View style={styles.resortHeader}>
          <Text style={styles.resortName}>{resortName}</Text>
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
        <View style={styles.userNameContainer}>
          {resortUsers[resortName].map((user) => (
            <TouchableOpacity key={`${resortName}-${user}`} onPress={() => navigation.navigate('GhostProfile', { ...route.params, usertodisplay: user })}>
              <Text style={styles.userName}>
                @{user}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
    
  
    const renderButtonLabel = (resortName) => {
      return membershipStatus[resortName] ? 'Leave' : 'Join';
    };
  
    return (
      <View style={styles.container}>
        {/* Header container */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ski Directory</Text>
        </View>
        <ScrollView contentContainerStyle={styles.ScrollContainer}>
          <View style={styles.resortsListContainer}>
            {Object.keys(resortUsers).map((resortName) => renderResortItem(resortName))}
          </View>
        </ScrollView>
        <FooterButtons/>
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
    width: '100%', // Ensure the ScrollView takes up full width
  },
  resortsListContainer: {
    width: '100%', // Ensure the container takes up full width
    alignItems: 'center', // Center the resort containers
    marginBottom: 200
  },
  resortContainer: {
    backgroundColor: 'white',
    width: '90%', // Adjust width as necessary, e.g., 90% of the screen width
    marginTop: 20,
    borderRadius: 7,
    padding: 10,
    alignSelf: 'center',
    // Add shadow or other styling to match your screenshot
  },
  resortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Add space between header and username list
  },
  resortName: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
  },
  userNameContainer: {
    // This will hold the list of usernames
  },
  userName: {
    color: '#0173f9', // The username color
    fontWeight: 'bold',
    // Add margins for spacing if needed
  },
  resortButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5, // Rounded corners of the button
    borderColor: 'black', // Color of the border
    borderWidth: 1, // Width of the border, making it visible
    backgroundColor: 'white', // Button background color
  },
  resortButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});




