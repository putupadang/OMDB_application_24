import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

const API_KEY = "247afc4f"; // Extracted API key

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  /**
   * Asynchronously fetches movies from the OMDB API based on the search term "star wars".
   *
   * @return {Promise<void>} - A Promise that resolves when the movies are successfully fetched and set in the state.
   *                          Rejects if there is an error in fetching the data.
   */
  const fetchMovies = async () => {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=star wars`;
    const data = await fetcher("GET", url);
    if (data?.Response === "True") {
      setMovies(data.Search);
      setLoading(false);
    } else {
      setError(data.Error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  /**
   * Updates the selected movie state with the provided movie object.
   *
   * @param {Object} movie - The movie object to be selected.
   * @return {void} This function does not return anything.
   */
  const handlePress = (movie) => {
    setSelectedMovie(movie);
    // Alert.alert("Selected movie", movie.Title);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  /**
   * Renders a single item in the list as a touchable component with an image and title.
   *
   * @param {Object} item - The item to render.
   * @return {JSX.Element} The rendered touchable component.
   */
  const renderItemComponent = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.movieContainer}>
        <Image source={{ uri: item.Poster }} style={styles.moviePoster} />
        <Text style={styles.movieTitle}>{item.Title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Searcher</Text>
      <FlatList
        data={movies}
        horizontal
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => renderItemComponent({ item })}
        contentContainerStyle={styles.flatListContentContainer}
      />
      {selectedMovie && (
        <View style={styles.selectedMovieContainer}>
          <Text style={styles.selectedMovieTitle}>Selected Movie:</Text>
          <Text style={styles.selectedMovieText}>{selectedMovie.Title}</Text>
          <Text style={styles.selectedMovieText}>{selectedMovie.Year}</Text>
          <Image
            source={{ uri: selectedMovie.Poster }}
            style={styles.selectedMoviePoster}
          />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

/**
 * Asynchronous function to fetch data from a specified URL with optional parameters.
 *
 * @param {string} action - The HTTP request method (GET, POST, PUT, DELETE, etc.).
 * @param {string} url - The URL from which to fetch data.
 * @param {object} [params=null] - Optional parameters to include in the request body.
 * @return {Promise} A Promise that resolves to the fetched data.
 */
const fetcher = async (action, url, params = null) => {
  try {
    const res = await fetch(url, {
      method: action,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: params ? JSON.stringify(params) : null,
    });
    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  flatListContentContainer: {
    paddingHorizontal: 10,
  },
  movieContainer: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    minHeight: 280,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedMovieContainer: {
    marginTop: 0,
    alignItems: "center",
  },
  selectedMovieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  selectedMovieText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  selectedMoviePoster: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
});
