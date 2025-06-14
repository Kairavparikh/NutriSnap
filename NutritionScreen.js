import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NutritionScreen({ navigation }) {
  const route = useRoute();
  const { foodItems, imageUri, foodName, foodItemsss } = route.params || {};
  const portion = parseFloat(route.params?.portion || '1');

  const rawItems = foodItemsss && foodItemsss.length > 0 ? foodItemsss : foodItems;
  const tags = rawItems.map((item, index) => ({
    id: index + 1,
    name: item,
  }));

  const [nutritionList, setNutritionList] = useState([]);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalCals, setTotalCals] = useState(0);

  useEffect(() => {
    const getNutritionInfo = async (foodName) => {
      try {
        const apiKey = 'GrFgafPUtwdIFU5lQOg3w3O1yIthg1ZJNeFqM8TD';
        const response = await fetch(
          `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(foodName)}`
        );
        const data = await response.json();
        if (data.foods && data.foods.length > 0) {
          const food = data.foods[0];
          let protein = 0,
            fat = 0,
            carbs = 0;

          for (let nutrient of food.foodNutrients) {
            if (nutrient.nutrientName.includes('Protein')) protein = nutrient.value;
            if (nutrient.nutrientName.includes('Total lipid (fat)')) fat = nutrient.value;
            if (nutrient.nutrientName.includes('Carbohydrate')) carbs = nutrient.value;
          }

          return { foodName, protein, fat, carbs };
        }
        return { foodName, protein: 0, fat: 0, carbs: 0 };
      } catch (err) {
        console.error('API error', err);
        return { foodName, protein: 0, fat: 0, carbs: 0 };
      }
    };

    const fetchAllNutrition = async () => {
      const results = await Promise.all(tags.map((tag) => getNutritionInfo(tag.name)));

      const adjustedProtein = results.reduce((sum, item) => sum + item.protein, 0);
      const adjustedFats = results.reduce((sum, item) => sum + item.fat, 0);
      const adjustedCarbs = results.reduce((sum, item) => sum + item.carbs, 0);
      const adjustedCals = adjustedProtein * 4 + adjustedFats * 9 + adjustedCarbs * 4;

      setNutritionList(results);
      setTotalProtein(adjustedProtein * portion);
      setTotalFats(adjustedFats * portion);
      setTotalCarbs(adjustedCarbs * portion);
      setTotalCals(adjustedCals * portion);
    };

    fetchAllNutrition();
  }, []);

  const navigateToHistory = () => {
    navigation.navigate('History', {
      totalProtein,
      totalCarbs,
      totalFats,
      totalCals,
      imageUri,
      foodName: foodName || rawItems?.join(', ') || 'Food',
    });
  };

  return (
    <LinearGradient
    colors={['#B497BD', '#7F6D9C']}
    style={styles.gradient}
>
    <ScrollView contentContainerStyle={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Text style={styles.title}>Nutrition Breakdown</Text>

      {nutritionList.length === 0 ? (
        <Text style={styles.loadingText}>Loading nutrition data...</Text>
      ) : (
        <>
          {nutritionList.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.foodTitle}>{item.foodName}</Text>
              <Text style={styles.nutrient}> Protein: <Text style={styles.protein}>{item.protein.toFixed(1)}g</Text></Text>
              <Text style={styles.nutrient}> Fat: <Text style={styles.fat}>{item.fat.toFixed(1)}g</Text></Text>
              <Text style={styles.nutrient}> Carbs: <Text style={styles.carbs}>{item.carbs.toFixed(1)}g</Text></Text>
            </View>
          ))}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Nutrients (x{portion})</Text>
            <Text style={styles.nutrient}> Protein: <Text style={styles.protein}>{totalProtein.toFixed(1)}g</Text></Text>
            <Text style={styles.nutrient}> Fat: <Text style={styles.fat}>{totalFats.toFixed(1)}g</Text></Text>
            <Text style={styles.nutrient}> Carbs: <Text style={styles.carbs}>{totalCarbs.toFixed(1)}g</Text></Text>
            <Text style={styles.nutrient}> Calories: <Text style={styles.calories}>{totalCals.toFixed(0)}</Text></Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="View History" onPress={navigateToHistory} color="#245" />
          </View>
        </>
      )}
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#37474F', 
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#37474F',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF', 
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#B2DFDB',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#37474F', 
  },
  nutrient: {
    fontSize: 16,
    marginBottom: 4,
    color: '#37474F', 
  },
  protein: {
    color: '#0077b6', 
    fontWeight: '600',
  },
  fat: {
    color: '#d00000',
    fontWeight: '600',
  },
  carbs: {
    color: '#f77f00', 
    fontWeight: '600',
  },
  calories: {
    color: '#6a4c93', 
    fontWeight: '600',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#37474F',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 8,
    overflow: 'hidden',
  },
});