import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av'; // Import the Video component
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { firestore, db } from '../firebase'; // Import your firebase configurations

const ProfilePost = ({ id, imageUrl, description, usernameToDisplay, username, onDelete }) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Added for managing play state
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
  const videoRef = useRef(null); // Reference to the video for playback control

  const handleLikePress = () => {
    setLiked(!liked);
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

  const handleDeletePress = async () => {
    try {
      // Delete the post based on the provided id
      await deleteDoc(doc(collection(firestore, 'posts'), id));
      Alert.alert('Post Deleted', 'The post has been successfully deleted.');
      // Trigger a re-render by changing the forceUpdate state
      setForceUpdate(!forceUpdate);
      // Trigger the callback to refresh the posts
      onDelete();
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'An error occurred while deleting the post. Please try again.');
    }
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
        <View style={styles.likeButton}>
          <TouchableOpacity onPress={handleLikePress}>
            <IconComponent name="thumbs-up" size={30} color={liked ? '#0173f9' : 'gray'} solid={liked} />
          </TouchableOpacity>
        </View>
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
  likeButton: {
    marginTop: -20,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#0173f9', // The username color
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfilePost;
