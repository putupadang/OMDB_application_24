import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  ScrollView,
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
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * Fetches movies from the OMDB API using the provided API key.
   *
   * @return {Promise<void>} A promise that resolves when the movies have been fetched successfully.
   * @throws {Error} If the API response is not "True".
   */
  const fetchMovies = async () => {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=star wars`;
    const data = await fetcher("GET", url);
    if (data?.Response === "True") {
      setMovies(data.Search);
      setLoading(false);
    } else {
      setError(data);
      throw new Error(data);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handlePress = (movie) => {
    setSelectedItem(movie);
    Alert.alert("Selected movie", movie.Title);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Film Searcher</Text>
      <ScrollView horizontal style={styles.scrollView}>
        {movies.map((movie, index) => (
          <TouchableOpacity key={index} onPress={() => handlePress(movie)}>
            <View style={styles.movieContainer}>
              <Image
                source={{ uri: movie.Poster }}
                style={styles.moviePoster}
              />
              <Text style={styles.movieTitle}>{movie.Title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <Text>selected movie</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

/**
 * Fetches data from the specified URL using the provided HTTP method and optional parameters.
 *
 * @param {string} action - The HTTP method to use for the request (e.g. "GET", "POST", etc.).
 * @param {string} url - The URL to send the request to.
 * @param {object} [params=null] - Optional parameters to include in the request body.
 * @return {Promise<object>} A promise that resolves to the parsed JSON response from the server.
 * @throws {Error} If there is an error during the fetch request.
 */
const fetcher = async (action, url, params = null) => {
  try {
    const res = await fetch(`${url}`, {
      method: action,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: params ? params : null,
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
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    backgroundColor: "red",
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
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
