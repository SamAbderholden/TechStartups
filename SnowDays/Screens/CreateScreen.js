import React, { useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image} from 'react-native';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import FooterButtons from './FooterButtons';
import { storageRef, db, firestore} from '../firebase';
import {ref, uploadBytes, uploadBytesResumable} from "firebase/storage";
import { getDoc, doc, getDocs, collection, updateDoc, arrayUnion, arrayRemove, addDoc, setDoc, serverTimestamp} from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const CreateScreen = ({ route }) => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null); // Add media state
  const [isMaxCharReached, setIsMaxCharReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null); // Reference to the video for playback control
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
        alert("Image/Video uploaded successfully!");
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
    setLoading(true);
    let fileName = "";
  
    if (media) {
      const fileUri = media.assets[0].uri;
      const response = await fetch(fileUri);
      const blob = await response.blob();
      fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const imageRef = await ref(db, `content/${fileName}`);
      await uploadBytesResumable(imageRef, blob);
    }
  
    const docName = `${new Date().toISOString()}_${route.params.username}`;
  
    try {
      await setDoc(doc(collection(firestore, 'posts'), docName), {
        text: description,
        filename: fileName,
        username: route.params.username,
        timestamp: new Intl.DateTimeFormat('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        }).format(new Date())
      });
      setMedia(null);
      setDescription('');
      setLoading(false);
      alert('Post successfully added!');
    } catch (error) {
      setMedia(null);
      setDescription('');
      setLoading(false);
      alert('Error adding post. Please try again.');
    }
  };

  const isVideo = (url) => {
    return /\.(mp4|mov)(\?.*)?(#.*)?$/i.test(url);
  };
  

  if(loading){
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // Toggle video playback state
  const handleVideoPress = () => {
    if (isPlaying) {
      videoRef.current?.pauseAsync();
    } else {
      videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying); // Toggle play state
  };
  

  return (
    <View style={styles.container}>
      {/* Header similar to ResortsScreen */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create a Post</Text>
      </View>
      {media != null && (
        isVideo(media.assets[0].uri) ? (
          <TouchableOpacity onPress={handleVideoPress}>
            <Video
              ref={videoRef}
              source={{ uri: media.assets[0].uri }}
              style={styles.media}
              resizeMode="cover"
              isLooping
              shouldPlay={isPlaying}
            />
            {!isPlaying && (
              <TouchableOpacity style={styles.playButton} onPress={handleVideoPress}>
                <FontAwesome name="play" size={60} color="white" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ) : (
          <Image
            resizeMode="cover"
            source={{ uri: media.assets[0].uri }}
            style={styles.media}
          />
        )
      )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  media: {
    width: '50%', // This will make the media take the full width of its parent container
    aspectRatio: 4 / 5, // Sets the aspect ratio to 4:5
    alignSelf: 'center',
    borderBottomWidth: 8,
    borderTopWidth: 8,
    marginBottom: 30
  },
  playButton: {
    position: 'absolute',
    top: 100,
    left: 90
  },
});