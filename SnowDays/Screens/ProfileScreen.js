import React, { useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firestore, db, storageRef } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import { getDoc, doc, collection, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';
import FooterButtons from './FooterButtons';
import { getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import ProfilePost from '../CustomComponents/ProfilePost';
import { FontAwesome } from '@expo/vector-icons';


const ProfileScreen = ({ route }) => {
  const [editable, setEditable] = useState(false);

  const handleEditPress = () => {
    setEditable(!editable);
  };

  const [fetchedPosts, setFetchedPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const postsCollectionRef = collection(firestore, 'posts');
      const querySnapshot = await getDocs(query(postsCollectionRef, where('username', '==', route.params.username)));
  
      const posts = [];
  
      for (const doc of querySnapshot.docs) {
        const postData = doc.data();
        const fileName = postData.filename;
        let imageUrl = "";
  
        if (fileName !== "") {
          imageUrl = await getDownloadURL(ref(db, `content/${fileName}`));
        }
  
        posts.push({ id: doc.id, ...postData, imageUrl, username: postData.username, timestamp: postData.timestamp });
      }
      setFetchedPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    // Fetch fresh posts from Firestore
    fetchProfileData();
    fetchPosts();
  }, []);

  const [instagramHandle, setInstagramHandle] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [bio, setBio] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [prevImage, setPrevImage] = useState('');

  const handleSave = async () => {
  
    // Upload new profile image if available
    if (media) {
      const fileUri = media.assets[0].uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      setPrevImage(fileUri.substring(fileUri.lastIndexOf('/') + 1));
      const imageRef = ref(db, `content/${prevImage}`);
      await uploadBytesResumable(imageRef, blob);
    }
  
    const userDocRef = doc(collection(firestore, 'profiles'), route.params.username);
  
    try {
      // Check if the user profile already exists
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        // Update user profile fields in Firestore
        await updateDoc(userDocRef, {
          instagram: instagramHandle,
          email: emailAddress,
          profileImage: prevImage, // Assuming the profile image is stored as a field named 'profileImage'
        });
  
        alert('Profile successfully updated!');
        fetchProfileData();
      } else {
        // Create a new user profile
        await setDoc(userDocRef, {
          instagram: instagramHandle,
          email: emailAddress,
          profileImage: prevImage, // Assuming the profile image is stored as a field named 'profileImage'
          gnarPoints: 0
        });
        alert('Profile successfully updated!');
        fetchProfileData();
      }
    } catch (error) {
      alert('Error updating/creating profile. Please try again.');
    }
  
    // Toggle back to "Edit" mode after saving
    setEditable(false);
  };

  const fetchProfileData = async () => {
    const profileDocRef = doc(firestore, 'profiles', route.params.username);
    const profileDocSnap = await getDoc(profileDocRef);
  
    if (profileDocSnap.exists()) {
      const data = profileDocSnap.data();
      setPrevImage(data.profileImage);
      const imageUrl = await getDownloadURL(ref(db, `content/${data.profileImage}`));
      setProfileImageUrl(imageUrl);
  
      // Set the Instagram handle and associated values
      setInstagramHandle(data.instagram); // Adjust the state variable as per your component's state
      setEmailAddress(data.email); // Adjust the state variable as per your component's state
      setBio(data.bio); // Adjust the state variable as per your component's state
    } else {
      console.log("No such profile!");
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
        console.log("Image/Video uploaded successfully!");
      }
    } catch (error) {
      console.error('Error picking an image or video', error);
    }
  };


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
            source={profileImageUrl ? { uri: profileImageUrl } : null}
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

              />
            </View>
            <View style={styles.textFieldContainer}>
              <FontAwesome name="star" size={26} color="white" />
              <TextInput
                style={styles.textField}
                placeholder="Gnar Points" // Since this field is not editable, you might want to indicate this or leave it empty
                editable={false}
                placeholderTextColor="grey" // Make sure the placeholder is visible
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
            value={bio}
            onChangeText={(text) => setBio(text)}
          />
        </View>
      </View>

      <ScrollView style={styles.postsContainer}>
        {fetchedPosts.map((post) => (
          <ProfilePost key={post.id} id={post.id} imageUrl={post.imageUrl} description={post.text} onDelete={fetchPosts} timestamp={post.timestamp} />
        ))}
      </ScrollView>
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
    marginLeft: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;



