import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { hoagies } from '../../services/api';
import { HoagieFormData } from '../../types';

const CreateHoagieScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState<HoagieFormData>({
    name: '',
    ingredients: [''],
    picture: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleIngredientChange = (text: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) =>
        i === index ? text : ingredient
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Filter out empty ingredients
      const validIngredients = formData.ingredients.filter(ing => ing.trim() !== '');
      
      if (validIngredients.length === 0) {
        setError('Please add at least one ingredient');
        return;
      }

      await hoagies.create({
        ...formData,
        ingredients: validIngredients,
      });
      
      navigation.goBack();
    } catch (err) {
      setError('Failed to create hoagie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Hoagie Name"
        value={formData.name}
        onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {formData.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.ingredientRow}>
          <TextInput
            label={`Ingredient ${index + 1}`}
            value={ingredient}
            onChangeText={text => handleIngredientChange(text, index)}
            style={styles.ingredientInput}
          />
          <Button
            mode="outlined"
            onPress={() => handleRemoveIngredient(index)}
            style={styles.removeButton}
          >
            Remove
          </Button>
        </View>
      ))}

      <Button
        mode="outlined"
        onPress={handleAddIngredient}
        style={styles.addButton}
      >
        Add Ingredient
      </Button>

      <TextInput
        label="Picture URL (optional)"
        value={formData.picture}
        onChangeText={text => setFormData(prev => ({ ...prev, picture: text }))}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading || !formData.name.trim()}
        style={styles.submitButton}
      >
        Create Hoagie
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientInput: {
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    minWidth: 80,
  },
  addButton: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default CreateHoagieScreen; 