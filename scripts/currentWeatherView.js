const result = fetchWeatherData().then( data => {
    console.log(data);}
);


async function fetchWeatherData(){
    try{
        const response = await fetch('https://332474-3.web.fhgr.ch/endpointGetCurrentWeather.php');
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}