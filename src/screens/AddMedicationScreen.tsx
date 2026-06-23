import React, { useState } from "react";

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import * as Contacts from "expo-contacts";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMedicationStore } from "../store/medicationStore";
import type {
  Medication,
  PharmacyLocation,
  RelatedContact,
} from "../types/Medication";

export default function AddMedicationScreen({ navigation }: any) {

  //---parcial uno---
  
  const [name, setName] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  //---parcial dos---
  
  const [image, setImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState("pending");
  const [galleryPermission, setGalleryPermission] = useState("pending");

  const [locationPermission, setLocationPermission] = useState("pending");
  const [pharmacyLocation, setPharmacyLocation] =
    useState<PharmacyLocation | null>(null);

  const [contactPermission, setContactPermission] = useState("pending");
  const [relatedContact, setRelatedContact] =
    useState<RelatedContact | null>(null);

  const [calendarPermission, setCalendarPermission] = useState("pending");
  const [calendarEventCreated, setCalendarEventCreated] = useState(false);

  const addMedication = useMedicationStore(
    (state) => state.addMedication
  );

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



  const pickImageFromCamera = async () => {

    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    setCameraPermission(status);

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para usar la cámara."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
       cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    setGalleryPermission(status);

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para acceder a la galería."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const savePharmacyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    setLocationPermission(status);

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para obtener la ubicación de la farmacia."
      );
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const locationData = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };

    setPharmacyLocation(locationData);

    Alert.alert(
      "Ubicación guardada",
      "Se guardó la ubicación de la farmacia."
    );
  };

  const selectContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    setContactPermission(status);

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para acceder a los contactos."
      );
      return;
    }

    const contact = await (Contacts as any).presentContactPickerAsync();

    if (!contact) {
      return;
    }

    const contactName =
      contact.name ||
      `${contact.firstName || ""} ${contact.lastName || ""}`.trim() ||
      "Contacto";

    const contactPhone =
      contact.phoneNumbers && contact.phoneNumbers.length > 0
        ? contact.phoneNumbers[0].number
        : "Sin teléfono";

    setRelatedContact({
      name: contactName,
      phone: contactPhone,
    });
  };

  const createCalendarEvent = async () => {
    if (!name.trim()) {
      Alert.alert(
        "Error",
        "Primero completa el nombre del medicamento."
      );
      return;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();


    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos permiso para crear el evento en el calendario."
      );
      return;
    }

    const startDate = new Date(selectedTime);
    const endDate = new Date(selectedTime);

    endDate.setMinutes(endDate.getMinutes() + 15);

    try {
      const result = await (Calendar as any).createEventInCalendarAsync({
        title: `Tomar ${name.trim()}`,
        startDate,
        endDate,
        notes: "Recordatorio creado desde la app de medicación.",
      });

      if (result?.action === "canceled") {
        Alert.alert("Calendario", "No se creó el evento.");
        return;
      }

      setCalendarEventCreated(true);

      Alert.alert(
        "Calendario",
        "Evento creado o abierto en el calendario."
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "No se pudo crear el evento en el calendario."
      );
    }
  };

  const saveItem = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Completa el nombre");
      return;
    }

    try {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name: name.trim(),
        hour: formattedHour,
        imageUri: image,
        pharmacyLocation,
        relatedContact,
        calendarEventCreated,
      };

      await addMedication(newMedication);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Recordatorio de medicamento",
          body: `Es momento de tomar tu ${name.trim()}`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 5,
        },
      });

      Alert.alert("Éxito", "Medicamento guardado");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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

          <Text style={styles.label}>Foto del medicamento</Text>

          <View style={styles.photoSection}>
            <View style={styles.photoButtonsColumn}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={pickImageFromCamera}
              >
                <Ionicons
                  name="camera"
                  size={28}
                  color="#2563eb"
                />

                <Text style={styles.iconButtonText}>
                  Cámara
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={pickImageFromGallery}
              >
                <Ionicons
                  name="images"
                  size={28}
                  color="#2563eb"
                />

                <Text style={styles.iconButtonText}>
                  Galería
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.emptyImageContainer}>
                  <Ionicons
                    name="image-outline"
                    size={40}
                    color="#9ca3af"
                  />

                  <Text style={styles.emptyImageText}>
                    Sin imagen
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Text style={styles.permissionText}>
            Cámara: {cameraPermission} | Galería: {galleryPermission}
          </Text>

          <Text style={styles.label}>Datos adicionales</Text>

          <View style={styles.extraActions}>
            <TouchableOpacity
              style={styles.extraIconButton}
              onPress={savePharmacyLocation}
            >
              <Ionicons
                name="location"
                size={30}
                color="#16a34a"
              />

              <Text style={styles.extraIconText}>
                Ubicación
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.extraIconButton}
              onPress={selectContact}
            >
              <Ionicons
                name="person"
                size={30}
                color="#f97316"
              />

              <Text style={styles.extraIconText}>
                Contacto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.extraIconButton}
              onPress={createCalendarEvent}
            >
              <Ionicons
                name="calendar"
                size={30}
                color="#0f766e"
              />

              <Text style={styles.extraIconText}>
                Calendario
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.permissionText}>
            Ubicación: {locationPermission} | Contactos: {contactPermission}
          </Text>

          <Text style={styles.permissionText}>
            Calendario: {calendarPermission}
          </Text>

          {pharmacyLocation && (
            <View style={styles.infoBox}>
              <Ionicons
                name="location"
                size={18}
                color="#16a34a"
              />

              <Text style={styles.infoText}>
                Ubicación de farmacia guardada
              </Text>
            </View>
          )}

          {relatedContact && (
            <View style={styles.infoBox}>
              <Ionicons
                name="person"
                size={18}
                color="#f97316"
              />

              <Text style={styles.infoText}>
                {relatedContact.name} - {relatedContact.phone}
              </Text>
            </View>
          )}

          {calendarEventCreated && (
            <View style={styles.infoBox}>
              <Ionicons
                name="calendar"
                size={18}
                color="#0f766e"
              />

              <Text style={styles.infoText}>
                Evento de calendario creado
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={saveItem}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 80,
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

  photoSection: {
    flexDirection: "row",
    gap: 12,
    alignItems: "stretch",
  },

  photoButtonsColumn: {
    width: 95,
    gap: 10,
  },

  iconButton: {
    flex: 1,
    minHeight: 72,
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    justifyContent: "center",
    alignItems: "center",
  },

  iconButtonText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#2563eb",
  },

  imageContainer: {
    flex: 1,
    height: 154,
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyImageText: {
    marginTop: 5,
    fontSize: 13,
    color: "#9ca3af",
  },

  extraActions: {
    flexDirection: "row",
    gap: 10,
  },

  extraIconButton: {
    flex: 1,
    minHeight: 90,
    backgroundColor: "#FFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },

  extraIconText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },

  permissionText: {
    fontSize: 13,
    color: "#555",
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#751b79",
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});