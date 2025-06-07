import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getRecipeById, Recipe } from '../../services/api';

import { darkTheme, lightTheme } from '../../theme/colors';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useApp();
  const { user } = useAuth();
  const { isDarkMode } = useApp();
  const router = useRouter();

  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const data = await getRecipeById(id as string);
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!recipe) return;

    if (isFavorite(recipe.idMeal)) {
      await removeFavorite(recipe.idMeal);
    } else {
      await addFavorite(recipe);
    }
  };

  const renderFavoriteButton = () => {
    if (!recipe) return null;
    
    return (
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavorite}
      >
        <Ionicons
          name={isFavorite(recipe.idMeal) ? "heart" : "heart-outline"}
          size={32}
          color={isFavorite(recipe.idMeal) ? "#ff4081" : theme.text}
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Recipe not found</Text>
      </View>
    );
  }

  const ingredients = Object.entries(recipe)
    .filter(([key, value]) => key.startsWith('strIngredient') && value)
    .map(([key, value], index) => {
      const measureKey = key.replace('Ingredient', 'Measure');
      const measure = recipe[measureKey as keyof Recipe] as string;
      return { ingredient: value, measure };
    });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>{recipe.strMeal}</Text>
          {renderFavoriteButton()}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients</Text>
          {ingredients.map((item, index) => (
            <Text key={index} style={[styles.ingredient, { color: theme.textSecondary }]}>
              • {item.measure} {item.ingredient}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Instructions</Text>
          <Text style={[styles.instructions, { color: theme.textSecondary }]}>
            {recipe.strInstructions}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 