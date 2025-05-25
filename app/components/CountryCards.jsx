import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { getCountryById } from "../services/Api";

export default function CountryCard({ countryName }) {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryById(countryName);
        setCountry(data[0]); 
      } catch (err) {
        setError("No se pudo cargar el país");
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryName]);

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!country) return null;

  return (
    <View style={styles.card}>
      <Image source={{ uri: country.flags?.png || country.flags?.svg }} style={styles.flag} />
      <View style={styles.content}>
        <Text style={styles.name}>{country.name.common}</Text>
        <Text style={styles.info}>Capital: {country.capital?.[0] || "N/A"}</Text>
        <Text style={styles.info}>Región: {country.region}</Text>
        <Text style={styles.info}>
          Población: {country.population.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  flag: {
    width: 80,
    height: 50,
    borderRadius: 6,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  info: {
    fontSize: 14,
    color: "#666",
  },
});
