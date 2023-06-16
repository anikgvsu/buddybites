import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';

import {getFoodFacts} from '../api/FoodAPI.js';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import {
  setupEventListener,
} from "../helpers/fb-event";

const EventListScreen = ({ navigation }) => {

  const [events, setEvents] = useState([]);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </View>
  );

  useEffect(() => {

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        console.log('user is signed in event list screen');
        console.log(user.uid);
        // ...
      } else {

        console.log('user is signed out');
        navigation.navigate('Login');
        // User is signed out
        // ...
        
      }
    });

    const userSignOut = () => {
      signOut(auth)
        .then(() => {
          console.log("sign out successful");
          navigation.navigate('Login');
        })
        .catch((error) => console.log(error));
    };

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={userSignOut}
        >
          <View>
            <Text style={styles.signOutButtonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EventAdd")
          }
        >
          <View style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Event</Text>
          </View>
        </TouchableOpacity>
      ),
    });

    setupEventListener((items) => {

      setEvents(items);
    });
  }, []);

  const goToRecepie = () => {
    navigation.navigate("Recepie")
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.eventList}
      />
      <Button title="Surprize Recepie" onPress={goToRecepie} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  addButton: {
    // position: 'absolute',
    // top: 10,
    // right: 10,
    // backgroundColor: '#007AFF',
    // borderRadius: 10,
    // paddingVertical: 8,
    // paddingHorizontal: 16,
    // elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    margin:20,
  },

  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  eventList: {
    flexGrow: 1,
    marginTop: 40,
  },
  eventItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 16,
    marginTop: 5,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventListScreen;
