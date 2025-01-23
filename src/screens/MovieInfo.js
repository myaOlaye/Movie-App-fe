import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { findMovieById, getMovieListItems } from "../api";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CommentCard } from "../components/CommentCard";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function MovieInfo() {
  const route = useRoute();
  const { id, showAddButton = true, movielist_id } = route.params;
  const navigation = useNavigation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    findMovieById(id)
      .then((movieData) => {
        setMovie(movieData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {movie && (
        <ScrollView>
          <View style={styles.posterContainer}>
            <Image
              source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }}
              style={styles.poster}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.movieTitle}>{`${movie.title} (${
            movie.release_date.split("-")[0]
          })`}</Text>
          <View style={styles.tagsRow}>
            {movie.genres.map((genre) => {
              return (
                <View style={styles.tagsRow}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{genre.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{movie.overview}</Text>
          </View>
          {showAddButton ? (
            <TouchableOpacity style={styles.button}>
              <Text
                title="Add to watch Lists"
                onPress={() =>
                  navigation.navigate("AddToListScreen", {
                    movieName: movie.title,
                    tmdb_movie_id: id,
                  })
                }
                style={styles.buttonText}
              >
                Add to watch Lists
              </Text>
            </TouchableOpacity>
          ) : (
            <CommentCard movielist_id={movielist_id} tmdb_movie_id={id} />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  posterContainer: {
    height: 400,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  tagsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  tagText: {
    fontSize: 16,
    color: "#666",
  },
  descriptionContainer: {
    backgroundColor: "#F8F8F8",
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  button: {
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MovieInfo;
