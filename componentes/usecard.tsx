import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { differenceInHours } from 'date-fns';

const { width } = Dimensions.get('window');

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
      <Text style={styles.userIdText}>User ID: {user.id}</Text>
      <Text style={styles.randomStringText}>Random String: {user.random_string}</Text>

      {currentElogio ? (
        <Text style={styles.elogioText}>"{currentElogio.text}"</Text>
      ) : (
        <Text style={styles.noElogioText}>No elogios available.</Text>
      )}

      {currentImage ? (
        <Image
          style={styles.image}
          source={{ uri: `https://laqxbdncmapnhorlbbkg.supabase.co/storage/v1/object/public/images/${currentImage}` }}
        />
      ) : (
        <Text style={styles.noImageText}>No image available.</Text>
      )}

      <Text style={styles.elapsedTime}>Dating for: {elapsedTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#FFEBE5',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  userIdText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  randomStringText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  elogioText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#D6336C',
    textAlign: 'center',
    marginBottom: 15,
  },
  noElogioText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  image: {
    width: width - 80,
    height: (width - 80) * 1.2,
    borderRadius: 10,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  elapsedTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D6336C',
    marginTop: 10,
  },
});

export default UserCard;
