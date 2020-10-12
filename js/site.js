"use strict";

let draw = {
    wrapper: document.getElementById("site_wrapper"),
    drawIndexPage: function() {
        for (let i = 0; i < data.blogEntries.length; ++i) {
            let headerElem = document.createElement("h3");
            headerElem.innerHTML = data.blogEntries[i];
            this.wrapper.appendChild(headerElem); 
            for (let j = 0; j < data.headers[i].length; ++j) {
                let headerElem = document.createElement("h4");
                let linkHeader = document.createElement("a");
                linkHeader.innerHTML = data.headers[i][j];
                linkHeader.setAttribute("href", "");

                headerElem.appendChild(linkHeader); 
                this.wrapper.appendChild(headerElem);
            }
        }
    }
}

let data = {
    headers: Array(),
    articles: Array(),
    blogEntries: Array(),
    getBlogEntries: function() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
                this.blogEntries = JSON.parse(responseText);
                this.getHeader(); 
            }
        });
        xmlhttp0.open('GET', "edit.php?get_blog_entries=true", true);
        xmlhttp0.send();  
    },
    getHeader: function() {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                this.headers = JSON.parse(responseText);
                console.log(responseText);
                draw.drawIndexPage();
            }
        });
        xmlhttp0.open('GET', "edit.php?get_header=true", true);
        xmlhttp0.send();  

    }
}

function init(e) {
    data.getBlogEntries();
}

document.addEventListener("DOMContentLoaded", init);
