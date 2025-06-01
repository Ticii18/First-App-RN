import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function CountryExtraDetails() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
        const data = await res.json();
        setCountry(data[0]);
      } catch (error) {
        console.error("Error cargando el país:", error);
      } finally {
        setLoading(false);
      }
    };

    if (name) fetchCountry();
  }, [name]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <Text>No se pudo cargar la información adicional del país.</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView>
        <Text className="text-2xl font-bold mb-4">Información Adicional</Text>

        <View className="mb-4">
          <Text className="font-semibold text-lg">Dominio de Internet:</Text>
          <Text>{country.tld?.join(", ") || "No disponible"}</Text>
        </View>

        <View className="mb-4">
          <Text className="font-semibold text-lg">Fronteras:</Text>
          <Text>{country.borders?.join(", ") || "No disponible"}</Text>
        </View>

        <View className="mb-4">
          <Text className="font-semibold text-lg">Independencia:</Text>
          <Text>{country.independent ? "Sí" : "No disponible"}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
