<?php

// include extract.php
include 'extract.php';

// echo "Hello Transform!";

// print_r($weather_data);

// make map with lat / lon to location
$locations = [
    '46.84,9.52' => 'Chur',
    '46.94,7.44' => 'Bern',
    '47.36,8.559999' => 'Zürich'
];

$wmoCodes = [
    '0' => 'sonnig',
    '1' => 'leicht-bewoelkt',
    '2' => 'wolken&sonne',
    '3' => 'stark-bewoelkt',
    '51' => 'regen',
    '53' => 'regen',
    '55' => 'regen', 
    '61' => 'regen',
    '63' => 'regen',
    '65' => 'regen', 
    '71' => 'schneefall',
    '73' => 'schneefall',
    '75' => 'schneefall',
    '77' => 'schneefall', 
    '80' => 'starker-regen',
    '81' => 'starker-regen',
    '82' => 'starker-regen',
    '85' => 'schneefall',
    '86' => 'schneefall'
];

// new function weather_condition      ------- brauchen wir eigentlich nicht mehr, da wir die WMO-Codes haben
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

    $wmo = $item['weather_code'];
    $weather_data[$index]['weather_code'] = $wmoCodes[$wmo];

    // remove lat / lon
    unset($weather_data[$index]['latitude']);
    unset($weather_data[$index]['longitude']);

    // add weather condition
    $weather_data[$index]['condition'] = weather_condition($item['precipitation'], $item['cloud_cover']);


}

print_r($weather_data);

?>