import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import colours from "./theme/colours";  

import { fetchToken } from "../api";
import { postNewList } from "../api";

export const CreateNewList = ({ navigation }) => {
  const [username, setUsername] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [listTitle, setListTitle] = useState("");

  const handleCreateList = () => {
    postNewList(user_id, listTitle)
      .then(() => {
        navigation.navigate("Main", { screen: "MyLists" });
      })
      .catch((err) => console.error("Error creating list:", err));
  };

  useEffect(() => {
    fetchToken()
      .then((res) => {
        const { user_id, username } = res.data.decode;
        setUser_id(user_id);
        setUsername(username);
      })
      .catch((err) => console.error("Error fetching token:", err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Create a New List</Text>

   
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter list name"
          placeholderTextColor={colours.mutedText} 
          value={listTitle}
          onChangeText={setListTitle}
        />
      </View>

      {/* Button */}
      <TouchableOpacity style={styles.actionButton} onPress={handleCreateList}>
        <Text style={styles.actionButtonText}>Create List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.background, 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colours.text, 
    textAlign: "center",
    marginBottom: 24,
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: colours.midnightPurple, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    width: "80%", 
    alignSelf: "center", 
  },
  input: {
    height: 36, 
    fontSize: 16, 
    color: colours.text, 
    
    paddingLeft: 8, 
  },
  actionButton: {
    backgroundColor: colours.midnightPurple, 
    borderRadius: 5,
    alignItems: "center",
    padding: 12,
    borderColor: colours.text, 
    borderWidth: 1,
    alignSelf: "center",
    width: "60%", 
  },
  actionButtonText: {
    color: colours.text, 
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateNewList;
