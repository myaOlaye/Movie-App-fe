import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";

import { addMovieToList } from "../api";

const AddNoteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { listName, tmdb_movie_id, movielist_id, movieName } = route.params;
  const [comment, setComment] = useState("");

  const handleComment = () => {
    addMovieToList(movielist_id, tmdb_movie_id, comment)
      .then(() => {
        navigation.navigate("MyLists", {
          screen: "MovieList",
          params: { movielist_id, name: listName },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log(comment);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}></View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>Leave a note with {movieName}?</Text>
          <Text style={styles.description}>
            Notes are messages or comments you can leave with a saved movie.
            They can be your thoughts, feelings or anything else.
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type your note here ..."
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleComment}>
            Add to '{listName}'
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 24,
    textAlign: "center",
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    height: 150,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default AddNoteScreen;
