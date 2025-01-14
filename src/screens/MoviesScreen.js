import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet} from 'react-native';
import { getMovies, searchMovies, findMovieById } from '../api';
import MovieInfo from './MovieInfo';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';  

export const MoviesScreen = ({navigation}) => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    setLoading(true);
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
});
