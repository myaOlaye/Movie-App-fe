import axios from "axios";


const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});


const API_KEY = 'aba290e69fb8923d05342f835b24c1fd';

export const getMovies = (page = 1) => {
  return api
    .get("/discover/movie", {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page,
      },
    })
    .then(({ data }) => {
      return data.results;
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
      return [];
    });
};



export const findMovieById = (movie_id) => {
  return api.get(`movie/${movie_id}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
      },
    })
    .then(({ data }) => console.log(data))
     .catch((error) => {
      console.error("Error fetching movie:", error);
      return [];
    });
};


// export const getGenres = () => {
//   return api
//     .get("/genre/movie/list", {
//       params: {
//         api_key: API_KEY,
//         language: "en-US",
//       },
//     })
//     .then(({ data }) => data.genres)
//     .catch((error) => {
//       console.error("Error fetching genres:", error);
//       return [];
//     });
// };

export const searchMovies = (query) => {
  return api
    .get("/search/movie", {
      params: {
        api_key: API_KEY,
        query,
        language: "en-US",
      },
    })
    .then(({ data }) => data.results)
    .catch((error) => {
      console.error("Error searching for movies:", error);
      return [];
    });
};
