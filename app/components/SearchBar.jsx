import React from "react";
import { StyleSheet, TextInput } from "react-native";

export default function SearchBar({ value, onChange }) {
  return (
    <TextInput
      placeholder="Buscar país..."
      value={value}
      onChangeText={onChange}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    margin: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
