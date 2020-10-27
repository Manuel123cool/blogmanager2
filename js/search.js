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
}

let dataSearch = {
    result: Array(),
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
    }
}

function inputChangeEvent(e) {
    let string = "hallo oidwjqoij hallo iopj oidwihallo";  
    let search = document.getElementById("search_field").value;
    let count = dataSearch(string, search);
    console.log(count);
}

function loeadEvent(e) {
    drawSearch.createSearchField();
}
document.addEventListener("DOMContentLoaded", loeadEvent);
