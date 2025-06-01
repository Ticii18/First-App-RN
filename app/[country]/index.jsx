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
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <Text>No se recibió el nombre del país.</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600">{error}</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  if (!country) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <Text>Cargando detalles del país...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView>
        <Text className="text-3xl font-bold mb-4">
          {country?.name?.common || "Nombre no disponible"}
        </Text>

        {country?.flags?.png && (
          <Image
            source={{ uri: country.flags.png }}
            style={{ width: "100%", height: 200, marginBottom: 16 }}
            resizeMode="contain"
          />
        )}

        <View className="mb-4">
          <Text className="text-lg">
            <Text className="font-semibold">Nombre oficial: </Text>
            <Text>{country?.name?.official || "No disponible"}</Text>
          </Text>
          <Text className="text-lg">
            <Text className="font-semibold">Capital: </Text>
            {country?.capital ? country.capital.join(", ") : "No disponible"}
          </Text>
          <Text className="text-lg">
            <Text className="font-semibold">Región: </Text>
            {country?.region || "No disponible"}
          </Text>
          <Text className="text-lg">
            <Text className="font-semibold">Subregión: </Text>
            {country?.subregion || "No disponible"}
          </Text>
          <Text className="text-lg">
            <Text className="font-semibold">Población: </Text>
            {country?.population
              ? country.population.toLocaleString()
              : "No disponible"}
          </Text>
          <Text className="text-lg">
            <Text className="font-semibold">Área: </Text>
            {country?.area
              ? country.area.toLocaleString() + " km²"
              : "No disponible"}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="font-semibold text-lg mb-2">Moneda:</Text>
          {country?.currencies ? (
            Object.values(country.currencies).map((currency) => (
              <Text key={currency.name} className="text-lg">
                {currency.name} ({currency.symbol})
              </Text>
            ))
          ) : (
            <Text className="text-lg">No disponible</Text>
          )}
        </View>

        <View className="mb-4">
          <Text className="font-semibold text-lg mb-2">Idiomas:</Text>
          {country?.languages ? (
            <Text className="text-lg">
              {Object.values(country.languages).join(", ")}
            </Text>
          ) : (
            <Text className="text-lg">No disponible</Text>
          )}
        </View>
        <Button
          title="Ver más detalles"
          onPress={() => router.push(`/country/${name}/details`)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
