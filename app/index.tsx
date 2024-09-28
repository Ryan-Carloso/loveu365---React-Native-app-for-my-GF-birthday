import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles';

const App = () => {
  const [elapsedTime, setElapsedTime] = useState('');
  const [currentElogio, setCurrentElogio] = useState(null); 
  const [currentImage, setCurrentImage] = useState(''); 
  const [coupleName, setCoupleName] = useState('');
  const [code, setCode] = useState('');
  const [codeVisible, setCodeVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);

  useEffect(() => {
    const loadCode = async () => {
      try {
        const storedCode = await AsyncStorage.getItem('userCode');
        if (storedCode) {
          setCode(storedCode);
          await fetchData(storedCode); // Fetch data once when the code is loaded
        }
      } catch (error) {
        console.error('Error loading code:', error.message);
      }
    };

    loadCode();

    const timer = setInterval(() => {
      if (startDate) {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();
        
        // Calculate years, months, days, hours, minutes, and seconds
        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);
        const days = totalDays % 30;
    
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
    
        // Build the elapsed time string
        const timeParts = [];
        if (years > 0) timeParts.push(`${years}y`);
        if (months > 0) timeParts.push(`${months}m`);
        if (days > 0) timeParts.push(`${days}d`);
        if (hours > 0) timeParts.push(`${hours}h`);
        if (minutes > 0) timeParts.push(`${minutes}m`);
        if (seconds > 0) timeParts.push(`${seconds}s`);
    
        // Join the time parts
        setElapsedTime(timeParts.length > 0 ? timeParts.join(' ') : '0s'); // Show '0s' if everything is 0
      }
    }, 1000);
    

    return () => clearInterval(timer);
  }, [startDate]);

  const fetchData = async (randomString) => {
    const API_URL = 'https://laqxbdncmapnhorlbbkg.supabase.co/rest/v1/users';
    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcXhiZG5jbWFwbmhvcmxiYmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NjE3MjUsImV4cCI6MjA0MjQzNzcyNX0.Zv-JETPTIq8X67KWcdFOG0yK9jtpszt7krJT082WyPU'; // Your actual key

    try {
      const response = await axios.get(`${API_URL}?random_string=eq.${randomString}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'apikey': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log('Fetched data:', response.data);

      if (response.data.length > 0) {
        const fetchedData = response.data[0];
        const elogiosData = fetchedData.elogios;

        if (elogiosData) {
          const elogios = JSON.parse(elogiosData).text;
          setCurrentElogio({ text: elogios });
        }

        const imageUrls = JSON.parse(fetchedData.image_urls);
        if (imageUrls.length > 0) {
          setCurrentImage(imageUrls[0]);
        }

        setCoupleName(fetchedData.couplename);
        if (!startDate) { // Only set startDate if it hasn't been set yet
          setStartDate(new Date(fetchedData.date_time));
        }
      } else {
        Alert.alert('Error', 'No data found for the given code.');
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      Alert.alert('Error', 'Could not fetch data. Please try again later.');
    }
  };

  const handleCodeSubmit = async () => {
    try {
      await AsyncStorage.setItem('userCode', code);
      fetchData(code); // Call fetchData with the new code
      Alert.alert('Success', 'Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error.message);
      Alert.alert('Error', 'Could not save code. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Notification Section */}
        <View style={styles.notificationContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.notificationIcon}
          />
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>LOVEU365</Text>
            <Text style={styles.notificationText}>
              I will love you for the rest of my life.
            </Text>
          </View>
          <Text style={styles.notificationTime}>now</Text>
        </View>
        <Text style={styles.notificationSubtext}>
          *Daily notification: this will show in the app.*
        </Text>

        {/* Couple's Section */}
        <Text style={styles.coupleName}>{coupleName || 'Couple Name'}</Text>

        {/* Elogio Section */}
        {currentElogio ? (
          <Text style={styles.elogioText}>"{currentElogio.text}"</Text>
        ) : (
          <Text style={styles.noElogioText}>No elogios available.</Text>
        )}

        {/* Image Section */}
        {currentImage ? (
          <Image
            style={styles.image}
            source={{ uri: `https://laqxbdncmapnhorlbbkg.supabase.co/storage/v1/object/public/images/${currentImage}` }}
          />
        ) : (
          <Text style={styles.noImageText}>No image available.</Text>
        )}

        {/* Elapsed Time Section */}
        <View style={styles.elapsedTimeContainer}>
          <Text style={styles.elapsedTimeTitle}>We've been together for:</Text>
          <Text style={styles.elapsedTime}>Dating for: {elapsedTime}</Text>
        </View>

        {/* Code Input Section */}
        <View style={styles.codeInputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Enter your code"
            value={code}
            onChangeText={setCode}
            secureTextEntry={!codeVisible} // Toggle visibility
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setCodeVisible(!codeVisible)}
          >
            <Text style={styles.toggleButtonText}>
              {codeVisible ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleCodeSubmit}>
            <Text style={styles.submitButtonText}>Save Code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
