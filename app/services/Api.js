const api = 'https://restcountries.com/v3.1';

export const getAllCountries = async () => {
  const response = await fetch(`${api}/all`);
  const data = await response.json();
  return data;
};
export const getCountryById = async (name) => {
  const res = await fetch(`${api}/name/${name}`);
  return res.json();
};

export const getCountryByRegion= async (region)=>{
    const response = await fetch (`${api}/subregion/${region}`)
    const data = await response.json()
    return data;
}
