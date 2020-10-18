"use strict";

let drawCom = {
    wrapper: document.getElementById("comment_wrapper"),
    createCommentData(article) {
        let comment_data = document.createElement("div");
        comment_data.setAttribute("class", "comment_data");
        article.appendChild(comment_data);
        return comment_data;
    },
    createName(commentData, nameTxt) {
        let name = document.createElement("span");
        name.innerHTML = nameTxt; 
        name.setAttribute("class", "name_span");
        commentData.appendChild(name);
    },
    createDate(commentData, dateTxt = "default") {
        let date = document.createElement("span");
        let dateObj = new Date();
        let dateString = dateObj.toDateString(); 
        if (dateTxt != "default") {
            dateString = dateTxt;
        }
        date.innerHTML = dateString;
        date.setAttribute("class", "date_span");
        commentData.appendChild(date);
    },
    createReply(commentData) {
        let reply = document.createElement("button");
        reply.setAttribute("class", "reply_button");
        reply.innerHTML = "reply";
        commentData.appendChild(reply);

        reply.addEventListener("click", replyEvent);
    },
    createText(article, commentTxt) {
        let p = document.createElement("span");
        p.setAttribute("class", "text_span");
        p.innerHTML = commentTxt; 
        article.appendChild(p);
    },
    drawComment: function() {
        let article = document.createElement('article');        

        let commentData = this.createCommentData(article);
        this.createName(commentData, document.getElementById("name").value);
        this.createDate(commentData);
        this.createReply(commentData);

        article.appendChild(commentData);

        this.createText(article, document.getElementById("comment").value);

        drawCom.wrapper.appendChild(article);
        
        dataCom.sendData(article.childNodes[0].childNodes[0].innerHTML, 
            article.childNodes[0].childNodes[1].innerHTML, article.
                childNodes[1].innerHTML); 
    },
    drawReply: function(referenceNode, name, comment, date, margin, array, whichOne) {
        let article = document.createElement('article');        
        
        article.setAttribute("style", "margin-left: " + (20 * margin) + "px;");

        let commentData = this.createCommentData(article);
        this.createName(commentData, name);
        this.createDate(commentData, date);
        this.createReply(commentData);

        article.appendChild(commentData);

        let drawOnce = true;

        let newArray = Array(); 
        let count6 = 0;
        array.forEach( elem => {
            newArray[count6] = elem; 
            count6++;
        });

        newArray.push(whichOne);
        dataCom.array.forEach( (elem) => {
            if (dataCom.compareArray(elem[3], newArray) && drawOnce) { 
                drawOnce = false;
                let showReply = document.createElement("button");
                showReply.setAttribute("class", "show_reply");
                showReply.innerHTML = "show reply";
                commentData.appendChild(showReply);
                
                showReply.addEventListener("click", showReplyEvent);
            }
        });
        
        this.createText(article, comment);

        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
        insertAfter(article, referenceNode);
    },
    deleteReply: function(referenceNode) {
        referenceNode.nextSibling.remove(); 
    },
    drawComments: function(array) {
        let count = 0;
        array.forEach( (elem) => {
            if (elem[3][0] != "noReplyIndex") {
                return;
            }
            let article = document.createElement('article');        

            let commentData = this.createCommentData(article);
            this.createName(commentData, elem[1]);
            this.createDate(commentData, elem[2]);
            this.createReply(commentData);

            let drawOnce = true;
            array.forEach( (elem1) => {
                if (elem1[3][0] == count && drawOnce) { 
                    drawOnce = false;
                    let showReply = document.createElement("button");
                    showReply.setAttribute("class", "show_reply");
                    showReply.innerHTML = "show reply";
                    commentData.appendChild(showReply);
                    
                    showReply.addEventListener("click", showReplyEvent);
                }
            });

            article.appendChild(commentData);

            this.createText(article, elem[0]);

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
    replyIndex: Array(), 
    replyElem: null,
    siteIndex1: -1,
    siteIndex2: -1,
    sendData(name, date, text) {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                //console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/comment.php", true);
        xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        let replyIndex = this.replyIndex;
        xmlhttp0.send("name=" + name + "&date=" + date + "&comment=" + text + 
            "&replyIndex=" + JSON.stringify(replyIndex) +
                "&siteIndex1=" + this.siteIndex1 + "&siteIndex2=" + this.siteIndex2);
    },
    getData() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                //console.log(responseText);
                let result = JSON.parse(responseText);
                this.array = result;
                this.replyIndex[0] = "noReplyIndex";
                drawCom.drawComments(result);
            }
        });
        xmlhttp0.open('GET', "php/comment.php?getData=true&siteIndex1=" + this.siteIndex1 +
                        "&siteIndex2=" + this.siteIndex2, true);
        xmlhttp0.send();  
    },
    compareArray(array1, array2) {
        let until = array1.length;
        if (array2.length != array1.length) {
            return false;
        } 
        for (let i = 0; i < until; ++i) {
            if (array1[i] != array2[i]) {
                return false;
            } 
        }
        return true;
    },
    findCurrentPos(arrayForPush, currentTarget) {
        arrayForPush.splice(0, arrayForPush.length);
        let elemNot0px = true;
        let count1 = 0;
        let nextNode = currentTarget.parentNode.parentNode;

        dataCom.replyElem = nextNode;

        let marginChanged = false;
        let previousMargin = nextNode.style.marginLeft;
        while (elemNot0px) {
            previousMargin = nextNode.style.marginLeft;
            if (nextNode.style.marginLeft == "") {
                let count = 0;
                drawCom.wrapper.childNodes.forEach( elem => {
                    if (elem == nextNode) {
                        arrayForPush.push(count);
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
                arrayForPush.push(count1);
                count1 = 0;
            }
            else {
                count1++;
            } 
        }
        arrayForPush.reverse();
    },
    reReferenceNode(indexArray) {
        let object = {
            count: null,
            node: null
        };
        let previousElem = dataCom.replyElem;
        let currentElem = dataCom.replyElem.nextSibling;
        if (currentElem == null) {
            object.count = 0;
            object.node = previousElem; 
            return object;
        }
        let firstIsDifferent = false;

        let firstNum = currentElem.style.marginLeft.substring(0, 
            currentElem.style.marginLeft.length - 2);
    
        let secondNum = previousElem.style.marginLeft.substring(0, 
            previousElem.style.marginLeft.length - 2);

        if (Number(firstNum) > secondNum) {
            firstIsDifferent = true; 
        } else {
            object.count = 0;
            object.node = dataCom.replyElem; 
            return object;
        }
        
        let sameMargin = true;
        previousElem = currentElem;
        if (!previousElem.nextSibling) {
            object.count = 0;
            object.node = currentElem; 
            return object;
        } 
        currentElem = previousElem.nextSibling 
        let count = 1;
        while (sameMargin && firstIsDifferent) {
            if (currentElem.style.marginLeft != previousElem.style.marginLeft) {    
                object.count = count;
                object.node = previousElem; 
                return object; 
            }
            if (!currentElem.nextSibling) {
                object.count = count;
                object.node = currentElem; 
                return object; 
            }
            previousElem = currentElem;
            currentElem = currentElem.nextSibling;
            count++;
        }     
    }
}

function drawCommentEvent(e) {
    e.preventDefault();
    let comment = document.getElementById("comment").value;
    let name = document.getElementById("name").value;

    let dateObj = new Date();
    let dateString = dateObj.toDateString(); 
 
    let array = Array(); 
    array[0] = comment;
    array[1] = name;
    array[2] = dateString;
    array[3] = Array();
    
    let count6 = 0;
    dataCom.replyIndex.forEach( elem => {
        array[3][count6] = elem;
        count6++;
    });
    dataCom.array.push(array);

    
    if (!dataCom.replyOn) {
        drawCom.drawComment(); 
    } else {
        let currentNode = dataCom.reReferenceNode(dataCom.replyIndex).node;
        let count = dataCom.reReferenceNode(dataCom.replyIndex).count;
        if (currentNode != dataCom.replyElem) {
            drawCom.drawReply(currentNode, name, 
                    comment, dateString, dataCom.replyIndex.length, 
                        dataCom.replyIndex, count + 1);
        }

        let watchDouble = false;
        let checkShowReply = false;
        let count4 = 0;
        dataCom.array.forEach( elem => {
            if (dataCom.compareArray(elem[3], dataCom.replyIndex)) {
                if (count4 == 1) {
                    watchDouble = true;
                }
                checkShowReply = true;
                count4++; 
            }
        }); 

        if (checkShowReply && !watchDouble) {
            let showReply = document.createElement("button");
            showReply.setAttribute("class", "show_reply");
            showReply.innerHTML = "show reply";
            dataCom.replyElem.childNodes[0].appendChild(showReply);
            showReply.addEventListener("click", showReplyEvent)
        }

        dataCom.sendData(name, dateString, comment);
    }
} 

function replyEvent(e) {
    e.preventDefault();
      
    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "cancel reply";        
    replyCancel.addEventListener("click", cancelReplyEvent);
    
    dataCom.findCurrentPos(dataCom.replyIndex, e.currentTarget);
    dataCom.replyOn = true;
}

function cancelReplyEvent(e) { 
    e.preventDefault();

    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "";        

    dataCom.replyOn = false;
    dataCom.replyIndex[0] = "noReplyIndex";
    dataCom.replyElem = null;
}

function showReplyEvent(e) {
    let array = Array();
    dataCom.findCurrentPos(array, e.currentTarget);

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
     
    let count2 = 0;
    dataCom.array.forEach( (elem) => {
        if (dataCom.compareArray(elem[3], array)) {
            drawCom.drawReply(drawCom.wrapper.childNodes[indexReference], elem[1], 
                    elem[0], elem[2], length, array, count2);
            count2++;
            indexReference++;
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
