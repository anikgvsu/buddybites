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
  
    const isHostEvent = eventsAsHost.some((event) => event.id === item.id);
  
    const eventItemStyle = isHostEvent ? styles.hostEventItem : styles.guestEventItem;
  
    return (
      <TouchableOpacity onPress={goToEventDetails} style={styles.eventItemContainer}>
        <View style={[styles.eventItem, eventItemStyle]}>
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

    const goToEventAdd = () => {

      // console.log('guest list in event list screen');

      // console.log(guestList);

      navigation.navigate('EventAdd', { hostUid, guestList })
    };

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={userSignOut}>
          <Text style={styles.headerButton}>Logout</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={goToEventAdd}>
          <Text style={styles.headerButton}>Add Event</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  const goToRecipe = () => {
    navigation.navigate('Recipe', { hostUid, guestList, eventsAsHost, eventsAsGuest });
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
        <Text style={styles.surpriseRecipeButtonText}>Recipe</Text>
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
  headerButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#FF6F61',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    color: '#333',
  },
  eventDate: {
    fontSize: 16,
    marginTop: 5,
    color: '#666',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
  surpriseRecipeButton: {
    marginTop: 20,
    backgroundColor: '#FF6F61',
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

  hostEventItem: {
    backgroundColor: '#FFE8D6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guestEventItem: {
    backgroundColor: '#D6EDFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default EventListScreen;
