// Handles the search
const countrySelected = document.getElementById('countrySelector')
  .firstElementChild;
const dateUpdated = countrySelected.nextElementSibling;
const inputBox =
  countrySelected.nextElementSibling.nextElementSibling.firstElementChild;
const dropButton = inputBox.nextElementSibling;

// Handles the country list
const listOfCountriesContainer = document.getElementById('countryList');
const listOfCountries = document.getElementById('countryList')
  .firstElementChild;

// Handles the counts for selected country
const confirmed = document.getElementById('confirmed').firstElementChild
  .nextElementSibling;
const recovered = document.getElementById('recovered').firstElementChild
  .nextElementSibling;
const deaths = document.getElementById('deaths').firstElementChild
  .nextElementSibling;
const newConfirmed = document.getElementById('confirmed').lastElementChild;
const newRecovered = document.getElementById('recovered').lastElementChild;
const newDeaths = document.getElementById('deaths').lastElementChild;

// Handles date updated
const worldDateUpdate = document.getElementById('world-info').lastElementChild;

// Handles the world count
const worldTotalConfirmed = document.getElementById('worldTotalConfirmed')
  .firstElementChild.nextElementSibling;
const worldTotalRecovered = document.getElementById('worldTotalRecovered')
  .firstElementChild.nextElementSibling;
const worldTotalDeaths = document.getElementById('worldTotalDeaths')
  .firstElementChild.nextElementSibling;
const newTotalConfirmed = document.getElementById('worldTotalConfirmed')
  .lastElementChild;
const newTotalRecovered = document.getElementById('worldTotalRecovered')
  .lastElementChild;
const newTotalDeaths = document.getElementById('worldTotalDeaths')
  .lastElementChild;

// Number displayed with comma separator
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Displaying the date of update
const displayDate = (date) => {
  dateUpdated.innerText = `recorded as of ${moment(date).format('LLL')}`;
  worldDateUpdate.innerText = `as of ${moment(date).format('LLL')}`;
};

// Show lists of countries on click
inputBox.addEventListener('click', () => {
  listOfCountriesContainer.classList.toggle('d-none');
});

dropButton.addEventListener('click', () => {
  listOfCountriesContainer.classList.toggle('d-none');
  dropButton.classList.toggle('fa-sort-up');
});

// Shows the suggested country when input is starts with in the list
inputBox.addEventListener('input', (evt) => {
  const items = listOfCountries.getElementsByTagName('li');
  for (let i = 0; i < items.length; i++) {
    const isStartsWithLC = items[i].innerText
      .toLowerCase()
      .startsWith(evt.target.value.toLowerCase());
    const isStartsWithUC = items[i].innerText
      .toUpperCase()
      .startsWith(evt.target.value.toUpperCase());

    if ((!!evt.target.value && isStartsWithLC) || isStartsWithUC) {
      items[i].classList.remove('d-none');
    } else {
      items[i].classList.add('d-none');
    }
  }
});

// Displays country lists.
const setCountriesToList = (data) => {
  data.Countries.forEach((country) => {
    const countryItem = document.createElement('li');
    countryItem.classList.add('country-list-item');

    countryItem.setAttribute('total-confirmed', country.TotalConfirmed);
    countryItem.setAttribute('total-recovered', country.TotalRecovered);
    countryItem.setAttribute('total-deaths', country.TotalDeaths);
    countryItem.setAttribute('new-confirmed', country.NewConfirmed);
    countryItem.setAttribute('new-recovered', country.NewRecovered);
    countryItem.setAttribute('new-deaths', country.NewDeaths);
    countryItem.innerText = country.Country.toUpperCase();

    listOfCountries.appendChild(countryItem);

    // Shows the suggested country based on the user input
    inputBox.addEventListener('input', () => {
      const value = inputBox.value;
      // console.log('hello');

      if (country.Country.startsWith(value)) {
        // console.log('hello');
        countryItem.classList.toggle('d-none');
      }
    });
  });
};

// Country is selected
document.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('country-list-item')) {
    countrySelected.innerHTML = evt.target.innerText;
    listOfCountriesContainer.classList.add('d-none');

    // Displaying Total Cases
    confirmed.innerText = numberWithCommas(
      evt.target.getAttribute('total-confirmed')
    );
    recovered.innerText = numberWithCommas(
      evt.target.getAttribute('total-recovered')
    );
    deaths.innerText = numberWithCommas(
      evt.target.getAttribute('total-deaths')
    );

    // Displaying New Cases
    newConfirmed.innerText = `+${numberWithCommas(
      evt.target.getAttribute('new-confirmed')
    )}`;
    newRecovered.innerText = `+${numberWithCommas(
      evt.target.getAttribute('new-recovered')
    )}`;
    newDeaths.innerText = `+${numberWithCommas(
      evt.target.getAttribute('new-deaths')
    )}`;

    inputBox.value = '';
  }
});

// Displays the count of confirmed, recovered and deaths all over the world
const displayWorldTotalData = (data) => {
  worldTotalConfirmed.innerText = numberWithCommas(data.Global.TotalConfirmed);
  worldTotalRecovered.innerText = numberWithCommas(data.Global.TotalRecovered);
  worldTotalDeaths.innerText = numberWithCommas(data.Global.TotalDeaths);

  newTotalConfirmed.innerText = `+ ${numberWithCommas(
    data.Global.NewConfirmed
  )}`;
  newTotalRecovered.innerText = `+ ${numberWithCommas(
    data.Global.NewRecovered
  )}`;
  newTotalDeaths.innerText = `+ ${numberWithCommas(data.Global.NewDeaths)}`;
};

// Display by default
const displayByDefault = (data) => {
  data.filter((country) => {
    if (country.CountryCode == 'PH') {
      countrySelected.innerText = country.Country;

      confirmed.innerText = numberWithCommas(country.TotalConfirmed);
      recovered.innerText = numberWithCommas(country.TotalRecovered);
      deaths.innerText = numberWithCommas(country.TotalDeaths);

      // Displaying New Cases
      newConfirmed.innerText = `+${numberWithCommas(country.NewConfirmed)}`;
      newRecovered.innerText = `+${numberWithCommas(country.NewRecovered)}`;
      newDeaths.innerText = `+${numberWithCommas(country.NewDeaths)}`;
    }
  });
};

// API
const fetchData = () => {
  fetch('https://api.covid19api.com/summary')
    .then((res) =>
      res.json().then((data) => {
        setCountriesToList(data);
        displayDate(data.Date);
        displayWorldTotalData(data);
        displayByDefault(data.Countries);
      })
    )
    .catch((err) => {
      fetchData();
    });
};

(() => {
  fetchData();
})();
