import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MoviesScreen } from "../screens/MoviesScreen";
import MovieInfo from "../screens/MovieInfo";
import AddToListScreen from "../screens/AddToListScreen";
import AddNoteScreen from "../screens/AddNoteScreen";

const Stack = createNativeStackNavigator();

export default function MovieSearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MovieSearchMain"
        component={MoviesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieInfo"
        component={MovieInfo}
        options={{ headerShown: true, title: "Search for a Movie" }}
      />
      <Stack.Screen
        name="AddToListScreen"
        component={AddToListScreen}
        options={{ headerShown: true, title: "Movie Info" }}
      />
      <Stack.Screen
        name="AddNoteScreen"
        component={AddNoteScreen}
        options={{ headerShown: true, title: "Back" }}
      />
    </Stack.Navigator>
  );
}
