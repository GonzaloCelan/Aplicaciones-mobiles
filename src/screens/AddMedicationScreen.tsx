import React, { useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";


import { SafeAreaView } from "react-native-safe-area-context";

import * as Notifications from "expo-notifications";

import DateTimePicker from '@react-native-community/datetimepicker';


export default function AddMedicationScreen({ navigation }: any) {

  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event: any, date: any) => {
    setShowPicker(false);
    if (date) {
      setSelectedTime(date);
    }
  };

  const formattedHour = selectedTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const saveItem = async () => {
    if (!name) {
      Alert.alert("Error", "Completa el nombre");
      return;
    }

    try {
      const storedItems = await AsyncStorage.getItem("medications");
      const medications = storedItems ? JSON.parse(storedItems) : [];

      const newMedication = {
        id: (medications.length + 1).toString(),
        name,
        hour: formattedHour,
      };

      medications.push(newMedication);

      await AsyncStorage.setItem("medications", JSON.stringify(medications));

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Recordatorio de medicamento",
          body: `Es momento de tomar tu ${name}`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        }
      });

      Alert.alert("Éxito", "Medicamento guardado");
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Añadir Medicamento</Text>

      <View style={styles.form}>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Aspirina, Ibuprofeno..."
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Seleccione hora:</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timeText}>{formattedHour}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={saveItem}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },

  form: {
    gap: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#DDD",
    fontSize: 16,
  },

  timeButton: {
    backgroundColor: "#FFF",
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  timeText: {
    fontSize: 16,
  },

  button: {
    backgroundColor: "#751b79",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 25,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

});