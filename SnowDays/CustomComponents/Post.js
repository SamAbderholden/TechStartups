import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av'; // Import the Video component
import { getDoc, doc, collection, getDocs, query, where, updateDoc, setDoc } from 'firebase/firestore';
import {firestore} from '../firebase';

const Post = ({ imageUrl, description, usernameToDisplay, username, timestamp}) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Added for managing play state
  const videoRef = useRef(null); // Reference to the video for playback control

  const handleLikePress = async () => {
    try {
      setLiked(!liked);
      const userDocRef = doc(collection(firestore, 'profiles'), usernameToDisplay);
  
      // Get the current gnarPoints value
      const profileDocSnap = await getDoc(userDocRef);
      const currentGnarPoints = profileDocSnap.exists() ? profileDocSnap.data()?.gnarPoints || 0 : 0;
  
      // Update the gnarPoints based on whether the post is liked or unliked
      const newGnarPoints = liked ? Math.max(currentGnarPoints - 1, 0) : currentGnarPoints + 1;
  
      // Update the Firestore document with the new gnarPoints value
      await updateDoc(userDocRef, { gnarPoints: newGnarPoints });
  
      // Update the local state to reflect the change
    } catch (error) {
      console.error('Error updating gnarPoints:', error);
    }
  };
  
  

  const IconComponent = FontAwesome;

  const isVideo = (url) => {
    return /\.(mp4|mov)(\?.*)?(#.*)?$/i.test(url);
  };

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
      {imageUrl !== "" && (
        isVideo(imageUrl) ? (
          <TouchableOpacity onPress={handleVideoPress}>
            <Video
              ref={videoRef}
              source={{ uri: imageUrl }}
              style={styles.media}
              resizeMode="cover"
              isLooping
              shouldPlay={isPlaying}
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.media}
          />
        )
      )}
      <View style={styles.textContainer}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.footerContainer}>
          {usernameToDisplay && (
            <TouchableOpacity onPress={() => navigation.navigate('GhostProfile', { usertodisplay: usernameToDisplay, username: username })}>
              <Text style={styles.username}>@{usernameToDisplay}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.timestamp}>{new Date(timestamp.seconds * 1000).toLocaleDateString()}</Text>
          <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
            <IconComponent name="thumbs-up" size={30} color={liked ? '#0173f9' : 'gray'} solid={liked} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Post;


const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
    backgroundColor: 'black',
  },
  media: {
    width: 200, // Adjusted for consistency
    height: 200,
    alignSelf: 'center',
  },
  textContainer: {
    padding: 10,
  },
  description: {
    fontSize: 16,
    color: 'white',
  },
  footerContainer: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    marginTop: -20,
    marginBottom: -5,
    marginLeft: 7,
    marginRight: 7,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginBottom: -5,
    color: '#0173f9', // The username color
    fontWeight: 'bold',
  },
  timestamp: {
    marginLeft: 170,
    marginBottom: -5,
    color: 'white',
  },

});


