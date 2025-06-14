import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {
  Text,
  Button,
  Card,
  TextInput,
  Title,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [bool, setMyBool] = useState(false);
  const [extra, setExtra] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');
  const [foodItemsss, setFoodItemsss] = useState([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntryDone, setManualEntryDone] = useState(false);
  const [pastHistory, setPastHistory] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

    if (libraryStatus !== 'granted' || cameraStatus !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera and photo library.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      sendImageToBackend(uri);
    }
  };

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImage(uri);
        sendImageToBackend(uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const sendImageToBackend = async (uri) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      const response = await fetch('http://192.168.68.56:8000/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64Image }),
      });
  
      const data = await response.json();
      const foodItems = data.food_items;
  
      const combinedItems = [...foodItemsss, ...foodItems];
      setFoodItemsss(combinedItems);
  
      navigation.navigate('Nutrition', {
        foodItems: combinedItems,
        imageUri: uri,
        portion: parseFloat(selectedValue),
      });
  
      setFoodItemsss([]);
      setImage(null);
      setSelectedValue('');
      setShowManualEntry(false);
      setManualEntryDone(false);
      setMyBool(false);
      setPastHistory(true);
    } catch (error) {
      console.error('Error sending image to backend:', error);
      Alert.alert('Error', 'Failed to analyze image');
    }
  };
  

  return (
    <LinearGradient
    colors={['#B497BD', '#7F6D9C']}
    style={styles.gradient}
>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.header}>🍽️ NutriSnap</Title>

        {pastHistory && (
          <Button mode="contained-tonal" style={styles.button} onPress={() => navigation.navigate('History')}>
            View Past History
          </Button>
        )}

        <Text variant="titleMedium" style={styles.subtitle}>Select Portion Size</Text>

        <View style={styles.pickerWrapper}>
  <Picker
    selectedValue={selectedValue}
    onValueChange={(itemValue) => {
      setSelectedValue(itemValue);
      setShowManualEntry(true);
    }}
    dropdownIconColor="#00796B"   
    >
    <Picker.Item label="-- Choose Portion --" value="" />
    <Picker.Item label="A Little" value="0.25" />
    <Picker.Item label="Half" value="0.5" />
    <Picker.Item label="A Lot" value="0.75" />
    <Picker.Item label="All of It" value="1" />
  </Picker>
</View>

        {showManualEntry && !manualEntryDone && (
          <>
            <Text variant="titleMedium" style={styles.subtitle}>Add Manual Items (Optional)</Text>
            <TextInput
              value={extra}
              onChangeText={setExtra}
              label="Enter an Extra Item"
              style={styles.textInput}
            />
            <View style={styles.buttonGroup}>
              <Button mode="contained" style={styles.button} onPress={() => {
                if (extra?.trim()) setFoodItemsss(prevItems => [...prevItems, extra.trim()]);
                setExtra('');
                setManualEntryDone(true);
              }}>Add Item</Button>
              <Button mode="contained" onPress={() => setManualEntryDone(true)} style={styles.button}>Skip</Button>
            </View>
          </>
        )}

        {manualEntryDone && (
          <>
            <Button mode="contained" style={styles.button} onPress={pickImage}>Select Image</Button>
            <Button mode="contained" style={styles.button} onPress={takePhoto}>Take Photo</Button>
          </>
        )}

        {image && (
          <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: image }} style={styles.image} />
          </Card>
        )}

        {bool && (
          <Button
            mode="elevated"
            style={styles.button}
            onPress={() => {
              navigation.navigate('Nutrition', {
                foodItemsss,
                portion: parseFloat(selectedValue),
              });
            }}
          >
            View Macros
          </Button>
        )}
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
  },

  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },

  imageCard: {
    width: 260,
    height: 260,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});