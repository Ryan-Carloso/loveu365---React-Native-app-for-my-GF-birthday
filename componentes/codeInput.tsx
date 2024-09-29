import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CodeInputProps {
  onCodeSubmit: (code: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ onCodeSubmit }) => {
  const [code, setCode] = useState<string>('');

  // Load code from AsyncStorage when the component mounts
  useEffect(() => {
    const loadStoredCode = async () => {
      try {
        const storedCode = await AsyncStorage.getItem('userCode');
        if (storedCode) {
          setCode(storedCode);
        }
      } catch (error) {
        console.error('Error loading stored code:', error.message);
      }
    };

    loadStoredCode();
  }, []);

  const handleCodeSubmit = async () => {
    if (code.trim() === '') {
      Alert.alert('Validation Error', 'Please enter a valid code.');
      return;
    }

    try {
      // Delegate handling code submission to the parent component
      await onCodeSubmit(code);
      Alert.alert('Success', 'Code saved successfully!');
    } catch (error) {
      console.error('Error saving code:', error.message);
      Alert.alert('Error', 'Could not save code. Please try again.');
    }
  };

  return (
    <View>
      <Text style={styles.TextBelow}>Enter Your Code Below</Text>
      <View style={styles.codeInputContainer}>
        <TextInput
          style={styles.TextcodeInput}
          placeholder="Enter your code"
          value={code}  // Keep the value from AsyncStorage in the input
          onChangeText={setCode}
          secureTextEntry={false} // Always show the code
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleCodeSubmit}>
          <Text style={styles.submitButtonText}>Save Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CodeInput;
