import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0', // Soft background color
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  notificationContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFEBE5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D6336C',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#555',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 10,
  },
  notificationSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  coupleName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#D6336C',
    marginVertical: 20,
    textAlign: 'center',
  },
  TextBelow: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D6336C',
    marginBottom: 5,
    textAlign: 'center',
  },
  elogioText: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  noElogioText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: width - 40,
    height: (width - 40) * 1.2,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  elapsedTimeContainer: {
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  elapsedTimeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D6336C',
    marginBottom: 8,
  },
  elapsedTime: {
    fontSize: 16,
    color: '#555',
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  TextcodeInput: {
    borderWidth: 1,
    borderColor: '#D6336C',
    borderRadius: 8,
    padding: 10,
    width: 250, // Largura fixa de 250 pixels
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#D6336C',
    borderRadius: 8,
    marginRight: 10,
  },
  toggleButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 10,
    backgroundColor: '#D6336C',
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default styles;
