import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from "react";
import { auth } from '../firebase';
import { ref, update } from 'firebase/database';
import { database } from '../realtimeDatabase';

const PostDetail = ({ route }) => {
  const { postId, postContent } = route.params;
  const [inputText, setInputText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const handleComment = async () => {
    const timestamp = Date.now();
    if (inputText.trim() === '') {
      setError('Please enter some text before commenting.');
      return;
    }
    setError('');
    setPosting(true);
    try {
      const newComment = {
        author: auth.currentUser?.uid,
        text: inputText,
      };
      update(ref(database, 'posts/global/' + postId + '/comments/' + timestamp), newComment);
      setInputText('');
    } catch (e) {
      setError('Failed to post. Please try again.');
      console.error(e);
    }
    setPosting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Author: {postId}</Text>
      <Text style={styles.text}>Content: {postContent.text}</Text>
      {postContent.comments.length > 0 ? (
        <FlatList
          data={postContent.comments}
          keyExtractor={(comment) => comment.id}
          renderItem={({ item: comment }) => (
            <View style={styles.commentContainer}>
              <Text style={styles.commentAuthor}>{comment.author}:</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noComments}>No comments yet.</Text>
      )}

      <View style={styles.container}>
        <TextInput
          style={[styles.input, { color: 'white' }]}
          placeholder="Write your comment..."
          onChangeText={text => setInputText(text)}
          value={inputText}
          multiline
          placeholderTextColor={'#ccc'}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button
          title={posting ? "Posting..." : "Comment"}
          onPress={handleComment}
          disabled={posting}
          color="#007AFF"
        />
        {posting && <ActivityIndicator size="small" color="#007AFF" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0A1931',
  },
  input: {
    backgroundColor: '#0A1931',
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  commentContainer: {
    backgroundColor: '#0A1931',
    padding: 5,
    marginVertical: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  commentAuthor: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  commentText: {
    marginLeft: 10,
    color: '#fff',
  },
  noComments: {
    color: '#fff',
    fontStyle: "italic",
  },
  errorText: {
    color: 'red',
    marginVertical: 5,
  },
});

export default PostDetail;