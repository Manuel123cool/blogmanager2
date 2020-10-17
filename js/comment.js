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
        
        dataCom.sendData(name.innerHTML, date.innerHTML, p.innerHTML); 
    },
    drawReply: function(referenceNode, name, comment, date, margin, array, whichOne) {
        let article = document.createElement('article');        
        
        article.setAttribute("style", "margin-left: " + (20 * margin) + "px;");

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

        let drawOnce = true;
        let newArray = array;
        newArray.push(whichOne);
        dataCom.array.forEach( (elem) => {
            let staysEqual = true;
            let until = newArray.length;
            if (elem[3].length > until) {
                until = elem[3].length 
            } 
            for (let i = 0; i < until; ++i) {
                if (elem[3][i] != newArray[i]) {
                    staysEqual = false;
                } 
            }

            if (staysEqual && drawOnce) { 
                drawOnce = false;
                let showReply = document.createElement("button");
                showReply.setAttribute("class", "show_reply");
                showReply.innerHTML = "show reply";
                comment_data.appendChild(showReply);
                
                showReply.addEventListener("click", showReplyEvent);
            }
        });

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
            if (elem[3][0] != "noReplyIndex") {
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
    replyIndex: Array(), 
    siteIndex1: -1,
    siteIndex2: -1,
    sendData: function(name, date, text) {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                //console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/comment.php", true);
        xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        let replyIndex = ['noReplyIndex'];
        if (this.replyIndex.length > 0) {
            replyIndex = this.replyIndex;
        }
        xmlhttp0.send("name=" + name + "&date=" + date + "&comment=" + text + 
            "&replyIndex=" + JSON.stringify(replyIndex) +
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
            if (dataCom.replyIndex[0] == elem[3][0]) {
                myDraw = false;
            }
        }); 
        if (myDraw) {
            let showReply = document.createElement("button");
            showReply.setAttribute("class", "show_reply");
            showReply.innerHTML = "show reply";
            drawCom.wrapper.childNodes[dataCom.replyIndex[0]].
                childNodes[0].appendChild(showReply);
            showReply.addEventListener("click", showReplyEvent);
        }
 
        let array = Array(); 
        array[0] = comment;
        array[1] = name;
        array[2] = dateString;
        array[3] = dataCom.replyIndex;
        dataCom.array.push(array);

        dataCom.sendData(name, dateString, comment);
    }
} 

function replyEvent(e) {
    e.preventDefault();
      
    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "cancel reply";        
    replyCancel.addEventListener("click", cancelReplyEvent);
    
    dataCom.replyIndex = Array();
    let elemNot0px = true;
    let count1 = 0;
    let nextNode = e.currentTarget.parentNode.parentNode;
    let marginChanged = false;
    let previousMargin = nextNode.style.marginLeft;
    while (elemNot0px) {
        previousMargin = nextNode.style.marginLeft;
        if (nextNode.style.marginLeft == "") {
            let count = 0;
            drawCom.wrapper.childNodes.forEach( elem => {
                if (elem == nextNode) {
                    dataCom.replyIndex.push(count);
                    elemNot0px = false;
                }
                if (elem.style.marginLeft == "") {
                    count++;
                }
            }); 
        } 
        if (!elemNot0px) {
            break;
        }
        nextNode = nextNode.previousSibling;
        if (nextNode.style.marginLeft != previousMargin) {
            dataCom.replyIndex.push(count1);
            count1 = 0;
        }
        else {
            count1++;
        } 
    }
    dataCom.replyIndex.reverse();
    console.log(dataCom.replyIndex);
    dataCom.replyOn = true;
}
function cancelReplyEvent(e) { 
    e.preventDefault();

    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "";        

    dataCom.replyOn = false;
    dataCom.replyIndex[0] = "noReplyIndex";
}

function showReplyEvent(e) {
    let array = Array();
    let elemNot0px = true;
    let count1 = 0;
    let nextNode = e.currentTarget.parentNode.parentNode;
    let marginChanged = false;
    let previousMargin = nextNode.style.marginLeft;
    while (elemNot0px) {
        previousMargin = nextNode.style.marginLeft;
        if (nextNode.style.marginLeft == "") {
            let count = 0;
            drawCom.wrapper.childNodes.forEach( elem => {
                if (elem == nextNode) {
                    array.push(count);
                    elemNot0px = false;
                }
                if (elem.style.marginLeft == "") {
                    count++;
                }
            }); 
        } 
        if (!elemNot0px) {
            break;
        }
        nextNode = nextNode.previousSibling;
        if (nextNode.style.marginLeft != previousMargin) {
            array.push(count1);
            count1 = 0;
        }
        else { 
            count1++;
        }
    }

    let currentNode = e.currentTarget.parentNode.parentNode;
    let myDelete = false;
    if (currentNode.nextSibling) {
        let firstNum = currentNode.style.marginLeft.substring(0, 
               currentNode.style.marginLeft.length - 2);
 
        let secondNum = currentNode.nextSibling.style.marginLeft.substring(0, 
               currentNode.nextSibling.style.marginLeft.length - 2);
        
        if (firstNum < secondNum) {
            myDelete = true;
        }
    }

    array.reverse();
    console.log(array);
    
    let count2 = 0;
    let count3 = 0;

    //get index
    let count = 0;
    let indexReference = 0;
    let length = array.length;
    drawCom.wrapper.childNodes.forEach( elem => {
        if (elem == currentNode) {
            indexReference = count;
        }
        count++;
    }); 
     
    dataCom.array.forEach( (elem) => {
        let staysEqual = true;
        let until = length;
        if (elem[3].length != length) {
            staysEqual = false;
        } 
        for (let i = 0; i < until; ++i) {
            if (elem[3][i] != array[i]) {
                staysEqual = false;
            } 
        }
        if (staysEqual && myDelete) {
            drawCom.deleteReply(drawCom.wrapper.childNodes[indexReference]);
        } else if (staysEqual) {
            drawCom.drawReply(drawCom.wrapper.childNodes[indexReference], elem[1], 
                    elem[0], elem[2], length, array, count2);
            count2++;
        } 
    });
    let untilMarginSmaller = true;
    let node = e.currentTarget.parentNode.parentNode;
    let startNum = node.style.marginLeft.substring(0, 
       node.style.marginLeft.length - 2);

    let wasDel = false;
    while (untilMarginSmaller && myDelete) {
        if (node.nextSibling) {
            if (!wasDel) {
                node = node.nextSibling;
            }
            let firstNum = node.style.marginLeft.substring(0, 
               node.style.marginLeft.length - 2);
            if (Number(firstNum) > Number(startNum)) {
                wasDel = true;
                let tmpNode = node;
                if (node.nextSibling) {
                    node = node.nextSibling;
                }
                tmpNode.remove();
            } else {
                untilMarginSmaller = false;
            }
        } else {
            let firstNum = node.style.marginLeft.substring(0, 
               node.style.marginLeft.length - 2);
            if (Number(firstNum) > Number(startNum)) {
                node.remove(); 
            }
            untilMarginSmaller = false;
        }
    }
}
