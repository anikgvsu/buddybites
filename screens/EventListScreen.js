import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

const EventListScreen = ({ navigation }) => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Birthday Party',
      date: '2023-06-15',
      location: '123 Main St',
    },
    {
      id: 2,
      title: 'Wedding Reception',
      date: '2023-07-10',
      location: '456 Elm St',
    },
    {
      id: 3,
      title: 'Family Gathering',
      date: '2023-08-05',
      location: '789 Oak St',
    },
  ]);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
      <Text style={styles.eventLocation}>{item.location}</Text>
    </View>
  );

  const handleAddEvent = () => {
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>Add Event</Text>
      </TouchableOpacity>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.eventList}
      />
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
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  addButtonText: {
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
