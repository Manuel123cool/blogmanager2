<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "comments";

function conn() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "comments";

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

function createTable($index1, $index2) {
    $sql = "CREATE TABLE IF NOT EXISTS ${index1}comment$index2 (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30),
        comment VARCHAR(1000),
        date VARCHAR(30),
        replyIndex1 INT(30),
        replyIndex2 INT(30)
    )";

    if (conn()->query($sql) === TRUE) {
      echo "Table MyGuests created successfully";
    } else {
      echo "Error creating table: " . conn()->error;
    }

    conn()->close();
}

function insertData($name, $comment, $date, 
        $replyIndex1, $replyIndex2, $siteIndex1, $siteIndex2) {
    createTable($siteIndex1, $siteIndex2);
    $sql = "INSERT INTO ${siteIndex1}comment$siteIndex2
         (comment, name, date, replyIndex1, replyIndex2)
                 VALUES (?, ?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssii", $comment, $name, $date, $replyIndex1, $replyIndex2);
    $stmt->execute();
}

function getData() {

}

if (isset($_POST['name'], $_POST['comment'], $_POST['date'], 
            $_POST['siteIndex1'], $_POST['siteIndex2'], $_POST["replyIndex"],
                $_POST["replyIndex2"])) {

    insertdata($_POST['name'], $_POST['comment'], $_POST['date'], 
            $_POST['replyIndex'], $_POST['replyIndex2'], $_POST["siteIndex1"],
                $_POST["siteIndex2"]);    
    echo "data arrived";
}

if (isset($_GET["getData"], $_GET["siteIndex1"], $_GET["siteIndex2"])) {
    echo "Hallo";
}
