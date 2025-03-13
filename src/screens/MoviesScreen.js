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
} from "react-native";
import { getMovies, searchMovies } from "../api";
import { MovieFilter } from "../components/MovieFilter";
import { MoviesSearch } from "../components/MovieSearch";
import { MoviesCard } from "../components/MoviesCard";
import colours from "./theme/colours";

export const MoviesScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [query, setQuery] = useState("");

  const isInitialMount = useRef(true);

  useEffect(() => {
    setLoading(true);
    getMovies(1, sortBy, sortOrder, selectedGenres).then((fetchedMovies) => {
      setMovies(fetchedMovies);
      setLoading(false);
    });
  }, [sortBy, sortOrder, selectedGenres]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setLoading(true);
      searchMovies(query).then((fetchedMovies) => {
        setMovies(fetchedMovies);
        setLoading(false);
      });
    }
  }, [query]);

  const openFilterModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MoviesSearch setQuery={setQuery} />
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
          Filter search
        </Text>
      </View>

      {loading && <Text>Loading...</Text>}

      <MoviesCard navigation={navigation} movies={movies} />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingBottom: 0,
    backgroundColor: "#100C08",
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
  },
  modalView: {
    margin: 20,
    backgroundColor: "grey",
    borderRadius: 5,
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
  filters: { display: "flex", flexDirection: "row", alignItems: "center" },
  filterIcon: {
    color: "white",
    marginHorizontal: 8,
    marginVertical: 15,
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
