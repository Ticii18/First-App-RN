import React from "react";
import { Button, StyleSheet, View } from "react-native";

export default function LoadMoreButton({ onPress }) {
  return (
    <View style={styles.buttonContainer}>
      <Button title="Cargar más" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});
