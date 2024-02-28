import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Post = ({ imageUrl, description }) => {
  const [liked, setLiked] = useState(false);

  const handleLikePress = () => {
    setLiked(!liked);
  };

  const IconComponent = liked ? FontAwesome : FontAwesome;

  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={handleLikePress}>
        <IconComponent name="thumbs-up" size={32} color={liked ? '#0173f9' : 'white'} solid={liked} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'white',
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
    color: 'white',
  },
  likeButton: {
    position: 'absolute',
    bottom: 6,
    right: 10,
  },
});

export default Post;
