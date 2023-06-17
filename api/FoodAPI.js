import axios from 'axios';
import { apiKey, appId} from './api_key';


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