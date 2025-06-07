import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../context/AppContext';

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function IngredientsScreen() {
  const { ingredients, addIngredient, removeIngredient } = useApp();
  const [visible, setVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '', unit: '' });

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setNewIngredient({ name: '', quantity: '', unit: '' });
  };

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      const ingredient: Ingredient = {
        id: Date.now().toString(),
        name: newIngredient.name.trim(),
        quantity: newIngredient.quantity.trim(),
        unit: newIngredient.unit.trim(),
      };
      addIngredient(ingredient);
      hideDialog();
    }
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientItem}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        {(item.quantity || item.unit) && (
          <Text style={styles.ingredientDetails}>
            {item.quantity} {item.unit}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={() => removeIngredient(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {ingredients.length === 0 ? (
        <Text style={styles.emptyText}>No hay ingredientes guardados</Text>
      ) : (
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.id}
          renderItem={renderIngredientItem}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={hideDialog}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar ingrediente</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del ingrediente"
              placeholderTextColor="#999"
              value={newIngredient.name}
              onChangeText={(text: string) => setNewIngredient(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad (opcional)"
              placeholderTextColor="#999"
              value={newIngredient.quantity}
              onChangeText={(text: string) => setNewIngredient(prev => ({ ...prev, quantity: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Unidad (opcional)"
              placeholderTextColor="#999"
              value={newIngredient.unit}
              onChangeText={(text: string) => setNewIngredient(prev => ({ ...prev, unit: text }))}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={hideDialog}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.addButton]} 
                onPress={handleAddIngredient}
              >
                <Text style={[styles.buttonText, styles.addButtonText]}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={showDialog}>
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff4081',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#ff4081',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  addButtonText: {
    color: '#fff',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
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
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff4081',
  },
}); 