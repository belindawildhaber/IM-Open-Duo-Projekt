async function main(){
    let city = getCityFromUrl();
    setTextToCurrentyCity(city);
    
    const data = await fetchData();
    const date = data.dates;

    let obj;

    if(city == 'Chur'){
        obj = data.Chur;
    }else if(city == 'Bern'){
        obj = data.Bern;
    }else if(city == 'Züri'){
        obj = data.Zurich;        
    }
   
    configChart(obj.temperature, obj.precipitation, city, date.sort()); 
}

function configChart(temp, ns, city, date){
    const maxTemp = Math.max(...temp);
    const maxNs = Math.max(...ns);
    const adjustedMaxTemp = Math.floor(maxTemp + 2);
    const adjustedMaxNS = Math.floor(maxNs + 2);

    const ctx = document.getElementById('temperatureChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Temperatur ' + city,
                data: temp,
                borderColor: 'rgba(251,204,47)',
                yAxisID: 'y'
            },
            {
                label: 'Niederschlag ' + city,
                data: ns,
                borderColor: 'rgba(158,177,228)',
                yAxisID: 'y1'
            }]
        },
        
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm'
                        }
                    },
                    ticks: {
                        source: 'labels',
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    type: 'linear', // Specify linear scale for primary y-axis
                    beginAtZero: true,
                    position: 'left', // Align with left side of chart
                    title: {
                        display: true,
                        text: "Temperatur",
                        color: 'rgba(251,204,47)'
                    },
                    ticks: {
                        stepSize: 1, // Show only full rounded degrees
                    },
                    max: adjustedMaxTemp
                },
                y1: {
                    type: 'linear', // Specify linear scale for secondary y-axis
                    beginAtZero: true,
                    position: 'right', // Align with right side of chart
                    title: {
                        display: true,
                        text: "Niederschlag",
                        color: 'rgba(158,177,228)'
                    },
                    ticks: {
                        stepSize: 1,
                    },
                    grid: {
                        drawOnChartArea: false, // Don't draw gridlines on the chart area
                    },
                    max: adjustedMaxNS
                }
            }
        }
        
    });
}

function getCityFromUrl(){
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('city');
}   

async function fetchData() {
    try{
        const response = await fetch('https://332474-3.web.fhgr.ch/endpointgetweather.php?hourly');
        return await response.json();
       } catch(error) {
        console.log(error);
    }
}

function setTextToCurrentyCity(city){
    document.getElementById('cityTitel').textContent = city.toUpperCase();
    document.getElementById('cityText').textContent = "Das isch de Temperatur- und Niederschlagsverlauf fu " + city + "."
}

main();