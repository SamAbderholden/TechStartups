import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';// Import the Video component

const Post = ({ imageUrl, description }) => {
  const [liked, setLiked] = useState(false);

  const handleLikePress = () => {
    setLiked(!liked);
  };

  const IconComponent = FontAwesome;

  // Function to determine if the URL is a video based on its extension
  const isVideo = (url) => {
    return /\.(mp4|mov)(\?.*)?(#.*)?$/i.test(url);
  };


  return (
    <View style={styles.container}>
      {
        isVideo(imageUrl) ? (
          <Video
            source={{ uri: imageUrl }}
            style={styles.media}
            resizeMode="cover"
            useNativeControls
            isLooping
          />
        ) : (
          <Image
            source={{ uri: imageUrl }}
            style={styles.media}
          />
        )
      }
      <View style={styles.textContainer}>
        <Text style={styles.description}>{description}</Text>
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
    width: 200,
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
});

export default Post;
