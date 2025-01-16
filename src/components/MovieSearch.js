import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { searchMovies } from '../api';

export const MoviesSearch = ({setQuery}) => {
  const [queryInput, setQueryInput] = useState('');

    const handleSearch = () => {
        setQuery(queryInput);
      };

  return (
    <View>
        <TextInput
        style={styles.input}
        placeholder="Search for movies"
        value={queryInput}
        onChangeText={(text) => setQueryInput(text)}
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
  