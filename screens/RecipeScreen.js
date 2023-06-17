import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import { getFoodFacts } from '../api/FoodAPI.js';

const RecipeScreen = ({ navigation, route }) => {
  const { hostUid } = route.params ?? { hostUid: null };
  const { eventsAsHost } = route.params ?? { eventsAsHost: [] };
  const { eventsAsGuest } = route.params ?? { eventsAsGuest: [] };
  const { guestList } = route.params ?? { guestList: [] };
  
  const { width } = useWindowDimensions();
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState({
    image: '',
    title: '',
    instruction: '',
    summary: '',
  });

  const getRecipe = () => {
    getFoodFacts(ingredients, (data) => {
      setRecipe({
        image: data.recipes[0].image,
        instruction: data.recipes[0].instructions,
        summary: data.recipes[0].summary,
        title: data.recipes[0].title,
      });
    });
  };

  const renderRecipe = (recipe) => {
    if (recipe.title === '') {
      return <View></View>;
    } else {
      return (
        <ScrollView contentContainerStyle={styles.recipeContainer}>
          {/* <Image style={styles.recipeImage} source={{ uri: recipe.image }} /> */}
          <View style={styles.recipeContent}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.recipeDescription}>
              <RenderHtml contentWidth={width} source={{ html: recipe.instruction }} />
              <RenderHtml contentWidth={width} source={{ html: recipe.summary }} />
            </View>
          </View>
        </ScrollView>
      );
    }
  };

  const goToEventList = () => {
    navigation.navigate("EventList", { hostUid: hostUid, guestList: guestList, eventsAsHost: eventsAsHost, eventsAsGuest: eventsAsGuest });
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={goToEventList}>
          <Text style={styles.headerButton}>Event List</Text>
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setIngredients}
          value={ingredients}
          placeholder="Type ingredients separated by commas..."
        />
        <TouchableOpacity style={styles.button} onPress={getRecipe}>
          <Text style={styles.buttonText}>Get Recipe</Text>
        </TouchableOpacity>
      </View>
      {renderRecipe(recipe)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF6F61',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeContainer: {
    flexGrow: 1,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  recipeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  recipeContent: {
    marginTop: 20,
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  recipeDescription: {
    marginHorizontal: 20,
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
});

export default RecipeScreen;
