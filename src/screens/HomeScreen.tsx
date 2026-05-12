import {
  Alert,
  FlatList,
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

export default function HomeScreen({ navigation }: any) {

  const [items, setItems] = useState([]);

  const [userName, setUserName] = useState("");

  // cargo medicamentos y usuario
  const loadItems = async () => {

    try {

      const storedItems =
        await AsyncStorage.getItem("medications");

      const medications = storedItems
        ? JSON.parse(storedItems)
        : [];

      setItems(medications);

      // obtengo el usuario guardado en AsyncStorage, lo parseo y seteo el nombre de usuario para mostrarlo en pantalla
      const user = await AsyncStorage.getItem("user");

      if (user) {
      const parsedUser = JSON.parse(user);
       setUserName(parsedUser.username);
      }


    } catch (error) {
      console.log(error);
    }
  };

  // elimino medicamento
  const deleteItem = async (id: string) => {

    try {

      const updatedMedications =
        items.filter(
          (item: any) => item.id !== id
        );

      await AsyncStorage.setItem(
        "medications",
        JSON.stringify(updatedMedications)
      );

      setItems(updatedMedications);

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
      loadItems();
    }, [])
  );

  return (
    <SafeAreaProvider>

      <SafeAreaView style={styles.container}>


        <View style={styles.header}>

          <View>

            <Text style={styles.userName}>
              Hola {userName}
            </Text>

          </View>

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

          keyExtractor={(item: any) => item.id}

          contentContainerStyle={{
            marginTop: 20,
            paddingBottom: 20,
          }}

          renderItem={({ item }: any) => (

            <View style={styles.card}>

              <View>

                <View style={styles.medicationContainer}>

                  <Ionicons
                    name="medkit"
                    size={24}
                    color="#751b79"
                  />

                  <Text style={styles.medicationName}>
                    {item.name}
                  </Text>

                </View>

                <Text style={styles.hour}>
                  Hora: {item.hour}
                </Text>

              </View>

              <TouchableOpacity
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  greeting: {
    fontSize: 18,
    color: "#64748b",
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
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,

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

    shadowRadius: 5,

    elevation: 3,
  },

  medicationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },

  medicationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },

  hour: {
    color: "#6b7280",
    fontSize: 15,
    marginLeft: 32,
  },

  deleteText: {
    fontSize: 22,
  },

});