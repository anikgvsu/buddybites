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

  const handleSignUp = () => {
    
    storeUserItem({ name: name, username: username, password: password, phone: phone, allergy: allergy, favoriteFoods: favoriteFoods, dietHabit: dietHabit });
    navigation.navigate('EventList');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Allergy"
        value={allergy}
        onChangeText={setAllergy}
      />
      <TextInput
        style={styles.input}
        placeholder="Favorite Foods"
        value={favoriteFoods}
        onChangeText={setFavoriteFoods}
      />
      <TextInput
        style={styles.input}
        placeholder="Diet Habit"
        value={dietHabit}
        onChangeText={setDietHabit}
      />
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
});

export default SignUpScreen;
