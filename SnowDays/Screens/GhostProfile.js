import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FooterButtons from './FooterButtons';
import Post from '../CustomComponents/Post';
import { firestore, db } from '../firebase';
import { getDoc, doc, getDocs, query, collection , where} from 'firebase/firestore';
import { getDownloadURL, ref as storageRef } from "firebase/storage";

const GhostProfile = ({ route }) => {
    const userInView = route.params.usertodisplay;
    const [profileData, setProfileData] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    useEffect(() => {
        const fetchProfileData = async () => {
            const profileDocRef = doc(firestore, 'profiles', userInView);
            const profileDocSnap = await getDoc(profileDocRef);

            if (profileDocSnap.exists()) {
                const data = profileDocSnap.data();
                setProfileData(data);

                const imageUrl = await getDownloadURL(storageRef(db, `content/${data.profileimage}`));
                setProfileImageUrl(imageUrl);
            } else {
                console.log("No such profile!");
            }
        };

        const fetchUserPosts = async () => {
            const postsQuery = query(collection(firestore, 'posts'), where('username', '==', userInView));
            const querySnapshot = await getDocs(postsQuery);
            const posts = [];

            for (const doc of querySnapshot.docs) {
                const postData = doc.data();
                const fileName = postData.filename;
                const imageUrl = await getDownloadURL(storageRef(db, `content/${fileName}`));

                posts.push({ id: doc.id, ...postData, imageUrl });
            }

            setUserPosts(posts);
        };

        fetchProfileData();
        fetchUserPosts();
    }, [userInView]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>@{userInView}</Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: profileImageUrl }}
                        />
                    </View>
                    <View style={styles.textFieldsContainer}>
                        <View style={styles.textFieldContainer}>
                            <Text style={styles.label}>Instagram:</Text>
                            <Text style={styles.textField}>{profileData?.instagram}</Text>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <Text style={styles.label}>Email:</Text>
                            <Text style={styles.textField}>{profileData?.email}</Text>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <Text style={styles.label}>Gnar Points:</Text>
                            <Text style={styles.textField}>{profileData?.gnarpoints}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <ScrollView style={styles.postsContainer}>
                {userPosts.map((post) => (
                    <Post
                    key={post.id}
                    imageUrl={post.imageUrl}
                    description={post.text}
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
    fontSize: 25,
  },
  editBt: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  edit: {
    color: 'white',
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
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  textField: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
  },
  largeTextBoxContainer: {
    marginTop: 20,
  },
  largeTextBox: {
    borderWidth: 1,
    padding: 10,
    minHeight: 100,
    // Additional styling for large text box
  },
  image: {
    width: 150, // Set the width of the image
    height: 150, // Set the height of the image
    resizeMode: 'cover', // Adjust the resizeMode based on your design needs
  },
  postsContainer: {
    margin: 20,
  }
});

export default GhostProfile;
