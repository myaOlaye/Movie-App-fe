import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUsers } from '../api';
import { SearchUser } from './SearchUserScreen';

export const ShareWithUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getUsers().then((fetchedUsers) => {
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    });
  }, []);

  const handleSelectUser = (user) => {
    // Handle user selection logic here
  };

  return (
    <View style={styles.container}>
      <SearchUser setFilteredUsers={setFilteredUsers} users={users} />
      {filteredUsers.length === 0 ? (
        <Text>No users found</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item)}>
              <Text style={styles.userItem}>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button
        onPress={() => {
          navigation.navigate('Movies');
        }}
        title="Add Movies to List"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});