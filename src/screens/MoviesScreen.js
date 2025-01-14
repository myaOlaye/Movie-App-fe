import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getMovies, searchMovies, findMovieById, getGenres, getMoviesByGenre } from '../api';
// import MovieInfo from './MovieInfo';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';  

export const MoviesScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');
  // const [genre, setGenre] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  

  useEffect(() => {
    setLoading(true);
    getGenres()
      .then((fetchedGenres) => {
        setGenres(fetchedGenres);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setLoading(false);
      });
    getMovies(1, sortBy, sortOrder)
      .then((fetchedMovies) => {
        setMovies(fetchedMovies);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, [sortBy, sortOrder]);
  
  const handleSearch = () => {
    setLoading(true);
    searchMovies(query).then((results) => {
      setMovies(results);
      setLoading(false);
    });
  };
  const handleSortByChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
    } else {
    setSortBy(newSortBy);
    setSortOrder('desc');
  }};
  const openFilterModal = () => {
    setModalVisible(true);
  };

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setModalVisible(false);
    fetchMoviesByGenre(genreId);
  };

  const fetchMoviesByGenre = (genreId) => {
    setLoading(true);
    getMoviesByGenre(genreId)
      .then((fetchedMovies) => {
        setMovies(fetchedMovies);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies by genre:', error);
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1, padding: 100 }}>
      <TextInput
        style={styles.input}
        placeholder="Search for movies"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />
      <Button title="Sort by Popularity" onPress={() => handleSortByChange('popularity')} />
      <Button title="Sort by Release Date" onPress={() => handleSortByChange('release_date')} />
      <Button title="Test button" onPress={() => openFilterModal('genre', 'Action')} />
        

      {loading && <Text>Loading...</Text>}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieContainer}>
            {item.poster_path ? (
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
                style={styles.poster}
              />
            ) : (
              <Text>No Image Available</Text>
            )}
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Button title="View Details" onPress={() => navigation.replace('MovieInfo', { id: item.id })} />
          </View>
        )}
      />

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Genre</Text>
            <FlatList
              data={genres}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.genreButton}
                  onPress={() => handleGenreSelect(item.name)}
                >
                  <Text style={styles.textStyle}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  movieContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  genreButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 5,
  },
});