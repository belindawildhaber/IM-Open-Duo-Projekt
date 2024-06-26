<?php

require_once 'config.php';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT * FROM weather /*where created >= NOW() - INTERVAL 24 HOUR*/ ORDER BY created DESC;";
    
    $statement = $pdo->prepare($query);
    $statement->execute();
    $data = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode($data);

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>