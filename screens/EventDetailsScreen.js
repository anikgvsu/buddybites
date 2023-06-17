import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getEventById } from "../helpers/fb-db";

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

  const { title, date, location, description, guests, allergies } = event;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Date: {date}</Text>
      <Text style={styles.subtitle}>Location: {location}</Text>
      <Text style={styles.description}>{description}</Text>

      {allergies && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Allergies:</Text>
          <Text style={styles.allergyText}>{allergies}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Guests:</Text>
      {guests.map((guest, index) => (
        <View key={index} style={styles.guestContainer}>
          <Text style={styles.guestName}>{guest.name}</Text>
          <Text style={styles.guestInfo}>Favorite Foods: {guest.favoriteFoods}</Text>
          <Text style={styles.guestInfo}>Diet Habits: {guest.dietHabit}</Text>
        </View>
      ))}
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
  sectionContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  allergyText: {
    fontSize: 16,
  },
  guestContainer: {
    marginTop: 10,
  },
  guestName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestInfo: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default EventDetailsScreen;
