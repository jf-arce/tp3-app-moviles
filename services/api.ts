import axios from 'axios';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strIngredient16?: string;
  strIngredient17?: string;
  strIngredient18?: string;
  strIngredient19?: string;
  strIngredient20?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
  strMeasure16?: string;
  strMeasure17?: string;
  strMeasure18?: string;
  strMeasure19?: string;
  strMeasure20?: string;
}

export interface ApiResponse {
  meals: Recipe[] | null;
}

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    const response = await axios.get<ApiResponse>(`${BASE_URL}/search.php?s=${query}`);
    return response.data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await axios.get<ApiResponse>(`${BASE_URL}/lookup.php?i=${id}`);
    return response.data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

export const getRandomRecipe = async (): Promise<Recipe | null> => {
  try {
    const response = await axios.get<ApiResponse>(`${BASE_URL}/random.php`);
    return response.data.meals?.[0] || null;
  } catch (error) {
    console.error('Error fetching random recipe:', error);
    return null;
  }
}; 