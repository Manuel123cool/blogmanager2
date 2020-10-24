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

function insertData($name, $comment, $date, $replyIndex, $dbIndex) {
    $sql = "INSERT INTO comment$dbIndex
         (comment, name, date, replyIndex)
                 VALUES (?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $comment, $name, $date, $serializedData);
    $serializedData = serialize($replyIndex);
    $stmt->execute();
}

function getData($dbIndex) {
    $array = Array();
    $sql = "SELECT comment, name, date, replyIndex 
                FROM comment$dbIndex";
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
            $_POST['dbIndex'],
                $_POST["replyIndex"])) {

    insertdata($_POST['name'], $_POST['comment'], $_POST['date'], 
            json_decode($_POST['replyIndex']), $_POST["dbIndex"]);    
    echo "data arrived";
}

function deleteCom($dbid, $pos) {
    $array = Array();
    $sql = "SELECT id, replyIndex FROM comment$dbid";
    $result = conn()->query($sql);

    $returnEmpty = false;
    if ($result->num_rows > 0) {
        $count = 0;
        while($row = $result->fetch_assoc()) {
            $array[$count] = Array();
            $array[$count][0] = unserialize($row["replyIndex"]); 
            $array[$count][1] = $row["id"];
            $count++;
        }
    }    
    $arrayOfDelId = Array();
    
    for ($i = 0; $i < count($array); $i++) {
        $staysTrue = true;
        print_r($array[$i][0]);
        if ($array[$i][0][0] === "noReplyIndex") {
            continue;
        }
        if (count($array[$i][0]) < count($pos) - 1) {
            continue;
        }
        for ($j = 0; $j < count($pos) - 1; $j++) {
            if ($array[$i][0][$j] !== $pos[$j]) {
                $staysTrue = false; 
            } 
        } 
        if ($staysTrue) {
            array_push($arrayOfDelId, $array[$i]);
        }
    }
    
    $arrayOfNoReply = Array();
    $count = 0;
    foreach ($array as $value) {
        if ($value[0][0] === "noReplyIndex") {
            $arrayOfNoReply[$count] = $value;
            $count++;  
        }
    }
    unset($value);    
    if (count($pos) == 1) {
        array_push($arrayOfDelId, $arrayOfNoReply[$pos[0]]); 
    }

    foreach ($arrayOfDelId as $value) {
        $sql = "DELETE FROM comment$dbid WHERE id=$value[1]";

        if (conn()->query($sql) === TRUE) {
          echo "Record deleted successfully";
        } else {
          echo "Error deleting record: " . $conn->error;
        }
    } 
    unset($value);    
}

if (isset($_GET["getData"], $_GET["dbIndex"])) {
    getData($_GET["dbIndex"]);    
}
    
if (isset($_COOKIE["myname"], $_COOKIE["mypassword"])) {
    if ($_COOKIE["myname"] == "Manuel" &&
            password_verify("Password", $_COOKIE["mypassword"])) {
    if (isset($_GET["setTable"], $_GET["DB_id"])) {
        if ($_GET["DB_id"] >= 0) {
            createTable($_GET["DB_id"]);
            echo "Successfull created table";
        } else {
            echo "db id was empty";
        }
    }
    if (isset($_GET["checkAdmin"])) {
        echo "true";
        exit();
    }

    if (isset($_GET["deleteCom"], $_GET["DB_id"], $_GET["pos"])) {
        deleteCom($_GET["DB_id"], json_decode($_GET["pos"])); 
    }
    }
}

if (isset($_GET["checkAdmin"])) {
    echo "false";
    exit();
}
