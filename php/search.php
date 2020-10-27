<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "searches";

function conn() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "searches";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}
$conn = new mysqli($servername, $username, $password);

$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
  //echo "Database created successfully";
} else {
  echo "Error creating database: " . $conn->error;
}
$conn->close();

function createTable() {
    $sql = "CREATE TABLE IF NOT EXISTS search (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        search VARCHAR(100),
        index1 VARCHAR(100),
        index2 VARCHAR(100),
        num VARCHAR(1000)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
      echo "Error creating table: " . conn()->error;
    }

    conn()->close();
}
createTable();

function insertData($seach, $index1, $index2, $num) {
    $sql = "INSERT INTO search (search, index1, index2, num)
                 VALUES (?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $seach, $index1, $index2, $num);
    $stmt->execute();
}

if (isset( $_POST["search"],$_POST["index1"],$_POST["index2"],
        $_POST["num"])) {

   insertData($_POST["search"],$_POST["index1"],$_POST["index2"],
        $_POST["num"]);
   echo "Data arrived";
}
   









