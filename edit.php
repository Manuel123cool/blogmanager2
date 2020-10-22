<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "blog_data";

function conn() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "blog_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

$conn = new mysqli($servername, $username, $password);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    //echo "Database created successfully";
} else {
    echo "Error creating database: " . $conn->error;
}

function createTableBlogEntries() {
    $sql = "CREATE TABLE IF NOT EXISTS blog_entries (
        text VARCHAR(30)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
        echo "Error creating table: " . conn()->error;
    }
    conn()->close();
}

function createTableHeader($index) {
    $sql = "CREATE TABLE IF NOT EXISTS header$index (
        text VARCHAR(30)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
        echo "Error creating table: " . conn()->error;
    }
    conn()->close();
}

function createTableDB($index) {
    $sql = "CREATE TABLE IF NOT EXISTS db$index (
        text VARCHAR(30)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
        echo "Error creating table: " . conn()->error;
    }
    conn()->close();
}

function createTableArticle($index) {
    $sql = "CREATE TABLE IF NOT EXISTS article$index (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
        text VARCHAR(10000)
    )";

    if (conn()->query($sql) === TRUE) {
        //echo "Table MyGuests created successfully";
    } else {
        echo "Error creating table: " . conn()->error;
    }
    conn()->close();
}

function resetDB() {
    $sql = 'DROP DATABASE blog_data';
    if (conn()->query($sql) === TRUE) {
        // 
    } else {
        echo "Error deleting DB: " . conn()->error;
    } 

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "blog_data";

    $conn = new mysqli($servername, $username, $password);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "CREATE DATABASE IF NOT EXISTS $dbname";
    if ($conn->query($sql) === TRUE) {
        //echo "Reset successfull";
    } else {
        echo "Error creating database: " . $conn->error;
    }
}

function getBlogEntries() {
    $array = array();
    $sql = "SELECT text FROM blog_entries";
    $result = conn()->query($sql);
    if (!$result) {
        trigger_error('Invalid query: ' . conn()->error);
    }

    if ($result->num_rows > 0) {
        $count = 0;
        while($row = $result->fetch_assoc()) {
            $array[$count] = $row["text"]; 
            $count++;
        }
    } else {
        //echo "0 results";
    }
    conn()->close();
    return $array;
}

function getArticle() {
    //get length
    $count = 0;
    $exists = true;
    while ($exists) {
        $sql = "select 1 from article$count LIMIT 1";
        $result = conn()->query($sql);

        if($result !== FALSE)
        {
            $count++; 
        } else {
            $exists = false;
        }
    }
    $array = Array();
    for ($i = 0; $i < $count; $i++) {
        $array[$i] = Array();
        $sql = "SELECT text FROM article$i";
        $result = conn()->query($sql);
        if (!$result) {
            trigger_error('Invalid query: ' . conn()->error);
        }

        if ($result->num_rows > 0) {
            $count1 = 0;
            while($row = $result->fetch_assoc()) {
                $array[$i][$count1] = $row["text"]; 
                $count1++;
            }
        } else {
            //echo "0 results";
        }
    }
    return $array;
    conn()->close();
}

function getHeader() {
    //get length
    $count = 0;
    $exists = true;
    while ($exists) {
        $sql = "select 1 from header$count LIMIT 1";
        $result = conn()->query($sql);

        if($result !== FALSE)
        {
            $count++; 
        } else {
            $exists = false;
        }
    }
    $array = Array();
    for ($i = 0; $i < $count; $i++) {
        $array[$i] = Array();
        $sql = "SELECT text FROM header$i";
        $result = conn()->query($sql);
        if (!$result) {
            trigger_error('Invalid query: ' . conn()->error);
        }

        if ($result->num_rows > 0) {
            $count1 = 0;
            while($row = $result->fetch_assoc()) {
                $array[$i][$count1] = $row["text"]; 
                $count1++;
            }
        } else {
            //echo "0 results";
        }
    }
    return $array;
    conn()->close();
}

function createFile($fileName, $fileContent) {
    echo "Hallo";
    $fileName = "page/" . $fileName;
    $myfile = fopen($fileName, "w") or die("Unable to open file!");
    fwrite($myfile, $fileContent);
    fclose($myfile);
}

if (isset($_COOKIE["myname"], $_COOKIE["mypassword"])) {
    if ($_COOKIE["myname"] == "Manuel" && 
            password_verify("Password", $_COOKIE["mypassword"])) {
    if (isset($_POST["blog_entries"])) {
        createTableBlogEntries();
        $blog_entries = json_decode($_POST["blog_entries"]);
        $conn = conn();
        $stmt = $conn->prepare("INSERT INTO blog_entries (text) VALUES (?)");
        $stmt->bind_param("s", $text);
        foreach ($blog_entries as $entrie) {
            $text = $entrie;
            $stmt->execute();
        }
        $stmt->close();
        $conn->close();
    }

    if (isset($_POST["header"])) {
        $headers = json_decode($_POST["header"]);
        $count = 0;
        foreach ($headers as $header) {
            createTableHeader($count); 
        $conn = conn();
        $stmt = $conn->prepare("INSERT INTO header$count (text) VALUES (?)");
        $stmt->bind_param("s", $text);
        foreach ($header as $headerTxt) {
            $text = $headerTxt;    
            $stmt->execute();
        } 
        $stmt->close();
        $conn->close();
        $count++;
        }
    }

    if (isset($_POST["article"])) {
        system("sudo rm page/*");
        $articles = json_decode($_POST["article"]);
        $count = 0;
        $count2 = 0;
        foreach ($articles as $article) {
            createTableArticle($count); 
            $conn = conn();
            $stmt = $conn->prepare("INSERT INTO article$count (text) VALUES (?)");
            $stmt->bind_param("s", $text);
            foreach ($article as $articleTxt) {
                if (is_string($articleTxt)) {
                    if (!empty($articleTxt)) {
                        createFile($count2 . ".html", $articleTxt);
                    }
                    $count2++; 
                    $text = $articleTxt;    
                    $stmt->execute();
                }
            } 
            unset($articleTxt);
            $stmt->close();
            $conn->close();
            $count++;
        }
        unset($article);
    }

    if (isset($_GET["reset"])) {
        resetDB();
    }
    
    if (isset($_GET["
    }
}

if (isset($_GET["getData"])) {
    createTableBlogEntries();
    $array = [
        "blogEntries" => getBlogEntries(),
        "headers" => getHeader(),
        "articles" => getArticle()
    ];
    echo json_encode($array);
}

