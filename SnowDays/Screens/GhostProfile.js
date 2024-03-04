import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { getDoc, doc, getDocs, query, collection, where, onSnapshot } from 'firebase/firestore';
import FooterButtons from './FooterButtons';
import Post from '../CustomComponents/Post';
import { firestore, db } from '../firebase';

const GhostProfile = ({ route }) => {
  const userInView = route.params.usertodisplay;
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


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

      setUserPosts(posts);
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
    />
  );
  if(isLoading){
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
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
            />
          </View>
          <View style={styles.textFieldsContainer}>
            <View style={styles.textFieldContainer}>
              <Text style={styles.label}>Instagram:</Text>
              <Text style={styles.textField}>{profileData?.instagramHandle}</Text>
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.textField}>{profileData?.emailAddress}</Text>
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={styles.label}>Gnar Points:</Text>
              <Text style={styles.textField}>{profileData?.gnarPoints}</Text>
            </View>
          </View>
        </View>
        <View style={styles.textFieldContainer}>
              <Text style={styles.textField}>{profileData?.bio}</Text>
        </View>
      </View>
      <FlatList style={styles.postsContainer}
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.posts}
      />
      <FooterButtons style={styles.footerButtons} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 60,
    marginRight: 30,
    marginLeft: 30,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  editBt: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  edit: {
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    marginTop: 50,
    marginRight: 30,
    marginLeft: 30,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    // Additional styling for image container
    marginRight: 10,
  },
  textFieldsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  textFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  textField: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
  },
  largeTextBoxContainer: {
    marginTop: 20,
  },
  largeTextBox: {
    borderWidth: 1,
    padding: 10,
    minHeight: 100,
    // Additional styling for large text box
  },
  image: {
    width: 150, // Set the width of the image
    height: 150, // Set the height of the image
    resizeMode: 'cover', // Adjust the resizeMode based on your design needs
  },
  postsContainer: {
    margin: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GhostProfile;
