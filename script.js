'use strict';

const main = document.querySelector('.main');
const form = document.querySelector('.form');
const icon = document.querySelector('.icon');
const res = document.querySelector('.res');
const reset = document.querySelector('.reset');
const inputTip = document.querySelector('.input_tip');
const inputPozicija = document.querySelector('.input_pozicija');
const inputVreme = document.querySelector('.input_vreme');
const inputKolicina = document.querySelector('.input_kolicina');

class Result {
  months = [
    'Januar',
    'Februar',
    'Mart',
    'April',
    'Maj',
    'Jun',
    'Jul',
    'Avgust',
    'Septembar',
    'Oktobar',
    'Novembar',
    'Decembar',
  ];
  date = new Date();
  day = this.date.getDate();
  month = this.months[this.date.getMonth()];
  year = this.date.getFullYear();
  fullDate = `${this.day}. ${this.month} ${this.year}.`;
  id = Math.ceil(Math.random() * 100000);

  constructor(coords, tip, pozicija, vreme, kolicina) {
    this.coords = coords;
    this.tip = tip;
    this.pozicija = pozicija;
    this.vreme = vreme;
    this.kolicina = kolicina;
    this.calcProsek();
    this.vremenskiUslovi();
  }

  calcProsek() {
    this.prosek = this.kolicina / this.vreme;
    return this.prosek;
  }

  vremenskiUslovi() {
    const check1 = document.getElementById('myCheckbox1');
    const check2 = document.getElementById('myCheckbox2');
    const check3 = document.getElementById('myCheckbox3');
    const check4 = document.getElementById('myCheckbox4');
    const check5 = document.getElementById('myCheckbox5');
    const check6 = document.getElementById('myCheckbox6');

    if (
      check1.checked == false &&
      check2.checked == false &&
      check3.checked == false &&
      check4.checked == false &&
      check5.checked == false &&
      check6.checked == false
    ) {
      this.vremenskiUslovi = `nisu uneti!`;
      return this.vremenskiUslovi;
    }

    if (check1.checked == true) {
      this.vremenskiUslovi = `<img src="img/weather/sun.png" alt="" class="sun" width="30px" />`;
      return this.vremenskiUslovi;
    }
    if (check2.checked == true) {
      this.vremenskiUslovi = `<img src="img/weather/sun_cloud.png" alt="" width="30px" />`;
      return this.vremenskiUslovi;
    }
    if (check3.checked == true) {
      this.vremenskiUslovi = `<img src="img/weather/cloud.png" alt="" width="30px" />`;
      return this.vremenskiUslovi;
    }
    if (check4.checked == true) {
      this.vremenskiUslovi = `<img src="img/weather/rain.png" alt="" width="30px" />`;
      return this.vremenskiUslovi;
    }
    if (check5.checked == true) {
      this.vremenskiUslovi = `<img src="img/weather/snow.png" alt="" width="30px" />`;
      return this.vremenskiUslovi;
    }
    if (check6.checked == true) {
      this.vremenskiUslovi = `<img src="img/weather/wind.png" alt="" width="30px" />`;
      return this.vremenskiUslovi;
    }
  }
}

class App {
  map;
  mapEvent;
  results = [];

  constructor() {
    this.getPosition();
    this.getLocalStorage();
    form.addEventListener('submit', this.newResult.bind(this));
    icon.addEventListener('click', this.expand.bind(this));
    reset.addEventListener('click', this.deleteAll.bind(this));
    res.addEventListener('click', this.moveToMarker.bind(this));
  }

  getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this.loadMap.bind(this),
        function () {
          alert('Could not get your position!');
        }
      );
  }

  loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.map = L.map('map').setView(coords, 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('click', this.focus.bind(this));

    this.results.forEach(res => this.renderMarker(res));
  }

  focus(mapE) {
    this.mapEvent = mapE;
    inputTip.focus();
  }

  newResult(e) {
    e.preventDefault();
    let tip = inputTip.value;
    let pozicija = inputPozicija.value;
    let vreme = inputVreme.value;
    let kolicina = inputKolicina.value;
    let result;

    const { lat, lng } = this.mapEvent.latlng;

    if (!pozicija || !vreme || !kolicina)
      return alert('Molimo Vas da popunite sva polja!');

    result = new Result([lat, lng], tip, pozicija, vreme, kolicina);

    this.results.push(result);

    this.renderMarker(result);

    this.renderResult(result);

    this.setLocalStorage(result);
  }

  renderMarker(result) {
    L.marker(result.coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${result.tip}-popup`,
        })
      )
      .setPopupContent(`${result.tip}`)
      .openPopup();
  }

  renderResult(result) {
    const html = `
    <div class="results results_${result.tip}">
     <ul class="resultsUl">
       <li class="result" data-id="${result.id}">
         <h3 class="result__title">${result.tip},  ${result.fullDate}</h3>
         <div class="result__details">
           <span class="result__icon">🚩</span>
           <span class="result__value">${result.pozicija}</span>
           <span class="result__unit"></span>
         </div>
         <div class="result__details">
           <span class="result__icon">⏱</span>
           <span class="result__value">${result.vreme}</span>
           <span class="result__unit">h</span>
         </div>
         <div class="result__details">
           <span class="result__icon">🎣</span>
           <span class="result__value">${result.kolicina}</span>
           <span class="result__unit">kg</span>
         </div>
         <div class="result__details">
           <span class="result__icon">⚡️</span>
           <span class="result__value">${result.prosek.toFixed(2)}</span>
           <span class="result__unit">kg/h</span>
         </div>
         <div class="result__details">
         <span class="result__icon">Vremenski uslovi:</span>
         <span class="result__value">${result.vremenskiUslovi}</span>
         <span class="result__unit"></span>
       </div>
       </li> 
     </ul>
   </div> 
   `;

    res.insertAdjacentHTML('afterbegin', html);
    form.reset();
  }

  expand() {
    main.style.transition = 'all 2s';
    main.classList.toggle('main-extend');
  }

  moveToMarker(e) {
    const el = e.target.closest('.result');

    const result = this.results.find(res => res.id == el.dataset.id);

    this.map.setView(result.coords, 9, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  setLocalStorage() {
    localStorage.setItem('results', JSON.stringify(this.results));
  }

  getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('results'));

    if (!data) return;

    this.results = data;

    this.results.forEach(res => {
      this.renderResult(res);
    });
  }

  deleteAll() {
    localStorage.removeItem('results');
    location.reload();
  }
}

const app = new App();

/*
Starter code (before classes)

const vremenskiUslovi = function () {
  const check1 = document.getElementById('myCheckbox1');
  const check2 = document.getElementById('myCheckbox2');
  const check3 = document.getElementById('myCheckbox3');
  const check4 = document.getElementById('myCheckbox4');
  const check5 = document.getElementById('myCheckbox5');
  const check6 = document.getElementById('myCheckbox6');

  if (
    check1.checked == false &&
    check2.checked == false &&
    check3.checked == false &&
    check4.checked == false &&
    check5.checked == false &&
    check6.checked == false
  ) {
    return `nisu uneti!`;
  }

  if (check1.checked == true) {
    return `<img src="img/weather/sun.png" alt="" class="sun" width="30px" />`;
  }
  if (check2.checked == true) {
    return `<img src="img/weather/sun_cloud.png" alt="" width="30px" />`;
  }
  if (check3.checked == true) {
    return `<img src="img/weather/cloud.png" alt="" width="30px" />`;
  }
  if (check4.checked == true) {
    return `<img src="img/weather/rain.png" alt="" width="30px" />`;
  }
  if (check5.checked == true) {
    return `<img src="img/weather/snow.png" alt="" width="30px" />`;
  }
  if (check6.checked == true) {
    return `<img src="img/weather/wind.png" alt="" width="30px" />`;
  }
};

// prettier-ignore
const months = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
const date = new Date();
const day = date.getDate();
const month = months[date.getMonth()];
const year = date.getFullYear();
const fullDate = `${day}. ${month} ${year}.`;

let map, mapEvent;

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(latitude, longitude);
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      const coords = [latitude, longitude];

      map = L.map('map').setView(coords, 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.on('click', function (mapE) {
        mapEvent = mapE;
        inputTip.focus();

        // const { lat, lng } = mapEvent.latlng;

        // L.marker([lat, lng])
        //   .addTo(map)
        //   .bindPopup(
        //     L.popup({
        //       maxWidth: 250,
        //       minWidth: 100,
        //       autoClose: false,
        //       closeOnClick: false,
        //       className: `${tip}-popup`,
        //     })
        //   )
        //   .setPopupContent(`${tip}`)
        //   .openPopup();
        // console.log(`${tip}-popup`);
      });
    },
    function () {
      alert('Could not get your position!');
    }
  );

icon.addEventListener('click', function () {
  main.style.transition = 'all 2s';
  main.classList.toggle('main-extend');
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  let tip = inputTip.value;
  let pozicija = inputPozicija.value;
  let vreme = inputVreme.value;
  let kolicina = inputKolicina.value;
  let prosek = kolicina / vreme;
  let id = Math.ceil(Math.random() * 100000);

  const { lat, lng } = mapEvent.latlng;

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${tip}-popup`,
      })
    )
    .setPopupContent(`${tip}`)
    .openPopup();

  const html = `
   <div class="results results_${tip}">
    <ul class="resultsUl">
      <li data-id="${id}">
        <h3 class="result__title">${
          tip.slice(0, 1).toUpperCase() + tip.slice(1)
        },  ${fullDate}</h3>
        <div class="result__details">
          <span class="result__icon">🚩</span>
          <span class="result__value">${pozicija}</span>
          <span class="result__unit"></span>
        </div>
        <div class="result__details">
          <span class="result__icon">⏱</span>
          <span class="result__value">${vreme}</span>
          <span class="result__unit">h</span>
        </div>
        <div class="result__details">
          <span class="result__icon">🎣</span>
          <span class="result__value">${kolicina}</span>
          <span class="result__unit">kg</span>
        </div>
        <div class="result__details">
          <span class="result__icon">⚡️</span>
          <span class="result__value">${prosek.toFixed(2)}</span>
          <span class="result__unit">kg/h</span>
        </div>
        <div class="result__details">
        <span class="result__icon">Vremenski uslovi:</span>
        <span class="result__value">${vremenskiUslovi()}</span>
        <span class="result__unit"></span>
      </div>
      </li> 
    </ul>
  </div> 
  `;

  res.insertAdjacentHTML('afterbegin', html);

  form.reset();
  inputTip.focus();
});
*/
