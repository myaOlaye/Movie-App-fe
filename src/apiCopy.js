import axios from "axios";
// Create an axios instance with the base URL
const api = axios.create({
  baseURL: "http://192.168.1.40:3000/api/",
});

export const fetchData = (endpoint, params = {}) => {
  return api
    .get(endpoint, { params })
    .then(({ data }) => data)
    .catch((error) => {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return null; // Return null or any fallback value you prefer
    });
};
// Function to fetch a movie list item by movielist_id and tmdb_movie_id
export const getMovieListItem = (movielist_id, tmdb_movie_id) => {
  return fetchData(`/movielistItems/${movielist_id}/${tmdb_movie_id}`)
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching movie list item:", error);
      return null;
    });
};
