"use strict";

let drawCom = {
    wrapper: document.getElementById("comment_wrapper"),
    drawComment: function() {
        let article = document.createElement('article');        

        let comment_data = document.createElement("div");
        comment_data.setAttribute("id", "comment_data");
        article.appendChild(comment_data);

        let name = document.createElement("span");
        name.innerHTML = document.getElementById("name").value;
        name.setAttribute("id", "name_span");
        comment_data.appendChild(name);

        let date = document.createElement("span");
        let dateObj = new Date();
        let dateString = dateObj.toDateString(); 
        date.innerHTML = dateString;
        date.setAttribute("id", "date_span");
        comment_data.appendChild(date);
        
        let reply = document.createElement("button");
        reply.setAttribute("id", "reply_button");
        reply.innerHTML = "reply";
        comment_data.appendChild(reply);
       
        reply.addEventListener("click", replyEvent);
        article.appendChild(comment_data);

        let p = document.createElement("span");
        p.setAttribute("id", "text_span");
        p.innerHTML = document.getElementById("comment").value;
        article.appendChild(p);

        drawCom.wrapper.appendChild(article);
        
        if (!dataCom.replyOn) {
            dataCom.sendData(name.innerHTML, date.innerHTML, p.innerHTML, -1, -1); 
        }
    },
    drawReply: function(referenceNode, name, comment, date) {
        let article = document.createElement('article');        

        let comment_data = document.createElement("div");
        comment_data.setAttribute("id", "comment_data");
        article.appendChild(comment_data);

        let nameElem = document.createElement("span");
        nameElem.innerHTML = name;
        nameElem.setAttribute("id", "name_span");
        comment_data.appendChild(nameElem);

        let dateElem = document.createElement("span");
        dateElem.innerHTML = date;
        dateElem.setAttribute("id", "date_span");
        comment_data.appendChild(dateElem);
        
        let reply = document.createElement("button");
        reply.setAttribute("id", "reply_button");
        reply.innerHTML = "reply";
        comment_data.appendChild(reply);
       
        reply.addEventListener("click", replyEvent);
        article.appendChild(comment_data);

        let p = document.createElement("span");
        p.setAttribute("id", "text_span");
        p.innerHTML = comment;
        article.appendChild(p);
            
        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        insertAfter(article, referenceNode);
    },
    drawComments: function(array) {
        //console.log(array);
        let count = 0;
        array.forEach( (elem) => {
            if (elem[3] != -1) {
                return;
            }
            let article = document.createElement('article');        

            let comment_data = document.createElement("div");
            comment_data.setAttribute("id", "comment_data");
            article.appendChild(comment_data);

            let name = document.createElement("span");
            name.innerHTML = elem[1];
            name.setAttribute("id", "name_span");
            comment_data.appendChild(name);

            let date = document.createElement("span");
            date.innerHTML = elem[2];
            date.setAttribute("id", "date_span");
            comment_data.appendChild(date);
            
            let reply = document.createElement("button");
            reply.setAttribute("id", "reply_button");
            reply.innerHTML = "reply";
            comment_data.appendChild(reply);

            array.forEach( (elem1) => {
                if (elem1[3] == count) { 
                    let showReply = document.createElement("button");
                    showReply.setAttribute("id", "show_reply");
                    showReply.innerHTML = "show reply";
                    comment_data.appendChild(showReply);
                    
                    showReply.addEventListener("click", showReplyEvent);
                }
            });

            reply.addEventListener("click", replyEvent);
            article.appendChild(comment_data);

            let p = document.createElement("span");
            p.setAttribute("id", "text_span");
            p.innerHTML = elem[0];
            article.appendChild(p);

            drawCom.wrapper.appendChild(article);
            count++;
        });
    },
    draw: function(index1, index2) {
        dataCom.siteIndex1 = index1;
        dataCom.siteIndex2 = index2;
        
        dataCom.getData();
        let submit = document.getElementById("submit");
        submit.addEventListener("click", drawCommentEvent);
    }
}

let dataCom = {
    array: Array(),
    replyOn: false,
    replyIndex1: -1,
    replyIndex2: -1,
    siteIndex1: -1,
    siteIndex2: -1,
    sendData: function(name, date, text, replyIndex1, replyIndex2) {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                //console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/comment.php", true);
        xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp0.send("name=" + name + "&date=" + date + "&comment=" + text + 
            "&replyIndex1=" + replyIndex1 + "&replyIndex2=" + replyIndex2 +
                "&siteIndex1=" + this.siteIndex1 + "&siteIndex2=" + this.siteIndex2);
    },
    getData: function() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                //console.log(responseText);
                let result = JSON.parse(responseText);
                this.array = result;
                drawCom.drawComments(result);
            }
        });
        xmlhttp0.open('GET', "php/comment.php?getData=true&siteIndex1=" + this.siteIndex1 +
                        "&siteIndex2=" + this.siteIndex2, true);
        xmlhttp0.send();  
 
    }
}

function drawCommentEvent(e) {
    e.preventDefault();
    if (!dataCom.replyOn) {
        drawCom.drawComment(); 
    } else {
        let comment = document.getElementById("comment").value;
        let name = document.getElementById("name").value;
    
        let dateObj = new Date();
        let dateString = dateObj.toDateString(); 
        
        dataCom.sendData(name, dateString, comment, dataCom.replyIndex1, -1);
    }
}
    
function replyEvent(e) {
    e.preventDefault();
      
    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "cancel reply";        
    replyCancel.addEventListener("click", cancelReplyEvent);
    
    let childNodes = drawCom.wrapper.childNodes;
    let count = 0;
    childNodes.forEach( (elem) => {
        if (elem == e.currentTarget.parentNode.parentNode) {
            dataCom.replyIndex1 = count;
        }
        count++;
    });
    dataCom.replyOn = true;
}

function cancelReplyEvent(e) {
    e.preventDefault();

    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "";        

    dataCom.replyOn = false;
}

function showReplyEvent(e) {
    let childNodes = drawCom.wrapper.childNodes;
    let count = 0;
    let index = 0;
    let indexForChecking = 0;
    childNodes.forEach( (elem) => {
        if (elem == e.currentTarget.parentNode.parentNode) {
            index = count; 
        }
        if (document.querySelector(
        count++;
    });
    let firstReply = true;
    let count1 = 0;
    dataCom.array.forEach( (elem) => {
        if (elem[3] == index) {
            if (firstReply) {
                drawCom.drawReply(childNodes[index], elem[1], elem[0], elem[2]);
                firstReply = false;
            } else {
                drawCom.drawReply(childNodes[index + count1], elem[1], elem[0], elem[2]);
            }
            count1++;
        }
    });  
}
