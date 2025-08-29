import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import FaceLogin from "./components/FaceLogin";
import FaceRegister from "./components/FaceRegister";

export default function MainScreen() {
  const [cuil, setCuil] = useState("");
  const [showFaceRegister, setShowFaceRegister] = useState(false);
  const [showFaceLogin, setShowFaceLogin] = useState(false);
  const router = useRouter();

  // Registro facial
  const handleFaceRegister = {
    cuil,
    onSuccess: () => {
      setShowFaceRegister(false);
      Alert.alert("Registro facial exitoso");
    },
  };

  // Login facial
  const handleFaceLogin = async (recognizedCuil) => {
    setShowFaceLogin(false);
    if (recognizedCuil) {
      router.replace({ pathname: "/screens/Dashboard", params: { cuil: recognizedCuil } });
    } else {
      Alert.alert("No se reconoció el rostro");
    }
  };

  return (
    <ScrollView>
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Registro clásico</Text>
      <TextInput
        placeholder="Cuil"
        value={cuil}
        onChangeText={setCuil}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Registrar rostro" onPress={() => setShowFaceRegister(true)} />
      <Button title="Ingresar con rostro" onPress={() => setShowFaceLogin(true)} />

      {showFaceRegister && (
        <FaceRegister onRegister={handleFaceRegister} />
      )}
      {showFaceLogin && (
        <FaceLogin onSuccess={handleFaceLogin} />
      )}
    </View>
    </ScrollView>
  );
}
