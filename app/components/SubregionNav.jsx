import React from "react";
import { Button, StyleSheet, View } from "react-native";

export default function SubregionNav({ subregions, selected, onSelect }) {
  return (
    <View style={styles.navContainer}>
      {subregions.map((region) => (
        <Button
          key={region}
          title={region}
          onPress={() => onSelect(region)}
          color={selected === region ? "#2196F3" : "#aaa"}
        />
      ))}
      <Button
        title="Todos"
        onPress={() => onSelect(null)}
        color={!selected ? "#2196F3" : "#aaa"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    flexWrap: "wrap",
  },
});
