import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text
} from "react-native";
import CountryCard from "../components/CountryCards";
import LoadMoreButton from "../components/LoadMoreButton";
import SearchBar from "../components/SearchBar";
import SubregionNav from "../components/SubregionNav";
import { getAllCountries } from "../services/Api";

export default function CountryScreen() {
  const [allCountries, setAllCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedSubregion, setSelectedSubregion] = useState(null);
  const [error, setError] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

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
        const response = await fetch(
          `https://restcountries.com/v3.1/subregion/${encodeURIComponent(
            selectedSubregion
          )}`
        );
        const data = await response.json();
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar value={search} onChange={setSearch} />
      <SubregionNav
        subregions={subregions}
        selected={selectedSubregion}
        onSelect={(region) => {
          setSelectedSubregion(region);
          setSearch("");
          setVisibleCount(10);
        }}
      />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>}
      <ScrollView>
        {visibleCountries.map((country) => (
          <CountryCard key={country.cca3} countryName={country.name.common} />
        ))}
        {!selectedSubregion &&
          !search &&
          visibleCount < countriesToShow.length && (
            <LoadMoreButton onPress={() => setVisibleCount(visibleCount + 10)} />
          )}
      </ScrollView>
    </SafeAreaView>
  );
}