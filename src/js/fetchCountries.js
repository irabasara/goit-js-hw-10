const BASE_URL = 'https://restcountries.com/v3.1/name/';

export const fetchCountries = name => {
  return fetch(`${BASE_URL}${name.trim()}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};
