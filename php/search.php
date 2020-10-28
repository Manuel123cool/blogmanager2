<?php
session_start();

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

function createIPTable() {
    $sql = "CREATE TABLE IF NOT EXISTS ip_address (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(100),
        time VARCHAR(100)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
      echo "Error creating ip table: " . conn()->error;
    }

    conn()->close();
}
createIPTable();

function insertIPAddress() {
    $sql = "INSERT INTO ip_address (ip, time)
                 VALUES (?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $ip, $time);
    $ip = getIpAddress();
    $time = time();
    $stmt->execute();
}

function insertData($search, $index1, $index2) {
    $array = getData();
    foreach ($array as $value) {
        if (strtolower($search) == strtolower($value[0]) && 
                $index1 == $value[1] && $index2 == $value[2]) {
            $num = $value[3] + 1; 
            $sql = "UPDATE search SET num=$num WHERE id=$value[4]";
            if (conn()->query($sql) === TRUE) {
              //echo "Record updated successfully";
            } else {
              echo "Error updating record: " . conn()->error;
            }
            return;
        }
    }
    $sql = "INSERT INTO search (search, index1, index2, num)
                 VALUES (?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $search, $index1, $index2, $num);
    $num = 1;
    $stmt->execute();
}

function checkIfIpIsSpaming() {
    $array = getDataIP(); 
    $once = false;
    foreach ( $array as $value) {
        if ($value[0] == getIpAddress()) {
            $once = true;
            $startTime = $value[1]; 
            $nowTime = time();
            $timeElapsed = $nowTime - $startTime;
            $timeElapsed /= 60; 
            if ($timeElapsed < 2) {
                return true;
            } else {
                $sql = "DELETE FROM ip_address WHERE id=$value[2]";

                if (conn()->query($sql) === TRUE) {
                    //echo "Record deleted successfully";
                } else {
                    echo "Error deleting record: " . conn()->error;
                }
                $conn->close();
            }
        }
    }
    unset($value);
    if (!$once) {
        insertIPAddress();
    }
    return false;
}

if (isset( $_POST["search"],$_POST["index1"],$_POST["index2"])) {
    if (checkIfIpIsSpaming() || isset($_SESSION["anti_spam"])) {
        echo "You are spamming";
        exit();
    } 
    insertData($_POST["search"],$_POST["index1"],$_POST["index2"]);
    echo "Data arrived";
    $_SESSION["anti_spam"] = "true";
}

if (isset($_GET["getData"])) {
    echo json_encode(getData());
}

function getIpAddress() {
    //whether ip is from share internet
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   
    {
        $ip_address = $_SERVER['HTTP_CLIENT_IP'];
    }
    //whether ip is from proxy
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))  
    {
        $ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    //whether ip is from remote address
    else
    {
        $ip_address = $_SERVER['REMOTE_ADDR'];
    }
    return $ip_address;    
}

function getData() {
    $array = Array();
    $sql = "SELECT search, index1, index2, num, id 
        FROM search";
    $result = conn()->query($sql);

    $returnEmpty = false;
    if ($result->num_rows > 0) {
        $count = 0;
        while($row = $result->fetch_assoc()) {
            $array[$count] = Array();
            $array[$count][0] = $row["search"]; 
            $array[$count][1] = $row["index1"]; 
            $array[$count][2] = $row["index2"]; 
            $array[$count][3] = $row["num"]; 
            $array[$count][4] = $row["id"]; 
            $count++;
        }
    } else {
        return $array;
        $returnEmpty = true;
    }

    if (!$returnEmpty) {
        return $array;
    }
}

function getDataIP() {
    $array = Array();
    $sql = "SELECT ip, time, id FROM ip_address";
    $result = conn()->query($sql);

    $returnEmpty = false;
    if ($result->num_rows > 0) {
        $count = 0;
        while($row = $result->fetch_assoc()) {
            $array[$count] = Array();
            $array[$count][0] = $row["ip"]; 
            $array[$count][1] = $row["time"]; 
            $array[$count][2] = $row["id"]; 
            $count++;
        }
    } else {
        return $array;
        $returnEmpty = true;
    }

    if (!$returnEmpty) {
        return $array;
    }
}

function deleteTable() {
     $sql = "DROP TABLE search";
     $result = conn()->query($sql);
     if (!$result) {
        echo "Error deleting table: " . conn()->error(); 
     } 
}

if (isset($_COOKIE["myname"], $_COOKIE["mypassword"])) {
    if ($_COOKIE["myname"] == "Manuel" &&
            password_verify("Password", $_COOKIE["mypassword"])) {
 
    if (isset($_GET["deleteData"])) {
        deleteTable();
    }
    }
}
