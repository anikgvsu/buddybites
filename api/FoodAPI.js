import { apiKey, appId} from './api_key';
const query = 'apple';

/* const apiUrl = `https://api.edamam.com/api/food-database/v2/parser?ingr=${encodeURIComponent(
  query
)}&app_id=${appId}&app_key=${apiKey}`; */


const tags = "vegetarian"
import axios from 'axios';
const FoodServer = axios.create({
    baseURL: "https://api.spoonacular.com/recipes/random",
});

FoodServer.interceptors.request.use(
    async (config) => {
        config.headers.Accept = 'application/json';
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

export const getFoodFacts = async (ingredients, callback) => {
    ingredients = ingredients.toLowerCase();
    const recipeQuery = `?tags=${ingredients}&apiKey=${apiKey}&number=1`;
    const response = await FoodServer.get(
        recipeQuery
    );
    callback(response.data)
};

export default FoodServer;