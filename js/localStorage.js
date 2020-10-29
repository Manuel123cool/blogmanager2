"use strict";

let my_localStorage = {
    setData(blogEntries, headers, dbIds, articles) {
        localStorage.setItem("blogEntries", JSON.stringify(blogEntries));   
        localStorage.setItem("headers", JSON.stringify(headers));   
        localStorage.setItem("dbIds", JSON.stringify(dbIds));   

        let count = 0;
        let index1 = 0;
        let index2 = 0;
        headers.forEach( elem => {
            elem.forEach( elem1 => {
                if (!articles[index1][index2]) {
                    articles[index1][index2] = "";
                }
                localStorage.setItem("article" + count, 
                    JSON.stringify(articles[index1][index2]));   
                count++;
                index2++;
            });
            index1++;
        });
        let startTime = new Date();
        localStorage.setItem("timestamp", startTime.toJSON());   
    },
    timeOver() {
        if (!localStorage.timestamp) {
            return true;
        }
        let startTime = new Date(localStorage.timestamp);
        let nowTime = new Date();
        let timeDiff = nowTime - startTime;
        var minutes = Math.round(timeDiff / 60000);
        if (minutes > 1) {
            return true;
        }
        return false;
    },
    reData() {
        let reObj = new Object();
        reObj.blogEntries = JSON.parse(localStorage.blogEntries);
        reObj.headers = JSON.parse(localStorage.headers);
        reObj.dbIds = JSON.parse(localStorage.dbIds);

        let count = 0;
        let index1 = 0;
        let index2 = 0;
        reObj.articles = Array();
        reObj.headers.forEach( elem => {
            reObj.articles[index1] = Array();
            elem.forEach( elem1 => {
                reObj.articles[index1][index2] = JSON.parse(localStorage.
                    getItem("article" + count)); 
                count++;
                index2++;
            });
            index1++;
        });
 
        return reObj;
    },
    setSearchData(searches) {
        localStorage.setItem("searches", JSON.stringify(searches));   
        let startTime = new Date();
        localStorage.setItem("search_timestamp", startTime.toJSON());   
    },
    timeForSearchOver() {
        if (!localStorage.search_timestamp) {
            return true;
        }
        let startTime = new Date(localStorage.search_timestamp);
        let nowTime = new Date();
        let timeDiff = nowTime - startTime;
        var minutes = Math.round(timeDiff / 60000);
        if (minutes > 1) {
            return true;
        }
        return false;
    },
    reSearchData() {
        let reObj = new Object();
        reObj = JSON.parse(localStorage.searches);
        return reObj;
    },
    setFormData() {
        let name = document.getElementById("name").value;
        let email = document.getElementById("E-Mail").value;
        let website = document.getElementById("website").value;

        localStorage.setItem("name_form", name);   
        localStorage.setItem("email_form", email);   
        localStorage.setItem("website_form", website);   
    },
    getFormData() {
        if (localStorage.name_form) {
            document.getElementById("save_input").checked = true;
            document.getElementById("name").value = localStorage.name_form;
            document.getElementById("E-Mail").value = localStorage.email_form;
            document.getElementById("website").value = localStorage.
                    website_form;
        }
    },
    deleteFormData() {
        localStorage.removeItem("name_form");   
        localStorage.removeItem("email_form");   
        localStorage.removeItem("wbsite_form");   
    }
}
