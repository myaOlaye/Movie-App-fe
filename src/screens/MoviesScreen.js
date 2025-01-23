import React, { useEffect, useState, useRef, use } from "react";
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
import { fetchToken } from "../api";

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
      <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
        <Text style = {styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

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
  container: { flex: 1, padding: 50, backgroundColor: '#1A1A2E' },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
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
    backgroundColor: "#2E0854",
    borderRadius: 20,
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
    backgroundColor: "#FF004F",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "white",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  filterButton: {
    backgroundColor: '#2e0854',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    width: '50%',
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
