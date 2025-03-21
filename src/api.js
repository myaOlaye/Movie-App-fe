import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

const OurFlicksBE = axios.create({
  baseURL: "http://192.168.1.40:3000/api",
});

const API_KEY = "aba290e69fb8923d05342f835b24c1fd";

export const getMovies = (
  page = 1,
  sortBy = "popularity",
  sortOrder = "desc",
  genres = []
) => {
  const genreString = genres.join(",");
  return api
    .get("/discover/movie", {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page,
        sort_by: `${sortBy}.${sortOrder}`,
        with_genres: genreString,
      },
    })
    .then(({ data }) => data.results)
    .catch((error) => {
      console.error("Error fetching movies:", error);
      return [];
    });
};

export const getTopRatedMovies = (page = 1) => {
  return api
    .get("/movie/top_rated", {
      params: {
        api_key: API_KEY,
        language: "en-US",
        page,
      },
    })
    .then(({ data }) => data.results)
    .catch((error) => {
      console.error("Error fetching movies:", error);
      return [];
    });
};

export const findMovieById = (movie_id) => {
  return api
    .get(`movie/${movie_id}`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
      },
    })
    .then(({ data }) => data)
    .catch((error) => {
      console.error("Error fetching movie:", error);
      return [];
    });
};

export const getGenres = () => {
  return api
    .get("/genre/movie/list", {
      params: {
        api_key: API_KEY,
        language: "en-US",
      },
    })
    .then(({ data }) => data.genres)
    .catch((error) => {
      console.error("Error fetching genres:", error);
      return [];
    });
};

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

export const fetchToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return OurFlicksBE.post("/users/userData", { token }).catch((error) => {
    console.error("Error fetching user:", error);
  });
};

// registerUser function
export const registerUser = (name, username, email, password) => {
  return OurFlicksBE.post("/users/register", {
    name,
    username,
    email,
    password,
  });
};
export const loginUser = (email, password) => {
  return OurFlicksBE.post("/users/login", {
    email,
    password,
  }).then((res) => {
    AsyncStorage.setItem("token", res.data.token);
  });
};

export const getUserMovieLists = (owner_id, excluded_movielist_ids) => {
  const params = {};
  if (excluded_movielist_ids.length > 0) {
    params.excluded_movielist_ids = excluded_movielist_ids.join(",");
  }

  return OurFlicksBE.get(`/movielists/${owner_id}`, {
    params: params,
  }).then(({ data }) => {
    return data;
  });
};

export const getMovieListItems = (movielist_id) => {
  return OurFlicksBE.get(`/movielistItems/${movielist_id}`).then(({ data }) => {
    return data;
  });
};

export const addMovieToList = (movielist_id, tmdb_movie_id, notes) => {
  return OurFlicksBE.post(`/movielistItems`, {
    movielist_id,
    tmdb_movie_id,
    notes,
  });
};

export const getUsers = () => {
  return OurFlicksBE.get("/users").then(({ data }) => {
    return data.users;
  });
};

export const ShareMovie = (reqBody) => {
  return OurFlicksBE.post("/movieListShares", reqBody).then(({ data }) => {
    return data;
  });
};

export const getMovieListShares = (username) => {
  return OurFlicksBE.get(`/movieListShares/${username}`).then(({ data }) => {
    return data;
  });
};

export const getMovieListsByMovieListId = (movielist_id) => {
  return OurFlicksBE.get(`/movieLists/movielistid/${movielist_id}`).then(
    ({ data }) => {
      return data;
    }
  );
};

export const respondToShareRequest = (share_id, response) => {
  return OurFlicksBE.patch(`/movieListShares/${share_id}`, { response }).then(
    ({ data }) => {
      return data;
    }
  );
};

export const postNewList = (owner_id, listTitle) => {
  return OurFlicksBE.post("/movielists", {
    owner_id,
    name: listTitle,
  }).then(({ data }) => {
    return data;
  });
};

export const getUser = (username) => {
  return OurFlicksBE.get(`/users/${username}`).then(({ data }) => {
    return data;
  });
};
