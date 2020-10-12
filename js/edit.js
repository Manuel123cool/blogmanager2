"use strict"

let draw = {
    wrapper: document.getElementById("edit_wrapper"),
    drawSaveButton: function() {
        let saveButton = document.createElement("button"); 
        saveButton.innerHTML =  "save";    
        saveButton.setAttribute("class", "saveButton");
        this.wrapper.appendChild(saveButton);

        saveButton.addEventListener("click", saveButtonEvent);
    },
    drawBackButton: function() {
        let backButton = document.createElement("button");
        backButton.innerHTML =  "go back";    
        backButton.setAttribute("class", "backButton");
        this.wrapper.appendChild(backButton);
        
        backButton.addEventListener("click", backButtonEvent); 
    },
    drawAddBlockEntry: function(insertAfter = false, referenceNode) {
        let smallAddButton = document.createElement("button");
        smallAddButton.innerHTML =  "add blog entry";    
        smallAddButton.setAttribute("class", "smallAddButton");
        if (insertAfter) {
            this.insertAfter(smallAddButton, referenceNode);
        } else {
            this.wrapper.appendChild(smallAddButton);
        }
        
        smallAddButton.addEventListener("click", drawEditArticlesEvent);
    },
    drawAddArticle: function(insertAfter = false, referenceNode) {
        let smallAddButton = document.createElement("button");
        smallAddButton.innerHTML =  "add article";    
        smallAddButton.setAttribute("class", "smallAddButton");
        if (insertAfter) {
            this.insertAfter(smallAddButton, referenceNode);
        } else {
            this.wrapper.appendChild(smallAddButton);
        }
        
        smallAddButton.addEventListener("click", addArticleEvent);
    },

    insertAfter: function(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },
    drawEditArticles: function(header, insertAfter = false, 
            referenceNode, editArticle = false) {
        let article = document.createElement("article"); 
        article.setAttribute("class", "edit_article");

        let editButton = document.createElement("button");
        editButton.setAttribute("class", "editButton");
        article.appendChild(editButton);
        if (editArticle) {
            editButton.innerHTML = "edit article";
            editButton.addEventListener("click", editArticleEvent);
        } else {
            editButton.innerHTML = "edit articles"; 
            editButton.addEventListener("click", editArticlesEvent);
        }

        let textArea = document.createElement("textarea");
        textArea.setAttribute("class", "headerTextarea");
        textArea.value = header;
        article.appendChild(textArea); 
    
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("class", "deleteButton");
        deleteButton.innerHTML = "delete"; 
        article.appendChild(deleteButton);
 
        if (editArticle) {
            deleteButton.addEventListener("click", deleteButtonArticleEvent);
        } else {
            deleteButton.addEventListener("click", deleteButtonArticlesEvent);
        } 

        if (insertAfter) {
            this.insertAfter(article, referenceNode);
            if (editArticle) {
                this.drawAddArticle(true, article);
            } else {
                this.drawAddBlockEntry(true, article);
            }
        } else {
            this.wrapper.appendChild(article);
            if (editArticle) {
                this.drawAddArticle();
            } else {
                this.drawAddBlockEntry();
            }
        }

    },
    drawAll: function() {
        this.drawSaveButton();
        this.drawAddBlockEntry();

        let count = 0;
        data.blogEntries.forEach( elem => {
            this.drawEditArticles(elem);
            if (!data.blogEntriesArticleHeader[count]) {
                data.blogEntriesArticleHeader[count] = Array();
            }
            if (!data.blogEntriesArticles[count]) {
                data.blogEntriesArticles[count] = Array();
            }
            count++;
        });    
    },
    drawUponIndex: function(index) {
        this.drawBackButton();
        this.drawAddArticle(); 
        if (data.blogEntriesArticleHeader[index]) {
            data.blogEntriesArticleHeader[index].forEach( elem => {
                this.drawEditArticles(elem, false, null, true);
            });
        }
    },
    drawTextField: function(index) {
        let backButton = document.createElement("button");
        backButton.innerHTML =  "go back";    
        backButton.setAttribute("class", "backButton");
        this.wrapper.appendChild(backButton);
        
        backButton.addEventListener("click", backButtonArticleEvent); 
        
        let textArea = document.createElement("textarea");
        if (data.blogEntriesArticles[data.currentBlogTarget]) {
                textArea.value = 
                    data.blogEntriesArticles[data.currentBlogTarget][data.currentArticleTarget]; 
            if (data.blogEntriesArticles[data.currentBlogTarget][data.currentArticleTarget] == 
                    undefined) { 
                textArea.value = ""; 
            }
        }
        textArea.setAttribute("id", "article_textarea");
    
        this.wrapper.appendChild(textArea); 
    }
}

let data = {
    currentBlogTarget: -1,
    currentArticleTarget: -1,
    blogEntriesArticleHeader: Array(),
    blogEntriesArticles: Array(),
    blogEntries: Array(),
    resetDB: function() {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                //console.log(responseText);
                this.sendData();
            }
        });
        xmlhttp0.open('GET', "edit.php?reset=true", true);
        xmlhttp0.send();  
    },
    sendData: function() {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.addEventListener('readystatechange', (e) => {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                let responseText = xmlhttp.responseText;
                console.log(responseText);
            }
        });
        xmlhttp.open('POST', "edit.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("header=" + JSON.stringify(this.blogEntriesArticleHeader) + 
            "&article="  + JSON.stringify(this.blogEntriesArticles) + 
                "&blog_entries=" + JSON.stringify(this.blogEntries));
    },
    getBlogEntries: function() {
        var xmlhttp0 = new XMLHttpRequest();
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
                this.blogEntriesArticleHeader = JSON.parse(responseText);
                console.log(responseText);
                this.getArticle();
            }
        });
        xmlhttp0.open('GET', "edit.php?get_header=true", true);
        xmlhttp0.send();  

    },
    getArticle: function() {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                this.blogEntriesArticles = JSON.parse(responseText);
                console.log(responseText);
                draw.drawAll();
            }
        });
        xmlhttp0.open('GET', "edit.php?get_article=true", true);
        xmlhttp0.send();  

    }
}

function drawEvent(e) {
    data.getBlogEntries();
}

function drawEditArticlesEvent(e) {
    draw.drawEditArticles("", true, e.target); 

    let count = 0;
    let index = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.nextSibling === elem) {
            data.blogEntriesArticleHeader.splice(count, 0, Array());
            data.blogEntriesArticles.splice(count, 0, Array());
            index = count;
        }
        ++count;
    });

    data.blogEntriesArticleHeader[index] = Array();
    data.blogEntriesArticles[index] = Array();
}

function addArticleEvent(e) {
    draw.drawEditArticles("", true, e.target, true); 
    
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.nextSibling === elem) {
            data.blogEntriesArticleHeader[data.currentBlogTarget].splice(count, 0, Array());
            data.blogEntriesArticles[data.currentBlogTarget].splice(count, 0, Array());
        }
        ++count;
    });
}

function saveButtonEvent(e) {
    let blogEntryData = Array();

    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        blogEntryData[count] = elem.childNodes[1].value;
        ++count;
    });

    data.blogEntries = blogEntryData;

    data.resetDB(); 
}

function editArticlesEvent(e) {
    let blogEntries = Array();

    let count = 0;
    let index = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        blogEntries[count] = elem.childNodes[1].value;
        if (e.target.parentNode === elem) {
            index = count;
        }
        ++count;
    });
    
    data.blogEntries = blogEntries;

    data.currentBlogTarget = index;
    draw.wrapper.innerHTML = "";
    draw.drawUponIndex(index);    
}

function backButtonEvent(e) {
    data.blogEntriesArticleHeader[data.currentBlogTarget] = Array();
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        data.blogEntriesArticleHeader[data.currentBlogTarget][count] = elem.childNodes[1].value;
        ++count;
    });
    draw.wrapper.innerHTML = "";
    draw.drawAll();
}


function editArticleEvent(e) {
    if (!data.blogEntriesArticleHeader[data.currentBlogTarget]) { 
        data.blogEntriesArticleHeader[data.currentBlogTarget] = Array();
    }
    let count = 0;
    let index = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        data.blogEntriesArticleHeader[data.currentBlogTarget][count] = elem.childNodes[1].value; 
        if (e.target.parentNode === elem) {
            index = count;
        }
        ++count;
    });
    
    data.currentArticleTarget = index;
    draw.wrapper.innerHTML = "";
    draw.drawTextField();
}

function backButtonArticleEvent(e) {
    if (!data.blogEntriesArticles[data.currentBlogTarget]) {
        data.blogEntriesArticles[data.currentBlogTarget] = Array();
    }
    let count = 0;
    let index = 0;
    let articleElem = document.getElementById("article_textarea");
    data.blogEntriesArticles[data.currentBlogTarget][data.currentArticleTarget] = 
        articleElem.value; 
 
    draw.wrapper.innerHTML = "";
    draw.drawUponIndex(data.currentBlogTarget);
}

function deleteButtonArticleEvent(e) {
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.parentNode === elem) {
            data.blogEntriesArticleHeader[data.currentBlogTarget].splice(count, 1);
            data.blogEntriesArticles[data.currentBlogTarget].splice(count, 1);
        }
        ++count;
    });
    e.target.parentNode.nextSibling.remove();
    e.target.parentNode.remove();
}  

function deleteButtonArticlesEvent(e) {
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.parentNode === elem) {
            data.blogEntriesArticleHeader.splice(count, 1);
            data.blogEntriesArticles.splice(count, 1);
        }
        ++count;
    });
    e.target.parentNode.nextSibling.remove();
    e.target.parentNode.remove();
}  

document.addEventListener("DOMContentLoaded", drawEvent);
