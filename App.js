import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import HomeScreen from "./src/screens/Homescreen";
import MovieInfo from "./src/screens/MovieInfo";
import { ShareWithUsers } from "./src/screens/ShareWithUsersScreen";
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { CreateNewList } from "./src/screens/CreateNewList";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="MovieInfo" 
        component={MovieInfo} 
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-add" size={size} color={color} />
            ),
          }}
        />
        <Stack.Screen
          name="Share"
          component={ShareWithUsers}
          options={{ headerShown: true }}
        />
            <Stack.Screen
          name="CreateList"
          component={CreateNewList}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
