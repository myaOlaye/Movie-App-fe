import React from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet } from 'react-native';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';  

export const MoviesCard = ({navigation, movies}) => {

return (
    <View style={{ flex: 1, padding: 100 }}>
    <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieContainer}>
            {item.poster_path ? (
              <Image
                source={{ uri: `${IMAGE_BASE_URL}${item.poster_path}` }}
                style={styles.poster}
              />
            ) : (
              <Text>No Image Available</Text>
            )}
            <Text style={styles.movieTitle}>{item.title}</Text>
            <Button title="View Details" onPress={() => navigation.replace('MovieInfo', { id: item.id })} />
          </View>
        )}
      />
      </View>
)};

const styles = StyleSheet.create({
    movieContainer: {
      marginVertical: 10,
      alignItems: 'center',
    },
    poster: {
      width: 120,
      height: 180,
      borderRadius: 8,
    },
    movieTitle: {
      fontSize: 18,
      marginTop: 10,
      textAlign: 'center',
    },
    });