let resultArray = [];
let city = ""
let chartTemperature;

async function main() {
    city = new URLSearchParams(window.location.search).get('city');
    document.getElementById('cityTitel').textContent = city.toUpperCase();
    document.getElementById('cityText').textContent = "Das isch de Temperatur- und Niederschlagsverlauf fu " + city + "."
    city = (city === "Züri") ? "Zürich" : city;

    const data = await fetchData();
    resultArray = data.filter(obj => obj.city === city);

    const formattedData = groupByHours(resultArray, 'day');
    configChart(formattedData.temp, formattedData.ns, city, formattedData.date);
}

function updateChart(resultArray, timeSet, city){
    const formattedData = groupByHours(resultArray, timeSet);
    chartTemperature.data.labels = formattedData.date;
    chartTemperature.data.datasets[0].data = formattedData.temp;
    chartTemperature.data.datasets[1].data = formattedData.ns;
    chartTemperature.options.scales.y.max = Math.floor(Math.max(...formattedData.temp) + 2);
    chartTemperature.options.scales.y1.max = Math.floor(Math.max(...formattedData.ns) + 2);
    chartTemperature.update();
}

const timeButtons = document.querySelectorAll('.timeBtn');
timeButtons.forEach(button => {
    if (button.value =="day"){
        button.classList.remove("timeBtn");
        button.classList.add("timeBtnActiv");
    }
    button.addEventListener('click', async function () {
        chartButtons()
        button.classList.remove("timeBtn");
        button.classList.add("timeBtnActiv");
        updateChart(resultArray, this.value, city)
    });
});

function chartButtons(){
    timeButtons.forEach(button => {
        button.classList.remove("timeBtnActiv");
        button.classList.add("timeBtn");
    })
}

async function fetchData() {
    try {
        const response = await fetch('https://332474-3.web.fhgr.ch/endpointGet24HourWeather.php');
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

function configChart(temp, ns, city, date) {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    const maxTemp = Math.max(...temp);
    const maxNs = Math.max(...ns);
    const adjustedMaxTemp = Math.floor(maxTemp + 2);
    const adjustedMaxNS = Math.floor(maxNs + 2);
  
    chartTemperature = new Chart(ctx, {
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
                            hour: 'DD.MM.YYYY, HH:mm'
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

function groupByHours(weatherData, timeSet) {
    const now = new Date();
    const timeRanges = {
        'day': 24 * 60 * 60 * 1000,
        'week': 7 * 24 * 60 * 60 * 1000,
        'month': 30 * 24 * 60 * 60 * 1000,
        'year': 365 * 24 * 60 * 60 * 1000
    };

    const groupedData = {};

    weatherData.forEach(data => {
        const date = new Date(data.created);
        if (now - date <= timeRanges[timeSet] || timeSet === 'all') {
            const hour = date.getHours();
            if (!groupedData[hour]) {
                groupedData[hour] = [];
            }
            groupedData[hour].push(data);
        }
    });

    let result = [];

    for (const hour in groupedData) {
        result.push(...groupedData[hour]);
    }

    let returnObj = {temp: [], ns: [], date: []};
    result.sort((a, b) => new Date(a.created) - new Date(b.created));

    console.log(result);
    result = calculateAverages(result)
    result.forEach(element => { returnObj.temp.push(element.temperature); });
    result.forEach(element => { returnObj.date.push(element.created); });
    result.forEach(element => { returnObj.ns.push(element.precipitation); });
    return returnObj;
}

function calculateAverages(data) {
    const averages = {};

    data.forEach(entry => {
        const timestamp = new Date(entry.created);
        const hour = timestamp.getUTCHours();
        const key = new Date(timestamp.setUTCHours(hour, 0, 0, 0)).toISOString();

        if (!averages[key]) {
            averages[key] = { sumTemperature: 0, sumPrecipitation: 0, count: 0 };
        }

        averages[key].sumTemperature += parseFloat(entry.temperature);
        averages[key].sumPrecipitation += parseFloat(entry.precipitation);
        averages[key].count++;
    });

    for (const key in averages) {
        const averageTemperature = averages[key].sumTemperature / averages[key].count;
        const averagePrecipitation = averages[key].sumPrecipitation / averages[key].count;
        averages[key] = { created: key, temperature: averageTemperature, precipitation: averagePrecipitation };
    }

    return Object.values(averages);
}
main()