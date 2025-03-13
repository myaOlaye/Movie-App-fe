import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import MovieListItem from "../components/MovieListItem";
import {
  useRoute,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import colours from "./theme/colours";
import { getMovieListItems } from "../api";

const MovieListScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();
  const { movielist_id, name } = route.params;
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (isFocused)
      getMovieListItems(movielist_id).then(({ movieListItems }) => {
        setMovies(movieListItems);
      });
  }, [movielist_id, isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{name}</Text>

      {/* Content */}
      {movies.length === 0 ? (
        <Text style={styles.emptyText}>This list is empty</Text>
      ) : (
        <View style={styles.listContainer}>
          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => navigation.navigate("Share", { movielist_id })}
          >
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <ScrollView>
            {movies.map((movie) => (
              <MovieListItem
                key={movie.tmdb_movie_id}
                movie={movie}
                navigation={navigation}
                style={styles.movieItem}
                movielist_id={movielist_id}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Add Movies Button */}
      <TouchableOpacity
        style={styles.circularAddButton}
        onPress={() => navigation.navigate("MovieSearch")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  title: {
    color: "white",
    fontSize: 25,
    textAlign: "center",
    marginTop: 5,
    padding: 20,
  },
  listContainer: {
    flex: 1,
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 60, // Increased height for button appearance
    justifyContent: "center",
  },
  shareButton: {
    backgroundColor: colours.indigo,
    shadowColor: colours.accent,
    marginBottom: 16,
    padding: 10,
    width: "20%",
    alignSelf: "end",
    borderRadius: 15,
  },
  shareButtonText: {
    color: colours.text,
    fontSize: 14,
    textAlign: "center",
  },
  circularAddButton: {
    backgroundColor: colours.indigo,
    shadowColor: colours.accent,
    width: 60,
    height: 60,
    borderRadius: 30, // Makes the button circular
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    left: "50%",
    transform: [{ translateX: -30 }], // Proper centering
    elevation: 5,
  },
  addButtonText: {
    color: colours.text,
    fontSize: 36, // Larger font size for the + symbol
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default MovieListScreen;
