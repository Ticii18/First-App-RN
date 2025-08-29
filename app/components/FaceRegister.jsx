import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, Image, Platform, StyleSheet, View } from "react-native";

export default function FaceRegister({ onRegister }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Se necesita acceso a la cámara");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    if (!image) {
      Alert.alert("Selecciona una foto primero");
      return;
    }
    setLoading(true);
    let fileToSend = null;
    try {
      if (Platform.OS === "web") {
        // Web: convertir a File
        const response = await fetch(image.uri);
        const blob = await response.blob();
        fileToSend = new File([blob], image.fileName || "face.jpg", { type: blob.type || "image/jpeg" });
      } else {
        fileToSend = {
          uri: image.uri,
          name: image.fileName || "face.jpg",
          type: "image/jpeg",
        };
      }
    } catch (fileErr) {
      setLoading(false);
      Alert.alert("Error preparando la imagen", fileErr.message || "No se pudo preparar la imagen");
      return;
    }

    const formData = new FormData();
    formData.append("cuil", onRegister.cuil);
    formData.append("image", fileToSend);

    try {
      const res = await fetch("https://52ve8mm1q0ra.share.zrok.io/register", {
        method: "POST",
        body: formData,
        headers: { "skip_zrok_interstitial": "true" },
      });
      let data = null;
      let text = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        text = await res.text();
      }
      setLoading(false);
      if (data && data.success) {
        Alert.alert("Registro facial exitoso");
        onRegister.onSuccess();
      } else if (text && text.toLowerCase().includes("registrado correctamente")) {
        // Extraer CUIL si está en el texto
        const cuilMatch = text.match(/CUIL\s*"?(\d{8,})"?/i);
        const cuil = cuilMatch ? cuilMatch[1] : undefined;
        Alert.alert("Registro facial exitoso", cuil ? `CUIL: ${cuil}` : text);
        onRegister.onSuccess && onRegister.onSuccess();
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Tomar Foto" onPress={takePhoto} disabled={loading} />
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
        />
      )}
      <Button title="Registrar" onPress={handleRegister} disabled={loading || !image} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  image: { width: 200, height: 200, marginVertical: 20, borderRadius: 10 },
});
