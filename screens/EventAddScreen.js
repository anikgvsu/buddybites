import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

const EventAddScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestList, setGuestList] = useState([]);

  const handleSaveEvent = () => {
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <SearchableDropdown
        multi={true}
        selectedItems={guestList}
        onItemSelect={(item) => {
          const selectedGuests = [...guestList];
          selectedGuests.push(item);
          setGuestList(selectedGuests);
        }}
        containerStyle={styles.dropdownContainer}
        onRemoveItem={(item, index) => {
          const updatedGuests = [...guestList];
          updatedGuests.splice(index, 1);
          setGuestList(updatedGuests);
        }}
        itemStyle={styles.dropdownItem}
        itemTextStyle={styles.dropdownItemText}
        itemsContainerStyle={styles.dropdownItemsContainer}
        items={[
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
          { id: 3, name: 'Mark' },
        ]}
        defaultIndex={-1}
        placeholder="Guest List"
        resetValue={false}
        textInputProps={{
          editable: false,
          placeholderTextColor: '#333',
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
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
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownItem: {
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropdownItemText: {
    color: '#333',
  },
  dropdownItemsContainer: {
    maxHeight: '50%',
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

export default EventAddScreen;
