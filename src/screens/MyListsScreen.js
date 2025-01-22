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
} from "../api";
import { respondToShareRequest } from "../api";

export const MyListsScreen = ({ navigation }) => {
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
        console.log(res.data.decode);
        const { user_id, username, image } = res.data.decode;
        setUser_id(user_id);
        setUsername(username);
        setUserImage(image);
      })
      .catch((err) => console.error("Error fetching token:", err));
  }, []);

  useEffect(() => {
    if (username) {
      getMovieListShares(username)
        .then(({ movieListShares }) => {
          const sentPendingMovieListShares = [];
          const recievedPendingMovieListShares = [];
          const acceptedMovieListShares = [];

          // Categorize movie shares into accepted, pending sent and pending recieved
          movieListShares.forEach((share) => {
            if (share.status === "accepted") {
              acceptedMovieListShares.push(share);
            } else if (share.status === "pending") {
              if (share.owner_username === username) {
                sentPendingMovieListShares.push(share);
              } else recievedPendingMovieListShares.push(share);
            }
          });

          // Utility function to fetch movie lists
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

          // Fetch different lists using the utility function
          const fetchAcceptedLists = fetchMovieLists(acceptedMovieListShares);
          const fetchSentPendingLists = fetchMovieLists(
            sentPendingMovieListShares
          );
          const fetchReceivedPendingLists = fetchMovieLists(
            recievedPendingMovieListShares
          );

          return Promise.all([
            fetchAcceptedLists,
            fetchSentPendingLists,
            fetchReceivedPendingLists,
          ]);
        })
        .then(([acceptedLists, sentPendingLists, recievedPendingLists]) => {
          setAcceptedMovieLists(acceptedLists);
          setSentPendingMovieLists(sentPendingLists);
          setRecievedPendingMovieLists(recievedPendingLists);

          // Fetch private movie lists
          const excludedIDs = [
            ...acceptedLists,
            ...sentPendingLists,
            ...recievedPendingLists,
          ].map((list) => list.movielist_id);

          return getUserMovieLists(user_id, excludedIDs);
        })
        .then(({ movieLists }) => setPrivateMovieLists(movieLists))
        .catch((err) => console.error("Error fetching movie lists:", err));
    }
  }, [username, user_id]);

  const handleResponse = (share_id, response) => {
    respondToShareRequest(share_id, response).then((res) => {
      console.log(res);
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>My Lists</Text>
        </View>

        {/* Content */}
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
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{list.name}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitle}> Accepted Shared Lists</Text>
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
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{list.name}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitle}>Sent Lists pending acceptance</Text>
          {sentPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{list.name}</Text>
              </View>
              <Text>Pending acceptance by {list.receiver_username}</Text>
            </View>
          ))}
          <Text style={styles.subtitle}>Recieved Join List Requests</Text>
          {recievedPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{list.name}</Text>
              </View>
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
            <View style={styles.cardContent}>
              <Ionicons name="add" size={24} color="#888" />
              <Text style={styles.cardText}>Create a new list</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    color: "#555",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4, // For Android shadow
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  buttonAccept: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  buttonDecline: {
    backgroundColor: "#F44336",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
