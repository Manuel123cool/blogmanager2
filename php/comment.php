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

function insertData($name, $comment, $date, 
        $replyIndex1, $replyIndex2, $site_index1, $site_index2) {
    $sql = "INSERT INTO ${siteIndex1}my_comments$site_index2
         (comment, name, date, replyIndex1, replyIndex2)
                 VALUES (?, ?, ?, ?, ?)";
    $conn = conn();
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssis", $comment, $name, $date, $reply_num, $into_div);
    $stmt->execute();
}

if (isset($_POST['name'], $_POST['comment'], $_POST['date'], 
            $_POST['reply_num'], $_POST['into_div'], $_POST["site_index"])) {

    insertdata($_POST['name'], $_POST['comment'], $_POST['date'], 
                    $_POST['reply_num'], $_POST['into_div'], $_POST["site_index"]);    
    echo "data arrived";
}
