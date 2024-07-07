import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { database } from '../realtimeDatabase';
import PostDetail from './PostDetail';

const Account = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUserData(docSnap.data());
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    const userPostsRef = ref(database, `posts/users/${userId}`);
    const globalPostsRef = ref(database, 'posts/global');

    onValue(userPostsRef, (userSnapshot) => {
      const userData = userSnapshot.val();
      if (userData) {
        const userPostIds = Object.keys(userData).map((key) => parseInt(key, 10));

        onValue(globalPostsRef, (globalSnapshot) => {
          const globalData = globalSnapshot.val();
          const matchedPosts = userPostIds.filter((postId) => globalData && globalData[postId]);
          const postsDetails = matchedPosts.map((postId) => ({
            id: postId.toString(),
            content: globalData[postId],
            likes: globalData[postId].likes,
            comments: globalData[postId].comments
          }));

          setUserPosts(postsDetails);
        });
      } else {
        setUserPosts([]);
      }
    });
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{userData.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Surname:</Text>
          <Text style={styles.value}>{userData.surname}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Birthdate:</Text>
          <Text style={styles.value}>{userData.dateofbirth}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
      </View>
      <View style={styles.postsContainer}>
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const commentsArray = item.comments ? Object.keys(item.comments).map(key => ({ id: key, ...item.comments[key] })) : [];
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('PostDetail', {
                  postId: item.id,
                  postContent: { ...item.content, comments: commentsArray },
                })}
                style={styles.postItem}
              >
                <Text style={styles.postText}>{item.content.text}</Text>
                <Text style={styles.postTimestamp}>{new Date(parseInt(item.id)).toLocaleString()}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#3498db',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginRight: 16,
    width: 100,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  postsContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  postItem: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  postText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  postTimestamp: {
    fontSize: 14,
    color: '#666',
  },
});

export default Account;
