import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IngredientItemProps {
  name: string;
  amount?: string;
  onDelete?: () => void;
  onPress?: () => void;
}

export const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  amount,
  onDelete,
  onPress,
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons name="nutrition-outline" size={24} color="#666" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{name}</Text>
          {amount && <Text style={styles.amount}>{amount}</Text>}
        </View>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 2,
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
}); 