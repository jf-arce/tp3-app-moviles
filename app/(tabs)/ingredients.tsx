import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { darkTheme, lightTheme } from '../../theme/colors';

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function IngredientsScreen() {
  const { ingredients, addIngredient, removeIngredient } = useApp();
  const { user } = useAuth();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: '',
  });

  const handleAddIngredient = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please log in to manage ingredients');
      return;
    }

    if (!newIngredient.name.trim()) {
      Alert.alert('Error', 'Please enter an ingredient name');
      return;
    }

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: newIngredient.name.trim(),
      quantity: newIngredient.quantity.trim(),
      unit: newIngredient.unit.trim(),
    };

    await addIngredient(ingredient);
    setNewIngredient({ name: '', quantity: '', unit: '' });
  };

  const handleRemoveIngredient = async (id: string) => {
    await removeIngredient(id);
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <View style={[styles.ingredientItem, { backgroundColor: theme.card }]}>
      <View style={styles.ingredientInfo}>
        <Text style={[styles.ingredientName, { color: theme.text }]}>{item.name}</Text>
        {(item.quantity || item.unit) && (
          <Text style={[styles.ingredientDetails, { color: theme.textSecondary }]}>
            {item.quantity} {item.unit}
          </Text>
        )}
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveIngredient(item.id)}
        style={styles.removeButton}
      >
        <Text style={[styles.removeButtonText, { color: theme.primary }]}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.message, { color: theme.text }]}>
          Please log in to manage ingredients
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border
          }]}
          placeholder="Ingredient name"
          placeholderTextColor={theme.textSecondary}
          value={newIngredient.name}
          onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
        />
        <View style={styles.quantityContainer}>
          <TextInput
            style={[styles.quantityInput, { 
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border
            }]}
            placeholder="Qty"
            placeholderTextColor={theme.textSecondary}
            value={newIngredient.quantity}
            onChangeText={(text) => setNewIngredient({ ...newIngredient, quantity: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.unitInput, { 
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.border
            }]}
            placeholder="Unit"
            placeholderTextColor={theme.textSecondary}
            value={newIngredient.unit}
            onChangeText={(text) => setNewIngredient({ ...newIngredient, unit: text })}
          />
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={handleAddIngredient}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={ingredients}
        renderItem={renderIngredientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No ingredients added yet
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quantityInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  unitInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  addButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientDetails: {
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 32,
  },
}); 