import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUsers } from '../api';
import { SearchUser } from '../components/SearchUser';

export const ShareWithUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    getUsers()
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    openFilterModal();
  };

  const openFilterModal = () => {
    setModalVisible(true);
  };

  const closeFilterModal = () => {
    setModalVisible(false);
    setSelectedUser(null); 
  };

  const confirmShare = () => {
    console.log('Sharing with user:', selectedUser);
    closeFilterModal();
    // Add sharing functionality here/ navigae?
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchUser
        onSearch={(query) => {
          const filtered = users.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredUsers(filtered);
        }}
      />
      {filteredUsers.length === 0 ? (
        <Text style={styles.noUsers}>No users found</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeFilterModal}
      >
        <TouchableWithoutFeedback onPress={closeFilterModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to share with {selectedUser?.username}?
              </Text>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={confirmShare}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttonClose, styles.cancelButton]}
                onPress={closeFilterModal}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  noUsers: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
