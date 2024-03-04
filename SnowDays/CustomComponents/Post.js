import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av'; // Import the Video component
import { getDoc, doc, collection, getDocs, query, where, updateDoc, setDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import {firestore} from '../firebase';

const Post = ({ id, imageUrl, description, usernameToDisplay, username, timestamp}) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Added for managing play state
  const videoRef = useRef(null); // Reference to the video for playback control
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

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

  const handleCommentSubmit = async () => {
    setShowCommentInput(false);
    
    // Construct a comment object including the username
    const commentObj = {
      text: comment,
      username: username, // Assuming 'username' holds the username of the current user
    };
  
    const postDocRef = doc(firestore, 'posts', id);
    try {
      await updateDoc(postDocRef, {
        comments: arrayUnion(commentObj)
      });
      console.log('Comment added to post');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  
    setComment('');
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
          <View style={styles.dateLikeContainer}>
            <Text style={styles.timestamp}>{new Date(timestamp.seconds * 1000).toLocaleDateString()}</Text>
            <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
              <IconComponent name="thumbs-up" size={30} color={liked ? '#0173f9' : 'gray'} solid={liked} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCommentInput(!showCommentInput)}>
              <IconComponent name="comment" size={30} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
        {comments.length > 0 && (
          <TouchableOpacity onPress={() => setShowComments(!showComments)}>
          <Text style={styles.toggleCommentsText}>{showComments ? 'Hide Comments' : 'Show Comments'}</Text>
          </TouchableOpacity>
        )}
        {showComments && (
          <View style={styles.commentSection}>
          {comments.map((commentObj, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('GhostProfile', { username: commentObj.username })}>
              <Text style={styles.comment}>
                <Text style={styles.commentUsername}>@{commentObj.username}:</Text> {commentObj.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        )

        }
          {showCommentInput && (
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="gray"
              value={comment}
              onChangeText={setComment}
              onSubmitEditing={handleCommentSubmit}
              returnKeyType="send"
              blurOnSubmit={false}
            />
          )}
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
    width: '98%', // This will make the media take the full width of its parent container
    aspectRatio: 4 / 5, // Sets the aspect ratio to 4:5
    alignSelf: 'center',
  },
  textContainer: {
    padding: 10,
  },
  description: {
    fontSize: 18,
    color: 'white',
  },
  footerContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: -2,
  },
  likeButton: {
    marginTop: -20,
    marginBottom: -5,
    marginLeft: 7,
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
    marginRight: 1,
    marginBottom: -5,
    color: 'white',
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
    borderWidth: 1,
    padding: 5,
    borderColor: 'gray',
  },
  toggleCommentsText: {
    color: '#0173f9',
    fontWeight: 'bold',
    marginTop: 5,
  }
});


