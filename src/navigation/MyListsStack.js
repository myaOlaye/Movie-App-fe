import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyListsScreen } from "../screens/MyListsScreen";
import MovieListScreen from "../screens/MovieListScreen";

const Stack = createNativeStackNavigator();

export default function MyListsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyListsMain"
        component={MyListsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieList"
        component={MovieListScreen}
        options={{ headerShown: true, title: "Movie List" }}
      />
    </Stack.Navigator>
  );
}
