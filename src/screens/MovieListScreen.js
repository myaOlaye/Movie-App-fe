import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import MovieListItem from "../components/MovieListItem";
import { useRoute, useNavigation } from "@react-navigation/native";
import colours from "./theme/colours";
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
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{name}</Text>

      {/* Content */}
      {movies.length === 0 ? (
        <Text style={styles.emptyText}>This list is empty</Text>
      ) : (
        <View style={styles.listContainer}>
        
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => navigation.navigate("Share")}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          {/* Movie List */}
          {movies.map((movie) => (
            <MovieListItem
              key={movie.tmdb_movie_id}
              movie={movie}
              navigation={navigation}
              style={styles.movieItem}
              movielist_id={movielist_id}
            />
          ))}
        </View>
      )}

      {/* Add Movies Button */}
      <TouchableOpacity
        style={[styles.actionButton, styles.addButton]}
        onPress={() => navigation.navigate("MovieSearch")}
      >
        <Text style={styles.addButtonText}>Add Movies to List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colours.text,
    textAlign: "center",
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
    gap: 12,
    paddingVertical: 8,
  },
  emptyText: {
    color: colours.mutedText,
    textAlign: "center",
    fontSize: 16,
    marginTop: 32,
  },
  movieItem: {
    backgroundColor: colours.midnightPurple,
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: colours.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  shareButton: {
    backgroundColor: colours.accent,
    marginBottom: 16,
  },
  shareButtonText: {
    color: colours.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: colours.indigo,
  },
  addButtonText: {
    color: colours.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MovieListScreen;
