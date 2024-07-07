// Account.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native';

// ... other imports


const SignScreen = ({ navigation }) => { // Receive navigation prop as an argument

  return (
    <View>
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('SignUp')} // Use navigation prop
      />
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('SignIn')} // Use navigation prop
      />
    </View>
  );
};

// ... rest of the code

export default SignScreen;
