import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import FooterButtons from './FooterButtons'; 
import Post from '../CustomComponents/Post';
import { firestore, db } from '../firebase';
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDownloadURL, ref } from "firebase/storage";

const HomeScreen = ({ navigation, route }) => {
  const [resortData, setResortData] = useState({});
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [fetchedPostIds, setFetchedPostIds] = useState([]);

  const fetchPosts = async () => {
    try {
      const postsCollectionRef = collection(firestore, 'posts');
      const querySnapshot = await getDocs(postsCollectionRef);
      const posts = [];

      for (const doc of querySnapshot.docs) {
        const postData = doc.data();
        const fileName = postData.filename; // Assuming the filename is stored in the 'filename' field of each post
        let imageUrl = "";
        if(fileName != ""){
          imageUrl = await getDownloadURL(ref(db, `content/${fileName}`));
        }
        posts.push({ id: doc.id, ...postData, imageUrl, username: postData.username});
      }

      setFetchedPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    // Load fetched posts from AsyncStorage when component mounts
    loadFetchedPosts();
    // Fetch fresh posts from Firestore
    fetchPosts();
  }, []);

  // Function to load fetched posts from AsyncStorage
  const loadFetchedPosts = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem('fetchedPosts');
      if (storedPosts) {
        setFetchedPosts(JSON.parse(storedPosts));
      }
    } catch (error) {
      console.error('Error loading fetched posts from AsyncStorage:', error);
    }
  };

  // Function to save fetched posts to AsyncStorage
  const saveFetchedPosts = async (posts) => {
    try {
      await AsyncStorage.setItem('fetchedPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving fetched posts to AsyncStorage:', error);
    }
  };

  // Call saveFetchedPosts whenever fetchedPosts state changes
  useEffect(() => {
    saveFetchedPosts(fetchedPosts);
  }, [fetchedPosts]);

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
      {fetchedPosts.map(post => (
          <Post key={post.id} imageUrl={post.imageUrl} description={post.text} username={post.username} navigation={navigation}/>
        ))}
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
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 4,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 34,
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
    marginTop: 10,
    marginBottom: 50,
    alignContent: 'center',
  },
});
