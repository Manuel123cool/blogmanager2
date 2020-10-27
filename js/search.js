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
        dataSearch.headerInOrder.forEach( elem => {
            let headerElem = document.createElement("h4");
            let linkHeader = document.createElement("a");
            linkHeader.innerHTML = data.headers[elem[0]][elem[1]];
            linkHeader.setAttribute("href", "");

            headerElem.appendChild(linkHeader); 
            this.result_wrapper.appendChild(headerElem);
            
            linkHeader.addEventListener("click", preventDefault);
            headerElem.addEventListener("click", getTextEvent);
        });
        let hr = document.createElement("hr");
        this.result_wrapper.appendChild(hr);
        dataSearch.result = [];
        dataSearch.headerInOrder = [];
    }
}

let dataSearch = {
    result: Array(),
    headerInOrder: Array(),
    search(string, searchFor) {
        if (searchFor == "") {
            return -1;
        }
        let reg = new RegExp(searchFor, "ig");
        let regNotG = new RegExp(searchFor, "i");
        let result = reg.test(string);
        let count = 0;
        while (result) {
            count++; 
            string.replace(regNotG, "");
            result = reg.test(string);
        }
        return count;
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
    checkData(searchFor) {
        let count = 0;
        data.headers.forEach( elem => {
            let count1 = 0;
            elem.forEach( elem1 => {
                let result = this.search(elem1, searchFor);     
                if (result != -1) {
                    let resultArray = Array();
                    resultArray[0] = result * 50; 
                    resultArray[1] = count;
                    resultArray[2] = count1;
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
                let result = this.search(elem1, searchFor);     
                if (result != -1) {
                    let length = this.findSamePos(count, count1);
                    if (length == this.result.length) {
                        let resultArray = Array();
                        resultArray[0] = result * 50; 
                        resultArray[1] = count;
                        resultArray[2] = count1;
                        this.result[length] = resultArray; 
                    } else {
                        this.result[length][0] += result * 10;
                    }
                }
                count1++;
            });
            count++;
        });
        console.log(this.result);
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
                this.headerInOrder.push(result); 
                this.result.splice(largestElem, 1);
            } else {
                for (let j = 0; j < this.result.length; j++) {
                    let result = Array();
                    result[0] = this.result[j][1];
                    result[1] = this.result[j][2];
                    this.headerInOrder.push(result);
                }
                this.result.splice(0, this.result.length);
            }
        }
        drawSearch.drawUponData();
    }
}

function inputChangeEvent(e) {
    let search = document.getElementById("search_field").value;
    dataSearch.checkData(search);
}

function loeadEvent(e) {
    drawSearch.createSearchField();
}
document.addEventListener("DOMContentLoaded", loeadEvent);
