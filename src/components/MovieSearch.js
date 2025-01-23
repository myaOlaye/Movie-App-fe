import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { searchMovies } from '../api';
export const MoviesSearch = ({setQuery}) => {
  const [queryInput, setQueryInput] = useState('');

  const handleSearch = () => {
    setQuery(queryInput);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for movies"
        value={queryInput}
        onChangeText={(text) => setQueryInput(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.textStyle}>Search</Text>
      </TouchableOpacity>
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
      borderRadius: 8,
      width: '90%',
      backgroundColor: '#2e0854',
      color: 'white',
      fontWeight: 'bold',
    },
    container: {
      alignItems: 'center', 
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    textStyle: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    button:{
      backgroundColor: 'white',
      padding: 10,
      margin: 10,
      borderRadius: 5,
      width: 100,
    }
  });
