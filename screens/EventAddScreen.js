import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import {
  storeEventItem,
  getUsersAndEvents
} from "../helpers/fb-db";

const EventAddScreen = ({ navigation, route }) => {

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
  const [selectedGuestList, setSelectedGuestList] = useState();


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
              <TouchableOpacity
                onPress={userSignOut}
              >
                <View>
                  <Text style={styles.signOutButtonText}>Logout</Text>
                </View>
              </TouchableOpacity>
            ),
          });
          // ...
        } else {

          // console.log('user is signed out');
          navigation.navigate('Login');
          // User is signed out
          // ...
          
        }
      });
      
    } catch (err) {
      console.log(err);
    }

  }, []);

  const handleSaveEvent = () => {
    // console.log(guestList)
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

    if (
      !titleError &&
      !dateError &&
      !locationError &&
      !descriptionError
    ) {
      storeEventItem({ 
        title: title, 
        description: description,
        date: date, 
        location: location, 
        guestList: selectedGuestList,
        hostUid: hostUid
      });

      getUsersAndEvents(hostUid, (users, eventsAsHost, eventsAsGuest) => {
        if (users || eventsAsHost || eventsAsGuest) {

          const guestList = users.map((item) => ({ id: item.uid, name: item.name }));
          navigation.navigate("EventList", { hostUid: hostUid, guestList: guestList, eventsAsHost: eventsAsHost, eventsAsGuest: eventsAsGuest });
        }
      });
    }
  
    
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
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

      <View>
      <MultiSelect
        items={guestList}
        uniqueKey="id"
        onSelectedItemsChange={setSelectedGuestList}
        selectedItems={selectedGuestList}
        selectText="Select Options"
        searchInputPlaceholderText="Search Options..."
        onChangeInput={(text) => console.log(text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: '#CCC' }}
        submitButtonColor="#33E6FF"
        submitButtonText="Confirm"
      />
    </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSaveEvent}>
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
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropdownButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#FFF',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
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

  signOutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventAddScreen;
