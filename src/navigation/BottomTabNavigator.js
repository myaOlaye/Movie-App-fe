import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MovieSearchStack from "./MovieSearchStack";
import ProfileScreen from "../screens/Profile";
import MyListsStack from "./MyListsStack";
import colours from "../screens/theme/colours";

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MovieSearch"
      screenOptions={{
        tabBarStyle: {
          height: 80,
          paddingTop: 8,
          backgroundColor: colours.background,
          borderColor: colours.background,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tab.Screen
        name="MovieSearch"
        component={MovieSearchStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MyLists"
        component={MyListsStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
