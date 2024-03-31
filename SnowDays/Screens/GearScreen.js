import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterButtons from './FooterButtons'; 
import Post from '../CustomComponents/Post';
import { firestore, db } from '../firebase';
import { query, collection, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, ref } from "firebase/storage";
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const isSmallScreen = height < 700; // iPhone SE width is 320

const GearPage = ({ route }) => {
  const navigation = useNavigation();
  const [fetchedPosts, setFetchedPosts] = useState([]);

  useEffect(() => {
    const postsCollectionRef = collection(firestore, 'posts');
    // Adjust the query to include a filter for the "tag" field equal to "Gear"
    const q = query(postsCollectionRef, where('tag', '==', 'Gear'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const postsPromises = querySnapshot.docs.map(async (doc) => {
        const postData = doc.data();
        if (!postData.timestamp) {
          return null;
        }
        let imageUrl = '';
        if (postData.filename) {
          imageUrl = await getDownloadURL(ref(db, `content/${postData.filename}`));
        }

        return {
          id: doc.id,
          ...postData,
          imageUrl,
          timestamp: postData.timestamp,
        };
      });

      const postsWithImages = await Promise.all(postsPromises);
      setFetchedPosts(postsWithImages.filter(post => post !== null).reverse());
    });

    return () => unsubscribe();
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 75
  }).current;

  const [viewableItems, setViewableItems] = useState([]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    const viewableKeys = viewableItems.map(item => item.key);
    setViewableItems(viewableKeys);
  }, []);

  const renderPost = ({ item }) => (
    <Post
      key={item.id}
      id={item.id}
      imageUrl={item.imageUrl}
      description={item.text}
      usernameToDisplay={item.username}
      username={route.params.username}
      timestamp={item.timestamp}
      isInView={viewableItems.includes(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gear</Text>
      </View>
      <FlatList style={styles.postsContainer}
        data={fetchedPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        initialNumToRender={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      <FooterButtons style={styles.footerButtons} />
    </View>
  );
};

export default GearPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: isSmallScreen ? 15 : 60, // Adjust the top padding for small screens
    paddingBottom: 4,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
  },
  postsContainer: {
    marginTop: 10,
    marginBottom: 70,
    alignContent: 'center',
  },
});
