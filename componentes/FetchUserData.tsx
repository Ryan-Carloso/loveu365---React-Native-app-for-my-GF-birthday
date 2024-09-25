// components/FetchUserData.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import UserCard from './usecard';
import { parseElogios } from './utils';

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
            <UserCard 
              key={index} 
              user={user} 
              elapsedTime={elapsedTime} 
              parseElogios={parseElogios} 
              currentDateTime={new Date().toISOString()} // Pass current time here
            />
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
  error: {
    color: 'red',
    marginTop: 20,
  },
});

export default FetchUserData;
