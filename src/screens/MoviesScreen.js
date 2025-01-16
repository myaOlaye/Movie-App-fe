import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getMovies, getGenres } from '../api';
import { MovieFilter } from '../components/MovieFilter';
import { MoviesSearch } from '../components/MovieSearch';
import { MoviesCard } from '../components/MoviesCard';


export const MoviesScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState('');
  const [genres, setGenres] = useState([]);
  const [movieFilters, setMovieFilters] = useState([]);
  

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
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [sortBy, sortOrder, movieFilters]);

  const fetchMovies = () => {
    setLoading(true);
    getMovies(1, sortBy, sortOrder, movieFilters)
      .then((fetchedMovies) => {
        setMovies(fetchedMovies);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  };

  const handleSortByChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const openFilterModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 100 }}>
      <MoviesSearch setMovies = {setMovies} setLoading={setLoading} />
      <Button title="Sort by Popularity" onPress={() => handleSortByChange('popularity')} />
      <Button title="Sort by Release Date" onPress={() => handleSortByChange('release_date')} />
      <Button title="Select Genre" onPress={openFilterModal}/>
        

      {loading && <Text>Loading...</Text>}

<MoviesCard 
navigation={navigation}
movies={movies}
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
            <MovieFilter 
            setMovieFilters={setMovieFilters}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            movieFilters={movieFilters}
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
});
