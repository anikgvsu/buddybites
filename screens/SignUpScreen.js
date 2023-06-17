import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


import {
  getAllUsers,
  initFirebase,
  storeUserItem,
  getUsersAndEvents
} from "../helpers/fb-db";

const SignUpScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [allergy, setAllergy] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const [dietHabit, setDietHabit] = useState('');

  const [user, setUser] = useState([]);

  useEffect(() => {
    try {
      initFirebase();
    } catch (err) {
      console.log(err);
    }
    getAllUsers((items) => {
      setUser(items);
    });
  }, []);

  const [error, setError] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    allergy: '',
    favoriteFoods: '',
    dietHabit: '',
  });

  const validateName = (value) => {
    return value ? '' : 'Name is required';
  };

  const validateUsername = (value) => {
    return value ? '' : 'Username is required';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const validateEmail = (value) => {
    return value ? '' : 'Email is required';
  };

  const validateAllergy = (value) => {
    return true;
  };

  const validateFavoriteFoods = (value) => {
    return value ? '' : 'Favorite Foods is required';
  };

  const validateDietHabit = (value) => {
    return value ? '' : 'Diet Habit is required';
  };

  const handleSignUp = () => {
    const isDuplicateUsername = user.some((item) => item.username === username);
    if (isDuplicateUsername) {
      setError((prevError) => ({
        ...prevError,
        username: 'Username is already taken',
      }));
      return;
    }

    const isDuplicateEmail = user.some((item) => item.email === email);
    if (isDuplicateEmail) {
      setError((prevError) => ({
        ...prevError,
        email: 'Email is already registered',
      }));
      return;
    }

    const nameError = validateName(name);
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const emailError = validateEmail(email);
    const allergyError = validateAllergy(allergy);
    const favoriteFoodsError = validateFavoriteFoods(favoriteFoods);
    const dietHabitError = validateDietHabit(dietHabit);

    setError({
      name: nameError,
      username: usernameError,
      password: passwordError,
      email: emailError,
      allergy: allergyError,
      favoriteFoods: favoriteFoodsError,
      dietHabit: dietHabitError,
    });

    if (
      !nameError &&
      !usernameError &&
      !passwordError &&
      !emailError &&
      !favoriteFoodsError &&
      !dietHabitError
    ) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          const userUid = user.uid;
          console.log('User signed in');
          // console.log(user);

          storeUserItem({
            name: name,
            username: username,
            // password: password,
            email: email,
            allergy: allergy,
            favoriteFoods: favoriteFoods,
            dietHabit: dietHabit,
            uid: userUid,
          });

          getUsersAndEvents(userUid, (users, eventsAsHost, eventsAsGuest) => {
            if (users || eventsAsHost || eventsAsGuest) {
              const guestList = users.map((item) => ({ id: item.uid, name: item.name }));
              navigation.navigate("EventList", { hostUid: userUid, guestList, eventsAsHost, eventsAsGuest });
            }
          });

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      {error.name ? <Text style={styles.error}>{error.name}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {error.username ? <Text style={styles.error}>{error.username}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error.password ? <Text style={styles.error}>{error.password}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {error.email ? <Text style={styles.error}>{error.email}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Allergy"
        value={allergy}
        onChangeText={setAllergy}
      />
      {error.allergy ? <Text style={styles.error}>{error.allergy}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Favorite Foods"
        value={favoriteFoods}
        onChangeText={setFavoriteFoods}
      />
      {error.favoriteFoods ? <Text style={styles.error}>{error.favoriteFoods}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Diet Habit"
        value={dietHabit}
        onChangeText={setDietHabit}
      />
      {error.dietHabit ? <Text style={styles.error}>{error.dietHabit}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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

  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default SignUpScreen;
