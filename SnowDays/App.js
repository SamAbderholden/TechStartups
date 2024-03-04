import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Text, TextInput, useEffect } from 'react-native';
import LoginScreen from './Screens/LoginScreen.js';
import HomeScreen from './Screens/HomeScreen.js';
import CreateScreen from './Screens/CreateScreen.js';
import ProfileScreen from './Screens/ProfileScreen.js';
import ResortsScreen from './Screens/ResortsScreen.js';
import GhostProfile from './Screens/GhostProfile.js'

const Stack = createStackNavigator();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          cardStyleInterpolator: TransitionPresets.SlideFromRightIOS.cardStyleInterpolator,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 0.0001 } },
            close: { animation: 'timing', config: { duration: 0.0001 } },
          },
        }}
      >
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Resorts" component={ResortsScreen} />
        <Stack.Screen name="GhostProfile" component={GhostProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

