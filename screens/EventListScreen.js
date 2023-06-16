import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';


import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const EventListScreen = ({ navigation, route }) => {

  const { events } = route.params;

  const renderEventItem = ({ item }) => {
    const goToEventDetails = () => {
      navigation.navigate("EventDetails", { eventId: item.id });
    };

    return (
      <TouchableOpacity onPress={goToEventDetails}>
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
      <Button title="Surprise Recipe" onPress={goToRecepie} />
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
