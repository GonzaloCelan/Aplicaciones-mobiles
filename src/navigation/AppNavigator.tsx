import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddMedicationScreen from "../screens/AddMedicationScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import MedicationDetailScreen from "../screens/MedicationDetailScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
          options={{ title: "Agregar Medicación" }}
        />

        <Stack.Screen
          name="MedicationDetail"
          component={MedicationDetailScreen}
          options={{ title: "Detalle del medicamento" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}