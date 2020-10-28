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
    drawBackButton: function(backup = false) {
        let backButton = document.createElement("button");
        backButton.innerHTML =  "go back";    
        backButton.setAttribute("class", "backButton");
        this.wrapper.appendChild(backButton);
        
        if (!backup) {
            backButton.addEventListener("click", backButtonEvent); 
        } else {
            backButton.addEventListener("click", backFromBackupEvent); 
        }
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
    drawEditDBidButton() {
        let editCom = document.createElement("button");
        editCom.innerHTML =  "edit DB id";    
        editCom.setAttribute("class", "editDBIdsButton");
        this.wrapper.appendChild(editCom);
        
        editCom.addEventListener("click", editDBidButtonEvent); 
    },
    drawBackupButton() {
        let backup = document.createElement("button");
        backup.innerHTML =  "backup";    
        backup.setAttribute("class", "backupButton");
        this.wrapper.appendChild(backup);
        
        backup.addEventListener("click", backupButtonEvent);
    },
    drawAll: function() {
        this.drawSaveButton();
        this.drawBackupButton();
        this.drawAddBlockEntry();

        let count = 0;
        data.blogEntries.forEach( elem => {
            this.drawEditArticles(elem);
            if (!data.headers[count]) {
                data.headers[count] = Array();
            }
            if (!data.articles[count]) {
                data.articles[count] = Array();
            }
            count++;
        });    
    },
    drawUponIndex: function(index) {
        this.drawBackButton();
        this.drawEditDBidButton();
        this.drawAddArticle(); 
        if (data.headers[index]) {
            data.headers[index].forEach( elem => {
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
        if (data.articles[data.currentBlogTarget]) {
                textArea.value = 
                    data.articles[data.currentBlogTarget][data.currentArticleTarget]; 
            if (data.articles[data.currentBlogTarget][data.currentArticleTarget] == 
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
    dbIds: Array(),
    headers: Array(), 
    articles: Array(),
    blogEntries: Array(),
    resetDB: function() {
        let xmlhttp0 = new XMLHttpRequest();
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
    resetSearchDB() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
            }
        });
        xmlhttp0.open('GET', "php/search.php?deleteData=true", true);
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
        xmlhttp.send("header=" + JSON.stringify(this.headers) + 
            "&article="  + JSON.stringify(this.articles) + 
                "&blog_entries=" + JSON.stringify(this.blogEntries) + 
                    "&db_ids=" + JSON.stringify(this.dbIds));
    },
    getData: function() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
                this.blogEntries = JSON.parse(responseText).blogEntries; 
                this.headers = JSON.parse(responseText).headers; 
                this.articles = JSON.parse(responseText).articles; 
                this.dbIds = JSON.parse(responseText).DBids; 
                draw.drawAll();
            }
        });
        xmlhttp0.open('GET', "edit.php?getData=true", true);
        xmlhttp0.send();  
    },
    setCommentTables(backup = false, allData) {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
                if (backup) {
                    insertBackupCom(allData);
                }
            }
        });
        xmlhttp0.open('GET', "php/comment.php?setTable=true&DB_ids=" 
            + JSON.stringify(this.dbIds), true);
        xmlhttp0.send(); 
    }
}

function drawEvent(e) {
    data.getData();
}

function drawEditArticlesEvent(e) {
    draw.drawEditArticles("", true, e.target); 

    let count = 0;
    let index = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.nextSibling === elem) {
            data.headers.splice(count, 0, Array());
            data.articles.splice(count, 0, Array());
            index = count;
        }
        ++count;
    });

    data.headers[index] = Array();
    data.articles[index] = Array();
}

function addArticleEvent(e) {
    draw.drawEditArticles("", true, e.target, true); 
    
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.nextSibling === elem) {
            data.headers[data.currentBlogTarget].splice(count, 0, Array());
            data.articles[data.currentBlogTarget].splice(count, 0, Array());
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
    data.setCommentTables();
    data.resetSearchDB();
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
    data.headers[data.currentBlogTarget] = Array();
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        data.headers[data.currentBlogTarget][count] = elem.childNodes[1].value;
        ++count;
    });
    draw.wrapper.innerHTML = "";
    draw.drawAll();
}


function editArticleEvent(e) {
    if (!data.headers[data.currentBlogTarget]) { 
        data.headers[data.currentBlogTarget] = Array();
    }
    let count = 0;
    let index = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        data.headers[data.currentBlogTarget][count] = elem.childNodes[1].value; 
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
    if (!data.articles[data.currentBlogTarget]) {
        data.articles[data.currentBlogTarget] = Array();
    }
    let articleElem = document.getElementById("article_textarea");
    data.articles[data.currentBlogTarget][data.currentArticleTarget] = 
        articleElem.value; 
 
    draw.wrapper.innerHTML = "";
    draw.drawUponIndex(data.currentBlogTarget);
}

function deleteButtonArticleEvent(e) {
    let count = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        if (e.target.parentNode === elem) {
            data.headers[data.currentBlogTarget].splice(count, 1);
            data.articles[data.currentBlogTarget].splice(count, 1);
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
            data.headers.splice(count, 1);
            data.articles.splice(count, 1);
        }
        ++count;
    });
    e.target.parentNode.nextSibling.remove();
    e.target.parentNode.remove();
}  

function editDBidButtonEvent(e) {
    let editButtons = document.querySelectorAll(".editButton");    
    let editButtons1 = document.querySelectorAll(".editCom");    
    if (editButtons.length > 0) {
        editButtons.forEach( elem => {
            let editCom = document.createElement("button");
            editCom.innerHTML =  "edit id";    
            editCom.setAttribute("class", "editCom");
            
            editCom.addEventListener("click", editDBidEvent); 
            elem.parentNode.replaceChild(editCom, elem);
        });
    } else if (editButtons1.length > 0) {
        editButtons1.forEach( elem => {
            let editButton = document.createElement("button");
            editButton.innerHTML =  "edit article";    
            editButton.setAttribute("class", "editButton");

            editButton.addEventListener("click", editArticleEvent);
            elem.parentNode.replaceChild(editButton, elem);
        });
 
    }
}

function editDBidEvent(e) {
    if (!data.headers[data.currentBlogTarget]) { 
        data.headers[data.currentBlogTarget] = Array();
    }

    let count = 0;
    let index = 0;
    let articlesElem = document.querySelectorAll('.edit_article');
    articlesElem.forEach( (elem) => {
        data.headers[data.currentBlogTarget][count] = elem.childNodes[1].value; 
        if (e.target.parentNode === elem) {
            index = count;
        }
        ++count;
    });
 
    data.currentArticleTarget = index;
    draw.wrapper.innerHTML = "";

    let backButton = document.createElement("button");
    backButton.innerHTML =  "go back";    
    backButton.setAttribute("class", "backButton");
    draw.wrapper.appendChild(backButton);
    
    backButton.addEventListener("click", backButtonDBidEvent); 
 
    let label = document.createElement("label");
    label.setAttribute("for", "DBId");
    label.innerHTML = "DB id:";
    draw.wrapper.appendChild(label);  

    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("id", "DBId");
    input.setAttribute("name", "DBId");
    if (data.dbIds[data.currentBlogTarget]) {
            input.value = 
                data.dbIds[data.currentBlogTarget][data.currentArticleTarget]; 
        if (data.dbIds[data.currentBlogTarget][data.currentArticleTarget] == 
                undefined) { 
            input.value = ""; 
        }
    }
 
    draw.wrapper.appendChild(input); 
}

function backButtonDBidEvent(e) {
    if (!data.dbIds[data.currentBlogTarget]) {
        data.dbIds[data.currentBlogTarget] = Array();
    }
    let dbElem = document.getElementById("DBId");
    data.dbIds[data.currentBlogTarget][data.currentArticleTarget] = 
        dbElem.value; 

    draw.wrapper.innerHTML = "";
    draw.drawUponIndex(data.currentBlogTarget);
    editDBidButtonEvent();
}

function backupButtonEvent(e) {
    e.preventDefault();
    draw.wrapper.textContent = "";
    draw.drawBackButton(true);
   
    let getBackup = document.createElement("button");
    getBackup.innerHTML =  "get backup";    
    getBackup.setAttribute("class", "getBackupButton");
    draw.wrapper.appendChild(getBackup);

    getBackup.addEventListener("click", getBackupEvent);

    let setBackup = document.createElement("button");
    setBackup.innerHTML =  "set backup";    
    setBackup.setAttribute("class", "setBackupButton");
    draw.wrapper.appendChild(setBackup);

    setBackup.addEventListener("click", setBackupEvent);

    let textArea = document.createElement("textarea");
    textArea.value = "";
    textArea.setAttribute("id", "backup_textarea");

    draw.wrapper.appendChild(textArea); 
 
}

function backFromBackupEvent(e) {
    e.preventDefault();
    draw.wrapper.textContent = "";
    draw.drawAll();
}

function getBackupEvent(e) {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                let allData = new Object();
                allData.site = new Object();
                allData.site.blogEntries = JSON.parse(responseText).blogEntries; 
                allData.site.headers = JSON.parse(responseText).headers; 
                allData.site.articles = JSON.parse(responseText).articles; 
                allData.site.dbIds = JSON.parse(responseText).DBids; 
                getAllComments(allData); 
            }
        });
        xmlhttp0.open('GET', "edit.php?getData=true", true);
        xmlhttp0.send();  
}

function getAllComments(allData) {
    allData.comment = Array();
    let count = 0;
    allData.site.dbIds.forEach( elem => {
        elem.forEach( elem1 => {
            let xmlhttp0 = new XMLHttpRequest(); 
            xmlhttp0.addEventListener('readystatechange', (e) => {
                if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                    let responseText = xmlhttp0.responseText;
                    console.log(responseText);
                    let result = JSON.parse(responseText);
                    allData.comment[result.count] = result.com;
                    let textArea = document.
                        getElementById("backup_textarea");
                    textArea.value = JSON.stringify(allData);
                }
            });
            xmlhttp0.open('GET', "php/comment.php?getData_index=true" +
                "&dbIndex=" + elem1 + "&index=" + count, true);
            xmlhttp0.send();  
            count++;
        });
    }); 
}
document.addEventListener("DOMContentLoaded", drawEvent);

function setBackupEvent(e) {
    let textArea = document.
        getElementById("backup_textarea");
    let allData = JSON.parse(textArea.value);
 
    data.blogEntries = allData.site.blogEntries; 
    data.headers = allData.site.headers; 
    data.articles = allData.site.articles; 
    data.dbIds = allData.site.dbIds; 

    let xmlhttp0 = new XMLHttpRequest(); 
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            let responseText = xmlhttp0.responseText;
            console.log(responseText);
            data.setCommentTables(true, allData);
        }
    });
    xmlhttp0.open('GET', "php/comment.php?deleteAll=true", true);
    xmlhttp0.send();  
} 

function insertBackupCom(allData) {
    let count = 0;
    let count1 = 0;
    console.log(allData.comment);
    allData.comment.forEach( elem => {
        elem.forEach( elem1 => {
            let replyIndex = elem1[3];
            let name = elem1[1];
            let date = elem1[2];
            let text = elem1[0];
            let dbIndex = elem1[4];
            var xmlhttp0 = new XMLHttpRequest();
            xmlhttp0.addEventListener('readystatechange', (e) => {
                if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                    var responseText = xmlhttp0.responseText;
                    console.log(responseText);
                }
            });
            xmlhttp0.open('POST', "php/comment.php", true);
            xmlhttp0.setRequestHeader("Content-type", 
                "application/x-www-form-urlencoded");
            xmlhttp0.send("name=" + name + "&date=" + date + "&comment=" + text + 
                "&replyIndex=" + JSON.stringify(replyIndex) +
                    "&dbIndex=" + dbIndex);
        });
    }); 
}
