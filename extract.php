<?php
/* 
echo "Hallo tut daaaas?"; */

$url = "https://api.open-meteo.com/v1/forecast?latitude=46.9481,46.8499,47.3667&longitude=7.4474,9.5329,8.55&current=temperature_2m,precipitation,weather_code,cloud_cover&timezone=Europe%2FBerlin";

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//Total precipitation (rain, showers, snow) sum of the preceding hour

$output = curl_exec($ch);

curl_close($ch);

// speichere hier alle Daten in Variablen
$data = json_decode($output, true);

// make new array wirh needed information
$weather_data = [];
foreach ($data as $item) {
    $latitude = $item['latitude'];
    $longitude = $item['longitude'];
    $temperature = $item['current']['temperature_2m'];
    $precipitation = $item['current']['precipitation'];
    $cloud_cover = $item['current']['cloud_cover'];
    $weather_code = $item['current']['weather_code'];

    $weather_data[] = [
        'latitude' => $latitude,
        'longitude' => $longitude,
        'temperature_2m' => $temperature,
        'precipitation' => $precipitation,
        'cloud_cover' => $cloud_cover,
        'weather_code' => $weather_code
    ];
}

// print_r($weather_data);
// echo $weather_data[0]['latitude'];

?>





