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
        const res = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`
        );
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
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-red-600 text-lg text-center mb-4">
          No se pudo cargar la información adicional del país.
        </Text>
        <Button title="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="space-y-6">
        <Text className="text-3xl font-bold text-blue-900 text-center mb-4">
          Información Adicional
        </Text>

        <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-blue-800 mb-1">
            Dominio de Internet
          </Text>
          <Text className="text-base">
            {country.tld?.join(", ") || "No disponible"}
          </Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-blue-800 mb-1">
            Fronteras
          </Text>
          <Text className="text-base">
            {country.borders?.join(", ") || "No disponible"}
          </Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-blue-800 mb-1">
            Independencia
          </Text>
          <Text className="text-base">
            {country.independent ? "Sí" : "No disponible"}
          </Text>
        </View>

        <View className="mt-6">
          <Button
            title="Volver"
            onPress={() => router.back()}
            color="#2563eb"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
