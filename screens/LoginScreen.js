import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { getUsersAndEvents } from '../helpers/fb-db';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View>
            <Text style={styles.homeButtonText}>Home</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, []);

  const handleLogin = () => {
    setEmailError('');
    setPasswordError('');

    const emailError = email.trim() === '';
    const passwordError = password.trim() === '';

    if (emailError) {
      setEmailError('Email is required');
    }

    if (passwordError) {
      setPasswordError('Password is required');
    }

    if (!emailError && !passwordError) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const userUid = userCredential.user.uid;

          getUsersAndEvents(userUid, (users, eventsAsHost, eventsAsGuest) => {
            if (users || eventsAsHost || eventsAsGuest) {

              // console.log('guest list');

              // console.log(users);

              const guestList = users.map((item) => ({ id: item.uid, name: item.name }));
              navigation.navigate("EventList", { hostUid: userUid, guestList, eventsAsHost, eventsAsGuest });
            }
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error.code);

          if (error.code === 'auth/user-not-found') {
            setEmailError('User Email not found');
          }

          if (error.code === 'auth/wrong-password') {
            setPasswordError('Wrong Password');
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LoginScreen;
