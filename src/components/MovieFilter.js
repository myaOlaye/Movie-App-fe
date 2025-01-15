import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getGenres } from '../api';

export const MovieFilter = ({ setMovieFilters, selectedGenres, setSelectedGenres }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then((fetchedGenres) => {
      setGenres(fetchedGenres);
    });
  }, []);

  const handleCheck = (genreId) => {
    setMovieFilters((currMovieFilters) => {
      if (currMovieFilters.includes(genreId)) {
        setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
        return currMovieFilters.filter((movieFilter) => movieFilter !== genreId);
      } else {
        setSelectedGenres([...selectedGenres, genreId]);
        return [...currMovieFilters, genreId];
      }
    });
  };

  return (
    <View style={styles.genreContainer}>
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
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    margin: 5,
  },
  selectedGenreButton: {
    backgroundColor: '#1769B5',
  },
  genreName: {
    color: 'white',
    fontWeight: 'bold',
  },
});