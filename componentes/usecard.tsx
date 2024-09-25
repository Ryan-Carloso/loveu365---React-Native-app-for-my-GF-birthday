// components/UserCard.tsx

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { differenceInHours } from 'date-fns';

const UserCard = ({ user, elapsedTime, parseElogios, currentDateTime }) => {
  const elogiosArray = parseElogios(user.elogios);
  const imageUrlsArray = JSON.parse(user.image_urls || '[]');

  // Calculate index based on the current time
  const currentIndex = Math.floor(differenceInHours(new Date(currentDateTime), new Date(user.date_time)) / 1);
  
  // Get the current elogio and image, defaulting to the first if out of bounds
  const currentElogio = elogiosArray[currentIndex % elogiosArray.length];
  const currentImage = imageUrlsArray[currentIndex % imageUrlsArray.length];

  return (
    <View style={styles.userContainer}>
      <Text style={styles.text}>User ID: {user.id}</Text>
      <Text style={styles.text}>Random String: {user.random_string}</Text>

      {currentElogio ? (
        <Text style={styles.elogio}>{currentElogio.text}</Text>
      ) : (
        <Text style={styles.text}>No elogios available.</Text>
      )}

      {currentImage ? (
        <Image
          style={styles.image}
          source={{ uri: `https://laqxbdncmapnhorlbbkg.supabase.co/storage/v1/object/public/images/${currentImage}` }}
        />
      ) : (
        <Text style={styles.text}>No image available.</Text>
      )}

      <Text style={styles.elapsedTime}>Dating for: {elapsedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
  elapsedTime: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default UserCard;
