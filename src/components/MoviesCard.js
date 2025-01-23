import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Image,
  StyleSheet,
} from "react-native";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const MoviesCard = ({ navigation, movies }) => {
 

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.poster_path ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
                  style={styles.imagePlaceholder}
                  resizeMode ='cover'
                />
              </View>
            ) : (
              <Text>No Image Available</Text>
            )}

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>Release Date: {item.release_date}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.replace("MovieInfo", { id: item.id })}
            >
              <Text style={styles.buttonText}>View</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  movieContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    padding: 10,
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 400,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    paddingVertical: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1A1A2E",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
