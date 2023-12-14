const txtSearch = document.querySelector("#txtSearch");
const btnSearch = document.querySelector("#btnSearch");
const countryDetails = document.querySelector("#countryDetails");
const neighbors = document.querySelector("#neighbors");
const errors = document.querySelector("#errors");
const details = document.querySelector("#dateails");
const btnLocation = document.querySelector("#btnLocation");
const loading = document.querySelector("#loading");

//* btn Search
btnSearch.addEventListener("click", () => {
  const text = txtSearch.value;
  details.style.opacity = 0;
  loading.style.display = "block";
  txtSearch.value = "";

  getCountry(text);
});

//* btn location
btnLocation.addEventListener("click", () => {
  loading.style.display = "block";
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
});

//* onError
function onError(err) {
  loading.style.display = "none";
}

//* onSuccess
async function onSuccess(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  let api_key = "534103e600ed493cb97485c0f5927888";
  let url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

  let response = await fetch(url);
  let data = await response.json();

  let country = data.results[0].components.country;

  txtSearch.value = country;
  btnSearch.click();
}

//* Get country
async function getCountry(country) {
  try {
    let response = await fetch(
      "https://restcountries.com/v3.1/name/" + country
    );
    if (!response.ok) throw new Error("Ülke bulunamadı");
    let data = await response.json();
    renderCountry(data[0]);
    console.log(data[0]);

    let countries = data[0].borders;
    if (!countries) throw new Error("Komşu Ülke bulunamadı");
    let response2 = await fetch(
      "https://restcountries.com/v3.1/alpha?codes=" + countries.toString()
    );
    let neighbors = await response2.json();
    renderNeighbors(neighbors);
  } catch (error) {
    details.style.opacity = 0;
    loading.style.display = "none";
    renderError(error);
  }
}

//* render country
function renderCountry(data) {
  details.style.opacity = 1;
  loading.style.display = "none";
  countryDetails.innerHTML = "";
  neighbors.innerHTML = "";
  let html = `
    
  <div class="col-4">
  <img src="${data.flags.png}" alt="" class="img-fluid" />
</div>
<div class="col-8">
  <h3 class="card-title">${data.name.common}</h3>
  <hr />
  <div class="row">
    <div class="col-4">Population:</div>
    <div class="col-8">${(data.population / 1000000).toFixed(1)}</div>
  </div>
  <div class="row">
    <div class="col-4">Formal Language::</div>
    <div class="col-8">${Object.values(data.languages)}</div>
  </div>
  <div class="row">
    <div class="col-4">Capital::</div>
    <div class="col-8">${data.capital[0]}</div>
  </div>
  <div class="row">
    <div class="col-4">Currency:</div>
    <div class="col-8">${Object.values(data.currencies)[0].name} 
                      (${Object.values(data.currencies)[0].symbol})</div>
  </div>
</div>
    
              `;

  countryDetails.innerHTML = html;
}

//* render neighbor
function renderNeighbors(data) {
  let html = "";
  for (let country of data) {
    html += `
        <div class="col-2 mt-2">
        <div class="card">
          <img src="${country.flags.png}" alt="" class="card-img-top" />
          <div class="card-body">
            <h3 class="card title">${country.name.common}</h3>
          </div>
        </div>
      </div>
     `;
    neighbors.innerHTML = html;
  }
}

//* render error
function renderError(error) {
  let html = `
              <div class="alert alert-danger" role="alert">
                ${error.message}
              </div>
              `;
  setTimeout(function () {
    errors.innerHTML = "";
  }, 2000);

  details.style.opacity = 0;
  errors.innerHTML = html;
}
