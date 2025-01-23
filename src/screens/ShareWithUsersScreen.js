import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getUsers } from "../api";
import { SearchUser } from "../components/SearchUser";
import { fetchToken } from "../api";
import { ShareMovie } from "../api";

export const ShareWithUsers = () => {
  const route = useRoute();
  const { movielist_id } = route.params;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [owner_id, setOwner_id] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    fetchToken().then((res) => {
      setOwner_id(res.data.decode.user_id);
      setUsername(res.data.decode.username);
    });
  }, [owner_id, username]);

  useEffect(() => {
    getUsers()
      .then((fetchedUsers) => {
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
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
    closeFilterModal();
    const reqBody = {
      movielist_id,
      owner_username: username,
      receiver_username: selectedUser.username,
    };

    console.log(reqBody);
    ShareMovie(reqBody)
      .then(() => {
        alert(`Share request sent to ${selectedUser.username}`);
      })
      .catch((error) => {
        console.error("Error sharing movie:", error);
        alert("Failed to send share request. Please try again.");
      });
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
    backgroundColor: "#1A1A2E",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "#ffffff",
  },
  noUsers: {
    textAlign: "center",
    fontSize: 16,
    color: "#ffffff",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonClose: {
    backgroundColor: "#4B0082",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#B8B8B8",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
