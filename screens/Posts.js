import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const Post = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPostData = async () => {
      const postDoc = await firestore().collection('posts').doc(postId).get();
      const postData = postDoc.data();
      setPost(postData);

      const userDoc = await firestore().collection('users').doc(postData.userId).get();
      setUser(userDoc.data());
    };

    fetchPostData();
  }, [postId]);

  if (!post || !user) {
    return <Text>Loading...</Text>;
  }

  const { content, timestamp, likes, reposts, comments } = post;
  const { username, profilePicture } = user;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.timestamp}>{moment(timestamp.toDate()).fromNow()}</Text>
        </View>
      </View>
      <Text style={styles.content}>{content}</Text>
      <View style={styles.interactions}>
        <Text>{likes.length} Likes</Text>
        <Text>{reposts.length} Reposts</Text>
        <Text>{comments.length} Comments</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: 'gray',
  },
  content: {
    marginBottom: 10,
  },
  interactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Post;