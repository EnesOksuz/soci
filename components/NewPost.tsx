import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { database } from "../realtimeDatabase";
import { ref, set, update } from 'firebase/database';
import { auth } from "../firebase";

export default function NewPost(props: { userId: any; }) {
  const [inputText, setInputText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    const timestamp = Date.now();
    if (inputText.trim() === '') {
      setError('Please enter some text before posting.');
      return;
    }
    setError('');
    setPosting(true);
    try {
      const newPost = {
        author:auth.currentUser?.uid,
        text: inputText,
 
      };
      set(ref(database, 'posts/global/' + timestamp), newPost);
      update(ref(database, 'posts/users/' + auth.currentUser?.uid), { [timestamp]: true });
      setInputText('');
    } catch (e) {
      setError('Failed to post. Please try again.');
      console.error(e);
    }
    setPosting(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write something..."
        onChangeText={text => setInputText(text)}
        value={inputText}
        multiline
        placeholderTextColor={'#FF0000' }
        
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        title={posting ? "Posting..." : "Post"}
        onPress={handlePost}
        disabled={posting}
      />
      {posting && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  input: {
    backgroundColor: '#0A1931',
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});