import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FooterButtons from './FooterButtons'; 
import Post from '../CustomComponents/Post';
import { ScrollView } from 'react-native-gesture-handler';




const HomeScreen = ({ navigation, route }) => (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.resortsButton}
        onPress={() => navigation.navigate('Resorts', { username: route.params.username })}
      >
        <Text style={{ color: 'white' }}>Resorts</Text>
      </TouchableOpacity>
      <ScrollView style={styles.posts}>
        <Post imageUrl={require('../testProfileImage.png')} description={"bruh"}></Post>
      </ScrollView>
      <FooterButtons />
    </View>
  );


export default HomeScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
    posts: {
      marginTop: 110,
    }
  });

  