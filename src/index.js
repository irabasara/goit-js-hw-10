import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEL = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInputKeydown, DEBOUNCE_DELAY));

function onInputKeydown(event) {
  fetchCountries(event.target.value)
    .then(data => {
      if (data.length <= 10 && data.length >= 2) {
        countryListEl.innerHTML = createFirstPartOfMarkup(data);
        countryInfoEL.style.visibility = 'hidden';
      } else if (data.length === 1) {
        countryListEl.innerHTML = createFirstPartOfMarkup(data);
        countryInfoEL.innerHTML = createSecondPartOfMarkup(data);
        countryInfoEL.style.visibility = 'visible';
      } else if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      countryListEl.innerHTML = '';
      countryInfoEL.innerHTML = '';
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
      return `<h3>Capital: ${capital}</h3>
                <h3>Language: ${Object.values(languages)}</h3>
                <h3>Population: ${population}</h3>`;
    })
    .join('');
}
