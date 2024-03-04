import React, { useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore, db } from '../firebase';
import { doc, onSnapshot, query, collection, where, orderBy, getDoc, updateDoc, setDoc} from 'firebase/firestore';
import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage'
import ProfilePost from '../CustomComponents/ProfilePost';
import FooterButtons from './FooterButtons';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ route }) => {
  const [editable, setEditable] = useState(false);
  const [fetchedPostsProfile, setFetchedPostsProfile] = useState([]);
  const [profileData, setProfileData] = useState({
    instagramHandle: '',
    emailAddress: '',
    bio: '',
    gnarPoints: '',
    profileImageUrl: '',
  });
  

  useEffect(() => {
    // Assuming firestore, route.params.username, db are defined elsewhere in your component
    const profileRef = doc(firestore, 'profiles', route.params.username);
  
    const unsubscribeProfile = onSnapshot(profileRef, async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // If profileImage is present, extract the filename and fetch the URL
        let profileImageUrl = '';
        if (data.profileImage) {
          profileImageUrl = await getDownloadURL(ref(db, `content/${data.profileImage}`));
        }
  
        // Update state with the new profile data
        setProfileData({
          instagramHandle: data.instagram,
          emailAddress: data.email,
          bio: data.bio,
          gnarPoints: data.gnarPoints,
          profileImageUrl, // Use the fetched or default empty string
        });

      }
    });
  
    // Cleanup function to unsubscribe from the profile observer when the component unmounts
    return () => unsubscribeProfile();
  }, []); // Empty dependency array means this effect runs only once on mount
  
  

  useEffect(() => {
    const postsRef = query(collection(firestore, 'posts'), where('username', '==', route.params.username));
    const unsubscribePosts = onSnapshot(postsRef, async (querySnapshot) => {
      const postsPromises = querySnapshot.docs.map(async (doc) => {
        const postData = doc.data();
        let imageUrl = ''; // Assume no image URL initially
        // Fetch the image URL if a filename is provided
        if (!postData.timestamp) {
          return null;
        }
        if (postData.filename) {
          imageUrl = await getDownloadURL(ref(db, `content/${postData.filename}`));
        }

        return {
          id: doc.id,
          ...postData,
          imageUrl, // Include the imageUrl in the postData
        };
      });

      // Resolve all promises to get posts with their images
      const postsWithImages = await Promise.all(postsPromises);

      // Optionally, sort the posts by timestamp if needed
      const sortedPosts = postsWithImages.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      setFetchedPostsProfile(sortedPosts.filter(post => post !== null));
    });

    return () => {
      unsubscribePosts();
    }
  }, [])
  

  const handleEditPress = () => {
    setEditable(!editable);
  };

  const handleSave = async () => {
    // Toggle back to "Edit" mode after saving
    setEditable(false);

    // Upload new profile image if available
    if (media) {
      const fileUri = media.assets[0].uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      updatedPrevImage = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const imageRef = ref(db, `content/${updatedPrevImage}`);
      await uploadBytesResumable(imageRef, blob);
    }
  
    const userDocRef = doc(collection(firestore, 'profiles'), route.params.username);
    
    try {
      // Check if the user profile already exists
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        // Update user profile fields in Firestore
        await updateDoc(userDocRef, {
          instagram: profileData.instagramHandle,
          email: profileData.emailAddress,
          profileImage: updatedPrevImage, // Assuming the profile image is stored as a field named 'profileImage'
          bio: profileData.bio
        });
  
        alert('Profile successfully updated!');
      } else {
        // Create a new user profile
        await setDoc(userDocRef, {
          instagram: profileData.instagramHandle,
          email: profileData.emailAddress,
          profileImage: updatedPrevImage, // Assuming the profile image is stored as a field named 'profileImage'
          gnarPoints: 0,
          bio: profileData.bio
        });
        alert('Profile successfully updated!');
      }
    } catch (error) {
      alert('Error updating/creating profile. Please try again.' + error);
    }
  };


  const [media, setMedia] = useState(null); // Add media state

  useEffect(() => {
    // Request permission to access the photo library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setMedia(result); 
        setProfileData({...profileData, profileImageUrl: result.assets[0].uri});
        console.log("Image/Video uploaded successfully!");
      }
    } catch (error) {
      console.error('Error picking an image or video', error);
    }
  };

  const renderPost = ({ item }) => (
    <ProfilePost
      key={item.id}
      id={item.id}
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
        <Text style={styles.username}>@{route.params.username}</Text>
        <TouchableOpacity style={styles.editButton} onPress={editable ? handleSave : handleEditPress}>
          <Text style={styles.edit}>{editable ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          {/* Image space */}
          <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={profileData.profileImageUrl ? { uri: profileData.profileImageUrl } : null}
          />
            {editable && (
              <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Three text fields */}
          <View style={styles.textFieldsContainer}>
            <View style={styles.textFieldContainer}>
            <FontAwesome name="instagram" size={28} color="white" />
              <TextInput
                style={styles.textField}
                placeholder="Instagram Handle"
                editable={editable}
                placeholderTextColor="grey" // Make sure the placeholder is visible
                autoCapitalize='none'
                value={profileData.instagramHandle}
                onChangeText={(text) => setProfileData({...profileData, instagramHandle: text})}
              />
            </View>
            <View style={styles.textFieldContainer}>
            <FontAwesome name="envelope" size={26} color="white" />
              <TextInput
                style={styles.textField}
                placeholder="Email Address"
                editable={editable}
                placeholderTextColor="grey" // Make sure the placeholder is visible
                autoCapitalize='none'
                value={profileData.emailAddress}
                onChangeText={(text) => setProfileData({...profileData, emailAddress: text})}
              />
            </View>
            <View style={styles.textFieldContainer}>
              <FontAwesome name="star" size={26} color="white" />
              <TextInput
                style={styles.textField} // Since this field is not editable, you might want to indicate this or leave it empty
                editable={false}
                placeholderTextColor="grey" // Make sure the placeholder is visible
                value={profileData.gnarPoints.toString()}
              />
            </View>
          </View>
        </View>
        {/* Large text box */}
        <View style={styles.largeTextBoxContainer}>
          <TextInput
            style={styles.largeTextBox}
            multiline
            editable={editable}
            placeholder="Write your bio or personal message here"
            placeholderTextColor="grey" // Make sure the placeholder is visible
            autoCapitalize="none"
            value={profileData.bio}
            onChangeText={(text) => setProfileData({...profileData, bio: text})}
          />
        </View>
      </View>
      <FlatList style={styles.postsContainer}
        data={fetchedPostsProfile}
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
    backgroundColor: 'black',
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
    marginLeft: 25, // Increase the left margin to push the content to the right
    // You can also use paddingHorizontal if you want to add padding instead
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  textField: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    color: 'white', // Ensure text is visible against the background
  },
  largeTextBoxContainer: {
    marginTop: 20,
  },
  largeTextBox: {
    borderWidth: 1,
    padding: 10,
    minHeight: 50,
    maxHeight: 100,
    borderColor: 'white', // Change border color to white
    color: 'white', // Add this to ensure text inside the box is visible
    margin: -10,
  },
  image: {
    width: 150, // Set the width of the image
    height: 150, // Set the height of the image
    resizeMode: 'cover', // Adjust the resizeMode based on your design needs
  },
  postsContainer: {
    margin: 20,
    marginBottom: 60
  },
  uploadButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;



