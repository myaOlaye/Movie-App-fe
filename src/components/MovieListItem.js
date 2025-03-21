import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { findMovieById } from "../api";

const MovieListItem = ({ movie, navigation, movielist_id }) => {
  const [movieData, setMovieData] = useState({});

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    findMovieById(movie.tmdb_movie_id).then((movie) => {
      setMovieData(movie);
    });
  }, []);

  return (
    <View style={styles.movieItem}>
      <View style={styles.imagePlaceholder}>
        <Image
          source={IMAGE_BASE_URL + movieData.poster_path}
          style={styles.imageContainer}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{movieData.title}</Text>
        <Text style={styles.description}>{movieData.overview}</Text>
        <Text style={styles.description}>{movieData.notes}</Text>
        <TouchableOpacity
          style={styles.seeMoreButton}
          onPress={() =>
            navigation.navigate("MovieInfo", {
              id: movie.tmdb_movie_id,
              showAddButton: false,
              movielist_id,
            })
          }
        >
          See More
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
    marginBottom: 10,
  },
  movieItem: {
    flexDirection: "row",
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imageContainer: {
    width: 150,
    height: 300,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  imagePlaceholder: {
    borderRadius: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "white",
    margin: 10,
  },
  description: {
    fontSize: 14,
    color: "white",
    margin: 10,
  },
  seeMoreButton: {
    backgroundColor: "white",
  },
  rating: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
  trashIcon: {
    fontSize: 20,
    color: "#f00",
  },
  addButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#888",
  },
});

export default MovieListItem;
