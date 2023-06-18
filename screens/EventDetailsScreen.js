import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
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

  const { title, hostName, date, location, description, guests, allergies } = event;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.hostName}>Host: {hostName}</Text>
          <Text style={styles.subtitle}>Date: {date}</Text>
          <Text style={styles.subtitle}>Location: {location}</Text>
          <Text style={styles.description}>{description}</Text>

          {allergies && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Allergies:</Text>
              <Text style={styles.allergyText}>{allergies}</Text>
            </View>
          )}

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Guests:</Text>
            {guests.map((guest, index) => (
              <View key={index} style={styles.guestContainer}>
                <Text style={styles.guestName}>{guest.name}</Text>
                <Text style={styles.guestInfo}>Favorite Foods: {guest.favoriteFoods}</Text>
                <Text style={styles.guestInfo}>Diet Habits: {guest.dietHabit}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
    color: '#888',
    textAlign: 'center',
  },
  hostName: {
    fontSize: 18,
    marginBottom: 5,
    color: '#888',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 20,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },
  sectionContainer: {
    marginTop: 20,
    backgroundColor: '#F2F8F8',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  allergyText: {
    fontSize: 16,
    color: '#666',
  },
  guestContainer: {
    marginTop: 10,
    backgroundColor: '#F2F8F8',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  guestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  guestInfo: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
});

export default EventDetailsScreen;
