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
    headersSet: false,
    drawHeaderPage: function() {
        document.getElementById("from_wrapper").setAttribute("style", "display: none;");
        drawCom.wrapper.textContent = "";
        drawCom.drawn = false;
        if (this.headersSet) {
            draw.drawIndexPage();
        } else {
            this.getBlogEntries();
        }
    },
    drawArticle: function(index1, index2) {
        draw.wrapper.textContent = "";
        document.getElementById("from_wrapper").setAttribute("style", "display: block;");
        try {
            if(this.articles[index1][index2] != undefined) {
                draw.wrapper.insertAdjacentHTML("beforeend", this.articles[index1][index2]);
                intersectionObserver(index1, index2);
            } else {
                this.getArticle(index1, index2);
            } 
        } catch {
            this.getArticle(index1, index2);
        } 
    },
    getBlogEntries: function() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                //console.log(responseText);
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
                //console.log(responseText);
                this.headersSet = true;
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
                //console.log(responseText);
                try {
                    if(this.articles[index1] != undefined) {
                        this.articles[index1][index2] = JSON.parse(responseText);
                    } else {
                        this.articles[index1] = Array();
                        this.articles[index1][index2] = JSON.parse(responseText);
                    } 
                } catch {
                    this.articles[index1] = Array();
                    this.articles[index1][index2] = JSON.parse(responseText);
                } 
                draw.wrapper.insertAdjacentHTML("beforeend", JSON.parse(responseText)); 
                intersectionObserver(index1, index2);
            }
        });
        xmlhttp0.open('GET', "edit.php?one_article=true&" + 
            "which_blog_entrie=" + index1 + "&index=" + index2, true);
        xmlhttp0.send();  

    }
}

function init(e) {
    urlPar.checkPar();
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
    urlPar.insertParam(index1 - 1, index2, true); 
}

function preventDefault(e) {
    e.preventDefault();
}

function intersectionObserver(index1, index2) {
    const callBackFunction = function(entries) {
        if (entries[0].isIntersecting && urlPar.currentPageChar == 'a') {
            drawCom.draw(index1, index2);
        }
    };

    const observer = new IntersectionObserver(callBackFunction);
    observer.observe(drawCom.wrapper);
}

document.addEventListener("DOMContentLoaded", init);
