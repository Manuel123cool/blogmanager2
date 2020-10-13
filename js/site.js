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
                
                linkHeader.addEventListener("click", preventDefault);
                headerElem.addEventListener("click", getTextEvent);
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

    },
    getArticle: function(index1, index2) {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
                this.headers = JSON.parse(responseText);
                draw.wrapper.textContent = "";
                draw.wrapper.insertAdjacentHTML("beforeend", JSON.parse(responseText));
            }
        });
        xmlhttp0.open('GET', "edit.php?one_article=true&" + 
            "which_blog_entrie=" + index1 + "&index=" + index2, true);
        xmlhttp0.send();  

    }
}

function init(e) {
    data.getBlogEntries();
}

function getTextEvent(e) {
    let countElem = true;
    let index1 = 0;
    let index2 = 0;
    let count = 0;
    while (countElem) {
        if (!draw.wrapper.childNodes[count]) {
            break;
        }
        if (draw.wrapper.childNodes[count].tagName == "H3") {
            index1++;
            index2 = 0;
        } else if (draw.wrapper.childNodes[count].tagName == "H4") {
            index2++;
        }
        if (draw.wrapper.childNodes[count] == e.currentTarget) {
            break;
        }
        count++;
    } 
    console.log(index1);
    console.log(index2);
    data.getArticle(index1 - 1, index2); 
}

function preventDefault(e) {
    e.preventDefault();
}
document.addEventListener("DOMContentLoaded", init);
