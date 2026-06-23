import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useCallback, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFocusEffect } from "@react-navigation/native";

import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

import CustomButton from "../components/Button";

import { useMedicationStore } from "../store/medicationStore";

export default function HomeScreen({ navigation }: any) {
  const items = useMedicationStore((state) => state.medications);

  const loadMedications = useMedicationStore(
    (state) => state.loadMedications
  );

  const deleteMedication = useMedicationStore(
    (state) => state.deleteMedication
  );

  const [userName, setUserName] = useState("");

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.username);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await deleteMedication(id);

      Alert.alert(
        "Éxito",
        "Medicamento eliminado correctamente"
      );
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMedications();
      loadUser();
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.userName}>
            Hola {userName}
          </Text>
        </View>

        <CustomButton
          title="Agregar Medicación"
          onPress={() =>
            navigation.navigate("AddMedication")
          }
        />

        <Text style={styles.subtitle}>
          Tu medicación de hoy
        </Text>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Todavía no agregaste medicamentos.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.leftContent}>
                <View style={styles.imageWrapper}>
                  {item.imageUri ? (
                    <Image
                      source={{ uri: item.imageUri }}
                      style={styles.medicationImage}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons
                        name="medkit"
                        size={32}
                        color="#751b79"
                      />
                    </View>
                  )}
                </View>

                <View style={styles.medicationInfo}>
                  <Text
                    style={styles.medicationName}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text style={styles.hour}>
                    Hora: {item.hour}
                  </Text>

                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() =>
                      navigation.navigate("MedicationDetail", {
                        medication: item,
                      })
                    }
                  >
                    <Text style={styles.moreButtonText}>
                      Ver más
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteItem(item.id)}
              >
                <MaterialIcons
                  name="delete"
                  size={28}
                  color="#ef4444"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  header: {
    marginBottom: 10,
  },

  userName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#0b0c0c",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#101011",
    marginTop: 8,
    marginBottom: 10,
  },

  listContent: {
    marginTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 2,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#0c3d9e",
    fontSize: 16,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    marginHorizontal: 2,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  imageWrapper: {
    width: 85,
    height: 85,
    borderRadius: 8,
    marginRight: 14,

    backgroundColor: "#ffffff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
  },

  medicationImage: {
    width: 85,
    height: 85,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },

  imagePlaceholder: {
    width: 85,
    height: 85,
    borderRadius: 8,
    backgroundColor: "#f3e8ff",
    justifyContent: "center",
    alignItems: "center",
  },

  medicationInfo: {
    flex: 1,
    justifyContent: "center",
  },

  medicationName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 5,
  },

  hour: {
    color: "#6b7280",
    fontSize: 15,
    marginBottom: 10,
  },

  moreButton: {
    backgroundColor: "#751b79",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  moreButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
  },

  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});