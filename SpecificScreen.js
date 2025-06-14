import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';


const screenWidth = Dimensions.get('window').width;

export default function SpecificScreen() {
  const route = useRoute();
  const { monthlyTotals, sixMonthTotals } = route.params;

  const [selectedSegment, setSelectedSegment] = useState('Month');

  const renderSegmentedControl = () => {
    return (
      <View style={styles.segmentedContainer}>
        <TouchableOpacity
          style={[
            styles.segment,
            selectedSegment === 'Month' && styles.selectedSegment,
          ]}
          onPress={() => setSelectedSegment('Month')}
        >
          <Text
            style={[
              styles.segmentText,
              selectedSegment === 'Month' && styles.selectedText,
            ]}
          >
            Month (Weekly)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segment,
            selectedSegment === '6 Months' && styles.selectedSegment,
          ]}
          onPress={() => setSelectedSegment('6 Months')}
        >
          <Text
            style={[
              styles.segmentText,
              selectedSegment === '6 Months' && styles.selectedText,
            ]}
          >
            6 Months (Monthly)
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderChart = () => {

    if (selectedSegment === 'Month' && monthlyTotals && monthlyTotals.length > 0) {
      const labels = monthlyTotals.map((week, i) => `W${i + 1}`);
  
      const calsData = monthlyTotals.map((week) => week.cals.toFixed(0) || 0);
      const fatsData = monthlyTotals.map((week) => week.fats.toFixed(0) || 0);
      const proteinData = monthlyTotals.map((week) => week.protein.toFixed(0) || 0);
      const carbsData = monthlyTotals.map((week) => week.carbs.toFixed(0) || 0);
      const chartWidth = Math.max(screenWidth - 40, labels.length * 60);
  
      return (
        <LinearGradient
    colors={['#B497BD', '#7F6D9C']}
    style={styles.gradient}
>
        <>
          <Text style={styles.title}>Weekly Totals - Calories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <BarChart
              data={{ labels, datasets: [{ data: calsData }] }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={styles.chartStyle}
              showValuesOnTopOfBars
              verticalLabelRotation={0}
              numberOfTicks={6}
            />
          </ScrollView>
  
          <Text style={styles.title}>Weekly Totals - Fats</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <BarChart
              data={{ labels, datasets: [{ data: fatsData }] }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={styles.chartStyle}
              showValuesOnTopOfBars
              verticalLabelRotation={0}
              numberOfTicks={6}
            />
          </ScrollView>
  
          <Text style={styles.title}>Weekly Totals - Proteins</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <BarChart
              data={{ labels, datasets: [{ data: proteinData }] }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={styles.chartStyle}
              showValuesOnTopOfBars
              verticalLabelRotation={0}
              numberOfTicks={6}
            />
          </ScrollView>
  
          <Text style={styles.title}>Weekly Totals - Carbs</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <BarChart
              data={{ labels, datasets: [{ data: carbsData }] }}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              fromZero
              style={styles.chartStyle}
              showValuesOnTopOfBars
              verticalLabelRotation={0}
              numberOfTicks={6}
            />
          </ScrollView>
        </>
        </LinearGradient>
      );
    }
  
    if (selectedSegment === '6 Months' && sixMonthTotals && sixMonthTotals.length > 0) {
        const labels = sixMonthTotals.map(m => m.label);
        const proteinData = sixMonthTotals.map(m => m.protein.toFixed(0) || 0);
        const fatsData = sixMonthTotals.map(m => m.fats.toFixed(0) || 0);
        const carbsData = sixMonthTotals.map(m => m.carbs.toFixed(0) || 0);
        const calsData = sixMonthTotals.map(m => m.cals.toFixed(0) || 0);

        const chartWidth = Math.max(screenWidth - 40, labels.length * 60);
      
        return (
            <LinearGradient
            colors={['#B497BD', '#7F6D9C']}
            style={styles.gradient}
        >
          <>
            <Text style={styles.title}>6 MONTHS - Protein</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <BarChart
                data={{ labels, datasets: [{ data: proteinData }] }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
                showValuesOnTopOfBars
                verticalLabelRotation={0}
                numberOfTicks={6}
              />
            </ScrollView>
      
            <Text style={styles.title}>6 MONTHS - Fats</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <BarChart
                data={{ labels, datasets: [{ data: fatsData }] }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
                showValuesOnTopOfBars
                verticalLabelRotation={0}
                numberOfTicks={6}
              />
            </ScrollView>
      
            <Text style={styles.title}>6 MONTHS - Carbs</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <BarChart
                data={{ labels, datasets: [{ data: carbsData }] }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
                showValuesOnTopOfBars
                verticalLabelRotation={0}
                numberOfTicks={6}
              />
            </ScrollView>
      
            <Text style={styles.title}>6 MONTHS - Calories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <BarChart
                data={{ labels, datasets: [{ data: calsData }] }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                style={styles.chartStyle}
                showValuesOnTopOfBars
                verticalLabelRotation={0}
                numberOfTicks={6}
              />
            </ScrollView>
          </>
          </LinearGradient>

        );
      }else if (selectedSegment === '6 Months') {
        return <Text style={styles.title}>No 6 Months Data Available</Text>;
      }
      
      
  
    return <Text style={styles.title}>No Data Available</Text>;
    
  };
  

  return (
    <LinearGradient
            colors={['#B497BD', '#7F6D9C']}
            style={styles.gradient}
        >
    <ScrollView contentContainerStyle={styles.container}>
      {renderSegmentedControl()}
      {renderChart()}
    </ScrollView>
            </LinearGradient>

  );
}
const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 16,
      
    },
    segmentedContainer: {
      flexDirection: 'row',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#007AFF', 
      overflow: 'hidden',
      marginBottom: 20,
      width: '90%',
      alignSelf: 'center',
    },
    segment: {
      flex: 1,
      paddingVertical: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSegment: {
      backgroundColor: '#007AFF',
    },
    segmentText: {
      fontSize: 16,
      color: '#007AFF',
      fontWeight: '600',
    },
    selectedText: {
      color: '#fff',
      fontWeight: '700',
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: '#333',
      marginVertical: 18,

      textAlign: 'center',
    },
    chartStyle: {
      borderRadius: 12,
      marginVertical: 12,
      marginHorizontal: 10,

    },
  });
  
const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',

  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#007AFF',
  },
};