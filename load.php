<?php

// include transform.php
include_once 'transform.php';

// require once config.php
require_once 'config.php';

// echo $weather_data;

try {
    // Erstellt eine neue PDO-Instanz mit der Konfiguration aus config.php
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Query mit Platzhaltern für das Einfügen von Daten
    $sql = "INSERT INTO weather (city, temperature, precipitation, cloud_cover, weather_condition) VALUES (?, ?, ?, ?, ?)";

    // Bereitet die SQL-Anweisung vor
    $stmt = $pdo->prepare($sql);

    $insertedLocations = [];

    // Fügt jedes Element im Array in die Datenbank ein
    foreach ($weather_data as $item) {
        if (!in_array($item['location'], $insertedLocations)) {
        $stmt->execute([
            $item['location'],
            $item['temperature_2m'],
            $item['precipitation'],
            $item['cloud_cover'],
            $item['weather_code']
        ]);

        echo $item['location'] . " Daten erfolgreich eingefügt.<br>";

            // Fügt den Standort zur Liste der eingefügten Standorte hinzu
            $insertedLocations[] = $item['location'];
        }
    }

    echo "Daten erfolgreich eingefügt.";

} catch (PDOException $e) {
    die("Verbindung zur Datenbank konnte nicht hergestellt werden: " . $e->getMessage());
}