import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { firestore, db } from '../firebase';
import { getDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import FooterButtons from './FooterButtons';
import { getDownloadURL, ref } from "firebase/storage";
import ProfilePost from '../CustomComponents/ProfilePost';
import { FontAwesome } from '@expo/vector-icons';


const ProfileScreen = ({ route }) => {
  const [editable, setEditable] = useState(false);

  const handleEditPress = () => {
    setEditable(!editable);
  };

  const [fetchedPosts, setFetchedPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const postsCollectionRef = collection(firestore, 'posts');
      const querySnapshot = await getDocs(query(postsCollectionRef, where('username', '==', route.params.username)));
  
      const posts = [];
  
      for (const doc of querySnapshot.docs) {
        const postData = doc.data();
        const fileName = postData.filename;
        let imageUrl = "";
  
        if (fileName !== "") {
          imageUrl = await getDownloadURL(ref(db, `content/${fileName}`));
        }
  
        posts.push({ id: doc.id, ...postData, imageUrl, username: postData.username, timestamp: postData.timestamp });
      }
      setFetchedPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    // Fetch fresh posts from Firestore
    fetchPosts();
  }, []);

  const handleSave = () => {
    // Add your logic here for saving/updating the data to the database
    // This function will be called when the "Save" button is pressed
    console.log('Data saved to the database');

    // Toggle back to "Edit" mode after saving
    setEditable(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>@{route.params.username}</Text>
        <TouchableOpacity style={styles.editButton} onPress={editable ? handleSave : handleEditPress}>
          <Text style={styles.edit}>{editable ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
  <View style={styles.rowContainer}>
    {/* Image space */}
    <View style={styles.imageContainer}>
      <Image
        style={styles.image}
        source={require('../testProfileImage.png')}
      />
    </View>
    {/* Three text fields */}
    <View style={styles.textFieldsContainer}>
      <View style={styles.textFieldContainer}>
      <FontAwesome name="instagram" size={28} color="white" />
        <TextInput
          style={styles.textField}
          placeholder="handle"
          editable={editable}
          placeholderTextColor="grey" // Make sure the placeholder is visible
          autoCapitalize='none'
        />
      </View>
      <View style={styles.textFieldContainer}>
      <FontAwesome name="envelope" size={26} color="white" />
        <TextInput
          style={styles.textField}
          placeholder="Email address"
          editable={editable}
          placeholderTextColor="grey" // Make sure the placeholder is visible
          autoCapitalize='none'

        />
      </View>
      <View style={styles.textFieldContainer}>
        <FontAwesome name="star" size={26} color="white" />
        <TextInput
          style={styles.textField}
          placeholder="Gnar Points" // Since this field is not editable, you might want to indicate this or leave it empty
          editable={false}
          placeholderTextColor="grey" // Make sure the placeholder is visible
        />
      </View>
    </View>
  </View>
  {/* Large text box */}
  <View style={styles.largeTextBoxContainer}>
    <TextInput
      style={styles.largeTextBox}
      multiline
      editable={editable}
      placeholder="Write your bio or personal message here"
      placeholderTextColor="grey" // Make sure the placeholder is visible
      autoCapitalize='none'
    />
  </View>
</View>

      <ScrollView style={styles.postsContainer}>
      {fetchedPosts.map(post => (
        <ProfilePost
          key={post.id}
          id={post.id}
          imageUrl={post.imageUrl}
          description={post.text}
          onDelete={fetchPosts}
          timestamp={post.timestamp}
        />
      ))}
      </ScrollView>
      <FooterButtons style={styles.footerButtons}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 60,
    marginRight: 30,
    marginLeft: 30,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 34,
    color: '#0173f9',
  },
  editButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: 55,
    alignItems: 'center',
  },
  edit: {
    color: 'black',
    fontSize: 16,
  },
  contentContainer: {
    marginTop: 50,
    marginRight: 30,
    marginLeft: 30,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    // Additional styling for image container
    marginRight: 10,
  },
  textFieldsContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  textFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 25, // Increase the left margin to push the content to the right
    // You can also use paddingHorizontal if you want to add padding instead
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  textField: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    color: 'white', // Ensure text is visible against the background
  },
  largeTextBoxContainer: {
    marginTop: 20,
  },
  largeTextBox: {
    borderWidth: 1,
    padding: 10,
    minHeight: 50,
    maxHeight: 100,
    borderColor: 'white', // Change border color to white
    color: 'white', // Add this to ensure text inside the box is visible
    margin: -10,
  },
  image: {
    width: 150, // Set the width of the image
    height: 150, // Set the height of the image
    resizeMode: 'cover', // Adjust the resizeMode based on your design needs
  },
  postsContainer: {
    margin: 20,
    marginBottom: 60
  }
});

export default ProfileScreen;



