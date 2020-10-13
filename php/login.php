<?php

if ($_POST["name"] == "Manuel" && $_POST["password"] == "Password") {
    setcookie("myname", "Manuel", NULL, "/", NULL, TRUE, TRUE); 
    $password_hash = password_hash("Password", PASSWORD_DEFAULT);
    setcookie("mypassword", $password_hash, NULL, "/", NULL, TRUE, TRUE); 
    echo "went fine";
} else {
    echo "somenthing went wrong";
}
