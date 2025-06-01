import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SearchBar from "../components/SearchBar";
import SubregionNav from "../components/SubregionNav";
import {
  getAllCountries,
  getCountryByRegion,
} from "../services/Api";

export default function CountryScreen() {
  const [allCountries, setAllCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);
  const [selectedSubregion, setSelectedSubregion] = useState(null);
  const [error, setError] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const router = useRouter();

  const subregions = ["South America", "Western Europe", "Southeast Asia"];

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setAllCountries(sorted);
        setFilteredCountries(sorted);
      } catch (err) {
        setError("Error al cargar países.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const fetchBySubregion = async () => {
      if (!selectedSubregion) {
        setFilteredCountries(allCountries);
        return;
      }
      try {
        setLoading(true);
        const data = await getCountryByRegion(selectedSubregion);
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setFilteredCountries(sorted);
      } catch (err) {
        setError("Error al cargar subregión.");
      } finally {
        setLoading(false);
      }
    };
    fetchBySubregion();
  }, [selectedSubregion]);

  const handleSearch = () =>
    filteredCountries.filter((country) =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );

  const countriesToShow = handleSearch();

  const visibleCountries =
    selectedSubregion || search
      ? countriesToShow
      : countriesToShow.slice(0, visibleCount);

  const loadMore = () => {
    if (visibleCount >= countriesToShow.length) return;
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SearchBar value={search} onChange={setSearch} />
      <SubregionNav
        subregions={subregions}
        selected={selectedSubregion}
        onSelect={(region) => {
          setSelectedSubregion(region);
          setSearch("");
          setVisibleCount(20);
        }}
      />
      {loading && visibleCountries.length === 0 && (
        <Text className="text-center mt-4">Cargando países...</Text>
      )}
      {error && <Text className="text-center text-red-500 mt-2">{error}</Text>}

      <FlatList
        data={visibleCountries}
        keyExtractor={(item) => item.cca3}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/[country]",
                params: { name: item.name.common },
              })
            }
            className="border-b border-gray-300 px-4 py-3"
          >
            <Text className="text-lg">{item.name.common}</Text>
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        ListFooterComponent={() =>
          visibleCount < countriesToShow.length ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
