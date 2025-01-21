import React from "react";
import { View, Text, Button } from "react-native";
import MovieListItem from "../components/MovieListItem";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";

import { getMovieListItems } from "../api";


const MovieListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { movielist_id, name } = route.params;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovieListItems(movielist_id).then(({ movieListItems }) => {
      setMovies(movieListItems);
    });
  }, [movielist_id]);

  return (
    <>
      <Text>{name}</Text>
      {movies.length === 0 ? (
        <Text>This list is empty</Text>
      ) : (
        <View>
          {movies.map((movie) => {
            return (
              <MovieListItem
                key={movie.tmdb_movie_id}
                movie={movie}
                navigation={navigation}
              ></MovieListItem>
            );
          })}{" "}
        </View>
      )}
      <Button
        onPress={() => {
          navigation.navigate("MovieSearch");
        }}
        title="Add Movies to List"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </>
  );
};

export default MovieListScreen;
