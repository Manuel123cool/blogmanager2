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

function createTable($index) {
    $sql = "CREATE TABLE IF NOT EXISTS comment$index (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30),
        comment VARCHAR(1000),
        date VARCHAR(30),
        replyIndex VARCHAR(1000)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
      echo "Error creating table: " . conn()->error;
    }

    conn()->close();
}

function insertData($name, $comment, $date, $replyIndex, $siteIndex1, $siteIndex2) {
    createTable($siteIndex1, $siteIndex2);
    $sql = "INSERT INTO ${siteIndex1}comment$siteIndex2
         (comment, name, date, replyIndex)
                 VALUES (?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $comment, $name, $date, $serializedData);
    $serializedData = serialize($replyIndex);
    $stmt->execute();
}

function getData($siteIndex1, $siteIndex2) {
    $array = Array();
    $sql = "SELECT comment, name, date, replyIndex 
                FROM ${siteIndex1}comment$siteIndex2";
    $result = conn()->query($sql);

    $returnEmpty = false;
    if ($result->num_rows > 0) {
        $count = 0;
        while($row = $result->fetch_assoc()) {
            $array[$count] = Array();
            $array[$count][0] = $row["comment"]; 
            $array[$count][1] = $row["name"]; 
            $array[$count][2] = $row["date"]; 
            $array[$count][3] = unserialize($row["replyIndex"]); 
            $count++;
        }
    } else {
        echo json_encode($array);
        $returnEmpty = true;
    }

    if (!$returnEmpty) {
        echo json_encode($array);
    }
}

if (isset($_POST['name'], $_POST['comment'], $_POST['date'], 
            $_POST['siteIndex1'], $_POST['siteIndex2'],
                $_POST["replyIndex"])) {

    insertdata($_POST['name'], $_POST['comment'], $_POST['date'], 
            json_decode($_POST['replyIndex']), $_POST["siteIndex1"],
                $_POST["siteIndex2"]);    
    echo "data arrived";
}

if (isset($_GET["getData"], $_GET["siteIndex1"], $_GET["siteIndex2"])) {
    getData($_GET["siteIndex1"], $_GET["siteIndex2"]);    
}
    
if (isset($_COOKIE["myname"], $_COOKIE["mypassword"])) {
    if ($_COOKIE["myname"] == "Manuel" &&
            password_verify("Password", $_COOKIE["mypassword"])) {
    if (isset($_GET["setTable"], $_GET["DB_id"])) {
        if ($_GET["DB_id"] > 0) {
            createTable($_GET["DB_id"]);
            echo "Successfull created table";
        } else {
            echo "db id was empty";
        }
    }
    }
}
