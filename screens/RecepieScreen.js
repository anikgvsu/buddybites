import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TextInput, StyleSheet, Text, Button, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

import {getFoodFacts} from '../api/FoodAPI.js';
import {StringToJSX} from "../helpers/String2JSX.js";

const RecepieScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState({
    image: '',
    title: '',
    instruction: '',
    summary: '',
  })

  const getRecipe = () => {
    getFoodFacts(ingredients, (data) => {
      console.log("food data here",data, data.recipes[0].image, data.recipes[0].instructions, data.recipes[0].summary);
      setRecipe({image: data.recipes[0].image, instruction: data.recipes[0].instructions, 
        summary: data.recipes[0].summary, title: data.recipes[0].title})
    });
  }
  const renderRecipe = (recipe) => {
      if (recipe.title === '') {
        return <View></View>;
      } else {
        return (
          <View style={styles.weatherView}>
            <Image
              style={styles.recipeImage}
              source={recipe.image}
            />
            <View>
              <Text style={styles.recipeTitle}>
                {recipe.title}
              </Text>
              <RenderHtml contentWidth={width} source={{html:recipe.instruction}}/>
              <RenderHtml contentWidth={width} source={{html:recipe.summary}}/>

            </View>
          </View>
        );
      }
    };

    useEffect(() => {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EventList")
            }
          >
            <View style={styles.addButton}>
              <Text style={styles.addButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
        ),
      });
    });
    return (
        <View style={styles.container}>
          <View>
            <TextInput
              style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
              onChangeText={setIngredients}
              value={ingredients}
              placeholder="type ingrediants saparated by commas..."
            />
            <Button title="Get Recepie" onPress={getRecipe} />
          </View>
          {renderRecipe(recipe)}
        </View>
    );
};



  const styles = StyleSheet.create({
    weatherView: {
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 50,
      marginBottom: 20,
    },
    recipeImage: {
      width: 200,
      height: 200,
    },
    weatherDetails: {
      marginLeft: 10,
    },
    recipeTitle: {
      fontSize: 30,
      marginTop: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    description: {
      fontSize: 18,
    },
    container: {
      padding: 10,
      backgroundColor: "#E8EAF6",
      flex: 1,
    },
    headerButton: {
      color: "#fff",
      fontWeight: "bold",
      margin: 10,
    },
    buttons: {
      padding: 10,
    },
    addButton: {
      // position: 'absolute',
      // top: 10,
      // right: 10,
      // backgroundColor: '#007AFF',
      // borderRadius: 10,
      // paddingVertical: 8,
      // paddingHorizontal: 16,
      // elevation: 2,
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      margin: 20,
    },
});

export default RecepieScreen;