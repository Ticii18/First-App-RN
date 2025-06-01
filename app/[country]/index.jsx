import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function CountryDetails() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;

    const fetchCountry = async () => {
      setLoading(true);
      setError(null);
      setCountry(null);
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            name
          )}?fullText=true`
        );
        const data = await response.json();

        if (data.status === 404 || !data[0]) {
          setError("País no encontrado");
          setCountry(null);
        } else {
          setCountry(data[0]);
        }
      } catch (err) {
        setError("Error al cargar los detalles del país");
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [name]);

  if (!name) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-red-600 text-center text-lg mb-4">
          No se recibió el nombre del país.
        </Text>
        <Button title="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-red-600 text-lg mb-4">{error}</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-gray-700 text-lg">Cargando detalles del país...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView className="space-y-6">
        <Text className="text-4xl font-bold text-center text-blue-900">
          {country?.name?.common || "Nombre no disponible"}
        </Text>

        {country?.flags?.png && (
          <Image
            source={{ uri: country.flags.png }}
            style={{ width: "100%", height: 200 }}
            className="rounded-lg shadow-md"
            resizeMode="contain"
          />
        )}

        <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-semibold mb-2 text-blue-800">
            Información general
          </Text>
          <Text className="text-base">
            <Text className="font-medium">Nombre oficial:</Text>{" "}
            {country?.name?.official || "No disponible"}
          </Text>
          <Text className="text-base">
            <Text className="font-medium">Capital:</Text>{" "}
            {country?.capital ? country.capital.join(", ") : "No disponible"}
          </Text>
          <Text className="text-base">
            <Text className="font-medium">Región:</Text> {country?.region || "No disponible"}
          </Text>
          <Text className="text-base">
            <Text className="font-medium">Subregión:</Text>{" "}
            {country?.subregion || "No disponible"}
          </Text>
          <Text className="text-base">
            <Text className="font-medium">Población:</Text>{" "}
            {country?.population?.toLocaleString() || "No disponible"}
          </Text>
          <Text className="text-base">
            <Text className="font-medium">Área:</Text>{" "}
            {country?.area?.toLocaleString() + " km²" || "No disponible"}
          </Text>
        </View>

        <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-semibold mb-2 text-blue-800">Moneda</Text>
          {country?.currencies ? (
            Object.values(country.currencies).map((currency) => (
              <Text key={currency.name} className="text-base">
                {currency.name} ({currency.symbol})
              </Text>
            ))
          ) : (
            <Text>No disponible</Text>
          )}
        </View>

        <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
          <Text className="text-xl font-semibold mb-2 text-blue-800">Idiomas</Text>
          {country?.languages ? (
            <Text className="text-base">
              {Object.values(country.languages).join(", ")}
            </Text>
          ) : (
            <Text>No disponible</Text>
          )}
        </View>

        <View className="mt-4">
          <Button
            title="Ver más detalles"
            onPress={() => router.push(`/country/${name}/details`)}
            color="#2563eb"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
