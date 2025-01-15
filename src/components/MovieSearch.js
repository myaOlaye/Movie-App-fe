import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { searchMovies } from '../api';

export const MoviesSearch = ({setMovies, setLoading}) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        setLoading(true);
        searchMovies(query).then((results) => {
          setMovies(results);
          setLoading(false);
        });
      };

  return (
    <View>
        <TextInput
        style={styles.input}
        placeholder="Search for movies"
        value={query}
        onChangeText={(text) => setQuery(text)}
      />
    <Button title="Search" onPress={handleSearch} />
    </View>
)
};  

const styles = StyleSheet.create({
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 8,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  