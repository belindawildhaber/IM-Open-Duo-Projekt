<?php

echo "Hallo tut daaaas?";

$url = "https://api.open-meteo.com/v1/forecast?latitude=46.8499,46.9481&longitude=9.5329,7.4474&current=temperature_2m,precipitation,cloud_cover&timezone=Europe%2FBerlin&forecast_days=1";

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$output = curl_exec($ch);

curl_close($ch);

echo $output;

echo "<br>";
echo "<br>";

// speichere hier alle Daten in Variablen
$data = json_decode($output, true);
// $latitude = $data[0]['latitude'];
// $longitude = $data[0]['longitude'];

// $temperature = $data[0]['current']['temperature_2m'];
// $precipitation = $data[0]['current']['precipitation'];
// $cloud_cover = $data[0]['current']['cloud_cover'];

// echo "Temperature: $temperature, Precipitation: $precipitation, Cloud Cover: $cloud_cover" . "<br>";

// echo "Latitude: $latitude, Longitude: $longitude";

// make new array wirh all data
$weather_data = [];
foreach ($data as $item) {
    $latitude = $item['latitude'];
    $longitude = $item['longitude'];
    $temperature = $item['current']['temperature_2m'];
    $precipitation = $item['current']['precipitation'];
    $cloud_cover = $item['current']['cloud_cover'];

    $weather_data[] = [
        'latitude' => $latitude,
        'longitude' => $longitude,
        'temperature' => $temperature,
        'precipitation' => $precipitation,
        'cloud_cover' => $cloud_cover
    ];
}

print_r($weather_data);
