import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const FetchUserData = () => {
  const [randomString, setRandomString] = useState('');
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [elapsedTime, setElapsedTime] = useState('');

  const API_URL = 'https://laqxbdncmapnhorlbbkg.supabase.co/rest/v1/users';
  const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcXhiZG5jbWFwbmhvcmxiYmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NjE3MjUsImV4cCI6MjA0MjQzNzcyNX0.Zv-JETPTIq8X67KWcdFOG0yK9jtpszt7krJT082WyPU'; // Replace with your actual API key

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}?random_string=eq.${randomString}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.length > 0) {
        setUserData(response.data);
        setErrorMessage('');
        calculateElapsedTime(response.data[0].date_time); // Get the first user's date_time
      } else {
        setUserData([]);
        setErrorMessage('No data found for the provided random string.');
      }
    } catch (error) {
      setUserData([]);
      setErrorMessage(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
  };

  const calculateElapsedTime = (dateTime) => {
    const startDate = new Date(dateTime);
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - startDate; // Difference in milliseconds

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setElapsedTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  };

  const parseElogios = (elogios) => {
    if (!elogios) return []; // Return an empty array if elogios is falsy
    try {
      const parsed = JSON.parse(elogios);
      // Check if parsed is an object and convert it to an array
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return [parsed]; // Wrap single object in an array
      } else if (Array.isArray(parsed)) {
        return parsed; // Return the parsed array if it's valid
      } else {
        console.warn("Parsed elogios is not an array or object:", parsed);
        return []; // Return an empty array if the parsed value is not an object or array
      }
    } catch (e) {
      console.error("Error parsing elogios:", e);
      return []; // Return an empty array in case of an error
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fetch User Data from Supabase</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter random string"
        value={randomString}
        onChangeText={setRandomString}
      />
      <Button title="Fetch Data" onPress={fetchData} />

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        userData.map((user, index) => (
          <View key={index} style={styles.userContainer}>
            <Text style={styles.text}>User ID: {user.id}</Text>
            <Text style={styles.text}>Random String: {user.random_string}</Text>

            {/* Check if elogios exists and is a valid JSON string */}
            {user.elogios ? (
              parseElogios(user.elogios).map((elogio, elogioIndex) => (
                <Text key={elogioIndex} style={styles.elogio}>{elogio.text}</Text>
              ))
            ) : (
              <Text style={styles.text}>No elogios available.</Text>
            )}

            {user.image_urls && JSON.parse(user.image_urls).map((img, imgIndex) => (
              <Image
                key={imgIndex}
                style={styles.image}
                source={{ uri: `https://laqxbdncmapnhorlbbkg.supabase.co/storage/v1/object/public/images/${img}` }}
              />
            ))}

            <Text style={styles.elapsedTime}>Dating for: {elapsedTime}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  userContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  elogio: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
  elapsedTime: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default FetchUserData;
