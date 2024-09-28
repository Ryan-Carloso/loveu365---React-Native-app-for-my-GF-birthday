import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import axios from 'axios';
import UserCard from './usecard'; // Ensure the path is correct
import { parseElogios } from './utils';

const { width } = Dimensions.get('window');

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
          'Content-Type': 'application/json',
        },
      });

      if (response.data.length > 0) {
        setUserData(response.data);
        setErrorMessage('');
        calculateElapsedTime(response.data[0].date_time);
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
      const diff = now - startDate;

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setElapsedTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Fetch User Data</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter random string"
            value={randomString}
            onChangeText={setRandomString}
          />
          <Button title="Fetch Data" onPress={fetchData} color="#D6336C" />
        </View>

        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : (
          <View style={styles.resultsContainer}>
            {userData.map((user, index) => (
              <UserCard
                key={index}
                user={user}
                elapsedTime={elapsedTime}
                parseElogios={parseElogios}
                currentDateTime={new Date().toISOString()}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D6336C',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: width - 40,
    marginBottom: 20,
    backgroundColor: '#FFEBE5',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#D6336C',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#FFF',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  resultsContainer: {
    width: '100%',
  },
});

export default FetchUserData;
