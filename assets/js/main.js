const api = {
  key: 'd7820c6c89e2fb258582e4021bf8a50e',
  base: 'https://api.openweathermap.org/data/2.5/',
  lang: 'pt_br',
  units: 'metric'
}

const city = document.querySelector('.city')
const date = document.querySelector('.date')
const containerImg = document.querySelector('.container-img')
const containerTemp = document.querySelector('.container-temp')
const tempNumber = document.querySelector('.container-temp div')
const tempUnit = document.querySelector('.container-temp span')
const weatherT = document.querySelector('.weather')
const searchInput = document.querySelector('.form-control')
const searchButton = document.querySelector('.btn')
const lowHigh = document.querySelector('.low-high')

window.addEventListener('load', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
  }
  else {
    alert('Navegador não suporta geolocalização')
  }
  function setPosition(position) {
    console.log(position)
    let lat = position.coords.latitude
    let long = position.coords.longitude
    coordResults(lat, long)
  }
  function showError(error) {
    alert(`erro: ${error.message}`)
  }
})

function coordResults(lat, long) {
  fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`http error: status ${response.status}`)
    }
    return response.json()
  })
  .catch(error => {
    alert(error.message)
  })
  .then(response => {
    displayResults(response)
  })
}


searchButton.addEventListener('click', () => {
  searchResults(searchInput.value)
})

searchInput.addEventListener('keypress', enter)
function enter(event) {
  key = event.keyCode
  if (key === 13) {
    searchResults(searchInput.value)
  }
}

function searchResults(city) {
  fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&appid=${api.key}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`http error: status ${response.status}`)
    }
    return response.json()
  })
  .catch(error => {
    alert(error.message)
  })
  .then(response => {
    displayResults(response)
  })
}

function displayResults(weather) {
  console.log(weather)

  city.innerText = `${weather.name}, ${weather.sys.country}`

  let now = new Date()
  date.innerText = dateBuilder(now)

  let iconName = weather.weather[0].icon
  containerImg.innerHTML = `  <img src="./assets/img/${iconName}.png">`

  let temperature = `${Math.round(weather.main.temp)}`
  tempNumber.innerHTML = temperature
  tempUnit.innerHTML = `°c`

  weatherT.innerHTML = weather.weather[0].description

  lowHigh.innerHTML = `${Math.round(weather.main.temp_min)} °c / ${Math.round(weather.main.temp_max)}°c`
}

function dateBuilder(d) {
  let days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
  let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julio", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

  let day = days[d.getDay()] //getDay: 0-6
  let date = d.getDate()
  let month = months[d.getMonth()]
  let year = d.getFullYear()

  return `${day}, ${date} ${month} ${year}`;
}

containerTemp.addEventListener('click', changeTemp)
function changeTemp() {
  temp_number_now = tempNumber.innerHTML

  if (tempUnit.innerHTML === '°c') {
    let f = (temp_number_now * 1.8) + 32
    tempUnit.innerHTML = '°f'
    tempNumber.innerHTML = Math.round(f)
  }
  else {
    let c = (temp_number_now - 32) / 1.8
    tempUnit.innerHTML = '°c'
    tempNumber.innerHTML = Math.round(c)
  }
}