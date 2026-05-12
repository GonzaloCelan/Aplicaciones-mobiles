import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }: any) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // registro un usuario guardándolo en AsyncStorage, luego muestro una alerta de éxito y vuelvo al login
  const userRegister = async () => {

    if (!username || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const user = {
      username,
      password,
    };

   await AsyncStorage.removeItem("medications");
  await AsyncStorage.setItem("user", JSON.stringify(user));

    Alert.alert("Éxito", "Usuario registrado");

    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Registro</Text>

      <TextInput
        placeholder="Usuario"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={userRegister}
      >
        <Text style={styles.buttonText}>
          Registrarse
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});