<?php
session_start();

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

function checkIfIpIsSpaming($ipAddress, $dbIndex) {
    $array = getTmpData($dbIndex); 
    foreach ( $array as $value) {
        if ($value[4] == $ipAddress) {
            $startTime = $value[5]; 
            $nowTime = time();
            $timeElapsed = $nowTime - $startTime;
            $timeElapsed /= 60; 
            if ($timeElapsed < 1) {
                return true;
            }
        }
    }
    unset($value);
    return false;
}

function insertTmpData($name, $comment, $date, $replyIndex, $dbIndex) {
    if (checkIfIpIsSpaming(getIpAddress(), $dbIndex)) {
        echo "isSpamming";
        exit();
    }
    $sql = "INSERT INTO tmp_comment$dbIndex
         (comment, name, date, replyIndex, ipAddress, time, randomKey)
                 VALUES (?, ?, ?, ?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $comment, $name, $date, $serializedData,
        $ipAddress, $time, $randomKey);
    $serializedData = serialize($replyIndex);
    $ipAddress = getIpAddress();
    $time = time();
    $randomKey = uniqid("", true);
    $stmt->execute();

    $_SESSION["randomKey"] = $randomKey;
}

function delTmpCom($dbIndex) {
    $array = getTmpData($dbIndex); 
    foreach ($array as $value) {
        if ($value[4] == getIpAddress() && $value[6] == 
                $_SESSION["randomKey"]) {
            $sql = "DELETE FROM tmp_comment$dbIndex WHERE id=$value[7]";

            if (conn()->query($sql) === TRUE) {
              echo "Record deleted successfully";
            } else {
              echo "Error deleting record: " . conn()->error;
            }    
        }
    }

    session_unset();
    session_destroy();
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
        return $array;
        $returnEmpty = true;
    }

    if (!$returnEmpty) {
        return $array;
    }
}

function getTmpDataForClient($dbIndex) {
    $array = Array();
    $sql = "SELECT comment, name, date, replyIndex, ipAddress, time, randomKey,
            id FROM tmp_comment$dbIndex";
    $result = conn()->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            if ($row["ipAddress"] == getIpAddress() && $row["randomKey"] ==
                    $_SESSION["randomKey"]) {
                $array = Array();
                $array[0] = $row["comment"]; 
                $array[1] = $row["name"]; 
                $array[2] = $row["date"]; 

                $startTime = $row["time"]; 
                $nowTime = time();
                $timeElapsed = $nowTime - $startTime;
                $timeElapsed /= 60; 
                $array[3] = round($timeElapsed); 
                break;
            }
        }
    } else {
        return $array;
    }
    return $array;
}

function getTmpData($dbIndex) {
    $array = Array();
    $sql = "SELECT comment, name, date, replyIndex, ipAddress, time, randomKey,
            id FROM tmp_comment$dbIndex";
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
            $array[$count][4] = $row["ipAddress"]; 
            $array[$count][5] = $row["time"]; 
            $array[$count][6] = $row["randomKey"];
            $array[$count][7] = $row["id"];
            $count++;
        }
    } else {
        return $array;
    }
    return $array;
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
    if (!is_numeric($_GET["dbIndex"])) {
        echo "Error: not numeric number";
        exit();
    }
    echo json_encode(getData($_GET["dbIndex"]));    
}

if (isset($_GET["getData_index"], $_GET["dbIndex"], $_GET["index"])) {
    if (!is_numeric($_GET["dbIndex"])) {
        echo "Error: not numeric number";
        exit();
    }
    $comment = getData($_GET["dbIndex"]);
    for ($i = 0; $i < count($comment); $i++) {
        array_push($comment[$i], $_GET["dbIndex"]);
    }
    $array = [
        "id" => $_GET["dbIndex"],
        "com" => $comment,
        "count" => $_GET["index"]
    ];
    echo json_encode($array);
}

if (isset($_COOKIE["myname"], $_COOKIE["mypassword"])) {
    if ($_COOKIE["myname"] == "Manuel" &&
            password_verify("Password", $_COOKIE["mypassword"])) {
    if (isset($_GET["setTable"], $_GET["DB_ids"])) {
        $array = json_decode($_GET["DB_ids"]);
        if (count($array) == 0) {
            echo "DB ids are zero";
            exit();
        }
        foreach ($array as $value) {
            foreach ($value as $value1) {
                if ($value1 != "noIndex") {
                    createTable($value1);
                    createTmpTable($value1);
                }
            }
            unset($value1);
        }
        unset($value);
    }
    if (isset($_GET["checkAdmin"])) {
        echo "true";
        exit();
    }
    if (isset($_GET["deleteAll"])) {
         $dbhost = 'localhost';
         $dbuser = 'root';
         $dbpass = '';
         $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
         
         if(!$conn){
            echo 'Connected failure<br>';
         }
         $sql = "DROP DATABASE comments";
         
         if (mysqli_query($conn, $sql)) {
            echo "Database deleted successfully";
         } else {
            echo "Error deleting record: " . mysqli_error($conn);
         }
         mysqli_close($conn);
    }
    if (isset($_GET["deleteCom"], $_GET["DB_id"], $_GET["pos"])) {
        deleteCom($_GET["DB_id"], json_decode($_GET["pos"])); 
    }
    if (isset($_POST['name'], $_POST['comment'], $_POST['date'], 
                    $_POST['dbIndex'], $_POST["replyIndex"])) {

        insertData($_POST['name'], $_POST['comment'], $_POST['date'], 
                json_decode($_POST['replyIndex']), $_POST["dbIndex"]);
        echo "data arrived";
        exit();
    }
    }
}

if (isset($_GET["checkAdmin"])) {
    echo "false";
    exit();
}

function createTmpTable($index) {
     $sql = "CREATE TABLE IF NOT EXISTS tmp_comment$index (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30),
        comment VARCHAR(1000),
        date VARCHAR(30),
        replyIndex VARCHAR(1000),
        ipAddress VARCHAR(50),
        time VARCHAR(1000),
        randomKey VARCHAR(50)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
      echo "Error creating table: " . conn()->error;
    }

    conn()->close();
}   

if (isset($_POST['name'], $_POST['comment'], $_POST['date'], 
            $_POST['dbIndex'],
                $_POST["replyIndex"])) {

    if (!is_numeric($_POST["dbIndex"])) {
        echo "Error: not numeric number";
        exit();
    }
    insertTmpData($_POST['name'], $_POST['comment'], $_POST['date'], 
            json_decode($_POST['replyIndex']), $_POST["dbIndex"]);
    echo "data arrived";
}

if (isset($_GET["deleteTmpCom"], $_GET["DB_id"])) {
    if (!is_numeric($_GET["DB_id"])) {
        echo "Error: not numeric number";
        exit();
    }
 
    delTmpCom($_GET["DB_id"]); 
}

if (isset($_GET["getTmpCom"], $_GET["dbIndex"])) {
    if (!is_numeric($_GET["dbIndex"])) {
        echo "Error: not numeric number";
        exit();
    }
    echo json_encode(getTmpDataForClient($_GET["dbIndex"]));    
}

if (isset($_GET["checkPosting"], $_GET["dbIndex"])) {
    if (!is_numeric($_GET["dbIndex"])) {
        echo "Error: not numeric number";
        exit();
    }

    $dbIndex = $_GET["dbIndex"];
    $array = getTmpData($dbIndex); 
    foreach ($array as $value) {
        $startTime = $value[5]; 
        $nowTime = time();
        $timeElapsed = $nowTime - $startTime;
        $timeElapsed /= 60; 
        if (round($timeElapsed) >= 1) {
            insertData($value[1], $value[0], $value[2], 
                $value[3], $_GET["dbIndex"]);

            $sql = "DELETE FROM tmp_comment$dbIndex WHERE id=$value[7]";

            if (conn()->query($sql) === TRUE) {
                //echo "Record deleted successfully";
            } else {
              echo "Error deleting record: " . conn()->error;
            }    

            if ($value[4] == getIpAddress()) {
                echo "Successfull posted";
            } 
        }
    }
    unset($value);
}
