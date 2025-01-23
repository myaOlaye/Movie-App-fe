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
      .then(() => {
        // Find the specific list first
        const acceptedList = recievedPendingMovieLists.find(
          (list) => list.share_id === share_id
        );
        // Update the receivedPendingMovieLists to exclude the accepted list
        setRecievedPendingMovieLists((prev) =>
          prev.filter((list) => list.share_id !== share_id)
        );

        if (response === "accepted") {
          // Add the accepted list to acceptedMovieLists
          setAcceptedMovieLists((prev) => [...prev, acceptedList]);
        }
      })
      .catch((err) => console.error("Error responding to share request:", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}></View>
        <Text style={styles.title}>Your Movie Lists</Text>
        <View style={styles.content}>
          {recievedPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.pendingCard}>
              <Image
                source={{
                  uri:
                    list.userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.cardText}>{list.name}</Text>
              <View style={styles.pendingTextContainer}>
                <Text style={styles.pendingText}>
                  {list.owner_username} has invited you to join this list
                </Text>
                <View style={styles.responseButtons}>
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
              </View>
            </View>
          ))}

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
              <Text style={styles.cardText}> {list.name}</Text>
              <Text style={styles.emoji}>🔒</Text>
            </TouchableOpacity>
          ))}

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
              <Text style={styles.cardText}> {list.name}</Text>
              <Text style={styles.emoji}>🫂</Text>
            </TouchableOpacity>
          ))}

          {sentPendingMovieLists.map((list) => (
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
              <View style={styles.pendingTextContainer}>
                <Text style={styles.pendingText}>
                  Pending acceptance by {list.receiver_username}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              navigation.navigate("CreateList");
            }}
          >
            <Ionicons name="add" size={24} color="#888" />
            <Text style={styles.addButtonText}>Create a new list</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
    margin: 0,
    padding: 0,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  backButton: {
    marginRight: 16,
  },
  title: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  content: {
    paddingVertical: 20,
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
    marginBottom: 26,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    position: "relative", // Added to enable absolute positioning of the lock
  },
  pendingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 26,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "column", // Ensures text stays below the movie name
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#e6e6e6",
  },
  creatorText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#888",
    marginLeft: 8,
  },
  emoji: {
    position: "absolute", // Added for positioning
    top: 15, // Fine-tuned to position the lock inside the card
    right: 20, // Fine-tuned to position the lock inside the card
    fontSize: 20, // Adjusted for visibility
    color: "#888", // Matches the card design aesthetic
  },

  cardText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2c3e50",
    marginLeft: 12, // Adds spacing between image and text
  },
  pendingTextContainer: {
    marginTop: 12, // Adds space between the title and the pending text
    marginLeft: 12, // Ensures consistent margin on the left
  },
  pendingText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666666",
    marginBottom: 8, // Spacing between text and buttons
  },
  responseButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonAccept: {
    backgroundColor: "#4B0082",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8, // Spacing between buttons
  },
  buttonDecline: {
    backgroundColor: "#B8B8B8",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  addButton: {
    backgroundColor: "#f1f1f1",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 26,
    marginLeft: 20,
    marginRight: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888888",
    marginLeft: 12,
  },
});
