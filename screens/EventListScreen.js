import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const EventListScreen = ({ navigation, route }) => {
  const { hostUid } = route.params ?? { hostUid: null };
  const { eventsAsHost } = route.params ?? { eventsAsHost: [] };
  const { eventsAsGuest } = route.params ?? { eventsAsGuest: [] };
  const { guestList } = route.params ?? { guestList: [] };

  const renderEventItem = ({ item }) => {
    const goToEventDetails = () => {
      navigation.navigate('EventDetails', { eventId: item.id });
    };

    return (
      <TouchableOpacity onPress={goToEventDetails} style={styles.eventItemContainer}>
        <View style={styles.eventItem}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDate}>{item.date}</Text>
          <Text style={styles.eventLocation}>{item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        console.log('user is signed in event list screen');
        // ...
      } else {
        console.log('user is signed out');
        navigation.navigate('Login');
        // User is signed out
      }
    });

    const userSignOut = () => {
      signOut(auth)
        .then(() => {
          console.log('sign out successful');
          navigation.navigate('Login');
        })
        .catch((error) => console.log(error));
    };

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={userSignOut}>
          <Text style={styles.headerButton}>Logout</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('EventAdd', { hostUid, guestList })}>
          <Text style={styles.headerButton}>Add Event</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const goToRecipe = () => {
    navigation.navigate('Recipe');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Events As Host</Text>
      <FlatList
        data={eventsAsHost}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.eventList}
      />

      <Text style={styles.sectionTitle}>Events As Guest</Text>
      <FlatList
        data={eventsAsGuest}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.eventList}
      />

      <TouchableOpacity style={styles.surpriseRecipeButton} onPress={goToRecipe}>
        <Text style={styles.surpriseRecipeButtonText}>Surprise Recipe</Text>
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
  headerButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  eventList: {
    flexGrow: 1,
  },
  eventItemContainer: {
    marginBottom: 10,
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
  surpriseRecipeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  surpriseRecipeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventListScreen;
