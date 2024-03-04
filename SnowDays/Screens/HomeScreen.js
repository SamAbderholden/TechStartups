import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import FooterButtons from './FooterButtons'; 
import Post from '../CustomComponents/Post';
import { firestore, db } from '../firebase';
import { getDoc, doc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref } from "firebase/storage";

const HomeScreen = ({route}) => {
  const navigation = useNavigation();
  const [resortData, setResortData] = useState({});
  const [fetchedPosts, setFetchedPosts] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(firestore, 'posts');
    const q = query(postsCollectionRef, orderBy('timestamp', 'desc'));
  
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      console.log("stuff");
      const postsPromises = querySnapshot.docs.map(async (doc) => {
        const postData = doc.data();
        if (!postData.timestamp) {
          return null;
        }
        console.log(postData);
        let imageUrl = ''; // Assume no image URL initially
        // Check if filename exists and attempt to fetch the image URL only if needed
        if (postData.filename) {
          // Attempt to use a cached imageUrl from the existing state if available
          const existingPost = fetchedPosts.find(p => p.id === doc.id);
          if (existingPost && existingPost.imageUrl) {
            imageUrl = existingPost.imageUrl; // Use the cached imageUrl
          } else {
            // Fetch new imageUrl since it's either not cached or this is a new post
            imageUrl = await getDownloadURL(ref(db, `content/${postData.filename}`));
          }
        }
  
        return {
          id: doc.id,
          ...postData,
          imageUrl, // Set the imageUrl, whether it was newly fetched or reused from cache
          timestamp: postData.timestamp
        };
      });
  
      // Resolve all promises to get the posts with their images
      const postsWithImages = await Promise.all(postsPromises);
  
      // Update the state with the new posts array
      setFetchedPosts(postsWithImages.filter(post => post !== null));
    });
  
    return () => unsubscribe(); // Detach listener when the component unmounts
  }, []);


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

  useEffect(() => {
    const fetchData = async () => {
      // Your data fetching logic here
      const resorts = ['Copper', 'Winter Park', 'Eldora', 'Vail', 'Breckenridge', 'Keystone', 'Arapahoe Basin', 'Steamboat'];
      resorts.forEach(fetchResortData);
    };

    fetchData();
  }, []);

  const renderPost = ({ item }) => (
    <Post
      key={item.id}
      imageUrl={item.imageUrl}
      description={item.text}
      usernameToDisplay={item.username}
      username={route.params.username}
      timestamp={item.timestamp}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SnowDays</Text>
        <TouchableOpacity
          style={styles.resortsButton}     
          onPress={() => navigation.navigate('Resorts', {username: route.params.username, resortData: resortData })}
        >
          <Text style={styles.resortsButtonText}>Resorts</Text>   
        </TouchableOpacity>
      </View>
      <FlatList style={styles.posts}
        data={fetchedPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.posts}
      />
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
    marginBottom: 70,
    alignContent: 'center',
  },
});
