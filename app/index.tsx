import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, Dimensions, TextInput, TouchableOpacity, Share } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import elogios from '../assets/elogios/elogios.json'; 
import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [startDate, setStartDate] = useState(new Date('2024-09-02'));
  const [timeDifference, setTimeDifference] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentElogio, setCurrentElogio] = useState(''); 
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [responseMessage, setResponseMessage] = useState(''); // For the response
  const viewRef = useRef(); // To reference the screen for screenshot

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * elogios.length);
      setCurrentElogio(elogios[randomIndex]);
      calculateTimeDifference(startDate);
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const calculateTimeDifference = (selectedDate) => {
    const now = new Date();
    const diff = now.getTime() - selectedDate.getTime();

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60 * 60)) / 1000) % 60; 

    setTimeDifference({ months, days, hours, minutes, seconds });
  };

  const takeScreenshot = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Screenshots', asset, false);
      alert('Screenshot saved to gallery!');
    } catch (error) {
      console.error('Error saving screenshot', error);
    }
  };

  const shareScreenshot = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 1,
      });
      const shareOptions = {
        title: 'Compartilhe seu momento!',
        message: 'Olha só o que meu namorado fez para mim!',
        url: uri,
      };
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing screenshot', error);
    }
  };

  const photos = [
    require('../assets/photos/photo1.png'),
    require('../assets/photos/photo2.png'),
    require('../assets/photos/photo3.png'),
    require('../assets/photos/photo4.png'),
  ];

  return (
    <View style={styles.container} ref={viewRef}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>Quando você e sua namorada começaram a namorar?</Text>
        <Text style={styles.subtitle}>Tempo desde o início do relacionamento:</Text>
        <Text style={styles.time}>
          {timeDifference.months} meses, {timeDifference.days} dias,{' '}
          {timeDifference.hours} horas, {timeDifference.minutes} minutos, {timeDifference.seconds} segundos
        </Text>
        <Image
          source={photos[currentPhotoIndex]}
          style={styles.photo}
        />
        <Text style={styles.elogio} numberOfLines={2} ellipsizeMode="tail">{currentElogio || ''}</Text>

        <TouchableOpacity style={styles.screenshotButton} onPress={takeScreenshot}>
          <Text style={styles.screenshotText}>Salvar Foto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton} onPress={shareScreenshot}>
          <Text style={styles.shareText}>Compartilhar no Instagram</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: width - 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    marginBottom: 15,
  },
  elogio: {
    fontSize: 16,
    marginTop: 20,
    width: width - 60,
    textAlign: 'center',
  },
  photo: {
    width: width - 60,
    height: width - 60,
    borderRadius: 50,
    marginTop: 20,
  },
  screenshotButton: {
    marginTop: 20,
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 10,
  },
  screenshotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    marginTop: 10,
    backgroundColor: '#34a853',
    padding: 10,
    borderRadius: 10,
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
