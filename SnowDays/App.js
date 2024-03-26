import React, { useEffect, useState } from 'react';
import { Text, TextInput, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebase.js';
import LoginScreen from './Screens/LoginScreen.js';
import HomeScreen from './Screens/HomeScreen.js';
import CreateScreen from './Screens/CreateScreen.js';
import ProfileScreen from './Screens/ProfileScreen.js';
import ResortsScreen from './Screens/ResortsScreen.js';
import GhostProfile from './Screens/GhostProfile.js';
import ResetPasswordScreen from './Screens/ResetPassword.js';
import SignUp from './Screens/SignUpScreen.js';
import GearPage from './Screens/GearScreen.js';

const Drawer = createDrawerNavigator();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [username, setUsername] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      if (currentUser) {
        // If a user is signed in, extract username from the email
        const username = currentUser.email.split('@')[0];
        setUsername(username);
      } else {
        setUsername('');
      }
      setUser(currentUser);
      setLoading(false); // Update loading state after checking auth state
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  if (loading) {
    // Show loading indicator while checking authentication state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ swipeEnabled: false, headerShown: false }}>
        {user ? (
          // Authenticated User Screens
          <>
            <Drawer.Screen name="Home" component={HomeScreen} initialParams={{ username: username }} />
            <Drawer.Screen name="Create" component={CreateScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="Resorts" component={ResortsScreen} />
            <Drawer.Screen name="GearPage" component={GearPage} />
            <Drawer.Screen name="GhostProfile" component={GhostProfile} />
          </>
        ) : (
          // Unauthenticated User Screens
          <>
            <Drawer.Screen name="Login" component={LoginScreen} />
            <Drawer.Screen name="SignUp" component={SignUp} />
            <Drawer.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
