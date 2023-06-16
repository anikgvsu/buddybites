import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import {
  initEventDB,
  setupEventListener,
  storeEventItem,
} from "../helpers/fb-event";

import {
  initUserDB,
  setupUserListener,
  storeUserItem,
} from "../helpers/fb-user";

const EventAddScreen = ({ navigation }) => {

  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [location, setLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [guestList, setGuestList] = useState([]);
  const [selectedGuestList, setSelectedGuestList] = useState([]);


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

          console.log('user is signed out');
          navigation.navigate('Login');
          // User is signed out
          // ...
          
        }
      });

      initUserDB();
      initEventDB();
      
    } catch (err) {
      console.log(err);
    }

    setupUserListener((items) => {
      const auth = getAuth();
      const currentUserUid = auth.currentUser.uid;
      const filteredItems = items
        .filter((item) => item.uid !== currentUserUid)
        .map((item) => ({ id: item.uid, name: item.name }));
      setGuestList(filteredItems);
    });
    
    

    setupEventListener((items) => {
      setEvent(items);
    });

  }, []);

  const handleSaveEvent = () => {
    console.log(guestList)
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
        guestList: selectedGuestList 
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
