import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { getGenres } from '../api';

export const MovieFilter = ({ selectedGenres, setSelectedGenres, setSortBy, setSortOrder, setModalVisible, sortBy}) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then((fetchedGenres) => {
      setGenres(fetchedGenres);
    });
  }, []);

  const handleCheck = (genreId) => {
    setSelectedGenres((currSelectedGenres) => {
      const updatedGenres = currSelectedGenres.includes(genreId)
        ? currSelectedGenres.filter((id) => id !== genreId)
        : [...currSelectedGenres, genreId];
      return updatedGenres;
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
    
    <View style={styles.genreContainer}>
      <Button title="Sort by Popularity" onPress={() => handleSortByChange('popularity')} />
      <Button title="Sort by Release Date" onPress={() => handleSortByChange('release_date')} />
      <Button title="Select Genre" onPress={openFilterModal}/>
      {genres.map((genre) => (
        <TouchableOpacity
          key={genre.id}
          style={[
            styles.genreButton,
            selectedGenres.includes(genre.id) && styles.selectedGenreButton,
          ]}
          onPress={() => handleCheck(genre.id)}
        >
          <Text style={styles.genreName}>{genre.name}</Text>
        </TouchableOpacity>
      ))}
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

