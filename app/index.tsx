import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RecipeCard } from '../components/RecipeCard';
import { SearchInput } from '../components/SearchInput';
import type { Recipe } from '../services/api';
import { getRandomRecipe, searchRecipes } from '../services/api';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      loadRandomRecipes();
    } else {
      searchRecipesHandler();
    }
  }, [searchQuery]);

  const loadRandomRecipes = async () => {
    setLoading(true);
    try {
      const randomRecipes = await Promise.all(
        Array(6).fill(null).map(() => getRandomRecipe())
      );
      setRecipes(randomRecipes.filter((recipe): recipe is Recipe => recipe !== null));
    } catch (error) {
      console.error('Error loading random recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchRecipesHandler = async () => {
    if (searchQuery.trim() === '') return;
    
    setLoading(true);
    try {
      const results = await searchRecipes(searchQuery);
      setRecipes(results);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar recetas..."
      />
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : recipes.length === 0 ? (
        <Text style={styles.noResultsText}>No se encontraron recetas</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard
              id={item.idMeal}
              title={item.strMeal}
              image={item.strMealThumb}
              category={item.strCategory}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 8,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
});
