import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { fetchToken } from "../api";
import { postNewList } from "../api";

export const CreateNewList = () => {
    const [username, setUsername] = useState(null);
    const [user_id, setUser_id] = useState(null);
    const [listTitle, setListTitle] = useState("");

const handleCreateList = () => {
    postNewList(user_id, listTitle)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error("Error creating list:", err));
};

    useEffect(() => {
      fetchToken()
        .then((res) => {
          console.log(res.data.decode);
          const { user_id, username } = res.data.decode;
          setUser_id(user_id);
          setUsername(username);
        })
        .catch((err) => console.error("Error fetching token:", err));
    }, []);

    return (
      <View style={styles.container}>
        <Text style={styles.notesTitle}>What would you like to call your list?</Text>
        <TextInput
            style={styles.textInput}
            placeholder= "Name your list"
            value={listTitle}
            onChangeText={setListTitle}
            multiline
            textAlignVertical= "top"
          />
          <TouchableOpacity onPress = {handleCreateList}>
            <Text>Create List</Text>
          </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  notesTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
});
