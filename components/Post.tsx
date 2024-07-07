import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { database } from "../realtimeDatabase";
import { ref, update } from "firebase/database";
import { auth } from "../firebase";

interface PostProps {
  postId: string;
  text: string;
}

export default function Post({ postId, text }: PostProps) {
  const userId = auth.currentUser?.uid;

  

  const handleLikeToggle = () => {
    if (!userId) return; // Prevent action if user is not authenticated

    const postRef = ref(database, `posts/global/${postId}`);
    const updates: { [key: string]: any } = {};

    
    update(postRef, updates)
      
      
  };

  return (
    <View style={styles.container}>
    <Text style={styles.text}>{text}</Text>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  likeSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginRight: 10,
  },
});
