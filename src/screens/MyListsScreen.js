import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { fetchToken, getUserMovieLists } from "../api";
import { useIsFocused } from "@react-navigation/native";

export const MyListsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [username, setUsername] = useState(null);
  const [owner_id, setOwner_id] = useState(null);
  const [movieLists, setMovieLists] = useState([]);
  const [excluded_movielist_ids, SetExcluded_movielist_ids] = useState([]);

  useEffect(() => {
    fetchToken().then((res) => {
      setOwner_id(res.data.decode.user_id);

      setUsername(res.data.decode.username);
    });
  }, [owner_id, username]);

  useEffect(() => {
    if (isFocused) {
      if (owner_id) {
        getUserMovieLists(owner_id, excluded_movielist_ids).then(
          ({ movieLists }) => {
            setMovieLists(movieLists);
          }
        );
      }
    }
  }, [owner_id]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{}</Text>
      </View>
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>Your Lists</Text>
        {/* List Options */}
        {movieLists.map((movieLists) => (
          <TouchableOpacity
            key={movieLists.movielist_id}
            style={styles.card}
            onPress={() => {
              navigation.navigate("MovieList", {
                movielist_id: movieLists.movielist_id,
                name: movieLists.name,
              });
            }}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardText}>{movieLists.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate("CreateList");
          }}
        >
          <View style={styles.cardContent}>
            <Ionicons name="add" size={24} color="#888" />
            <Text style={styles.cardText}>Create a new list</Text>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 16,
    marginLeft: 12,
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
  activeNavText: {
    color: "#000",
  },
});
