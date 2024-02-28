import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
const IMAGE_PATH = '/Users/jacksigler/Library/CloudStorage/OneDrive-ColoradoSchoolofMines/Mines/Spring_2024/CSCI-498/TechStartups/SnowDays/StylingImages/Login.png';


const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
      if (username !== '' && password !== '') {
          navigation.navigate('Home', { username });
      }
  };

  return (
      // Parent container that holds everything
      <View style={styles.parentContainer}>
          {/* Container for the title */}
          <Text style={styles.title}>SnowTies</Text>
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
                  onChangeText={setUsername}
              />
              <TextInput
                  style={styles.inputFieldBox}
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.inputButton} onPress={handleLogin}>
                  <Text style={styles.inputButtonText}>Log In</Text>
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
    marginTop: 100, // Space on top of the title
    marginBottom: -20, // Space on bottom of the title
    fontSize: 60,
    color: '#fff', // Title color
    fontWeight: 'bold',
  },
  logo: {
    marginTop: -15,
    marginBottom: -130,
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
  inputButton: {
    marginTop: 12, // Space on top of the button
    marginBottom: 220, // Space on bottom of the button
    backgroundColor: 'white', // Button background color
    padding: 13,
    borderRadius: 5,
    width: '30%', // Full width of the login container
    alignItems: 'center',
  },
  inputButtonText: {
    color: 'black', // Button text color
  },
});





export default LoginScreen;







