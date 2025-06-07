import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Recipe } from '../services/api';
import { useAuth } from './AuthContext';

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface AppContextType {
  favorites: Recipe[];
  ingredients: Ingredient[];
  isDarkMode: boolean;
  addFavorite: (recipe: Recipe) => Promise<void>;
  removeFavorite: (recipeId: string) => Promise<void>;
  addIngredient: (ingredient: Ingredient) => Promise<void>;
  removeIngredient: (ingredientId: string) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
      loadIngredients();
      loadTheme();
    } else {
      setFavorites([]);
      setIngredients([]);
    }
  }, [user]);

  const loadTheme = async () => {
    try {
      const themeJson = await SecureStore.getItemAsync(`theme_${user?.id}`);
      if (themeJson) {
        setIsDarkMode(JSON.parse(themeJson));
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesJson = await SecureStore.getItemAsync(`favorites_${user?.id}`);
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadIngredients = async () => {
    try {
      const ingredientsJson = await SecureStore.getItemAsync(`ingredients_${user?.id}`);
      if (ingredientsJson) {
        setIngredients(JSON.parse(ingredientsJson));
      }
    } catch (error) {
      console.error('Error loading ingredients:', error);
    }
  };

  const toggleDarkMode = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await SecureStore.setItemAsync(`theme_${user?.id}`, JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const addFavorite = async (recipe: Recipe) => {
    try {
      const newFavorites = [...favorites, recipe];
      setFavorites(newFavorites);
      await SecureStore.setItemAsync(`favorites_${user?.id}`, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (recipeId: string) => {
    try {
      const newFavorites = favorites.filter(recipe => recipe.idMeal !== recipeId);
      setFavorites(newFavorites);
      await SecureStore.setItemAsync(`favorites_${user?.id}`, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const addIngredient = async (ingredient: Ingredient) => {
    try {
      const newIngredients = [...ingredients, ingredient];
      setIngredients(newIngredients);
      await SecureStore.setItemAsync(`ingredients_${user?.id}`, JSON.stringify(newIngredients));
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  const removeIngredient = async (ingredientId: string) => {
    try {
      const newIngredients = ingredients.filter(ingredient => ingredient.id !== ingredientId);
      setIngredients(newIngredients);
      await SecureStore.setItemAsync(`ingredients_${user?.id}`, JSON.stringify(newIngredients));
    } catch (error) {
      console.error('Error removing ingredient:', error);
    }
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(recipe => recipe.idMeal === recipeId);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        ingredients,
        isDarkMode,
        addFavorite,
        removeFavorite,
        addIngredient,
        removeIngredient,
        toggleDarkMode,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 