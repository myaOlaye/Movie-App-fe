import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getGenres } from "../api";
import colours from "../screens/theme/colours";

export const MovieFilter = ({
  selectedGenres,
  setSelectedGenres,
  setSortBy,
  setSortOrder,
  setModalVisible,
  sortBy,
}) => {
  const [genres, setGenres] = useState([]);
  const [selectedSortOption, setSelectedSortOption] =
    useState("popularity-desc");

  useEffect(() => {
    getGenres().then((fetchedGenres) => {
      setGenres(fetchedGenres);
    });
  }, []);

  const handleCheck = (genreId) => {
    setSelectedGenres((currSelectedGenres) => {
      const updatedGenres = currSelectedGenres.includes(genreId)
        ? currSelectedGenres.filter((id) => id !== genreId)
        : [...currSelectedGenres, genreId];
      return updatedGenres;
    });
  };

  const handleSortChange = (value) => {
    const [sortField, order] = value.split(".");
    setSortBy(sortField);
    setSortOrder(order);
    setSelectedSortOption(value);
  };

  const closeFilterModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedSortOption}
        onValueChange={handleSortChange}
        style={styles.dropdown}
      >
        <Picker.Item label="Popularity (Descending)" value="popularity.desc" />
        <Picker.Item label="Popularity (Ascending)" value="popularity.asc" />
        <Picker.Item
          label="Release Date (Descending)"
          value="release_date.desc"
        />
        <Picker.Item
          label="Release Date (Ascending)"
          value="release_date.asc"
        />
        <Picker.Item label="Rating (Descending)" value="rating.desc" />
        <Picker.Item label="Rating (Ascending)" value="rating.asc" />
      </Picker>
      <Button
        title="Update"
        onPress={closeFilterModal}
        color={colours.midnightPurple}
      />
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreButton,
              selectedGenres.includes(genre.id) && styles.selectedGenreButton,
            ]}
            onPress={() => handleCheck(genre.id)}
          >
            <Text style={styles.genreName}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  // dropdown: {
  //   height: 50,
  //   marginVertical: 10,
  //   backgroundColor: "white",
  //   color: "black",
  //   fontWeight: "bold",
  // },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  genreButton: {
    backgroundColor: "black",
    padding: 10,
    margin: 5,
    borderRadius: 30,
  },
  selectedGenreButton: {
    backgroundColor: "red",
  },
  genreName: {
    color: "white",
  },
});
