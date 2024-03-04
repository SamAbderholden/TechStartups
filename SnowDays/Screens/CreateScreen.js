import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FooterButtons from './FooterButtons';
import { storageRef, db, firestore} from '../firebase';
import {ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import { getDoc, doc, getDocs, collection, updateDoc, arrayUnion, arrayRemove, addDoc, setDoc, serverTimestamp} from 'firebase/firestore';

const CreateScreen = ({ route }) => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null); // Add media state
  const [isMaxCharReached, setIsMaxCharReached] = useState(false);
  const MAX_LENGTH = 125;

  useEffect(() => {
    // Request permission to access the photo library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleDescriptionChange = (text) => {
    setDescription(text);
    setIsMaxCharReached(text.length >= MAX_LENGTH);
  };
  
  useEffect(() => {
    if (isMaxCharReached) {
      // Trigger the alert when the max character limit is reached
      alert('Maximum character reached.');
    }
  }, [isMaxCharReached]); // Dependency array to re-run the effect when isMaxCharReached changes


  const handleUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
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


  const handlePost = async () => {
    const userDocRef = doc(collection(firestore, 'profiles'), route.params.username);
    const userDoc = await getDoc(userDocRef);
    if(!userDoc.exists()){
      alert("Please navigate to profile and create it before posting!");
      return;
    }
    let fileName = "";
  
    if (media) {
      const fileUri = media.assets[0].uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const imageRef = ref(db, `content/${fileName}`);
      await uploadBytesResumable(imageRef, blob);
    }
  
    const docName = `${new Date().toISOString()}_${route.params.username}`;
  
    try {
      await setDoc(doc(collection(firestore, 'posts'), docName), {
        text: description,
        filename: fileName,
        username: route.params.username,
        timestamp: serverTimestamp(),
      });
      alert('Post successfully added!');
    } catch (error) {
      alert('Error adding post. Please try again.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      {/* Header similar to ResortsScreen */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create a Post</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="gray" // Ensure placeholder text is visible
        value={description}
        onChangeText={handleDescriptionChange}
        maxLength={MAX_LENGTH} // Set the max length
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={ styles.uploadButtonText }>Upload Photo/Video</Text>
      </TouchableOpacity>
      {/* New Post Button */}
      <TouchableOpacity style={styles.postButton} onPress={() => handlePost()}>
        <Text style={ styles.postButtonText }>Post</Text>
      </TouchableOpacity>
      <FooterButtons />
    </View>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    padding: 20,
    paddingTop: 60, // Adjust for status bar height
    paddingBottom: 50,
    paddingHorizontal: 10,
    backgroundColor: 'black', // Match the container background
    alignItems: 'center', // Center the title
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    paddingTop: 10,
    minHeight: 30,
    maxHeight: 100,
    marginBottom: 20,
    
    width: '80%',
    color: 'white', // Ensure text is visible against background
  },
  uploadButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: '45%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#0173f9',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});