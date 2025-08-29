import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  const { matches, username } = useLocalSearchParams(); 
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/4202/4202843.png" }}
        style={styles.icon}
      />
      {matches ? (
        <Text style={styles.title}>Bienvenido {matches}</Text>
      ) : (
        <Text style={styles.title}>¡Hola, {username}!</Text>
      )}
      <Text style={styles.subtitle}>
        Has iniciado sesión correctamente.
      </Text>
      <Text style={styles.message}>
        Explorá el menú para comenzar a navegar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2a4d9b",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
  },
});
