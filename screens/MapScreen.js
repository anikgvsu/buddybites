import MapView from 'react-native-maps';
import axios from 'axios';
import { maps_KEY } from "../api/api_key.js";
import { Text, StyleSheet, View, TextInput, SafeAreaView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useState } from 'react';

const AddressSearchBar = () => {


  // return (
  //   <GooglePlacesAutocomplete
  //     placeholder='Search'
  //     onPress={(data, details = null) => {
  //       // 'details' is provided when fetchDetails = true
  //       console.log(data, details);
  //     }}
  //     query={{
  //       key: maps_KEY,
  //       language: 'en',
  //     }}
  //   />
  // );
  
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      provider="google" 
      />
    </View>
  );
};

export default AddressSearchBar;



const styles = StyleSheet.create({
container: {
  flex: 1,
},
map: {
  width: '100%',
  height: '100%',
},
});