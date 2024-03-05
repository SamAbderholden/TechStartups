import React, { useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    instagramHandle: '',
    emailAddress: '',
    bio: '',
    gnarPoints: 0,
    profileImageUrl: '', // Will store the full URL for display
    profileImageFilename: '', // New field to store just the filename
  });
  

  useEffect(() => {
    const unsubscribeProfile = onSnapshot(doc(firestore, 'profiles', route.params.username), async (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
  
        let profileImageUrl = '';
        let profileImageFilename = data.profileImage || ''; // Assuming this is the filename stored in Firestore
  
        if (profileImageFilename) {
          profileImageUrl = await getDownloadURL(ref(db, `content/${profileImageFilename}`));
        }
  
        setProfileData(prevState => ({
          ...prevState,
          instagramHandle: data.instagram,
          emailAddress: data.email,
          bio: data.bio,
          gnarPoints: data.gnarPoints,
          profileImageUrl,
          profileImageFilename
        }));
      }
    });
  
    return () => unsubscribeProfile();
  }, []);
  
  

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
    setEditable(false);
    setIsLoading(true);
    let updatedPrevImage = profileData.profileImageFilename; // Use filename for saving
    if (media) {
      const fileUri = media.assets[0].uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      updatedPrevImage = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const imageRef = ref(db, `content/${updatedPrevImage}`);
      await uploadBytesResumable(imageRef, blob);
  
      // Update the profileImageUrl with the new full URL after upload
      const newProfileImageUrl = await getDownloadURL(imageRef);
      setProfileData(prevState => ({
        ...prevState,
        profileImageUrl: newProfileImageUrl,
        profileImageFilename: updatedPrevImage,
      }));
    }
  
    // Use setDoc with { merge: true } to update or create the document
    const userDocRef = doc(firestore, 'profiles', route.params.username);
    try {
      await setDoc(userDocRef, {
        instagram: profileData.instagramHandle,
        email: profileData.emailAddress,
        profileImage: updatedPrevImage, // Save filename
        bio: profileData.bio,
        gnarPoints: profileData.gnarPoints
      }, { merge: true });
      setIsLoading(false);
      alert('Profile successfully updated!');
    } catch (error) {
      console.error("Error updating/creating profile:", error);
      setIsLoading(false);
      alert('Error updating/creating profile. Please try again.');
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
        <Text style={styles.username}>@{route.params.username}</Text>
        <TouchableOpacity style={styles.editButton} onPress={editable ? handleSave : handleEditPress}>
          <Text style={styles.edit}>{editable ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={profileData.profileImageUrl ? { uri: profileData.profileImageUrl } : null}
              />
            {editable && (
              <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <FontAwesome name="pencil" size={24} color="white" />
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
              <Text style={styles.textDisplay}>
               Gnar Points: {profileData.gnarPoints ? profileData.gnarPoints.toString() : '0'}  
              </Text>
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
    marginLeft: -6,
    flex: 1,
    flexDirection: 'column',
  },
  textFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 25,
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
    marginLeft: -5,
  },
  postsContainer: {
    margin: 20,
    marginBottom: 60
  },
  uploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0173f9', // Background color of the button
    width: 40, // Width of the button
    height: 40, // Height of the button (make it the same as width for a circle)
    borderRadius: 20, // Half of the width/height to make it circular
    // Other styling as needed (e.g., margin, shadow)
    marginTop: -19,
    marginLeft: -18,
  },
  textDisplay: {
    color: 'white', // Ensure text is visible
    marginLeft: 11, // Provide some spacing after the icon
    fontSize: 12, // Match the font size to your design
    fontWeight: 'bold',
  },
  uploadText: {
    color: 'white',
    fontSize: 13,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
});

export default ProfileScreen;



