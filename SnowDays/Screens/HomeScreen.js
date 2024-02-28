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
      <TouchableOpacity
        style={styles.resortsButton}     
        onPress={() => navigation.navigate('Resorts', { username: route.params.username })}
      >
        <Text style={styles.resortsButtonText}>Resorts</Text>   
      </TouchableOpacity>
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
      alignItems: 'center',
      justifyContent: 'center',
    },
    resortsButton: {
      position: 'absolute',
      top: 60,
      right: 20,
      backgroundColor: '#0173f9',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    resortsButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    posts: {
      marginTop: 110,
    }
  });

  