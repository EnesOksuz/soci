import React, { useState } from 'react';
import { db } from '../../firebase';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import ddd from '../../components/database';
import 'firebase/firestore';
import { collection, doc, setDoc,where,query,limit,getDocs} from "firebase/firestore"; 
import { useEffect } from 'react';




const isUsernameAvailable = async (username) => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};




const handleEmailPassword = async()=>{
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth,email, password);
    // Signed up successfully, navigate to another screen or perform other actions
    
    console.log('User signed up:', userCredential.user);

    setError("you have signed-up succesfully!")
  } 
  catch (err) {
    setError(err.message);
  }
}



const SignUp =  () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [name, setname] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth,setDateOfBirth] = useState('')

  
    
  
  
  const handleSignUp = async () => {
    try {
      const usernameAvailable = await isUsernameAvailable(username);
      if (!usernameAvailable) {
        setError("The username is already taken. Please choose another one.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up:', userCredential.user);
      setError("You have signed up successfully!");
      const user = userCredential.user;

      // const userID = auth.currentUser;
      // if (user !== null) {
      //   // The user's ID, unique to the Firebase project. Do NOT use
      //   // this value to authenticate with your backend server, if
      //   // you have one. Use User.getIdToken() instead.
      //   const uid = user.uid;
      // }  

      // Call your function to handle additional signup actions
      ddd(email,username,name,surname,dateOfBirth,user.uid);
    } catch (err) {
      setError(err.message);
    }
  };





   
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setname}
        autoCapitalize="none"
        placeholderTextColor="red"
      />
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
        autoCapitalize="none"
        placeholderTextColor="red"

      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor="red"

      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="red"

      />
      <TextInput
        style={styles.input}
        placeholder="date of birth"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        autoCapitalize="none"
        placeholderTextColor="red"

      />
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="red"

        //onBlur={() => handleUsername({username: username})} // call handleUsername when the user leaves the username field
        
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>{}}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    width: '100%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
