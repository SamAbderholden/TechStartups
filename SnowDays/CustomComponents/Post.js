import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Post = ({ imageUrl, description }) => {
  const [liked, setLiked] = useState(false);

  const handleLikePress = () => {
    setLiked(!liked);
  };

  const IconComponent = FontAwesome;

  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
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
    backgroundColor: 'black', // Assuming you want a black background for the text
  },
  image: {
    width: '97%',
    height: '97%',
    height: undefined,
    aspectRatio: 1.5, // Adjusted aspect ratio for a wide image
    resizeMode: 'cover',
    alignSelf: 'center', // Center the image
  },
  textContainer: {
    padding: 10, // Add some padding around the text and button
  },
  description: {
    fontSize: 16,
    color: 'white',
  },
  likeButton: {
    marginTop: -20, // Add some space above the like button
    alignSelf: 'flex-end', // Align button to the right
    flexDirection: 'row', // Align icon with text horizontally
    alignItems: 'center', // Align icon with text vertically
  },
});

export default Post;
