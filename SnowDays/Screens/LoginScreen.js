import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
const IMAGE_PATH = '../StylingImages/Login.png';

const LoginScreen = ({ navigation }) => {

  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      setLoading(false);
      navigation.navigate('Home', {username: username.split('@')[0].toLowerCase()});
    } catch (e) {
      setLoading(false);
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') {
        window.alert('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);

    }

  };

  const signUp = async () => {
    navigation.navigate('SignUp');
  };

  const handleResetPass = () => {
    navigation.navigate('ResetPassword');
  }

  return (
      // Parent container that holds everything
      <View style={styles.parentContainer}>
          {/* Container for the title */}
          <Text style={styles.title}>SnowDays</Text>
          {/* Container for the image */}
          <Image
              source={require(IMAGE_PATH)}
              style={styles.logo}
          />
          {/* Container for the login form */}
          <View style={styles.loginContainer}>
              <TextInput
                  style={styles.inputFieldBox}
                  placeholder="Username"
                  value={username}
                  onChangeText={setEmail}
                  autoCapitalize='none'
              />
              <TextInput
                  style={styles.inputFieldBox}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize='none'
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.inputButton} onPress={handleLogin}>
                    <Text style={styles.inputButtonText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.ResetPassButton} onPress={handleResetPass}>
                  <Text style={styles.PassResetButtonText}>Forgot Password?</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

// Updated styles
const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: '#000', // Parent container background color
    alignItems: 'center',
    justifyContent: 'space-around', // Space around items
  },
  title: {
    marginTop: 70, // Space on top of the title
    marginBottom: -20, // Space on bottom of the title
    fontSize: 60,
    color: '#fff', // Title color
    fontWeight: 'bold',
  },
  logo: {
    marginTop: -40,
    marginBottom: -70,
    width: 400,
    height: 370,
    resizeMode: 'contain',
  },
  loginContainer: {
    width: '80%', // Width of the login form container
    alignItems: 'center',
  },
  inputFieldBox: {
    width: '70%', // Full width of the login container
    margin: 9,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 11,
    borderRadius: 5,
    backgroundColor: '#fff', // Input background color
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  inputButton: {
    marginTop: 12, // Space on top of the button
    marginBottom: 5, // Space on bottom of the button
    marginRight: 10, // Space between the buttons
    backgroundColor: 'white', // Button background color
    padding: 13,
    borderRadius: 5,
    flex: 1,
  },
  inputButtonText: {
    color: 'black', // Button text color
    textAlign: 'center',  //center the text
  },
  signUpButton: {
    marginTop: 12, // Space on top of the button
    marginBottom: 5, // Space on bottom of the button
    backgroundColor: 'white', // Button background color
    padding: 13,
    borderRadius: 5,
    flex: 1,
  },
  signUpButtonText: {
    color: 'black', // Button text color
    textAlign: 'center',  //center the text
  },
  ResetPassButton: {
    marginTop: 5, // Space on top of the button
    marginBottom: 100, // Space on bottom of the button
    backgroundColor: 'transparent', // Button background color
    padding: 0,
    borderRadius: 5,
    width: '100%', // Full width of the login container
    alignItems: 'center',
    whiteSpace: 'nowrap', // Display text on one line
  },
  PassResetButtonText: {
    color: 'white', // Button text color
  },
});





export default LoginScreen;







