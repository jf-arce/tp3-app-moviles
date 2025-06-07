import type { Recipe } from '@/services/api';
import { searchRecipes } from '@/services/api';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { darkTheme, lightTheme } from '../../theme/colors';

const RECETAS_DESTACADAS: Recipe[] = [
  {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52804',
    strMeal: 'Poutine',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52844',
    strMeal: 'Lasagne',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52977',
    strMeal: 'Corba',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/58oia61564916529.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52978',
    strMeal: 'Kumpir',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/mlchx21564916997.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52979',
    strMeal: 'Burek',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/tkxquw1628771028.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52980',
    strMeal: 'Kafteji',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/1bsv1q1560459826.jpg',
    strInstructions: '',
  },
  {
    idMeal: '52981',
    strMeal: 'Tamiya',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/n3xxd91598732796.jpg',
    strInstructions: '',
  }
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? darkTheme : lightTheme;

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

  const mostrarDestacadas = !searchQuery.trim() && recipes.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }]}
          placeholder="Buscar recetas..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {loading ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        </View>
      ) : mostrarDestacadas ? (
        <View style={styles.contentContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recetas destacadas</Text>
          <FlatList
            data={RECETAS_DESTACADAS}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={styles.recipeList}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No hay recetas destacadas</Text>
            }
          />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={styles.recipeList}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No se encontraron recetas</Text>
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
  searchInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
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
    paddingVertical: 8,
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
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
}); 