import type { Recipe } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { getRandomRecipe, searchRecipes } from '../../services/api';
import { darkTheme, lightTheme } from '../../theme/colors';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      loadRandomRecipes();
    }
  }, [searchQuery]);

  const loadRandomRecipes = async () => {
    setLoading(true);
    try {
      const randomRecipes = await Promise.all(
        Array(8).fill(null).map(() => getRandomRecipe())
      );
      setRecipes(randomRecipes.filter((recipe): recipe is Recipe => recipe !== null));
    } catch (error) {
      console.error('Error cargando recetas aleatorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchRecipes(searchQuery);
      setRecipes(results);
    } catch (error) {
      console.error('Error buscando recetas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.idMeal}`);
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={[styles.recipeCard, { backgroundColor: theme.card }]}
      onPress={() => handleRecipePress(item)}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={[styles.recipeName, { color: theme.text }]} numberOfLines={2}>
          {item.strMeal}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar recetas..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.recipeList}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {searchQuery ? 'No se encontraron recetas' : 'Cargando recetas...'}
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  recipeList: {
    padding: 16,
  },
  recipeCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
}); 