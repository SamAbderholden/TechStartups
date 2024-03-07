import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av'; // Import the Video component
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { firestore, db } from '../firebase'; // Import your firebase configurations

const ProfilePost = ({ id, imageUrl, description, usernameToDisplay, username, onDelete, timestamp }) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Added for managing play state
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
  const videoRef = useRef(null); // Reference to the video for playback control
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

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
      // Trigger a re-render by changing the forceUpdate state
      setForceUpdate(!forceUpdate);
    } catch (error) {
      console.error('Error deleting post:', error);
      Alert.alert('Error', 'An error occurred while deleting the post. Please try again.');
    }
  };

  useEffect(() => {
    const postDocRef = doc(firestore, 'posts', id);

    const unsubscribe = onSnapshot(postDocRef, (doc) => {
      if (doc.exists()) {
        const postData = doc.data();
        setComments(postData.comments || []);
      } else {
        console.log("No such document!");
      }
    });
    // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {imageUrl !== "" && (
        isVideo(imageUrl) ? (
          <View style={styles.videoContainer}>
            <TouchableOpacity onPress={handleVideoPress} style={{ width: '100%', height: '100%' }}>
              <Video
                ref={videoRef}
                source={{ uri: imageUrl }}
                style={styles.media}
                resizeMode="cover"
                isLooping
                shouldPlay={isPlaying}
              />
            </TouchableOpacity>
            {!isPlaying && (
              <TouchableOpacity style={styles.playButton} onPress={handleVideoPress}>
                <FontAwesome name="play" size={60} color="white" />
              </TouchableOpacity>
            )}
          </View>
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
          <Text style={styles.timestamp}>{timestamp}</Text>
        

        {comments.length > 0 && (
          <View style={styles.commentNDelete}>
            <TouchableOpacity onPress={() => setShowComments(!showComments)}>
          <Text style={styles.toggleCommentsText}>{showComments ? 'Hide Comments' : 'Show Comments'}</Text>
          </TouchableOpacity>
          <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
          </View>
        )}
        {comments.length == 0 && (
          <View style={styles.deleteButtonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          </View>
        )}
        </View>
      </View>
      {showComments && (
          <View style={styles.commentSection}>
          {comments.map((commentObj, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('GhostProfile', { usertodisplay: commentObj.username, username: username })}>
              <Text style={styles.comment}>
                <Text style={styles.commentUsername}>@{commentObj.username}:</Text> {commentObj.text}
              </Text>
            </TouchableOpacity>
          ))}
    
        </View>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  media: {
    width: '100%', // This will make the media take the full width of its parent container
    aspectRatio: 4 / 5, // Sets the aspect ratio to 4:5
    alignSelf: 'center',
    borderBottomWidth: 8,
    borderTopWidth: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,

  },
  textContainer: {
    padding: 10,
  },
  description: {
    fontSize: 18,
    color: 'white',
  },
  timestamp: {
    fontSize: 18,
    color: 'white',
    marginTop: 4,
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
  commentInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    color: 'white',
    borderRadius: 5,
  },
  comment: {
    color: 'white'
  },
  commentUsername: {
    color: '#0173f9',
    fontWeight: 'bold',
  },
  commentSection: {
    borderTopWidth: 2,
    padding: 10,
    marginTop: 3,
    borderColor: 'gray',
  },
  toggleCommentsText: {
    color: '#0173f9',
    fontWeight: 'bold',
    marginTop: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: -2,
  },
  commentNDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },
  playButton: {
    position: 'absolute',
    top: 220,
    left: 190
  },
  videoContainer: {
    width: '100%', // Take the full width of the parent
    aspectRatio: 4 / 5, // Keep the aspect ratio of the video
    alignSelf: 'center',
    justifyContent: 'center', // Center children vertically
    alignItems: 'center', // Center children horizontally
  },
});

export default ProfilePost;
