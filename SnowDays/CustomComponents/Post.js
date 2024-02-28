import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Post = ({ imageUrl, description }) => {
  const [liked, setLiked] = useState(false);

  const handleLikePress = () => {
    setLiked(!liked);
  };

  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
        <FontAwesome name={liked ? 'heart' : 'heart-o'} size={24} color={liked ? 'red' : 'black'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    padding: 10,
    position: 'relative', // Add position relative to allow absolute positioning within
  },
  image: {
    width: 350,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  },
  likeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default Post;
