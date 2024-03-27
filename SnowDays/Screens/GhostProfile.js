import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { getDoc, doc, getDocs, query, collection, where, onSnapshot } from 'firebase/firestore';
import FooterButtons from './FooterButtons';
import Post from '../CustomComponents/Post';
import { firestore, db } from '../firebase';
import { FontAwesome } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

const GhostProfile = ({ route }) => {
  const userInView = route.params.usertodisplay;
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewableItems, setViewableItems] = useState([]);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 25 // Adjust as needed
  }).current;

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    const viewableKeys = viewableItems.map(item => item.key);
    setViewableItems(viewableKeys);
  }, []);


  const [profileData, setProfileData] = useState({
    instagramHandle: '',
    emailAddress: '',
    bio: '',
    gnarPoints: '',
    profileImageUrl: '',
  });
  

  useEffect(() => {
    const fetchUserPosts = async () => {
      const postsQuery = query(collection(firestore, 'posts'), where('username', '==', userInView));
      const querySnapshot = await getDocs(postsQuery);
      const posts = [];

      for (const doc of querySnapshot.docs) {
        const postData = doc.data();
        const fileName = postData.filename;
        let imageUrl = "";
        if(fileName != ""){
          imageUrl = await getDownloadURL(storageRef(db, `content/${fileName}`));
        }

        posts.push({ id: doc.id, ...postData, imageUrl, timestamp: postData.timestamp });
      }

      setUserPosts(posts.reverse());
    };
    // Function to fetch profile and posts
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      
      // Fetch profile data
      const profileRef = doc(firestore, 'profiles', userInView);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const data = profileSnap.data();
        let profileImageUrl = '';
        if (data.profileImage) {
          profileImageUrl = await getDownloadURL(storageRef(db, `content/${data.profileImage}`));
        }
        setProfileData({
          instagramHandle: data.instagram,
          emailAddress: data.email,
          bio: data.bio,
          gnarPoints: data.gnarPoints,
          profileImageUrl,
        });
      } else {
        console.log("No such document!");
      }
  
      // Fetch user posts
      await fetchUserPosts(); // Assuming fetchUserPosts is refactored to an async function without useEffect
  
      setIsLoading(false);
    };
  
    fetchData();
  }, [userInView]);


  const renderPost = ({ item }) => (
    <Post
      key={item.id}
      id={item.id}
      imageUrl={item.imageUrl}
      description={item.text}
      usernameToDisplay={item.username}
      username={route.params.username}
      timestamp={item.timestamp}
      isInView={viewableItems.includes(item.id)}
    />
  )

  const test = () => {
    setIsLoading(false);
  }

  if(isLoading){
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@{userInView}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={profileData.profileImageUrl ? { uri: profileData.profileImageUrl } : null}
              onLoad={test}
            />
          </View>
          <View style={styles.textFieldsContainer}>
            <View style={styles.textFieldContainer}>
              <FontAwesome name="instagram" size={28} color="white" />
              <Text style={styles.textField}>{profileData.instagramHandle}</Text>
            </View>
            <View style={styles.textFieldContainer}>
              <FontAwesome name="envelope" size={26} color="white" />
              <Text style={styles.textField}>{profileData.emailAddress}</Text>
            </View>
            <View style={styles.textFieldContainer}>
              <FontAwesome name="star" size={26} color="white" />
              <Text style={styles.textField}>Gnar Points: {profileData.gnarPoints ? profileData.gnarPoints.toString() : '0'}</Text>
            </View>
          </View>
        </View>
      </View>
        <View style={styles.largeTextBoxContainer}>
          <TextInput style={styles.largeTextBox}>{profileData.bio} </TextInput>
        </View>
      <FlatList
        style={styles.postsContainer}
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialNumToRender={5}
      />
      <FooterButtons style={styles.footerButtons} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 40,
    marginRight: 30,
    marginLeft: 30,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 34,
    color: '#0173f9',
  },
  editButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: 55,
    alignItems: 'center',
  },
  edit: {
    color: 'black',
    fontSize: 16,
  },
  contentContainer: {
    marginTop: 30,
    marginRight: 30,
    marginLeft: 30,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    // Additional styling for image container
    marginRight: 5,
  },
  textFieldsContainer: {
    //marginLeft: -6,
    flex: 1,
    flexDirection: 'column',
  },
  textFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 13, // Increase the left margin to push the content to the right
    // You can also use paddingHorizontal if you want to add padding instead
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    color: 'white',
  },
  textField: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    color: 'white', // Ensure text is visible against the background
  },
  largeTextBoxContainer: {
    marginTop: 12,
    borderColor: 'white',
  },
  largeTextBox: {
    borderRadius: 10,
    borderBottomWidth: 1,
    padding: 10,
    minHeight: 20,
    maxHeight: 70,
    width: '100%',
    borderColor: 'white', // Keep the border color white as you have it
    color: 'white', // Keep the text color white for visibility
    margin: -10,
    fontSize: 16, // Adjust the font size as needed
    fontWeight: 'normal', // Choose 'bold', 'normal', etc., as desired
    textAlign: 'center', // You can adjust this to 'center' if you prefer
    lineHeight: 24, // Adjust the line height for better readability of multiline text
  },
  image: {
    width: 150, // Set the width of the image
    height: 150, // Set the height of the image
    resizeMode: 'cover', // Adjust the resizeMode based on your design needs
    marginLeft: -5,
  },
  postsContainer: {
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  
});

export default GhostProfile;
