import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/Homescreen'; 
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import { MoviesScreen } from './src/screens/MoviesScreen';
import MovieInfo from './src/screens/MovieInfo';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Movies"
          component={MoviesScreen}
          options={{
            headerShown: false }}
        />
        <Stack.Screen
        name="MovieInfo"
        component={MovieInfo}
        options={{
          headerShown: false, }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
