<?php

require_once 'config.php';

try {
    $dates = [];
    $bern = [];
    $zurich = [];
    $chur = [];

    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if hourly parameter is set
    if(isset($_GET['hourly']) && $_GET['hourly'] == 'true') {
        $query = "SELECT HOUR(created) as hour, AVG(temperature) as avg_temperature, AVG(precipitation) as avg_precipitation, city FROM weather GROUP BY HOUR(created), city";
    } else {
        $query = "SELECT * FROM weather";
    }

    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    $datecount = 0;
    $tempcount = 0;

    foreach($data as $row){
        $hour = $row['hour'];
        $temperature = (float)$row['avg_temperature'];
        $city = $row['city'];
        $precipitation = (float)$row['avg_precipitation'];

        $formattedDate = date('Y-m-d H:00:00', strtotime("today +{$hour} hours"));
        
        if (!in_array($formattedDate, $dates)) {
            $dates[] = $formattedDate;
            $datecount++;
        }

        if ($city == 'Bern') {
            $bern['temperature'][] = $temperature;
            $bern['precipitation'][] = $precipitation;
            $tempcount++;
        } elseif ($city == 'Zürich') {
            $zurich['temperature'][] = $temperature;
            $zurich['precipitation'][] = $precipitation;
            $tempcount++;
        } elseif ($city == 'Chur') {
            $chur['temperature'][] = $temperature;
            $chur['precipitation'][] = $precipitation;
            $tempcount++;
        }
    }

    $data = [
        'dates' => $dates,
        'Bern' => $bern,
        'Zurich' => $zurich,
        'Chur' => $chur,
        'datecount' => $datecount,
        'tempcount' => $tempcount/3
    ];

    header('Content-Type: application/json');
    echo json_encode($data);

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

?>
