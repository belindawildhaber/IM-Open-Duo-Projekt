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
    const ns_chur = data.Chur.precipitation.map(i => i+3);

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
            },
            {
                label: 'Niederschlag Chur',
                data: ns_chur,
                borderColor: 'rgba(158,177,228)'
            }]
        },
        
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormat: {
                            day: 'DD.MM HH:M'
                        }
                    },
                    tick: {
                        source: 'labels'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Temperatur"
                    }
                }
            }
        }
    }); 
    
}

main();