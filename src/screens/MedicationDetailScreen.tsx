import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationDetailScreen({ route }: any) {
  const { medication } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detalle del medicamento</Text>

        {medication.imageUri ? (
          <Image
            source={{ uri: medication.imageUri }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="medkit"
              size={50}
              color="#751b79"
            />
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.medicationName}>
            {medication.name}
          </Text>

          <Text style={styles.hour}>
            Hora de toma: {medication.hour}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="location"
              size={20}
              color="#16a34a"
            />

            <Text style={styles.sectionTitle}>
              Ubicación de farmacia
            </Text>
          </View>

          {medication.pharmacyLocation ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: medication.pharmacyLocation.latitude,
                  longitude: medication.pharmacyLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: medication.pharmacyLocation.latitude,
                    longitude: medication.pharmacyLocation.longitude,
                  }}
                  title="Farmacia"
                  description="Ubicación asociada al medicamento"
                />
              </MapView>
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No se guardó ubicación.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="person"
              size={20}
              color="#f97316"
            />

            <Text style={styles.sectionTitle}>
              Contacto relacionado
            </Text>
          </View>

          {medication.relatedContact ? (
            <>
              <Text style={styles.text}>
                Nombre: {medication.relatedContact.name}
              </Text>

              <Text style={styles.text}>
                Teléfono: {medication.relatedContact.phone}
              </Text>
            </>
          ) : (
            <Text style={styles.emptyText}>
              No se seleccionó contacto.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons
              name="calendar"
              size={20}
              color="#0f766e"
            />

            <Text style={styles.sectionTitle}>
              Calendario
            </Text>
          </View>

          {medication.calendarEventCreated ? (
            <Text style={styles.text}>
              Evento creado para la toma del medicamento.
            </Text>
          ) : (
            <Text style={styles.emptyText}>
              No se creó evento en calendario.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111827",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    marginBottom: 20,
  },

  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    marginBottom: 20,
    backgroundColor: "#f3e8ff",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  medicationName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  hour: {
    marginTop: 8,
    fontSize: 16,
    color: "#6b7280",
  },

  section: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#111827",
  },

  mapContainer: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d1fae5",
    marginTop: 5,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  text: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 15,
    color: "#9ca3af",
  },
});