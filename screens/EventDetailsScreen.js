import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    getEventById,
  } from "../helpers/fb-db";

const EventDetailsScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEventById(eventId, (eventData) => {
      if (eventData) {
        setEvent(eventData);
      } else {
        setEvent(null);
    }
    });
  }, [eventId]);

  if (!event) {
    return (
      <View style={styles.container}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

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
