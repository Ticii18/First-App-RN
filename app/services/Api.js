const baseUrl = 'https://restcountries.com/v3.1';

export const getAllCountries = async () => {
  const response = await fetch(`${baseUrl}/all?fields=name,cca2,cca3`);
  return response.json();
};

export const getCountryById = async (name) => {
  const response = await fetch(`${baseUrl}/name/${encodeURIComponent(name)}?fullText=true`);
  return response.json();
};

export const getCountryByRegion = async (region) => {
  const response = await fetch(`${baseUrl}/subregion/${encodeURIComponent(region)}?fields=name,cca2,cca3`);
  return response.json();
};
