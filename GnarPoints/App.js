import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const FooterButtons = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const navigateOrReplace = (screenName) => {
    if (route.name !== screenName) {
      navigation.replace(screenName);
    }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Home')}>
        <FontAwesome name="home" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Create')}>
        <FontAwesome name="plus" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => navigateOrReplace('Profile')}>
        <FontAwesome name="user" size={35} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const Profile = () => (
  <View style={styles.container}>
    <Text style={{ fontSize: 20 }}>Welcome to Profile!</Text>
    <FooterButtons />
  </View>
);

const Create = () => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);

  useEffect(() => {
    // Request permission to access the photo library
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleUpload = async () => {
    try {
      // Launch the image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        // Set the selected image or video to the state
        setMedia(result.uri);
      }
    } catch (error) {
      console.error('Error picking an image or video', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Welcome to Create!</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={{ color: 'white' }}>Upload Photo/Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton} onPress={() => handleUpload()}>
        <FontAwesome name="arrow-up" size={20} color="white" />
      </TouchableOpacity>

      <FooterButtons />
    </View>
  );
};

const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={{ fontSize: 20 }}>Welcome to Home!</Text>
    <FooterButtons />
  </View>
);

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username !== '' && password !== '') {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Login Page</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={{ color: 'white' }}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: TransitionPresets.SlideFromRightIOS.cardStyleInterpolator,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 0.0001 } },
            close: { animation: 'timing', config: { duration: 0.0001 } },
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 20,
    width: 200,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: 'black', // Change color as needed
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingBottom: 26,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    marginLeft: 10,
  },
});
