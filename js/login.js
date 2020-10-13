"use strict";

function sendData(e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var password = document.getElementById("password").value;
    
    var xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            var responseText = xmlhttp0.responseText;
            console.log(responseText);
            if (responseText == "went fine") {
                window.open("http://localhost/edit.html", "_self");
            }
        }
    });
    xmlhttp0.open('POST', "php/login.php", true);
    xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp0.send("name=" + name + "&password=" + password);
}

var submit = document.getElementById("submit");
submit.addEventListener("click", sendData);
