const API_KEY = e63937237298849235ab5f63a0eb5974;
const AUT_KEY = p6N4RrFW2nQdsr4ev2xpw3RT2DGjPtympmx5Pnswcy2uoBr8zYrrx96l;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

const dataAtual = new Date();
let hora;

if (dataAtual.getMinutes() < 10){
    hora = dataAtual.getHours() + ':0' + dataAtual.getMinutes();
} else {
    hora = dataAtual.getHours() + ':' + dataAtual.getMinutes();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocation is not supported by this browser.");
        pesquisarCidade('São Paulo');
    }
}

function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    getCityName(lat, lon);
}

function getCityName(lat, lon) {
    let url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let data = JSON.parse(xmlHttp.responseText);
            let cityName = data.address.city || data.address.town || data.address.village || data.address.hamlet;
            pesquisarCidade(cityName, lat, lon);
        }
    };
    xmlHttp.send();
}

function showError(error) {
    console.log(error.message);
    pesquisarCidade('São Paulo');
}

let d_cidade = document.getElementById('cidade');
let d_input_cidade = document.getElementById('cidade_input');
let d_tempAtual = document.getElementById('tempAtual');
let d_condicao = document.getElementById('condicao');
let d_hora = document.getElementById('hora');
let d_vento = document.getElementById('vento');
let d_umidade = document.getElementById('umidade');
let d_maxima = document.getElementById('maxima');
let d_minima = document.getElementById('minima');
let condicaoAtual;
let img_condicao = document.getElementById('img_condicao')

d_input_cidade.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        pesquisarCidade();
    }
});

window.onload = function() {
    getLocation();
};

function pesquisarCidade(cityName, lat, lon) {
    let url;
    if (lat && lon) {
        url = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    } else {
        cityName = d_input_cidade.value; // Pegar valor do input
        url = `${BASE_URL}weather?q=${cityName}&appid=${API_KEY}`;
    }

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let dadosJSONObj = JSON.parse(xmlHttp.responseText);
            let cidade_final = dadosJSONObj.name;
            let lat = dadosJSONObj.coord.lat;
            let lon = dadosJSONObj.coord.lon;
            getTempByCity(cidade_final, lat, lon);
        }
    };
    xmlHttp.send();
    d_input_cidade.value = "";
}

function getTempByCity(cidade_final, lat, lon) {
    let url = `${BASE_URL}onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`;

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', url);
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
            let dadosJSONObj = JSON.parse(xmlHttp.responseText);
            let condicaoAtual = dadosJSONObj.current.weather[0].description;
            let condicaoMain = dadosJSONObj.current.weather[0].main;
            let temperatura = parseInt(dadosJSONObj.current.temp) + "&deg; C";
            let temperatura_max = parseInt(dadosJSONObj.daily[0].temp.max) + "&deg; C";
            let temperatura_min = parseInt(dadosJSONObj.daily[0].temp.min) + "&deg; C";
            d_cidade.textContent = cidade_final;
            d_tempAtual.innerHTML = temperatura;
            d_minima.innerHTML = temperatura_min;
            d_maxima.innerHTML = temperatura_max;
            d_condicao.textContent = condicaoAtual; // Define a condição atual da cidade pesquisada
            d_hora.textContent = hora;
            d_vento.textContent = dadosJSONObj.current.wind_speed + ' m/s';
            d_umidade.textContent = dadosJSONObj.current.humidity + '%';

            getRandomImage(condicaoMain); // Passa a condição atual para obter a imagem correspondente
        }
    };
    xmlHttp.send();
}

function getRandomImage(condicaoAtual) {
    let condicaoURL = condicaoAtual.replace(/\s/g, "%20");
    coletarImgCondicao(condicaoAtual)

    let url = `https://api.pexels.com/v1/search?page=1&size=20&query=sky%20${condicaoURL}`;
    console.log(url)

    let Httpxml = new XMLHttpRequest();
    Httpxml.open('GET', url);
    Httpxml.setRequestHeader('Authorization', AUT_KEY);
    Httpxml.onreadystatechange = () => {
        if (Httpxml.readyState === 4) {
            if (Httpxml.status === 200) {
                let dadosJSONText1 = Httpxml.responseText;
                let dadosJSON = JSON.parse(dadosJSONText1);
                let randomNumber = Math.floor(Math.random() * 14);
                let bgimg = dadosJSON.photos[randomNumber].src.original;
                document.body.style.backgroundImage = `url('${bgimg}')`;
            }
        }
    };
    Httpxml.send();
}


function coletarImgCondicao(condicaoMain) {
    let icon
    switch(condicaoMain) {
        case  "Clear":
            icon = '01'
            break
        case  "Clouds":
            icon = '02'
            break
        case  "Drizzle":
            icon = '09'
            break
        case  "Rain":
            icon = '10'
            break
        case  "Thunderstorm":
            icon = '11'
            break
        case  "Snow":
            icon = '13'
            break
        case  "Atmosphere":
            icon = '50'
            break


    }
    
    img_condicao.src = `https://openweathermap.org/img/wn/${icon}d@2x.png`
}














