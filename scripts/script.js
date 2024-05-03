async function fetchData() {
    try{
        const response = await fetch('https://332474-3.web.fhgr.ch/endpointgetweather.php');
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}

async function main(){
    const data = await fetchData();
    
    const date = data.dates;
    const temp_chur = data.Chur.temperature;
    const ns_chur = data.Chur.precipitation;

    console.log(date);
    console.log(temp_chur);
    console.log(ns_chur);

    const minTemp = Math.min(...temp_chur);
    const maxTemp = Math.max(...temp_chur);

    // Adjust the lowest and highest temperature values
    const adjustedMinTemp = minTemp - 3;
    const adjustedMaxTemp = maxTemp + 10;

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Temperatur Chur',
                data: temp_chur,
                borderColor: 'rgba(251,204,47)',
                borderWidth: 1,
                fill: false,
                yAxisID: 'temperature'
            },
            {
                label: 'Niederschlag Chur',
                data: ns_chur,
                borderColor: 'rgba(158,177,228)',
                borderWidth: 1,
                fill: false,
                yAxisID: 'precipitation'
            }]
        },
        options: {
            scales: {
                temperature: {
                    position: 'left',
                    beginAtZero: false,
                    min: Math.floor(adjustedMinTemp), // Round down the lowest value
                    max: Math.ceil(adjustedMaxTemp), // Round up the highest value
                    stepSize: 1, // Show only full rounded degrees
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperature (°C)'
                    }
                },
                precipitation: {
                    position: 'right',
                    beginAtZero: true,
                    suggestedMax: 14, // Set max value to 14mm
                    scaleLabel: {
                        display: true,
                        labelString: 'Niederschlag (mm)'
                    }
                }
            }
        }
    });
    
}

main();