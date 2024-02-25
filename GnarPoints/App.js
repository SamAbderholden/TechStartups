import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
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
      navigation.replace(screenName, { username: route.params.username });
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

const Profile = ({ route }) => (
  <View style={styles.container}>
    <Text style={{ fontSize: 20 }}>Welcome to Profile, {route.params.username}!</Text>
    <FooterButtons />
  </View>
);

const Create = ({ route }) => {
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
      let result;
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        // Handle image or video upload
        setMedia(result.uri);
      }
    } catch (error) {
      console.error('Error picking an image or video', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Welcome to Create, {route.params.username}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={() => handleUpload('photo')}>
        <Text style={{ color: 'white' }}>Upload Photo/Video</Text>
      </TouchableOpacity>
  
      <FooterButtons />
    </View>
  );
};

const HomeScreen = ({ navigation, route }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.resortsButton}
      onPress={() => navigation.navigate('Resorts', { username: route.params.username })}
    >
      <Text style={{ color: 'white' }}>Resorts</Text>
    </TouchableOpacity>
    <Text style={{ fontSize: 20 }}>Welcome to Home, {route.params.username}!</Text>
    <FooterButtons />
  </View>
);

const Resorts = ({ navigation, route }) => {
  const { username } = route.params;

  // State to keep track of users and membership status for each resort
  const [resortUsers, setResortUsers] = useState({
    Eldora: [],
    Copper: [],
    'Winter Park': [],
  });

  // State to keep track of membership status for each resort
  const [membershipStatus, setMembershipStatus] = useState({
    Eldora: false,
    Copper: false,
    'Winter Park': false,
  });

  const addUserToResort = (resortName) => {
    const isUsernameUnique = Object.values(resortUsers).every(
      (resort) => !resort.includes(username)
    );

    if (isUsernameUnique) {
      const updatedResortUsers = { ...resortUsers };
      updatedResortUsers[resortName] = [...updatedResortUsers[resortName], username];

      const updatedMembershipStatus = { ...membershipStatus };
      updatedMembershipStatus[resortName] = true;

      setResortUsers(updatedResortUsers);
      setMembershipStatus(updatedMembershipStatus);
    } else {
      alert('Username already exists in another resort.');
    }
  };

  const removeUserFromResort = (resortName) => {
    const updatedResortUsers = { ...resortUsers };
    const updatedMembershipStatus = { ...membershipStatus };

    updatedResortUsers[resortName] = updatedResortUsers[resortName].filter(
      (user) => user !== username
    );

    updatedMembershipStatus[resortName] = false;

    setResortUsers(updatedResortUsers);
    setMembershipStatus(updatedMembershipStatus);
  };

  const renderButtonLabel = (resortName) => {
    return membershipStatus[resortName] ? 'Leave' : 'Join';
  };

  return (
    <ScrollView contentContainerStyle={styles.resortContainer}>
      <TouchableOpacity
        style={styles.resortsButton}
        onPress={() => navigation.navigate('Home', { username })}
      >
        <Text style={{ color: 'white' }}>Home</Text>
      </TouchableOpacity>
      <View style={styles.resortsContainer}> 
        <View style={styles.resort}>
          <Text style={styles.boldResortName}>Eldora</Text>
          <View style={styles.people}>
            {resortUsers['Eldora'].map((user, index) => (
              <Text key={index} style={{ color: 'white' }}>
                {user}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.resortButton}
            onPress={() => {
              if (membershipStatus['Eldora']) {
                removeUserFromResort('Eldora');
              } else {
                addUserToResort('Eldora');
              }
            }}
          >
            <Text style={styles.buttonText}>{renderButtonLabel('Eldora')} </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resort}>
          <Text style={styles.boldResortName}>Copper</Text>
          <View style={styles.people}>
            {resortUsers['Copper'].map((user, index) => (
              <Text key={index} style={{ color: 'white' }}>
                {user}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.resortButton}
            onPress={() => {
              if (membershipStatus['Copper']) {
                removeUserFromResort('Copper');
              } else {
                addUserToResort('Copper');
              }
            }}
          >
            <Text style={styles.buttonText}>{renderButtonLabel('Copper')} </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.resort}>
          <Text style={styles.boldResortName}>Winter Park</Text>
          <View style={styles.people}>
            {resortUsers['Winter Park'].map((user, index) => (
              <Text key={index} style={{ color: 'white' }}>
                {user}
              </Text>
            ))}
          </View>
          <TouchableOpacity
            style={styles.resortButton}
            onPress={() => {
              if (membershipStatus['Winter Park']) {
                removeUserFromResort('Winter Park');
              } else {
                addUserToResort('Winter Park');
              }
            }}
          >
            <Text style={styles.buttonText}>{renderButtonLabel('Winter Park')} </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username !== '' && password !== '') {
      navigation.navigate('Home', { username });
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
        <Stack.Screen name="Resorts" component={Resorts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  resortContainer: {
    alignItems: 'center',
    paddingVertical: 20, // Adjust as needed
  },
  resortsContainer: {
    marginTop: 90
  },
  resort: {
    backgroundColor: 'black',
    width: 400,
    marginTop: 20, // Add margin for the first resort
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    height: 100,
    borderRadius: 5,
  },
  boldResortName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resortButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  people: {
    marginTop: 10, // Add margin to separate from the resort name
    padding: 10,
    borderRadius: 5,
  },
  person: {
    color: 'black',
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
  },
  resortsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
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
