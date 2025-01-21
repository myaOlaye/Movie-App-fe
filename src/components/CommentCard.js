import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getMovieListItem } from "../apiCopy";

export const CommentCard = ({ movieId }) => {
  const route = useRoute();
  const { movielist_id, tmdb_movie_id } = route.params;
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMovieListItem(3, 911)
      .then(({ movie }) => {
        setNote(movie[0].notes);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [movielist_id, tmdb_movie_id]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.notesTitle}>Notes:</Text>
      <Text style={styles.comment}>{note}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  notesTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
});
