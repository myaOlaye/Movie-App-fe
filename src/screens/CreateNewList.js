import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export const CreateNewList = () => {
    const [list, setList]= useState("")

    return (
      <View style={styles.container}>
        <Text style={styles.notesTitle}>Notes:</Text>
        
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
