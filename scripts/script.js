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

async function main(){
    console.log(getCityFromUrl())
    const data = await fetchData();
    const date = data.dates;
    const temp_chur = data.Chur.temperature;
    const ns_chur = data.Chur.precipitation;

    console.log(date);
    console.log(temp_chur);
    console.log(ns_chur);

/*     const minTemp = Math.min(...temp_chur); */
    const maxTemp = Math.max(...temp_chur);
    const maxNs = Math.max(...ns_chur);

    // Adjust the lowest and highest temperature values
/*     const adjustedMinTemp = minTemp - 3; */
    const adjustedMaxTemp = Math.floor(maxTemp + 2);
    const adjustedMaxNS = Math.floor(maxNs + 2);

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Temperatur Chur',
                data: temp_chur,
                borderColor: 'rgba(251,204,47)',
                yAxisID: 'y'
            },
            {
                label: 'Niederschlag Chur',
                data: ns_chur,
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

main();