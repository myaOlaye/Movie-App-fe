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

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

export const MoviesCard = ({ navigation, movies }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        horizontal={true}
        key={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.poster_path ? (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() =>
                  navigation.navigate("MovieInfo", { id: item.id })
                }
              >
                <Image
                  source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
                  style={styles.imagePlaceholder}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ) : (
              <Text>No Image Available</Text>
            )}

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.release_date}</Text>
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
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  card: {
    width: 150,
    marginRight: 1,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: 150,
    height: 300,
    marginBottom: 12,

    borderRadius: 12,
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    flexWrap: "wrap",
  },
  date: {
    fontSize: 10,
    color: "#888",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#7F00FF",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
