import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  LogBox,
  View,
} from "react-native";

import LandingScreen from "./screens/LandingScreen";
import SignUpScreen from "./screens/SignUpScreen";
import LoginScreen from "./screens/LoginScreen";
import EventListScreen from "./screens/EventListScreen";
import EventDetailsScreen from "./screens/EventDetailsScreen";
import EventAddScreen from "./screens/EventAddScreen";
import RecipeScreen from "./screens/RecipeScreen";
import MapScreen from "./screens/MapScreen";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={navStyling}>
          <Stack.Screen
            name="Home"
            component={LandingScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ title: "Sign Up" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="EventList"
            component={EventListScreen}
            options={{ title: "Event List" }}
          />
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
            options={{ title: "Event Details" }}
          />
          <Stack.Screen
            name="EventAdd"
            component={EventAddScreen}
            options={{ title: "Add Event" }}
          />
          <Stack.Screen
            name="Recipe"
            component={RecipeScreen}
            options={{ title: "Recipe" }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: "Location" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const navStyling = {
  headerStyle: {
    backgroundColor: "#0065A4",
    height: 80,
    elevation: 0,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitleAlign: "center",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
