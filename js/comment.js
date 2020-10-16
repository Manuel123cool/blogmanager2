"use strict";

let drawCom = {
    wrapper: document.getElementById("comment_wrapper"),
    drawComment: function() {
        let article = document.createElement('article');        

        let comment_data = document.createElement("div");
        comment_data.setAttribute("class", "comment_data");
        article.appendChild(comment_data);

        let name = document.createElement("span");
        name.innerHTML = document.getElementById("name").value;
        name.setAttribute("class", "name_span");
        comment_data.appendChild(name);

        let date = document.createElement("span");
        let dateObj = new Date();
        let dateString = dateObj.toDateString(); 
        date.innerHTML = dateString;
        date.setAttribute("class", "date_span");
        comment_data.appendChild(date);
        
        let reply = document.createElement("button");
        reply.setAttribute("class", "reply_button");
        reply.innerHTML = "reply";
        comment_data.appendChild(reply);
       
        reply.addEventListener("click", replyEvent);
        article.appendChild(comment_data);

        let p = document.createElement("span");
        p.setAttribute("class", "text_span");
        p.innerHTML = document.getElementById("comment").value;
        article.appendChild(p);

        drawCom.wrapper.appendChild(article);
        
        if (!dataCom.replyOn) {
            dataCom.sendData(name.innerHTML, date.innerHTML, p.innerHTML, -1, -1); 
        }
    },
    drawReply: function(referenceNode, name, comment, date) {
        let article = document.createElement('article');        
        article.setAttribute("class", "deph1");

        let comment_data = document.createElement("div");
        comment_data.setAttribute("class", "comment_data");
        article.appendChild(comment_data);

        let nameElem = document.createElement("span");
        nameElem.innerHTML = name;
        nameElem.setAttribute("class", "name_span");
        comment_data.appendChild(nameElem);

        let dateElem = document.createElement("span");
        dateElem.innerHTML = date;
        dateElem.setAttribute("class", "date_span");
        comment_data.appendChild(dateElem);
        
        let reply = document.createElement("button");
        reply.setAttribute("class", "reply_button");
        reply.innerHTML = "reply";
        comment_data.appendChild(reply);
       
        reply.addEventListener("click", replyEvent);
        article.appendChild(comment_data);

        let p = document.createElement("span");
        p.setAttribute("class", "text_span");
        p.innerHTML = comment;
        article.appendChild(p);
            
        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        insertAfter(article, referenceNode);
    },
    deleteReply: function(referenceNode) {
        referenceNode.nextSibling.remove(); 
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
            comment_data.setAttribute("class", "comment_data");
            article.appendChild(comment_data);

            let name = document.createElement("span");
            name.innerHTML = elem[1];
            name.setAttribute("class", "name_span");
            comment_data.appendChild(name);

            let date = document.createElement("span");
            date.innerHTML = elem[2];
            date.setAttribute("class", "date_span");
            comment_data.appendChild(date);
            
            let reply = document.createElement("button");
            reply.setAttribute("class", "reply_button");
            reply.innerHTML = "reply";
            comment_data.appendChild(reply);

            let drawOnce = true;
            array.forEach( (elem1) => {
                if (elem1[3] == count && drawOnce) { 
                    drawOnce = false;
                    let showReply = document.createElement("button");
                    showReply.setAttribute("class", "show_reply");
                    showReply.innerHTML = "show reply";
                    comment_data.appendChild(showReply);
                    
                    showReply.addEventListener("click", showReplyEvent);
                }
            });

            reply.addEventListener("click", replyEvent);
            article.appendChild(comment_data);

            let p = document.createElement("span");
            p.setAttribute("class", "text_span");
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

class ReplyIsOn {
    constructor(isOn, index) {
        this.isOn = isOn;
        this.index = index;
    }
}
let dataCom = {
    array: Array(),
    showReplyIsOn: Array(),
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
            
        let myDraw = true;
        dataCom.array.forEach( elem => {
            if (elem[3] == dataCom.replyIndex1) {
                myDraw = false;
            }
        }); 
        if (myDraw) {
            let showReply = document.createElement("button");
            showReply.setAttribute("class", "show_reply");
            showReply.innerHTML = "show reply";
            drawCom.wrapper.childNodes[dataCom.replyIndex1].
                childNodes[0].appendChild(showReply);
            showReply.addEventListener("click", showReplyEvent);
        }
 
        let array = Array(); 
        array[0] = comment;
        array[1] = name;
        array[2] = dateString;
        array[3] = dataCom.replyIndex1;
        array[4] = -1;
        dataCom.array.push(array);

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
    let count2 = 0;
    let index = 0;
    let indexForChecking = 0;
    childNodes.forEach( (elem) => {
        if (elem == e.currentTarget.parentNode.parentNode) {
            index = count; 
            indexForChecking = count2; 
        }
        if (window.getComputedStyle(elem).getPropertyValue("margin-left") != "20px") {
            count2++; 
        }
        count++;
    });
    let deleteReply = false;
    
    let showReplyIsOnIsOn = false;
    let showReplyIsOnElem = false;
    dataCom.showReplyIsOn.forEach( elem => {
        if (elem.index == indexForChecking && elem.isOn) {
            deleteReply = true;
            elem.isOn = false; 
        } else if (elem.index == indexForChecking && !elem.isOn) {
            showReplyIsOnIsOn = true;
            showReplyIsOnElem = elem;
        } 
    });
    if (!deleteReply) {
        if (showReplyIsOnIsOn) {
            showReplyIsOnElem.isOn = true;
        } else {
            dataCom.showReplyIsOn.push(new ReplyIsOn(true, indexForChecking)); 
        }
    }
    let firstReply = true;
    let count1 = 0;
    dataCom.array.forEach( (elem) => {
        if (elem[3] == indexForChecking) {
            if (deleteReply) {
                drawCom.deleteReply(childNodes[index]); 
            } else {
                if (firstReply) {
                    drawCom.drawReply(childNodes[index], elem[1], elem[0], elem[2]);
                    firstReply = false;
                } else {
                    drawCom.drawReply(childNodes[index + count1], elem[1], elem[0], elem[2]);
                }
            }
            count1++;
        }
    });  
}
