import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
// Assuming FooterButtons and Post are your custom components
import FooterButtons from './FooterButtons'; 
import Post from '../CustomComponents/Post';
import { firestore } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

const HomeScreen = ({ navigation, route }) => {
  const [resortData, setResortData] = useState({});

  const fetchResortData = async (resortName) => {
    try {
      const resortDocRef = doc(firestore, 'resorts', resortName);
      const resortDocSnapshot = await getDoc(resortDocRef);
  
      if (resortDocSnapshot.exists()) {
        const resortInfo = resortDocSnapshot.data();
        setResortData(prev => ({...prev, [resortName]: resortInfo}));
      } else {
        console.log(`${resortName} document does not exist.`);
      }
    } catch (error) {
      console.error('Error fetching resort data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        // Your data fetching logic here
        const resorts = ['Copper', 'Winter Park', 'Eldora', 'Vail', 'Breckenridge', 'Keystone', 'Arapahoe Basin', 'Steamboat'];
        resorts.forEach(fetchResortData);
      };
  
      fetchData();
  
      return () => {
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SnowDays</Text>
        <TouchableOpacity
          style={styles.resortsButton}     
          onPress={() => navigation.navigate('Resorts', { resortData: resortData, username: route.params.username })}
        >
          <Text style={styles.resortsButtonText}>Resorts</Text>   
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.posts}>
      <Post imageUrl={require('../testProfileImage.png')} description={"The alignSelf property is used to align the image within its container. By setting it to 'center', it will center the image horizontally. The marginVertical property adds equal top and bottom margins, pushing the image away from the borders of the container, creating a little space as "}></Post>
      </ScrollView>
      <FooterButtons style={styles.footerButtons}/>
    </View>
  );
};

export default HomeScreen;  


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    // alignItems: 'center', // Remove this to allow header to use full width
    // justifyContent: 'center', // Adjust this as needed
  },
  header: {
    width: '100%', // Make sure header container uses full width
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Push the button and text to opposite sides
    alignItems: 'center', // Center items vertically
    paddingTop: 60, // Add padding at the top for status bar
    paddingBottom: 4, // Add padding at the bottom
    paddingHorizontal: 10, // Add some horizontal padding
  },
  headerTitle: {
    color: 'white',
    fontSize: 34, // Adjust the size as needed
    fontWeight: 'bold',
  },
  resortsButton: {
    backgroundColor: '#0173f9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resortsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  posts: {
    marginTop: 10, // Adjust the top margin to give space below the header
    alignContent: 'center',
  },
  });

  