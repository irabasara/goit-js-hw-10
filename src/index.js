import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/';

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEL = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputKeydown, DEBOUNCE_DELAY));

const fetchCountries = name => {
  return fetch(`${BASE_URL}${name.trim()}`).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};

function onInputKeydown(event) {
  if (!event.target.value) {
    clearMarkup();
    return;
  }
  console.log(event.target.value);
  fetchCountries(event.target.value)
    .then(data => {
      if (data.length <= 10 && data.length >= 2) {
        countryListEl.innerHTML = createFirstPartOfMarkup(data);
        countryInfoEL.style.visibility = 'hidden';
      } else if (data.length === 1) {
        countryListEl.innerHTML = createFirstPartOfMarkup(data);
        countryInfoEL.innerHTML = createSecondPartOfMarkup(data);
        countryInfoEL.style.visibility = 'visibility';
      } else if (data.length > 10) {
        console.log(data);

        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      clearMarkup();
      Notify.failure('Oops, there is no country with that name');
    });
}

function createFirstPartOfMarkup(arr) {
  return arr
    .map(({ name, flags }) => {
      return `<li>
                <img src="${flags.svg}" alt="${flags.alt}" width="60" height="40">
                <h2>${name.common}</h2>
              </li>`;
    })
    .join('');
}

function createSecondPartOfMarkup(arr) {
  return arr
    .map(({ capital, languages, population }) => {
      return `<p>capital: ${capital}</p>
                <p>language: ${Object.values(languages)}</p>
                <p>population: ${population}</p>`;
    })
    .join('');
}

function clearMarkup() {
  //   countryInfoEL.style.visibility = 'hidden';
  //   countryListEl.style.visibility = 'hidden';
  countryListEl.innerHTML = '';
  countryInfoEL.innerHTML = '';
}
