import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av'; // Import the Video component

const Post = ({ imageUrl, description, username, navigation}) => {
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Added for managing play state
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

  return (
    <View style={styles.container}>
      {
        isVideo(imageUrl) ? (
          <TouchableOpacity onPress={handleVideoPress}>
            <Video
              ref={videoRef} // Use the ref for direct control over video playback
              source={{ uri: imageUrl }}
              style={styles.media}
              resizeMode="cover"
              isLooping
              shouldPlay={isPlaying} // Control the playback based on state
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.media}
          />
        )
      }
      <View style={styles.textContainer}>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.userNameContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('GhostProfile', { usertodisplay: username , username: username})}>
            <Text style={styles.username}>@{username}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
          <IconComponent name="thumbs-up" size={30} color={liked ? '#0173f9' : 'gray'} solid={liked} />
        </TouchableOpacity>
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
  }
});

export default Post;
