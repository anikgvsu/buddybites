import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { maps_KEY } from "../api/api_key.js";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import {
  storeEventItem,
  getUsersAndEvents
} from "../helpers/fb-db";

const EventAddScreen = ({ navigation, route }) => {
  const { locationName } = route.params ?? { locationName: '' };
  const { locationLat } = route.params ?? { locationLat: '' };
  const { locationLong } = route.params ?? { locationLong: '' };

  const { hostUid } = route.params ?? { hostUid: null };
  const { guestList } = route.params ?? { guestList: [] };

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [selectedGuestList, setSelectedGuestList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    try {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          const userSignOut = () => {
            signOut(auth)
              .then(() => {
                console.log("sign out successful");
                navigation.navigate('Login');
              })
              .catch((error) => console.log(error));
          };

          navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity onPress={userSignOut}>
                <View style={styles.signOutButton}>
                  <Text style={styles.signOutButtonText}>Logout</Text>
                </View>
              </TouchableOpacity>
            ),
          });
        } else {
          // User is signed out
          navigation.navigate('Login');
        }
      });
    } catch (err) {
      console.log(err);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMapEvent = () => {
    navigation.navigate("Map", { hostUid: hostUid, guestList: guestList });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const { locationName } = route.params ?? { locationName: '' };
      setLocation(locationName);
    });

    return unsubscribe;
  }, [navigation, route.params]);

  const handleSaveEvent = () => {
    setTitleError('');
    setDateError('');
    setLocationError('');
    setDescriptionError('');

    const titleError = title.trim() === '';
    const dateError = date.trim() === '';
    const locationError = location.trim() === '';
    const descriptionError = description.trim() === '';

    if (titleError) {
      setTitleError('Title is required');
    }

    if (descriptionError) {
      setDescriptionError('Description is required');
    }

    if (dateError) {
      setDateError('Date is required');
    }

    if (locationError) {
      setLocationError('Location is required');
    }

    if (!titleError && !dateError && !locationError && !descriptionError) {
      storeEventItem({
        title: title,
        description: description,
        date: date,
        location: location,
        guestList: selectedGuestList,
        hostUid: hostUid,
      });

      getUsersAndEvents(hostUid, (users, eventsAsHost, eventsAsGuest) => {
        if (users || eventsAsHost || eventsAsGuest) {
          const guestList = users.map((item) => ({ id: item.uid, name: item.name }));
          navigation.navigate("EventList", {
            hostUid: hostUid,
            guestList: guestList,
            eventsAsHost: eventsAsHost,
            eventsAsGuest: eventsAsGuest,
          });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Add Event</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {descriptionError ? <Text style={styles.error}>{descriptionError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      {locationError ? <Text style={styles.error}>{locationError}</Text> : null}

      <TouchableOpacity style={styles.mapButton} onPress={handleMapEvent}>
        <Text style={styles.buttonText}>Add Location from Map</Text>
      </TouchableOpacity>

      <View style={styles.guestListContainer}>
        <Text style={styles.label}>Guest List</Text>
        <MultiSelect
          items={guestList}
          uniqueKey="id"
          onSelectedItemsChange={setSelectedGuestList}
          selectedItems={selectedGuestList}
          selectText="Select Guests"
          searchInputPlaceholderText="Search Guests..."
          onChangeInput={(text) => console.log(text)}
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#333"
          selectedItemTextColor="#333"
          selectedItemIconColor="#333"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#333' }}
          submitButtonColor="#FFB86F"
          submitButtonText="Confirm"
          style={styles.multiSelect}
          selectedItemsTextStyle={styles.selectedItemsText}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveEvent}>
        <Text style={styles.buttonText}>Save Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F9F9F9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  mapButton: {
    backgroundColor: '#FFB86F',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  guestListContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  multiSelect: {
    marginTop: 10,
  },
  selectedItemsText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButton: {
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
  signOutButton: {
    padding: 10,
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventAddScreen;
