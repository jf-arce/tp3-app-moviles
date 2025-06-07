import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { RecipeCard } from '../components/RecipeCard';
import { useApp } from '../context/AppContext';

export default function FavoritesScreen() {
  const { favorites } = useApp();

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No hay recetas favoritas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
}); 