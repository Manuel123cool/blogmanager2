"use strict";

let drawSearch = {
    wrapper: document.getElementById("search_wrapper"),
    result_wrapper: document.getElementById("search_result_wrapper"), 
    createSearchField() {
        var label = document.createElement("label");
        label.setAttribute("for", "search");
        label.innerHTML = "Search:";
        this.wrapper.appendChild(label);  

        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "search_field");
        input.setAttribute("name", "search");
        this.wrapper.appendChild(input);            

        input.addEventListener("input", inputChangeEvent);
    },
    drawUponData() {
        this.result_wrapper.textContent = "";
        let once = false;
        dataSearch.headerInOrder.forEach( elem => {
            once = true;
            let headerElem = document.createElement("h4");
            let linkHeader = document.createElement("a");
            linkHeader.innerHTML = data.headers[elem[0]][elem[1]];
            linkHeader.setAttribute("href", "");

            headerElem.appendChild(linkHeader); 
            this.result_wrapper.appendChild(headerElem);
            
            linkHeader.addEventListener("click", preventDefaultFromSearch);
            headerElem.addEventListener("click", getTextFromSearchEvent);
        });
        if (once) {
            let hr = document.createElement("hr");
            this.result_wrapper.appendChild(hr);
         }
    }
}

let dataSearch = {
    result: Array(),
    headerInOrder: Array(),
    searches: Array(),
    getData() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
                this.searches = JSON.parse(responseText);
                my_localStorage.setSearchData(this.searches);
                console.log("Search data arrived");
            }
        });
        xmlhttp0.open('GET', "php/search.php?getData=true", true);
        xmlhttp0.send();  
 
    },
    sendData(search, index1, index2) {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/search.php", true); 
        xmlhttp0.setRequestHeader("Content-type", 
            "application/x-www-form-urlencoded");
        xmlhttp0.send("search=" + search + 
            "&index1=" + index1 + "&index2=" + index2); 
    },
    search(string, searchFor) {
        if (searchFor == "") {
            return 0;
        }
        let reg = new RegExp(searchFor, "ig");
        let regNotG = new RegExp(searchFor, "i");
        let result = reg.test(string);
        let count = 0;
        while (result) {
            count++; 
            string = string.replace(regNotG, "");
            result = reg.test(string);
        }
        return count;
    },
    searchWords(string, searchFor) {
        if (searchFor == "") {
            return -1;
        }
        let words = searchFor.split(" ");
        let result = 0;
        words.forEach( word => {
            result += this.search(string, word);
        });
        return result;
    },
    findSamePos(index1, index2) {
        let count = 0;
        let returnElem = -1;
        this.result.forEach( elem => {
            if (elem[1] == index1 && elem[2] == index2) {
                returnElem = count;
            }
            count++;
        });
        if (returnElem != -1) {
            return returnElem;
        }
        return this.result.length;
    },
    reResult(searchFor, result, index1, index2) {
        this.searches.forEach( elem => {
            if (elem[0].toUpperCase() == searchFor.toUpperCase() &&
                    elem[1] == index1 && elem[2] == index2) {
                result += 10 * elem[3];
            } 
        });
        return result;
    },
    checkData(searchFor) {
        let count = 0;
        data.headers.forEach( elem => {
            let count1 = 0;
            elem.forEach( elem1 => {
                let result = this.searchWords(elem1, searchFor);     
                if (result != -1 && result != 0) {
                    let resultArray = Array();
                    resultArray[0] = this.reResult(searchFor, result * 50,
                            count, count1);
                    resultArray[1] = count;
                    resultArray[2] = count1;
                    resultArray[3] = searchFor;
                    this.result.push(resultArray);
                }
                count1++;
            });
            count++;
        });

        count = 0;
        data.articles.forEach( elem => {
            let count1 = 0;
            elem.forEach( elem1 => {
                let result = this.searchWords(elem1, searchFor);     
                if (result != -1 && result != 0) {
                    let length = this.findSamePos(count, count1);
                    if (length == this.result.length) {
                        let resultArray = Array();
                        resultArray[0] = this.reResult(searchFor, result * 10,
                            count, count1);
                        resultArray[1] = count;
                        resultArray[2] = count1;
                        resultArray[3] = searchFor;
                        this.result[length] = resultArray; 
                    } else {
                        this.result[length][0] += result * 10;
                    }
                }
                count1++;
            });
            count++;
        });
        this.orderResult();
    },
    orderResult() {
        while (this.result.length > 0) {
            let largestElem = -1;
            let largestCount = 0;
            for (let i = 0; i < this.result.length; i++) {
                if (this.result[i][0] > largestCount) {
                    largestElem = i;
                    largestCount = this.result[i][0];
                }
            }
            if (largestElem != -1) {
                let result = Array();
                result[0] = this.result[largestElem][1];
                result[1] = this.result[largestElem][2];
                result[2] = this.result[largestElem][3];
                this.headerInOrder.push(result); 
                this.result.splice(largestElem, 1);
            } else {
                for (let j = 0; j < this.result.length; j++) {
                    let result = Array();
                    result[0] = this.result[j][1];
                    result[1] = this.result[j][2];
                    result[2] = this.result[j][3];
                    this.headerInOrder.push(result);
                }
                this.result.splice(0, this.result.length);
            }
        }
        drawSearch.drawUponData();
    }
}

function inputChangeEvent(e) {
    dataSearch.result = [];
    dataSearch.headerInOrder = [];

    let search = document.getElementById("search_field").value;
    dataSearch.checkData(search);
}

function getTextFromSearchEvent(e) {
    let countElem = true;
    let index = 0;
    let count = 0;
    while (countElem) {
        if (!drawSearch.result_wrapper.childNodes[count]) {
            break;
        } else if (drawSearch.result_wrapper.childNodes[count].tagName == "H4") {
            index++;
        }
        if (drawSearch.result_wrapper.childNodes[count] == e.currentTarget) {
            break;
        }
        count++;
    } 
    let index1 = dataSearch.headerInOrder[index - 1][0];     
    let index2 = dataSearch.headerInOrder[index - 1][1];     
    dataSearch.sendData(dataSearch.headerInOrder[index - 1][2], 
        dataSearch.headerInOrder[index - 1][0],
            dataSearch.headerInOrder[index - 1][1]);
    urlPar.insertParam(index1, index2, true); 
}

function preventDefaultFromSearch(e) {
    e.preventDefault();
}

function init(e) {
    if (my_localStorage.timeForSearchOver()) {
        dataSearch.getData();
    } else {
        dataSearch.searches = my_localStorage.reSearchData();
    }
}

document.addEventListener("DOMContentLoaded", init);
