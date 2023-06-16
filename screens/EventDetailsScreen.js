import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EventDetailsScreen = ({ route }) => {
  const { eventId } = route.params;

  console.log('event id');
  console.log(eventId);

  const event = {
    id: 1,
    title: 'Birthday Party',
    date: '2023-06-15',
    location: 'Apple Ridge',
    description: 'Join us for a fun-filled birthday party!',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.subtitle}>Date: {event.date}</Text>
      <Text style={styles.subtitle}>Location: {event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginTop: 20,
  },
});

export default EventDetailsScreen;
