import React from 'react';
import { Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './Screens/LoginScreen.js';
import HomeScreen from './Screens/HomeScreen.js';
import CreateScreen from './Screens/CreateScreen.js';
import ProfileScreen from './Screens/ProfileScreen.js';
import ResortsScreen from './Screens/ResortsScreen.js';
import GhostProfile from './Screens/GhostProfile.js';
import ResetPasswordScreen from './Screens/ResetPassword.js';
import SignUp from './Screens/SignUp.js';

const Drawer = createDrawerNavigator();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login" screenOptions={{ swipeEnabled: false, headerShown: false }}>
        <Drawer.Screen name="Login" component={LoginScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Create" component={CreateScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Resorts" component={ResortsScreen} />
        <Drawer.Screen name="GhostProfile" component={GhostProfile} />
        <Drawer.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Drawer.Screen name="SignUp" component={SignUp} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
