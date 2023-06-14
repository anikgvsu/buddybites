import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';

import {
  initUserDB,
  setupUserListener,
  storeUserItem,
} from "../helpers/fb-user";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [allergy, setAllergy] = useState('');
  const [favoriteFoods, setFavoriteFoods] = useState('');
  const [dietHabit, setDietHabit] = useState('');

  const[user, setUser] = useState([]);

  useEffect(() => {
    try {
      initUserDB();
    } catch (err) {
      console.log(err);
    }
    setupUserListener((items) => {
      setUser(items);
    });
  }, []);

  const [error, setError] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
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
    return value ? '' : 'Password is required';
  };
  
  const validatePhone = (value) => {
    return value ? '' : 'Phone is required';
  };
  
  const validateAllergy = (value) => {
    return value ? '' : 'Allergy is required';
  };
  
  const validateFavoriteFoods = (value) => {
    return value ? '' : 'Favorite Foods is required';
  };
  
  const validateDietHabit = (value) => {
    return value ? '' : 'Diet Habit is required';
  };
  

  const handleSignUp = () => {
    const nameError = validateName(name);
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);
    const phoneError = validatePhone(phone);
    const allergyError = validateAllergy(allergy);
    const favoriteFoodsError = validateFavoriteFoods(favoriteFoods);
    const dietHabitError = validateDietHabit(dietHabit);
  
    setError({
      name: nameError,
      username: usernameError,
      password: passwordError,
      phone: phoneError,
      allergy: allergyError,
      favoriteFoods: favoriteFoodsError,
      dietHabit: dietHabitError,
    });
  
    if (
      !nameError &&
      !usernameError &&
      !passwordError &&
      !phoneError &&
      !allergyError &&
      !favoriteFoodsError &&
      !dietHabitError
    ) {
      storeUserItem({
        name: name,
        username: username,
        password: password,
        phone: phone,
        allergy: allergy,
        favoriteFoods: favoriteFoods,
        dietHabit: dietHabit,
      });
      navigation.navigate('EventList');
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
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      {error.phone ? <Text style={styles.error}>{error.phone}</Text> : null}

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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
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
