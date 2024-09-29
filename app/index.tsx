import React, { useEffect, useState } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import styles from '../styles/styles';
import CodeInput from '../componentes/codeInput';
import ElapsedTime from '../componentes/elapsedTime';

interface Elogio {
  text: string;
}

interface User {
  elogios: string;
  image_urls: string;
  couplename: string;
  date_time: string;
}

interface CurrentElogio {
  text: string;
}

const App: React.FC = () => {
  const [currentElogio, setCurrentElogio] = useState<CurrentElogio | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [coupleName, setCoupleName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [elogiosArray, setElogiosArray] = useState<string[]>([]);
  const [currentElogioIndex, setCurrentElogioIndex] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Current permission status:', status);
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        console.log('New permission status:', newStatus);
        if (newStatus !== 'granted') {
          Alert.alert('Permission not granted', 'You need to enable notifications in settings.');
        }
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const loadCode = async () => {
      try {
        const storedCode = await AsyncStorage.getItem('userCode');
        if (storedCode) {
          setCode(storedCode);
          await fetchData(storedCode); // Fetch data once when the code is loaded
        }
      } catch (error: any) {
        console.error('Error loading code:', error.message);
      }
    };

    loadCode();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (elogiosArray.length > 0 && imageUrls.length > 0) {
        console.log('Changing elogio and image');
        setCurrentElogioIndex((prevIndex) => (prevIndex + 1) % elogiosArray.length); // Change elogio index
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length); // Change image index
      }
    }, 1800); // Change this to 18000000 for 5 hours in milliseconds

    return () => clearInterval(interval);
  }, [elogiosArray, imageUrls]);

  useEffect(() => {
    if (elogiosArray.length > 0) {
      setCurrentElogio({ text: elogiosArray[currentElogioIndex] });
      scheduleNotification(); // Reschedule notification on elogio change
    }
  }, [currentElogioIndex, elogiosArray]);

  useEffect(() => {
    if (imageUrls.length > 0) {
      setCurrentImage(imageUrls[currentImageIndex]);
    }
  }, [currentImageIndex, imageUrls]);

  const fetchData = async (randomString: string): Promise<void> => {
    const API_URL = 'https://laqxbdncmapnhorlbbkg.supabase.co/rest/v1/users';
    const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcXhiZG5jbWFwbmhvcmxiYmtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4NjE3MjUsImV4cCI6MjA0MjQzNzcyNX0.Zv-JETPTIq8X67KWcdFOG0yK9jtpszt7krJT082WyPU';

    try {
      const response: AxiosResponse<User[]> = await axios.get<User[]>(
        `${API_URL}?random_string=eq.${randomString}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            apikey: API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('API Response:', response.data); // Log the API response

      if (response.data.length > 0) {
        const fetchedData: User = response.data[0];
        console.log('Fetched data from the database:', fetchedData);

        const elogiosData: string = fetchedData.elogios;

        if (elogiosData) {
          const elogiosText = elogiosData
            .replace(/\\/g, '')
            .match(/"([^"]+)"/g)
            ?.map((elogio) => elogio.replace(/"/g, '').trim());

          console.log('Elogios fetched:', elogiosText); // Log elogios
          if (elogiosText) {
            setElogiosArray(elogiosText);
            setCurrentElogio({ text: elogiosText[0] });
          } else {
            console.log('Elogios array is empty.');
          }
        }

        const imageUrls: string[] = JSON.parse(fetchedData.image_urls);
        console.log('Image URLs fetched:', imageUrls); // Log image URLs
        if (imageUrls.length > 0) {
          setImageUrls(imageUrls);
          setCurrentImage(imageUrls[0]);
        } else {
          console.log('Image URLs array is empty.');
        }

        setCoupleName(fetchedData.couplename);
        if (!startDate) {
          setStartDate(new Date(fetchedData.date_time));
        }
      } else {
        console.log('No data found for the given code.');
        Alert.alert('Error', 'No data found for the given code.');
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      Alert.alert('Error', 'Could not fetch data. Please try again later.');
    }
  };

  const handleCodeSubmit = async (newCode: string): Promise<void> => {
    try {
      await AsyncStorage.setItem('userCode', newCode);
      setCode(newCode);
      await fetchData(newCode);
      Alert.alert('Success', 'Code saved and data fetched successfully!');
    } catch (error: any) {
      console.error('Error saving code:', error.message);
      Alert.alert('Error', 'Could not save code. Please try again.');
    }
  };

  const scheduleNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time for a new elogio!",
          body: currentElogio ? currentElogio.text : "No elogios available.",
          icon: 'assets/icon.png', // caminho para o seu ícone
        },
        trigger: {
          seconds: 1, //test 
        },
      });
      console.log('Notification scheduled successfully.');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.coupleName}>{coupleName || 'Couple Name'}</Text>

        {currentElogio ? (
          <Text style={styles.elogioText}>{currentElogio.text}</Text>
        ) : (
          <Text style={styles.noElogioText}>No elogios available.</Text>
        )}

        {currentImage ? (
          <Image
            style={styles.image}
            source={{
              uri: `https://laqxbdncmapnhorlbbkg.supabase.co/storage/v1/object/public/images/${currentImage}`,
            }}
          />
        ) : (
          <Text style={styles.noImageText}>No image available.</Text>
        )}

        <ElapsedTime startDate={startDate} />

        <CodeInput onCodeSubmit={handleCodeSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
