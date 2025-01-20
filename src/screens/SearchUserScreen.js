import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export const SearchUser = ({ setFilteredUsers, users }) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (users) {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search for a user</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for User"
        value={searchInput}
        onChangeText={(text) => setSearchInput(text)}
      />
      <Button
        title="Search"
        onPress={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    width: '80%',
  },
});