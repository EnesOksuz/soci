import React, { useState, useEffect } from "react";
import { View, ScrollView, FlatList, TouchableOpacity, Text, Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native";
import Post from "../components/Post";
import NewPost from "../components/NewPost";
import { ref, onValue } from "firebase/database";
import { database } from "../realtimeDatabase";
import { auth } from "../firebase";
import PostDetail from "./PostDetail";

const handleSignOut = () => {
  auth.signOut()
    .then(() => {
      console.log("Signed out successfully!");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState({});
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const postsRef = ref(database, "posts/global");
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    const postId = Object.keys(posts)[Object.values(posts).indexOf(item)];
    const commentsArray = item.comments ? Object.keys(item.comments).map(key => ({ id: key, ...item.comments[key] })) : [];

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PostDetail', {
          postId: postId,
          postContent: { ...item, comments: commentsArray },
        })}
      >
        <View style={styles.postContainer}>
          <Text style={styles.author}>Author: {item.author}</Text>
          <Text style={styles.text}>Text: {item.text}</Text>

          {commentsArray.length > 0 ? (
            <FlatList
              data={commentsArray}
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
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <NewPost userId={currentUserId} />
        <FlatList
          data={Object.values(posts)}
          keyExtractor={(item) => Object.keys(posts)[Object.values(posts).indexOf(item)]}
          renderItem={renderItem}
        />
        <Button title="Sign Out" onPress={handleSignOut} color="#007AFF" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1931',
  },
  postContainer: {
    backgroundColor: '#0A1931',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  author: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  text: {
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
});

export default Home;