import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FooterButtons from './FooterButtons'; 
import Post from '../CustomComponents/Post';
import { ScrollView } from 'react-native-gesture-handler';

{/* <TouchableOpacity style={styles.inputButton} onPress={handleLogin}>
<Text style={styles.inputButtonText}>Log In</Text>
</TouchableOpacity> */}


const HomeScreen = ({ navigation, route }) => (
  <View style={styles.container}>
    {/* Header container */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>SnowDays</Text>
      <TouchableOpacity
        style={styles.resortsButton}     
        onPress={() => navigation.navigate('Resorts', { username: route.params.username })}
      >
        <Text style={styles.resortsButtonText}>Resorts</Text>   
      </TouchableOpacity>
    </View>

    <ScrollView style={styles.posts}>
        <Post imageUrl={require('../testProfileImage.png')} description={"bruh"}></Post>
    </ScrollView>
    <FooterButtons style={styles.footerButtons}/>
  </View>
);


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
    paddingTop: 40, // Add padding at the top for status bar
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
  },
  });

  