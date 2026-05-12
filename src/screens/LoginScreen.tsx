import { useState } from "react";
import {
  Alert, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/Button";

export default function LoginScreen({ navigation }: any) {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

// inicio de sesión: obtengo el usuario guardado en AsyncStorage, lo parseo y comparo con los datos ingresados, 
// si coinciden navego a Home, 
// sino muestro una alerta de error.

const userLogin = async () => {
  try {
    const savedUser = await AsyncStorage.getItem("user");

    if (!savedUser) {
      Alert.alert("Error", "No hay usuario registrado");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (username === parsedUser.username && password === parsedUser.password) {
      navigation.navigate("Home");
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  } catch (error) {
    Alert.alert("Error", "Ocurrió un problema inesperado");
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <CustomButton
        title="Ingresar"
        onPress={login}
      />

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          ¿No tenés cuenta? Registrate
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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

  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#3b82f6",
  },
});