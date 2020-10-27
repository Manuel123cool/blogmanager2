"use strict";
let urlPar = {
    currentPageChar: "h",
    checkPar: function () {
        let url = window.location.href;
        let indexPage = url.search("page=");
        let index1Index = url.search("index1=");
        let index2Index = url.search("index2=");
        let firstPageChar = 'h';
        
        if (indexPage != -1) {
            firstPageChar = url.charAt(indexPage + 5); 
        } 

        let index1 = 0;
        if (index1Index != -1) {
            let counter = index1Index ;
            let isNumber = true;
            while (isNumber) {
                if (url.charAt(counter + 7) != '&' && url.charAt(counter + 7)) {
                    isNumber = true; 
                    index1 += url.charAt(counter + 7);
                } else {
                    isNumber = false;
                }
                counter++;
            }
        }

        let index2 = 0;
        if (index2Index != -1) {
            let counter = index2Index ;
            let isNumber = true;
            while (isNumber) {
                if (url.charAt(counter + 7) && url.charAt(counter + 7) != '&') {
                    isNumber = true; 
                    index2 += url.charAt(counter + 7);
                } else {
                    isNumber = false;
                }
                counter++;
            }
        }
 
        switch (firstPageChar) {
            case 'h':
                data.drawHeaderPage();
                this.currentPageChar = 'h';
                return true;
            case 'a':
                data.drawArticle(Number(index1), Number(index2));
                this.currentPageChar = 'a';
                return true;
            default:
                data.drawHeaderPage();
                this.currentPageChar = 'h';
                return true;
        }
    },
    insertParam: function(value, index2, siteIndex = false)
    {
        value = encodeURIComponent(value);
        let key = 'page';
        let key2 = '';
        let oldPar = '';
        if (siteIndex) {
            oldPar = 'page=article&';
            key = 'index1';
    
            key2 = '&index2=' + index2;
        }
        let url = 'index.html?' + oldPar + key + '=' + value + key2;
        window.history.pushState(null, null, url);
        this.checkPar();
    }
}

window.onpopstate = function(event) {
    urlPar.checkPar();
}

let draw = {
    wrapper: document.getElementById("site_wrapper"),
    drawIndexPage: function() {
        this.wrapper.innerHTML = "";
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
    dbIds: Array(),
    drawHeaderPage: function() {
        document.getElementById("from_wrapper").
            setAttribute("style", "display: none;");
        drawCom.wrapper.textContent = "";
        drawCom.indexWrapper.textContent = "";
        drawCom.tmp_wrapper.textContent = "";
        draw.drawIndexPage();
        drawSearch.createSearchField();
    },
    drawArticle: function(index1, index2) {
        draw.wrapper.textContent = "";
        document.getElementById("search_result_wrapper").textContent = "";
        document.getElementById("search_wrapper").textContent = "";
        if (this.dbIds[index1][index2] != "noIndex") {
            document.getElementById("from_wrapper").
                setAttribute("style", "display: block;");
        }
        draw.wrapper.
            insertAdjacentHTML("beforeend", this.articles[index1][index2]);
        drawCom.draw(this.dbIds[index1][index2]);
    },
    getData: function() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                //console.log(responseText);
                this.blogEntries = JSON.parse(responseText).blogEntries; 
                this.headers = JSON.parse(responseText).headers; 
                this.articles = JSON.parse(responseText).articles; 
                this.dbIds = JSON.parse(responseText).DBids; 
                urlPar.checkPar();
            }
        });
        xmlhttp0.open('GET', "edit.php?getData=true", true);
        xmlhttp0.send();  
    }
}

function init(e) {
    data.getData();
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
    urlPar.insertParam(index1 - 1, index2 - 1, true); 
}

function preventDefault(e) {
    e.preventDefault();
}

document.addEventListener("DOMContentLoaded", init);
