# NutriSnap

NutriSnap is a mobile application that allows you to track your nutritional intake by simply taking a picture of your food. The app uses AI to identify food items from your images, provides detailed nutritional information, and helps you track your progress towards your dietary goals.

## Features

* **AI-Powered Food Recognition:** Take a picture of your meal, and NutriSnap will identify the food items for you.
* **Detailed Nutritional Information:** Get comprehensive data on calories, protein, fats, and carbohydrates for each food item.
* **Historical Tracking:** Keep a history of your meals to monitor your eating habits over time.
* **Progress Monitoring:** Set daily nutritional goals and track your progress with intuitive charts and graphs.
* **Manual Entry:** Manually add food items that are not in your picture.
* **Data Visualization:** View your weekly and monthly nutritional data in easy-to-understand bar charts.

## Technologies Used

* **Frontend:** React Native, Expo
* **Backend:** Python, FastAPI
* **AI:** OpenAI GPT-4 Vision
* **Database:** AsyncStorage for local device storage
* **API:** USDA FoodData Central API for nutritional information

## Getting Started

### Prerequisites

* Node.js and npm
* Python 3.x
* Expo Go app on your mobile device
* OpenAI API Key
* USDA FoodData Central API Key

### Installation

**Backend:**

1.  Clone the repository.
2.  Navigate to the backend directory.
3.  Install the required Python packages:
    ```bash
    pip install fastapi openai python-dotenv uvicorn
    ```
4.  Create a `.env` file and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key
    ```
5.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

**Frontend:**

1.  Navigate to the project's root directory.
2.  Install the required Node.js packages:
    ```bash
    npm install
    ```
3.  In `NutritionScreen.js`, replace `'GrFgafPUtwdIFU5lQOg3w3O1yIthg1ZJNeFqM8TD'` with your USDA FoodData Central API key.
4.  Start the Expo development server:
    ```bash
    npx expo start
    ```
5.  Scan the QR code with the Expo Go app on your mobile device.

## Usage

1.  On the **Home** screen, you can either take a picture of your food or select one from your gallery.
2.  The app will analyze the image and identify the food items.
3.  You can then view the detailed nutritional information for the identified items on the **Nutrition** screen.
4.  Your meals will be saved in the **History** screen for future reference.
5.  Track your daily progress towards your nutritional goals on the **Progress** screen.
6.  View your long-term trends on the **Specifics** screen.

## Project Structure

```
.
├── App.js                 # Main component
├── Navigation.js          # Navigation setup
├── Screens
│   ├── HomeScreen.js      # Main screen for image capture
│   ├── HistoryScreen.js   # Displays meal history
│   ├── NutritionScreen.js # Displays nutritional information
│   ├── ProgressScreen.js  # Displays progress towards goals
│   └── SpecificScreen.js  # Displays charts for long-term data
├── main.py                # Backend FastAPI server
└── package.json           # Frontend dependencies
```

## Dependencies

### Frontend

* `@react-native-async-storage/async-storage`
* `@react-native-picker/picker`
* `@react-navigation/native`
* `@react-navigation/stack`
* `expo`
* `expo-file-system`
* `expo-image-picker`
* `expo-linear-gradient`
* `react-native-chart-kit`
* `react-native-circular-progress-indicator`
* `react-native-paper`

### Backend

* `fastapi`
* `openai`
* `uvicorn`
