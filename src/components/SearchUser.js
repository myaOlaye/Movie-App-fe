import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const SearchUser = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (text) => {
    setSearchInput(text);
    onSearch(text)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search for a user</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for User"
        value={searchInput}
        onChangeText={handleSearch} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'gray',
  },
});
