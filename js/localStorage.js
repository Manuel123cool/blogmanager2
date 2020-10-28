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
    }
}
