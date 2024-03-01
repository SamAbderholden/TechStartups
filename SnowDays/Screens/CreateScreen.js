import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FooterButtons from './FooterButtons';
import { storageRef, db, firestore} from '../firebase';
import {ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import { getDoc, doc, getDocs, collection, updateDoc, arrayUnion, arrayRemove, addDoc, setDoc} from 'firebase/firestore';

const CreateScreen = ({ route }) => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);

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
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        const fileUri = result.assets[0].uri; // Access the file URI from the assets array
  
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
        const imageRef = ref(db, `content/${fileName}`);
        await uploadBytesResumable(imageRef, blob);
  
        // Get timestamp
        const timestamp = new Date().toISOString();
  
        const docName = `${timestamp}_${route.params.username}`;

        // Add new document to "posts" collection with the combined docName as the document ID
        await setDoc(doc(collection(firestore, 'posts'), docName), {
          text: description,
          filename: fileName,
          username: route.params.username,
          // You can add more fields as needed
        });
  
        console.log("Image/Video uploaded and post added successfully!");
      }
    } catch (error) {
      console.error('Error picking an image or video', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Welcome to Create, {route.params.username}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={{ color: 'white' }}>Upload Photo/Video</Text>
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
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
});
