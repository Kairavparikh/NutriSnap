import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { LinearGradient } from 'expo-linear-gradient';


export default function ProgressScreen({}) {
    const route = useRoute();
    const { dailyTotals } = route.params;
    console.log("Received in Progress:", route.params?.dailyTotals);

    const [proteinGoal, setProteinGoal] = useState('');
    const [carbsGoal, setCarbsGoal] = useState('');
    const [fatsGoal, setFatsGoal] = useState('');
    const [calsGoal, setCalsGoal] = useState('');
    console.log(dailyTotals.protein)

    const intProteinGoal = parseFloat(proteinGoal);
    const proteinPercent = intProteinGoal > 0 ? (dailyTotals.protein / intProteinGoal) * 100 : 0;
    const intCarbsGoal = parseFloat(carbsGoal);
    const carbsPercent = intCarbsGoal > 0 ? (dailyTotals.carbs / intCarbsGoal) * 100 : 0;
    const intFatsGoal = parseFloat(fatsGoal);
    const fatsPercent = intFatsGoal > 0 ? (dailyTotals.fats / intFatsGoal) * 100 : 0;
    const intCalsGoals = parseFloat(calsGoal);
    const calsPercent = intCalsGoals > 0 ? (dailyTotals.cals / intCalsGoals) * 100 : 0;

    const [totals, setTotals] = useState([]);


    return(
        <LinearGradient
    colors={['#B497BD', '#7F6D9C']}
    style={styles.gradient}
>
        <ScrollView>
        <View style = {styles.container}>
       
      

        <Text style={styles.label}>Protein (%)</Text>
        <View style={styles.box}>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={proteinGoal}
            onChangeText={setProteinGoal}
            placeholder="Enter protein Goal(grams)"
            returnKeyType="done"
        />
    
        </View>
        
            <Text>Protein: {dailyTotals.protein.toFixed(0)  + "g"}</Text>
            <CircularProgress
            radius={90}
            value={(proteinPercent.toFixed(0))}
            textColor = '#222'
            fontSize = {20}
            valueSuffix={'%'}
            inActiveStrokeColor="blue"
            inActiveStrokeOpacity={0.2}
            inActiveStrokeWidth={6}
            maxValue={100}
            duration={1000}
            />


            <Text style={styles.label}>Carbs (%)</Text>
            <View style={styles.box}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={carbsGoal}
                onChangeText={setCarbsGoal}
                placeholder="Enter Carbs Goal(grams)"
                returnKeyType="done"
            />
            </View>
            <Text>Carbs: {dailyTotals.carbs.toFixed(0)  + "g"}</Text>
            <CircularProgress
            radius={90}
            value={carbsPercent.toFixed(0)}
            textColor = '##985'
            fontSize = {20}
            valueSuffix={'%'}
            inActiveStrokeColor="yellow"
            inActiveStrokeOpacity={0.2}
            inActiveStrokeWidth={6}
            maxValue={1000}

            duration={1000}
            />

        <Text style={styles.label}>Fats (%)</Text>
        <View style={styles.box}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fatsGoal}
                onChangeText={setFatsGoal}
                placeholder="Enter Carbs Goal(grams)"
                returnKeyType="done"
            />
            </View>

            <Text>Fats: {dailyTotals.fats.toFixed(0) + "g"} </Text>
            <CircularProgress
            radius={90}
            value={fatsPercent.toFixed(0)}
            textColor = '#222'
            fontSize = {20}
            valueSuffix={'%'}
            inActiveStrokeColor="red"
            inActiveStrokeOpacity={0.2}
            inActiveStrokeWidth={6}
            maxValue={1000}

            duration={1000}
            />


            <Text style={styles.label}>Calories (%)</Text>
            <View style={styles.box}>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={calsGoal}
                onChangeText={setCalsGoal}
                placeholder="Enter Carbs Goal(grams)"
                returnKeyType="done"
            />
            </View>

            <Text>Calories: {dailyTotals.cals.toFixed(0) + " cals"}</Text>
            <CircularProgress
            radius={90}
            value={calsPercent.toFixed(0)}
            textColor = '#222'
            fontSize = {20}
            valueSuffix={'%'}
            inActiveStrokeColor="green"
            inActiveStrokeOpacity={0.2}
            maxValue={1000}

            inActiveStrokeWidth={6}
            duration={1000}
            />
            </View>
            </ScrollView>
            </LinearGradient>
    );
}
const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    container: {
      padding: 24,
      paddingTop: 50,
      alignItems: 'center',
      flexGrow: 1,
    },
    header: {
      marginBottom: 20,
      fontSize: 28,
      fontWeight: 'bold',
      color: '#37474F', 
      alignSelf: 'center',
    },
    subtitle: {
      marginVertical: 10,
      fontSize: 16,
      color: '#37474F',
      alignSelf: 'flex-start',
      fontWeight: '600',
    },
  
    pickerWrapper: {
      borderWidth: 1,
      borderColor: '#B2DFDB',
      borderRadius: 12,
      backgroundColor: '#E0F2F1',
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  
    textInput: {
      width: '100%',
      marginBottom: 16,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      borderColor: '#B2DFDB',
      borderWidth: 1,
      paddingHorizontal: 12,
      fontSize: 16,
    },
  
    box: {
      width: '100%',
      padding: 16,
      backgroundColor: '#E0F2F1', 
      borderWidth: 1,
      borderColor: '#B2DFDB',
      borderRadius: 12,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  
    label: {
      width: '100%',
      fontWeight: '600',
      fontSize: 16,
      color: '#37474F',
      marginBottom: 6,
    },
  
    textValue: {
      fontSize: 16,
      color: '#37474F',
      marginBottom: 12,
    },
  
    button: {
      width: '100%',
      height: 48,
      justifyContent: 'center',
      borderRadius: 12,
      marginVertical: 6,
      backgroundColor: '#004D40', 
      elevation: 2,
    },
    buttonText: {
      fontWeight: '600',
      fontSize: 16,
      color: 'white',
      textAlign: 'center',
    },
  });