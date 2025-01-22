// import { fetchToken } from "../api";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { useState, useEffect } from "react";
// import { getUserMovieLists } from "../api";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";

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
import { useIsFocused, useRoute } from "@react-navigation/native";
import { getUser } from "../api";

const AddToListScreen = ({ navigation }) => {
  const route = useRoute();
  const { movieName, tmdb_movie_id } = route.params;
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          ></TouchableOpacity>
          <Text style={styles.title}>
            {" "}
            Which list would you like to add {movieName} to?{" "}
          </Text>
        </View>

        <View style={styles.content}>
          {privateMovieLists.map((list) => (
            <TouchableOpacity
              key={list.movielist_id}
              style={styles.card}
              onPress={() => {
                navigation.navigate("MovieSearch", {
                  screen: "AddNoteScreen",
                  params: {
                    movielist_id: list.movielist_id,
                    listName: list.name,
                    tmdb_movie_id: tmdb_movie_id,
                    movieName: movieName,
                  },
                });
              }}
            >
              <Image
                source={{
                  uri: userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              ></Image>
              <Text style={styles.creatorText}>Creator</Text>
              <Text style={styles.cardText}>🔒 {list.name}</Text>
            </TouchableOpacity>
          ))}

          {acceptedMovieLists.map((list) => (
            <TouchableOpacity
              key={list.movielist_id}
              style={styles.card}
              onPress={() => {
                navigation.navigate("MovieSearch", {
                  screen: "AddNoteScreen",
                  params: {
                    movielist_id: list.movielist_id,
                    listName: list.name,
                    tmdb_movie_id: tmdb_movie_id,
                    movieName: movieName,
                  },
                });
              }}
            >
              <Image
                source={{
                  uri:
                    list.userImage || "https://example.com/default-profile.png",
                }}
                style={styles.profileImage}
              />
              <Text style={styles.creatorText}>Creator</Text>
              <Text style={styles.cardText}>🤝 {list.name}</Text>
            </TouchableOpacity>
          ))}

          {sentPendingMovieLists.map((list) => (
            <View key={list.movielist_id} style={styles.pendingCard}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("MovieSearch", {
                    screen: "AddNoteScreen",
                    params: {
                      movielist_id: list.movielist_id,
                      listName: list.name,
                      tmdb_movie_id: tmdb_movie_id,
                      movieName: movieName,
                    },
                  });
                }}
              >
                <Image
                  source={{
                    uri:
                      list.userImage ||
                      "https://example.com/default-profile.png",
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.pendingTextContainer}>
                  <Text style={styles.cardText}>{list.name}</Text>
                  <Text style={styles.pendingText}>
                    Pending acceptance by {list.receiver_username}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
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
  creatorText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#888",
    marginLeft: 8,
  },
  pendingCard: {
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
  pendingTextContainer: {
    flex: 1,
    marginLeft: 12,
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

export default AddToListScreen;
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { movieName, tmdb_movie_id } = route.params;

//   const [username, setUsername] = useState(null);
//   const [owner_id, setOwner_id] = useState(null);
//   const [movieLists, setMovieLists] = useState([]);
//   const [excluded_movielist_ids, SetExcluded_movielist_ids] = useState([]);

//   useEffect(() => {
//     fetchToken().then((res) => {
//       setOwner_id(res.data.decode.user_id);
//       setUsername(res.data.decode.username);
//     });
//   }, [owner_id, username]);

//   useEffect(() => {
//     if (owner_id) {
//       getUserMovieLists(owner_id, excluded_movielist_ids).then(
//         ({ movieLists }) => {
//           setMovieLists(movieLists);
//         }
//       );
//     }
//   }, [owner_id]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.subtitle}>
//           Which list would you like to add {movieName} to?{" "}
//         </Text>

//         {movieLists.map((movieLists) => (
//           <TouchableOpacity
//             key={movieLists.movielist_id}
//             style={styles.card}
//             onPress={() => {
//               navigation.navigate("MovieSearch", {
//                 screen: "AddNoteScreen",
//                 params: {
//                   movielist_id: movieLists.movielist_id,
//                   listName: movieLists.name,
//                   tmdb_movie_id: tmdb_movie_id,
//                   movieName: movieName,
//                 },
//               });
//             }}
//           >
//             <View style={styles.cardContent}>
//               <Ionicons name="happy" size={24} color="#888" />
//               <Text style={styles.cardText}>{movieLists.name}</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//         <TouchableOpacity style={styles.card} onPress={() =>{navigation.navigate("CreateList")}}>
//           <View style={styles.cardContent}>
//             <Ionicons name="add" size={24} color="#888" />
//             <Text style={styles.cardText}>Create a new list</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   backButton: {
//     marginRight: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   subtitle: {
//     fontSize: 18,
//     marginBottom: 24,
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#F5F5F5",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//   },
//   cardContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cardText: {
//     fontSize: 16,
//     marginLeft: 12,
//   },
//   bottomNav: {
//     flexDirection: "row",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     paddingVertical: 8,
//   },
//   navItem: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//     color: "#888",
//   },
//   activeNavText: {
//     color: "#000",
//   },
// });

// export default AddToListScreen;
