fetchWeatherData().then( data => {
    const cityChur = getObjectByCity(data, "Chur")
    const cityBern = getObjectByCity(data, "Bern")
    const cityZuerich = getObjectByCity(data, "Zürich")

    document.getElementById('temperatureChur').textContent = cityChur.temperature + "C°";
    document.getElementById('iconChur').src = getIconSrc(cityChur);
    document.getElementById('temperatureBern').textContent = cityBern.temperature + "C°";
    document.getElementById('iconBern').src = getIconSrc(cityBern);
    document.getElementById('temperatureZuerich').textContent = cityZuerich.temperature + "C°";
    document.getElementById('iconZuerich').src = getIconSrc(cityZuerich);
}
    
);

function getIconSrc(obj){
    switch(obj.weather_condition){
        case "sonnig":
            return "links/wmo_1.png";
        case "leicht-bewoelkt":
            return "links/wmo_2.png";
        case "wolken&sonne":
            return "links/wmo_3.png";
        case "stark-bewoelkt":
            return "links/wmo_4.png";
        case "regen":
            return "links/wmo_5.png";
        case "starker-regen":
            return "links/wmo_6.png";
        case "schneefall":
            return "links/wmo_7.png";
        default:
            return "";
    }
}

function getObjectByCity(data, city){
    return data.find(obj => obj.city === city);
}

async function fetchWeatherData(){
    try{
        const response = await fetch('https://332474-3.web.fhgr.ch/endpointGetCurrentWeather.php');
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}