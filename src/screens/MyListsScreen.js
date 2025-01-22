import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
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
import { getUser } from "../api";

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

          const fetchMovieListsWithImages = (shares) =>
            Promise.all(
              shares.map((share) =>
                getMovieListsByMovieListId(share.movielist_id).then(
                  ({ movieList }) => {
                    const userToFetch = share.owner_username;

                    return getUser(userToFetch).then(({ user }) => ({
                      ...movieList[0],
                      share_id: share.share_id,
                      owner_username: share.owner_username,
                      receiver_username: share.receiver_username,
                      userImage: user.profile_img,
                    }));
                  }
                )
              )
            );

          return Promise.all([
            fetchMovieListsWithImages(accepted),
            fetchMovieListsWithImages(sentPending),
            fetchMovieListsWithImages(receivedPending),
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
              <Image
                source={{
                  uri: userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              ></Image>
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
              <Image
                source={{
                  uri:
                    list.userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.cardText}>{list.name}</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.subtitle}>Sent Lists Pending Acceptance</Text>
          {sentPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.card}>
              <Image
                source={{
                  uri:
                    list.userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.cardText}>{list.name}</Text>
              <Text>Pending acceptance by {list.receiver_username}</Text>
            </View>
          ))}

          <Text style={styles.subtitle}>Received Join List Requests</Text>
          {recievedPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.card}>
              <Image
                source={{
                  uri:
                    list.userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              />
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // Light background color for a clean look
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32, // Extra space for scrolling
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
  },
  content: {
    paddingVertical: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#34495e",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
    flex: 1,
    marginLeft: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#e6e6e6",
  },
  buttonAccept: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
    marginRight: 8,
  },
  buttonDecline: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  addButton: {
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888888",
    marginLeft: 12,
  },
});
