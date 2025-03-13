import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
export const MoviesSearch = ({ setQuery }) => {
  const [queryInput, setQueryInput] = useState("");

  const handleSearch = () => {
    setQuery(queryInput);
  };

  return (
    <View>
      <Text style={styles.text}>
        Hey Mya! Let's find something to watch...{" "}
      </Text>
      <View style={styles.searchBar}>
        <TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Search for a movie title"
            value={queryInput}
            onChangeText={(text) => setQueryInput(text)}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearch}>
          <AntDesign name="search1" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    color: "black",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
});
