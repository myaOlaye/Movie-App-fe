import React, { useEffect, useState, useRef, use } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { getMovies, searchMovies, getTopRatedMovies } from "../api";
import { MovieFilter } from "../components/MovieFilter";
import { MoviesSearch } from "../components/MovieSearch";
import { MoviesCard } from "../components/MoviesCard";
import colours from "./theme/colours";

export const MoviesScreen = ({ navigation }) => {
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [query, setQuery] = useState("");

  const isInitialMount = useRef(true);

  useEffect(() => {
    setLoading(true);
    getMovies(1, sortBy, sortOrder, selectedGenres)
      .then((fetchedMovies) => {
        setPopularMovies(fetchedMovies);
      })
      .then(() => {
        getTopRatedMovies().then((fetchedMovies) => {
          setTopRatedMovies(fetchedMovies);
          setLoading(false);
        });
      });
  }, [sortBy, sortOrder, selectedGenres]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      console.log("in else");
      setLoading(true);
      searchMovies(query).then((fetchedMovies) => {
        console.log(fetchedMovies, "<-- movies fetched with query");
        setSearchedMovies(fetchedMovies);
        setLoading(false);
      });
    }
  }, [query]);

  const openFilterModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <MoviesSearch setQuery={setQuery} />

        {loading && <Text>Loading...</Text>}

        {query && (
          <View>
            <Text style={styles.movieListHeadersText}>
              {" "}
              You searched for "{query}"
            </Text>
            <MoviesCard navigation={navigation} movies={searchedMovies} />
          </View>
        )}

        <View>
          <View style={styles.popularTodayDiv}>
            <Text style={styles.movieListHeadersText}>Popular Today</Text>

            <View style={styles.filters}>
              <Ionicons
                name="filter-outline"
                size={24}
                color="white"
                style={styles.filterIcon}
                onPress={openFilterModal}
              />
              <Text style={styles.filterText} onPress={openFilterModal}>
                {" "}
                Filter
              </Text>
            </View>
          </View>

          <MoviesCard navigation={navigation} movies={popularMovies} />
        </View>

        <View>
          <Text style={styles.movieListHeadersText}>Top Rated Movies</Text>
          <MoviesCard navigation={navigation} movies={topRatedMovies} />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Filter</Text>
                <MovieFilter
                  selectedGenres={selectedGenres}
                  setSelectedGenres={setSelectedGenres}
                  setSortBy={setSortBy}
                  setSortOrder={setSortOrder}
                  setModalVisible={setModalVisible}
                  sortBy={sortBy}
                />
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    backgroundColor: "#100C08",
  },
  movieListHeadersText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 20,
    marginRight: 20,
    marginBottom: 15,
  },
  popularTodayDiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "blue",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    margin: 20,
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    height: "50%",
  },
  buttonClose: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  filters: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  filterIcon: {
    color: "white",
    marginHorizontal: 5,
    display: "block",
  },
  filterText: {
    color: "white",
    fontSize: 12,
  },
  modalText: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
});
