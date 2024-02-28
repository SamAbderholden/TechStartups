import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FooterButtons from './FooterButtons';
import Post from '../CustomComponents/Post';

const ProfileScreen = ({ route }) => {
  const [editable, setEditable] = useState(false);

  const handleEditPress = () => {
    setEditable(!editable);
  };

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
        <TouchableOpacity style={styles.editBt} onPress={editable ? handleSave : handleEditPress}>
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
              <Text style={styles.label}>Instagram:</Text>
              <TextInput
                style={styles.textField}
                placeholder=""
                editable={editable}
              />
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.textField}
                placeholder=""
                editable={editable}
              />
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={styles.label}>Gnar Points:</Text>
              <TextInput
                style={styles.textField}
                placeholder=""
                editable={false}
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
          />
        </View>
      </View>
      <ScrollView style={styles.postsContainer}>
        <Post imageUrl={require('../testProfileImage.png')} description={"bruh"}></Post>
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

export default ProfileScreen;
