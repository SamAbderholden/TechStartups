import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av'; // Import the Video component
import { collection, deleteDoc, doc, onSnapshot, updateDoc, arrayRemove, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore, db } from '../firebase'; // Import your firebase configurations

const ProfilePost = ({ id, imageUrl, description, usernameToDisplay, username, onDelete, timestamp, isInView }) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Added for managing play state
  const [forceUpdate, setForceUpdate] = useState(false); // State to force re-render
  const videoRef = useRef(null); // Reference to the video for playback control
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const checkIfLiked = async () => {
      const postDocRef = doc(firestore, 'posts', id);
      const docSnap = await getDoc(postDocRef);
      if (docSnap.exists()) {
        const postData = docSnap.data();
        // Check if the user's username is in the likes array
        setLiked(postData.likes?.includes(username));
      }
    };
  
    checkIfLiked();
  }, []);

  useEffect(() => {
    if (isVideo(imageUrl)) {
      if (isInView && videoRef.current) {
        videoRef.current.playAsync();
      } else if (videoRef.current) {
        videoRef.current.pauseAsync();
      }
    }
  }, [isInView]);

  const handleLikePress = async () => {
    try {
      setLiked(!liked);
      const userDocRef = doc(collection(firestore, 'profiles'), username);
  
      // Get the current gnarPoints value
      const profileDocSnap = await getDoc(userDocRef);
      const currentGnarPoints = profileDocSnap.exists() ? profileDocSnap.data()?.gnarPoints || 0 : 0;
  
      // Update the gnarPoints based on whether the post is liked or unliked
      const newGnarPoints = liked ? Math.max(currentGnarPoints - 1, 0) : currentGnarPoints + 1;
  
      // Update the Firestore document with the new gnarPoints value
      await updateDoc(userDocRef, { gnarPoints: newGnarPoints });
      const postDocRef = doc(firestore, 'posts', id);
      if (!liked) {
        // Add user ID to likes array
        await updateDoc(postDocRef, {
          likes: arrayUnion(username)
        });
      } else {
        // Remove user ID from likes array
        await updateDoc(postDocRef, {
          likes: arrayRemove(username)
        });
      }
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

  const handleDeleteCommentPress = async (commentObj) => {
    const postDocRef = doc(firestore, 'posts', id);
    try {
      // Use arrayRemove with the specific comment object to remove
      await updateDoc(postDocRef, {
        comments: arrayRemove(commentObj)
      });
      console.log('Comment deleted from post');
    } catch (error) {
      console.error('Error deleting comment:', error);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.deletePostButton} onPress={handleDeletePress}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      {imageUrl !== "" && (
        isVideo(imageUrl) ? (
          <View style={styles.videoContainer}>
            <Video
              ref={videoRef}
              source={{ uri: imageUrl }}
              style={styles.media}
              resizeMode="cover"
              isLooping
            />
          </View>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.media}
          />
        )
      )}
      <View style={styles.textContainer}>
        <Text style={styles.postDescription}>{description}</Text>
        <View style={styles.footerContainer}>
        {comments.length > 0 && (
            <View style={styles.moveRightWComments}>
              <TouchableOpacity onPress={() => setShowComments(!showComments)}>
                <Text style={styles.toggleCommentsText}>{showComments ? 'Hide Comments' : 'Show Comments'}</Text>
              </TouchableOpacity>
              <View style={styles.likeNComment}>
                <TouchableOpacity style={styles.CommentBubble} onPress={() => setShowCommentInput(!showCommentInput)}>
                  <IconComponent name="comment" size={28} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
                  <IconComponent name="thumbs-up" size={30} color={liked ? '#0173f9' : 'gray'} solid={liked} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {comments.length === 0 && (
            <View style={styles.moveRight}>
              <TouchableOpacity style={styles.CommentBubble} onPress={() => setShowCommentInput(!showCommentInput)}>
                <IconComponent name="comment" size={28} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
                <IconComponent name="thumbs-up" size={30} color={liked ? '#0173f9' : 'gray'} solid={liked} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {showComments && (
          <View style={styles.parentCommentSection}>
            {comments.map((commentObj, index) => (
              <View key={index} style={styles.parentCommentSectionContainer}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('GhostProfile', { usertodisplay: commentObj.username, username: username })}
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}
                >
                  <Text style={styles.comment}>
                    <Text style={styles.commentUsername}>@{commentObj.username}:</Text> {commentObj.text}
                  </Text>
                  {commentObj.username === username && (
                    <TouchableOpacity 
                      onPress={() => handleDeleteCommentPress(commentObj)}
                      style={styles.deleteButton}
                    >
                      <FontAwesome name="times-circle" size={24} color="red" />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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

  //styling for the header items
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginTop: 1,
  },
  deleteButtonContainer: {
    marginTop: 5,
    alignItems: 'flex-end',
  },
  deletePostButton: {
    backgroundColor: 'red',
    padding: 7,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timestamp: {
    marginRight: 1,
    color: 'white',
    fontSize: 18,
  },


  //styling for the actual media
  media: {
    width: '100%', // This will make the media take the full width of its parent container
    aspectRatio: 4 / 5, // Sets the aspect ratio to 4:5
    alignSelf: 'center',
    borderBottomWidth: 8,
    borderTopWidth: 8
  },
  videoContainer: {
    width: '100%', // Match the width of the media
    aspectRatio: 4 / 5, // Keep the original aspect ratio of the video
    alignSelf: 'center', // Center the container
    position: 'relative', // Needed to position the play button absolutely relative to this container
    overflow: 'hidden', // Hide any overflow
  },
  playButton: {
    position: 'absolute', // Position the play button absolutely to overlay it on the video
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: [{ translateX: -15 }, { translateY: -30 }], // Adjust the centering based on the button's size
    // Note: Adjust the translate values based on the actual size of your play icon for perfect centering
  },
  textContainer: {
    padding: 10,
  },
  postDescription: {
    fontSize: 20,
    color: 'white',
  },

  

  //action buttons below the postDescription
  footerContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  likeNComment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 50
  },
  moveRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  moveRightWComments: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 16,
  },
  CommentBubble: {
    marginRight: 10,
    marginBottom: -3,
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
    fontSize: 18
  },
  

  commentNDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20
  },

  

  //styling for the comment section
  parentCommentSection: {
    borderTopWidth: 2,
    color: 'white',
    flex: 1,
    paddingRight: 9,
    paddingLeft: 9,
    paddingBottom: 4,
    justifyContent: 'space-between', // This will distribute the space evenly between items
    gap: 4,
  },
  commentInput: {
    marginTop: -7,
    borderColor: 'gray',
    padding: 10,
    color: 'white',
    marginBottom: 3,
    fontSize: 18,
  },
  comment: {
    color: 'white',
    fontSize: 18,
  },
  commentUsername: {
    color: '#0173f9',
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    alignItems: 'flex-end',
  },
});

export default ProfilePost;
