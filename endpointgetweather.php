<?php

require_once 'config.php';

try {

    $dates = [];
    $bern = [];
    $zurich = [];
    $chur = [];


    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $query = "SELECT temperature, created, city, precipitation FROM weather";
    $statement = $pdo->prepare($query);
    $statement->execute();
    
    while ($row = $statement->fetch(PDO::FETCH_ASSOC)){
        $temperature = (float)$row['temperature'];
        $created = $row['created'];
        $city = $row['city'];
        $precipitation = (float)$row['precipitation'];
        
        if (!in_array($created, $dates)) {
            $dates[] = $created;
        }

        if ($city == 'Bern') {
            $bern['temperature'][] = $temperature;
            $bern['precipitation'][] = $precipitation;
        } elseif ($city == 'Zürich') {
            $zurich['temperature'][] = $temperature;
            $zurich['precipitation'][] = $precipitation;
        } elseif ($city == 'Chur') {
            $chur['temperature'][] = $temperature;
            $chur['precipitation'][] = $precipitation;
        }

    }



    $data = [
        'dates' => $dates,
        'Bern' => $bern,
        'Zurich' => $zurich,
        'Chur' => $chur
    ];

    header('Content-Type: application/json');
    echo json_encode($data);

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}




?>