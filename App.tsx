import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import elogios from './assets/elogios/elogios.json';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [timeDifference, setTimeDifference] = useState({
    months: 0,
    days: 0,
    hours: 0,
    seconds: 0,
  });
  const [currentElogio, setCurrentElogio] = useState('');

  useEffect(() => {
    // Show the date picker only on the first render
    setShowDatePicker(true);

    // Schedule the first notification after 10 seconds
    const firstNotification = async () => {
      const randomIndex = Math.floor(Math.random() * elogios.length);
      const newElogio = elogios[randomIndex];
      setCurrentElogio(newElogio);
      await scheduleNotification(newElogio, 10); // Schedule first notification for 10 seconds
    };

    firstNotification();

    // Set up an interval to update the elogio every minute
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * elogios.length);
      const newElogio = elogios[randomIndex];
      if (newElogio !== currentElogio) {
        setCurrentElogio(newElogio);
        scheduleNotification(newElogio, 60); // Schedule notification every 60 seconds
      }
    }, 60000); // 60000 milliseconds = 1 minute

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [currentElogio]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
    calculateTimeDifference(currentDate);
  };

  const calculateTimeDifference = (selectedDate) => {
    const now = new Date();
    const diff = now.getTime() - selectedDate.getTime();

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const seconds = Math.floor((diff % (1000 * 60 * 60)) / 1000);

    setTimeDifference({ months, days, hours, seconds });
  };

  const scheduleNotification = async (elogio, seconds) => {
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Elogio do Dia',
        body: elogio,
      },
      trigger: { seconds }, // Trigger the notification after the specified seconds
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <Text>Quando você e sua namorada começaram a namorar?</Text>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <Text>Tempo desde o início do relacionamento:</Text>
        <Text>
          {timeDifference.months} meses, {timeDifference.days} dias,{' '}
          {timeDifference.hours} horas, {timeDifference.seconds} segundos
        </Text>
        <Text>{currentElogio || ""}</Text>
      </View>
      <StatusBar style="auto" />
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
});
