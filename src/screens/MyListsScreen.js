import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchToken,
  getUserMovieLists,
  getMovieListShares,
  getMovieListsByMovieListId,
  respondToShareRequest,
} from "../api";
import { useIsFocused } from "@react-navigation/native";

export const MyListsScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [username, setUsername] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [acceptedMovieLists, setAcceptedMovieLists] = useState([]);
  const [sentPendingMovieLists, setSentPendingMovieLists] = useState([]);
  const [recievedPendingMovieLists, setRecievedPendingMovieLists] = useState(
    []
  );
  const [privateMovieLists, setPrivateMovieLists] = useState([]);

  useEffect(() => {
    fetchToken()
      .then((res) => {
        const { user_id, username, image } = res.data.decode;
        setUser_id(user_id);
        setUsername(username);
        setUserImage(image);
      })
      .catch((err) => console.error("Error fetching token:", err));
  }, []);

  useEffect(() => {
    if (username && user_id) {
      getMovieListShares(username)
        .then(({ movieListShares }) => {
          const sentPending = [];
          const receivedPending = [];
          const accepted = [];

          movieListShares.forEach((share) => {
            if (share.status === "accepted") {
              accepted.push(share);
            } else if (share.status === "pending") {
              if (share.owner_username === username) {
                sentPending.push(share);
              } else {
                receivedPending.push(share);
              }
            }
          });

          const fetchMovieLists = (shares) =>
            Promise.all(
              shares.map((share) =>
                getMovieListsByMovieListId(share.movielist_id).then(
                  ({ movieList }) => ({
                    ...movieList[0],
                    share_id: share.share_id,
                    owner_username: share.owner_username,
                    receiver_username: share.receiver_username,
                  })
                )
              )
            );

          return Promise.all([
            fetchMovieLists(accepted),
            fetchMovieLists(sentPending),
            fetchMovieLists(receivedPending),
          ]);
        })
        .then(([accepted, sentPending, receivedPending]) => {
          setAcceptedMovieLists(accepted);
          setSentPendingMovieLists(sentPending);
          setRecievedPendingMovieLists(receivedPending);

          const excludedIDs = [
            ...accepted,
            ...sentPending,
            ...receivedPending,
          ].map((list) => list.movielist_id);

          return getUserMovieLists(user_id, excludedIDs);
        })
        .then(({ movieLists }) => setPrivateMovieLists(movieLists))
        .catch((err) => console.error("Error fetching movie lists:", err));
    }
  }, [username, user_id, isFocused]);

  const handleResponse = (share_id, response) => {
    respondToShareRequest(share_id, response)
      .then((res) => console.log("Response submitted:", res))
      .catch((err) => console.error("Error responding to share request:", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>My Lists</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Private Lists</Text>
          {privateMovieLists.map((list) => (
            <TouchableOpacity
              key={list.movielist_id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("MovieList", {
                  movielist_id: list.movielist_id,
                  name: list.name,
                })
              }
            >
              <Text style={styles.cardText}>{list.name}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitle}>Accepted Shared Lists</Text>
          {acceptedMovieLists.map((list) => (
            <TouchableOpacity
              key={list.movielist_id}
              style={styles.card}
              onPress={() =>
                navigation.navigate("MovieList", {
                  movielist_id: list.movielist_id,
                  name: list.name,
                })
              }
            >
              <Text style={styles.cardText}>{list.name}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitle}>Sent Lists Pending Acceptance</Text>
          {sentPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.card}>
              <Text style={styles.cardText}>{list.name}</Text>
              <Text>Pending acceptance by {list.receiver_username}</Text>
            </View>
          ))}

          <Text style={styles.subtitle}>Received Join List Requests</Text>
          {recievedPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.card}>
              <Text style={styles.cardText}>{list.name}</Text>
              <TouchableOpacity
                style={styles.buttonAccept}
                onPress={() => handleResponse(list.share_id, "accepted")}
              >
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDecline}
                onPress={() => handleResponse(list.share_id, "declined")}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.card}>
            <Ionicons name="add" size={24} color="#888" />
            <Text style={styles.cardText}>Create a new list</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: 16 },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  content: { padding: 16 },
  subtitle: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  cardText: { fontSize: 16, fontWeight: "500", color: "#333" },
  buttonAccept: { backgroundColor: "#4CAF50", padding: 8, borderRadius: 8 },
  buttonDecline: { backgroundColor: "#F44336", padding: 8, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "600" },
});
