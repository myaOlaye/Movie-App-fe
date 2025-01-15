import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getMovies, searchMovies, findMovieById, getGenres, getMoviesByGenre } from '../api';

export const MovieFilter = ({ setMovieFilters }) => {
    const [genres, setGenres] = useState([]);
    useEffect(() => {
      getGenres().then(({ genres }) => {
        setGenres(genres);
      });
    }, []);
    const handleCheck = (e) => {
      if (e.target.checked) {
        setMovieFilters((currMovieFilters) => {
          return [...currMovieFilters, e.target.name];
        });
      } else {
        setMovieFilters((currMovieFilters) => {
          return currMovieFilters.filter(
            (movieFilter) => movieFilter !== e.target.name
          );
        });
      }
    };
    return (
      <div className="genre-container">
        {genres.map((genre) => {
          return (
            <label className="genre-label" key={genre.id} htmlFor={genre.id}>
              <input
                type="checkbox"
                onClick={handleCheck}
                id={genre.id}
                name={genre.id}
                className="genre-checkbox"
              />
              <span className="genre-name">{genre.name}</span>
            </label>
          );
        })}
      </div>
    );
  };