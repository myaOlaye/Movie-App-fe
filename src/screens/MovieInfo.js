import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, Image, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { findMovieById } from '../api'; 


const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';  

const MovieInfo = () => {
    const route = useRoute();
    console.log(route, 'route');
    const { id } = route.params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        findMovieById(id)
            .then((movieData) => {
                setMovie(movieData);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <Text>Loading...</Text>
    if (error) return <Text>Error: {error}</Text>;

    return (
        <View style={styles.container}>
            {movie && (
                <>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.description}>{movie.overview}</Text>
                    <Image source={{ uri: `${IMAGE_BASE_URL}${movie.poster_path}` }} style={styles.poster} />
                </>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        marginBottom: 16,
    },
    poster: {
        width: 200,
        height: 300,
    },
});

export default MovieInfo;