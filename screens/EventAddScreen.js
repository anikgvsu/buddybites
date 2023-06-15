import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  initEventDB,
  setupEventListener,
  storeEventItem,
} from "../helpers/fb-event";

const EventAddScreen = ({ navigation }) => {

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [guestList, setGuestList] = useState([]);


  const [event, setEvent] = useState([]);

  useEffect(() => {
    try {

      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          const uid = user.uid;
          console.log('user is signed in event add screen');
          console.log(user.uid);
          // ...
        } else {

          console.log('user is signed out');
          navigation.navigate('Login');
          // User is signed out
          // ...
          
        }
      });

      initEventDB();
    } catch (err) {
      console.log(err);
    }
    setupEventListener((items) => {
      setEvent(items);
    });
  }, []);

  const options = [
    { 
      value: 1,
      label: "Leanne Graham"
    },
    {
      value:  2,
      label: "Ervin Howell"
    }
  ];

  const handleSaveEvent = () => {

    setTitleError('');
    setDateError('');
    setLocationError('');

    const titleError = title.trim() === '';
    const dateError = date.trim() === '';
    const locationError = location.trim() === '';
  
    if (titleError) {
      setTitleError('Title is required');
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
      !locationError
    ) {

      storeEventItem({ 
        title: title, 
        date: date, 
        location: location, 
        guestList: guestList 
      });

      navigation.navigate('EventList');
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
        <SelectDropdown
          data={[
            'John',
            'Jane',
            'Mark',
          ]}
          multiSelect
          defaultButtonText="Choose Guest"
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
          dropdownStyle={styles.dropdownContainer}
          rowStyle={styles.dropdownItem}
          rowTextStyle={styles.dropdownItemText}
          dropdownIconPosition="right"
          onSelect={(selectedItems) => setGuestList(selectedItems)}
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
});

export default EventAddScreen;
