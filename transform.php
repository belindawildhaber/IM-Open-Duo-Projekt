<?php

// include extract.php
include 'extract.php';

// echo "Hello Transform!";

// print_r($weather_data);

// make map with lat / lon to location
$locations = [
    '46.84,9.52' => 'Chur',
    '46.94,7.44' => 'Bern'
];

// new function weather_condition
function weather_condition($precipitation, $cloud_cover) {
    if ($cloud_cover <= 80 && $precipitation == 0) {
        return 'sunny';
    } elseif ($cloud_cover > 80 && $precipitation < 5) {
        return 'cloudy';
    } elseif ($precipitation >= 5) {
        return 'rainy';
    }
}

// transfprm data
foreach ($weather_data as $index => $item) {

    // round temperature to integer
    $weather_data[$index]['temperature_2m'] = round($item['temperature_2m'] * 2) / 2;

    // convert lat / lon to location
    $coordinates = $item['latitude'] . ',' . $item['longitude'];

    // use map to get location
    $weather_data[$index]['location'] = $locations[$coordinates];

    // remove lat / lon
    unset($weather_data[$index]['latitude']);
    unset($weather_data[$index]['longitude']);

    // add weather condition
    $weather_data[$index]['condition'] = weather_condition($item['precipitation'], $item['cloud_cover']);


}

print_r($weather_data);

?>