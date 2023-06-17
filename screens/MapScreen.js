import MapView, {Marker, Circle, Callout} from 'react-native-maps';
import axios from 'axios';
import { maps_KEY } from "../api/api_key.js";
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useEffect, useState } from 'react';
import Geocoder from 'react-native-geocoding';

const AddressSearchBar = ({navigation, route}) => {

	const { hostUid } = route.params ?? { hostUid: null };
  	const { guestList } = route.params ?? { guestList: [] };

  const [ pin, setPin ] = useState({
		latitude: 42.97218609999999,
		longitude: -85.95402179999999,
		address: ""
	})

	console.log('current address');
	console.log(pin);

	const [ region, setRegion ] = useState({
		latitude: 42.97218609999999,
		longitude: -85.95402179999999,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	});

	const handleSaveEvent = () => {

		navigation.navigate("EventAdd", {
		  hostUid: hostUid,
		  guestList: guestList,
		  locationName: pin.address,
		  locationLat: pin.latitude,
		  locationLong: pin.longitude
		});
	  };
	  

	useEffect(() => {
		navigation.setOptions({
		  headerRight: () => (
		    <TouchableOpacity
		      onPress={handleSaveEvent}
		    >
		      <Text style={styles.headerButton}>Save</Text>
		    </TouchableOpacity>
		  ),
		});
	  });

	useEffect(() => {
		Geocoder.init(maps_KEY); // Initialize Geocoder with your API key
	  }, [pin]);
	
	  const getPinAddress = async (latitude, longitude) => {
		try {
		  const response = await Geocoder.from(latitude, longitude);
		  const address = response.results[0].formatted_address;
		  setPin({latitude: latitude, longitude: longitude,address: address });
		} catch (error) {
		  console.error(error);
		}
	  };
	  const handleSearchText = () => {
		return pin.address !== '' ? pin.address : 'Search'; // Use pin address if available, otherwise use 'Search'
	  };
	return (
		<View style={{ flex: 1 }}>
			<GooglePlacesAutocomplete
				placeholder={handleSearchText()}
				fetchDetails={true}
				
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					//console.log("here", data,"there", details.description)
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					})
					setPin({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						address: data.description
         			 })
				}}
				query={{
					key: maps_KEY,
					language: "en",
					components: "country:us",
					location: `${region.latitude}, ${region.longitude}`
				}}
				styles={{
					container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
					listView: { backgroundColor: "white" }
				}}
			/>
			<MapView
				style={styles.map}
          		region={region}
				provider="google"
			>
				
				<Marker
					coordinate={pin}
					draggable={true}
					onDragStart={(e) => {
						//console.log("Drag start", e.nativeEvent.coordinates)
					}}
					onDragEnd={(e) => {
						getPinAddress(
							e.nativeEvent.coordinate.latitude,
							e.nativeEvent.coordinate.longitude)
						console.log("saved address", pin)
					}}
				>
					<Callout>
						<Text>I'm here</Text>
					</Callout>
				</Marker>
			</MapView>
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
headerButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});