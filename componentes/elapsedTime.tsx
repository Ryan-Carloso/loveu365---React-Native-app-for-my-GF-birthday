// ElapsedTime.tsx

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import styles from '../styles/styles';

const ElapsedTime = ({ startDate }) => {
  const [elapsedTime, setElapsedTime] = useState('0s');

  useEffect(() => {
    if (!startDate) {
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - new Date(startDate).getTime();

      // Cálculos de anos, meses, dias, etc.
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const years = Math.floor(totalDays / 365);
      const months = Math.floor((totalDays % 365) / 30);
      const days = totalDays % 30;

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Construir a string de tempo decorrido
      const timeParts = [];
      if (years > 0) timeParts.push(`${years}y`);
      if (months > 0) timeParts.push(`${months}m`);
      if (days > 0) timeParts.push(`${days}d`);
      if (hours > 0) timeParts.push(`${hours}h`);
      if (minutes > 0) timeParts.push(`${minutes}m`);
      if (seconds > 0) timeParts.push(`${seconds}s`);

      // Unir as partes do tempo
      setElapsedTime(timeParts.length > 0 ? timeParts.join(' ') : '0s');
    }, 1000);

    // Limpar o intervalo quando o componente é desmontado ou startDate muda
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <View style={styles.elapsedTimeContainer}>
      <Text style={styles.elapsedTimeTitle}>We've been together for:</Text>
      <Text style={styles.elapsedTime}>Dating for: {elapsedTime}</Text>
    </View>
  );
};

export default ElapsedTime;
