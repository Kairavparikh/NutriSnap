import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native'; 
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HistoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  

  const {
    imageUri,
    totalProtein,
    totalFats,
    totalCarbs,
    totalCals,
    foodName = "Unknown Food"
  } = route.params || {};

  const [history, setHistory] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    cals: 0
  });
  const [sixMonthTotals, setSixMonthTotals] = useState({ protein: 0, fats: 0, carbs: 0, cals: 0 });
  const [monthlyTotals, setMonthlyTotals] = useState({ protein: 0, fats: 0, carbs: 0, cals: 0 });



  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('imageHistory');
      const parsed = data ? JSON.parse(data) : [];

      if (imageUri && totalProtein !== undefined) {
        const now = new Date();
        const dateTimeString = now.toLocaleString();

        const newEntry = {
          imageUri,
          dateTime: dateTimeString,
          protein: Number(totalProtein) || 0,
          fats: Number(totalFats) || 0,
          carbs: Number(totalCarbs) || 0,
          cals: Number(totalCals) || 0,
          foodName
        };
        const alreadyExists = parsed.some(item => item.imageUri === imageUri);
        if (!alreadyExists) {
          parsed.unshift(newEntry);
          await AsyncStorage.setItem('imageHistory', JSON.stringify(parsed));
        }
      }

      setHistory(parsed);
      calculateDailyTotals(parsed);
      calculateLastSixMonthsTotals(parsed);
      //console.log("Six Month" + calculateLastSixMonthsTotals(parsed) );
      calculateMonthlyTotals(parsed);
    } catch (error) {
      console.error('Failed to load or update image history:', error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [imageUri, totalProtein, totalFats, totalCarbs, totalCals, foodName]);

  
  
  const calculateDailyTotals = (historyItems) => {
    if (!historyItems || historyItems.length === 0) {
      return;
    }
    
    const todayStr = new Date().toLocaleDateString('en-US');
    
    const todaysItems = historyItems.filter(item => {
      if (!item.dateTime) {
        return false;
      }
      const itemDatePart = item.dateTime.split(',')[0];
      const itemMonthPart = itemDatePart.split('/')[0];

      return itemDatePart === todayStr;
    });
    
    const totals = todaysItems.reduce((acc, item) => {
      return {
        protein: acc.protein + Number(item.protein || 0),
        fats: acc.fats + Number(item.fats || 0),
        carbs: acc.carbs + Number(item.carbs || 0),
        cals: acc.cals + Number(item.cals || 0)
      };
    }, { protein: 0, fats: 0, carbs: 0, cals: 0 });
    
    setDailyTotals(totals);
    console.log("DAY" + dailyTotals);

    AsyncStorage.setItem('dailyTotals', JSON.stringify(totals))
      .catch(err => console.error("Failed to save daily totals:", err));
  };






  const calculateMonthlyTotals = (historyItems) => {
    if (!historyItems || historyItems.length === 0) {
      return;
    }
  
    const todayStr = new Date().toLocaleDateString('en-US'); 
    const currentMonth = Number(todayStr.split('/')[0]);
    const currentYear = Number(todayStr.split('/')[2]);
  
    let weeklyTotals = {
      1: { protein: 0, fats: 0, carbs: 0, cals: 0 },
      2: { protein: 0, fats: 0, carbs: 0, cals: 0 },
      3: { protein: 0, fats: 0, carbs: 0, cals: 0 },
      4: { protein: 0, fats: 0, carbs: 0, cals: 0 },
      5: { protein: 0, fats: 0, carbs: 0, cals: 0 },
    };
  
    historyItems.forEach(item => {
      if (!item.dateTime) return;
  
      const itemDatePart = item.dateTime.split(',')[0]; 
      const itemMonthPart = Number(itemDatePart.split('/')[0]);
      const itemDayPart = Number(itemDatePart.split('/')[1]);
      const itemYearPart = Number(itemDatePart.split('/')[2]);
  
      if (itemMonthPart === currentMonth && itemYearPart === currentYear) {
        let weekNumber;
        if (itemDayPart <= 7) weekNumber = 1;
        else if (itemDayPart <= 14) weekNumber = 2;
        else if (itemDayPart <= 21) weekNumber = 3;
        else if (itemDayPart <= 28) weekNumber = 4;
        else weekNumber = 5;
  
        weeklyTotals[weekNumber] = {
          protein: weeklyTotals[weekNumber].protein + Number(item.protein || 0),
          fats: weeklyTotals[weekNumber].fats + Number(item.fats || 0),
          carbs: weeklyTotals[weekNumber].carbs + Number(item.carbs || 0),
          cals: weeklyTotals[weekNumber].cals + Number(item.cals || 0),
        };
      }
    });
  
    const weeklyTotalsArray = Object.entries(weeklyTotals).map(([week, totals]) => ({
      label: `Week ${week}`,
      ...totals,
    }));
  
    console.log("Weekly Totals for Current Month:", weeklyTotalsArray);
  
    setMonthlyTotals(weeklyTotalsArray);
  
    AsyncStorage.setItem('monthlyTotals', JSON.stringify(weeklyTotalsArray))
      .catch(err => console.error("Failed to save weekly totals:", err));
  };
  
  



  const calculateLastSixMonthsTotals = (historyItems) => {
    if (!historyItems || historyItems.length === 0) {
      return;
    }
  
    const todayStr = new Date().toLocaleDateString('en-US');
    const currentMonth = Number(todayStr.split('/')[0]);
    const currentYear = Number(todayStr.split('/')[2]);
  
    let startMonth = currentMonth - 5;
    let startYear = currentYear;
  
    if (startMonth <= 0) {
      startMonth += 12;
      startYear -= 1;
    }
  
    const monthMap = new Map();
  
    historyItems.forEach(item => {
      if (!item.dateTime) return;
  
      const itemDatePart = item.dateTime.split(',')[0];
      const itemMonthPart = Number(itemDatePart.split('/')[0]);
      const itemYearPart = Number(itemDatePart.split('/')[2]);
  
      console.log(" " + itemDatePart + " " + todayStr);
      console.log(" " + itemMonthPart + " " + currentMonth);
      console.log(" " + itemYearPart + " " + currentYear);
  
      if (itemYearPart < startYear || itemYearPart > currentYear) {
        return;
      }
      if (itemYearPart === startYear && itemMonthPart < startMonth) {
        return;
      }
      if (itemYearPart === currentYear && itemMonthPart > currentMonth) {
        return;
      }
  
      const key = `${itemYearPart}-${itemMonthPart.toString().padStart(2, '0')}`;
  
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          label: new Date(itemYearPart, itemMonthPart - 1).toLocaleString('default', { month: 'short' }),
          protein: 0,
          fats: 0,
          carbs: 0,
          cals: 0,
        });
      }
  
      const prev = monthMap.get(key);
      monthMap.set(key, {
        ...prev,
        protein: prev.protein + Number(item.protein || 0),
        fats: prev.fats + Number(item.fats || 0),
        carbs: prev.carbs + Number(item.carbs || 0),
        cals: prev.cals + Number(item.cals || 0),
      });
    });
  
    const sixMonthTotals = Array.from(monthMap.entries())
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([_, value]) => value);
  
    console.log("Six Month Totals", sixMonthTotals);
  
    setSixMonthTotals(sixMonthTotals);
  
    AsyncStorage.setItem('sixMonthTotals', JSON.stringify(sixMonthTotals))
      .catch(err => console.error("Failed to save monthly totals:", err));
  };
  

  
  
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('imageHistory');
      await AsyncStorage.removeItem('dailyTotals');
      await AsyncStorage.removeItem('monthlyTotals');
      await AsyncStorage.removeItem('sixMonthTotals');
      setHistory([]);
      setMonthlyTotals({ protein: 0, fats: 0, carbs: 0, cals: 0 });
      setSixMonthTotals({ protein: 0, fats: 0, carbs: 0, cals: 0 });
      setDailyTotals({ protein: 0, fats: 0, carbs: 0, cals: 0 });
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const navigateToProgress = () => {
    AsyncStorage.getItem('dailyTotals')
      .then(data => {
        const storedTotals = data ? JSON.parse(data) : dailyTotals;
        console.log("DAY" + storedTotals );

        navigation.navigate('Progress', { 
          dailyTotals: storedTotals,
          debugHistoryCount: history.length
        });
      })
      .catch(err => {
        navigation.navigate('Progress', { dailyTotals });
      });
  };
  const navigatetoSpecifics = async () => {
    try {
      const monthlyTotalsData = await AsyncStorage.getItem('monthlyTotals');
      const sixMonthTotalsData = await AsyncStorage.getItem('sixMonthTotals');
  
      const monthStoredTotals = monthlyTotalsData ? JSON.parse(monthlyTotalsData) : monthlyTotals;
      const sixMonthStoredTotals = sixMonthTotalsData ? JSON.parse(sixMonthTotalsData) : sixMonthTotals;
  
      console.log("Monthly Totals:", monthStoredTotals);
      console.log("Six Month Totals:", sixMonthStoredTotals);
  
      navigation.navigate('Specifics', {
        monthlyTotals: monthStoredTotals,
        sixMonthTotals: sixMonthStoredTotals,
        debugHistoryCount: history.length
      });
    } catch (err) {
      console.error("Error retrieving totals:", err);
      navigation.navigate('Specifics', { });
    }
  };
  

  const todayStr = new Date().toLocaleDateString('en-US'); 
const todayHistory = history.filter(item => {
  const itemDate = item.dateTime.split(',')[0]; 
  return itemDate === todayStr;
});


  return (
    <LinearGradient
    colors={['#B497BD', '#7F6D9C']}
    style={styles.gradient}
>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food History</Text>
      
      <View style={styles.totalsContainer}>
  <Text style={styles.totalsTitle}>Today's Totals</Text>
  <View>
    <View style={styles.nutrientRow}>
      <Text style={[styles.nutrientText, styles.proteinText]}>Protein:</Text>
      <Text style={[styles.nutrientText, styles.proteinText]}>{dailyTotals.protein.toFixed(0)}g</Text>
    </View>
    <View style={styles.nutrientRow}>
      <Text style={[styles.nutrientText, styles.fatsText]}>Fats:</Text>
      <Text style={[styles.nutrientText, styles.fatsText]}>{dailyTotals.fats.toFixed(0)}g</Text>
    </View>
    <View style={styles.nutrientRow}>
      <Text style={[styles.nutrientText, styles.carbsText]}>Carbs:</Text>
      <Text style={[styles.nutrientText, styles.carbsText]}>{dailyTotals.carbs.toFixed(0)}g</Text>
    </View>
    <View style={styles.nutrientRow}>
      <Text style={[styles.nutrientText, styles.calsText]}>Calories:</Text>
      <Text style={[styles.nutrientText, styles.calsText]}>{dailyTotals.cals.toFixed(0)}</Text>
    </View>
  </View>
</View>
      
     
      <View style={styles.buttonContainer}>
        <Button
          title="View Progress"
          onPress={navigateToProgress}
        />
        <Button 
          title="Clear History" 
          onPress={clearHistory} 
          color="#FF0000"
        />
                  <Button title="View Past Data" onPress={navigatetoSpecifics}/>

      </View>
      
      {todayHistory.length === 0 ? (
  <Text style={styles.emptyMessage}>No history found for today.</Text>
) : (
  todayHistory.map((item, index) => (
    <View key={index} style={styles.historyItem}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.itemDetails}>
        <Text style={styles.foodName}>Food: {item.foodName}</Text>
        <Text>Date/Time: {item.dateTime}</Text>
        <View>
  <Text style={styles.proteinText}>Protein: {item.protein.toFixed(0)}g</Text>
  <Text style={styles.fatsText}>Fats: {item.fats.toFixed(0)}g</Text>
  <Text style={styles.carbsText}>Carbs: {item.carbs.toFixed(0)}g</Text>
  <Text style={styles.calsText}>Calories: {item.cals.toFixed(0)}</Text>
</View>
      </View>
    </View>
  ))
)}
  </ScrollView>
  </LinearGradient>
);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    fontWeight: 'bold',

  },
  historyItem: {
    width: '100%',
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#B2DFDB',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
  },
  itemDetails: {
    width: '100%',
    paddingHorizontal: 10,
    fontWeight: 'bold',

  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    fontWeight: 'bold',

  },

  emptyMessage: {
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },

  totalsContainer: {
    backgroundColor: '#f3e8ff',   
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#6a4c93',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  totalsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5e3a8a',   
    marginBottom: 12,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  nutrientText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a3f55',
  },
  proteinText: {
    color: '#0077b6',   
  },
  fatsText: {
    color: '#d00000',  
  },
  carbsText: {
    color: '#f77f00',  
  },
  calsText: {
    color: '#6a4c93',  
  },
});