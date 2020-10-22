"use strict";

let drawCom = {
    marginFactor: 20,
    siteLength: 3,
    currentSite: null,
    wrapper: document.getElementById("comment_wrapper"),
    indexWrapper: document.getElementById("index_wrapper"),
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
    createDelete(commentData) {
        if (dataCom.admin) {
            let deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "delete_button");
            deleteButton.innerHTML = "delete";
            commentData.appendChild(deleteButton);

            deleteButton.addEventListener("click", deleteEvent);
        }
    },
    createText(article, commentTxt) {
        let p = document.createElement("span");
        p.setAttribute("class", "text_span");
        let untilLength = 10;
        if (commentTxt.length > untilLength) {
            let firstText = commentTxt.slice(0, untilLength);
            let secondText = commentTxt.slice(untilLength, commentTxt.length);
            let firstTxtElem = document.createElement("span"); 
            let secondTxtElem = document.createElement("span"); 

            secondTxtElem.style.display = "none";

            secondTxtElem.innerHTML = secondText;
            firstTxtElem.innerHTML = firstText;
        
            let readMore = document.createElement("button");
            readMore.setAttribute("class", "read_more_button");
            readMore.addEventListener("click", readMoreEvent);
            readMore.innerHTML = "read more"
        
            p.appendChild(firstTxtElem);
            p.appendChild(secondTxtElem);
            p.appendChild(readMore);
        } else {
            p.innerHTML = commentTxt;
        }
        article.appendChild(p);
    },
    drawReply: function(referenceNode, name, comment, date, margin, array, whichOne) {
        let article = document.createElement('article');        
        
        article.setAttribute("style", "margin-left: " + 
            (this.marginFactor * margin) + "px;");

        let commentData = this.createCommentData(article);
        this.createName(commentData, name);
        this.createDate(commentData, date);
        this.createReply(commentData);
        this.createDelete(commentData);

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
    drawComments: function(array, fromZeroTo, from = 10000, to = -1) {
        let count = this.currentSite * this.siteLength;
        let noRepliesCount = 0;
        array.forEach( (elem) => {
            if (elem[3][0] != "noReplyIndex") {
                return;
            } else {
                noRepliesCount++;
            }
            if (noRepliesCount <= fromZeroTo || noRepliesCount >= from && 
                    noRepliesCount <= to) {
                return;
            }
            let article = document.createElement('article');        

            let commentData = this.createCommentData(article);
            this.createName(commentData, elem[1]);
            this.createDate(commentData, elem[2]);
            this.createReply(commentData);
            this.createDelete(commentData);

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
    drawIndexes(numberOfPages) {
        for (let i = 0; i < numberOfPages; ++i) {
            let indexLink = document.createElement('a');
            indexLink.innerHTML = i + 1;     
            indexLink.setAttribute('href', '');
            this.indexWrapper.appendChild(indexLink);

            indexLink.addEventListener('click', indexLinkEvent);  
        }
    },
    splitComments(array) {
        this.wrapper.innerHTML = "";
        this.indexWrapper.innerHTML = "";

        let length = 0;
        array.forEach( elem => {
            if (elem[3] == "noReplyIndex") {
                length++;
            } 
        });
        let numberOfPages = 1;
        if (length > this.siteLength) {
            numberOfPages = Math.floor(length/this.siteLength); 
            if (length % this.siteLength > 0) {
                numberOfPages++;
            }
            this.currentSite = numberOfPages - 1;
            this.drawComments(array, (numberOfPages - 1) * this.siteLength);
            this.drawIndexes(numberOfPages);
        } else {
            this.currentSite = numberOfPages;
            this.drawComments(array);
        }
    },
    draw: function(index) {
        dataCom.dbIndex = index;
        
        if (index != "noIndex") {
            dataCom.getData();
            let submit = document.getElementById("submit");
            submit.addEventListener("click", drawCommentEvent);
        }
    }
}

function indexLinkEvent(e) {
    e.preventDefault();
    let index = Number(e.currentTarget.innerHTML - 1);
    drawCom.currentSite = index; 
    drawCom.wrapper.innerHTML = "";
     
    let length = 0;
    dataCom.array.forEach( elem => {
        if (elem[3] == "noReplyIndex") {
            length++;
        } 
    });
 
    if (index != 0) {
        drawCom.drawComments(dataCom.array, index * drawCom.siteLength, 
            index * drawCom.siteLength + drawCom.siteLength + 1, length);
    } else {
        drawCom.drawComments(dataCom.array, -1, 1 * drawCom.siteLength + 1, length);
    }
}

function readMoreEvent(e) {
    var elem = e.currentTarget.previousSibling;
    if (elem.style.display === "none") {
        elem.style.display = "inline";
        e.currentTarget.innerHTML = "read less";
    } else {
        e.currentTarget.innerHTML = "read more";
        elem.style.display = "none";
    }
}

let dataCom = {
    array: Array(),
    replyOn: false,
    replyIndex: Array(), 
    replyElem: null,
    dbIndex: -1,
    admin: false,
    sendData(name, date, text) {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/comment.php", true);
        xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        let replyIndex = this.replyIndex;
        xmlhttp0.send("name=" + name + "&date=" + date + "&comment=" + text + 
            "&replyIndex=" + JSON.stringify(replyIndex) +
                "&dbIndex=" + this.dbIndex);
    },
    getData() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                console.log(responseText);
                let result = JSON.parse(responseText);
                this.array = JSON.parse(responseText);
                this.replyIndex[0] = "noReplyIndex";
        
                this.checkAdmin(result);
            }
        });
        xmlhttp0.open('GET', "php/comment.php?getData=true&dbIndex=" + this.dbIndex, true);
        xmlhttp0.send();  
    },
    checkAdmin(result) {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
                if (responseText == "true") {
                    this.admin = true;
                }
                drawCom.splitComments(result, responseText);
            }
        });
        xmlhttp0.open('GET', "php/comment.php?checkAdmin=true");
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
        currentTarget = currentTarget.parentNode.parentNode;
        let marginNum = currentTarget.style.marginLeft.substring(0, 
            currentTarget.style.marginLeft.length - 2);
        let marginArray = Array();
        marginArray[0] = Number(marginNum);
        while (currentTarget.previousSibling) { 
            currentTarget = currentTarget.previousSibling;
            let marginNum = currentTarget.style.marginLeft.substring(0, 
                currentTarget.style.marginLeft.length - 2);
            marginArray.push(Number(marginNum));
        }
     
        let previousMargin = marginArray[0];
        let stopCountingCount = 0;
        let count1 = 0;
        for (let i = 1; i < marginArray.length; i++) {
            let dontCountOnce = false;
            if (marginArray[i] < previousMargin) {
                if (stopCountingCount != 0) {
                    stopCountingCount--;
                } else {
                    arrayForPush.push(count1); 
                    count1 = 0;
                    dontCountOnce = true;
                }
            } 
            if (marginArray[i] > previousMargin) {
                count1 = 0;
                let marginDifferences = marginArray[i] - previousMargin;
                let countPlus = marginDifferences / drawCom.marginFactor;
                stopCountingCount += countPlus;
            }
            if (stopCountingCount == 0 && !dontCountOnce) {
                count1++; 
            }
            previousMargin = marginArray[i];
        }

        let count3 = 0;
        marginArray.forEach( elem => {
            if (elem == 0) {
                count3 += 1;
            }
        });
        arrayForPush.push((count3 - 1) + (drawCom.currentSite * drawCom.siteLength));
        arrayForPush.reverse(); 
        console.log(arrayForPush);
    },
    reReferenceNode() {
        let currentTarget = dataCom.replyElem;
        let marginNum = currentTarget.style.marginLeft.substring(0, 
            currentTarget.style.marginLeft.length - 2);
        let marginArray = Array();
        let elemArray = Array();
        marginArray[0] = Number(marginNum);
        elemArray.push(currentTarget);
        while (currentTarget.nextSibling) { 
            currentTarget = currentTarget.nextSibling;
            let marginNum = currentTarget.style.marginLeft.substring(0, 
                currentTarget.style.marginLeft.length - 2);
            marginArray.push(Number(marginNum));
            elemArray.push(currentTarget);
        }
        if (marginArray.length == 1) {
            return elemArray[0];
        }
        
        let itChanges = false;
        if (marginArray[1] > marginArray[0]) {
            itChanges = true; 
        } else {
            return elemArray[0]; 
        }
        
        for (let i = 1; i < marginArray.length; ++i) {
            if (marginArray[i] <= marginArray[0] && itChanges) {
                return elemArray[i - 1]; 
            }
        }
        return elemArray[elemArray.length - 1];
    },
    deleteReplies(currentTarget, myDelete) {
        let untilMarginSmaller = true;
        let node = currentTarget.parentNode.parentNode;
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
    },
    checkIfDelReply(currentTarget) {
        let currentNode = currentTarget.parentNode.parentNode;
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
        return myDelete;
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
        drawCom.splitComments(dataCom.array);
        dataCom.sendData(name, dateString, comment);
    } else {
        let currentNode = dataCom.reReferenceNode();
        if (currentNode != dataCom.replyElem) {
            drawCom.drawReply(currentNode, name, 
                    comment, dateString, dataCom.replyIndex.length, 
                        dataCom.replyIndex, 10000);
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
    dataCom.replyElem = e.currentTarget.parentNode.parentNode;
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
    let myDelete = dataCom.checkIfDelReply(e.currentTarget);

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

    dataCom.deleteReplies(e.currentTarget, myDelete);
}

function deleteEvent(e) {
    let array = Array();
    dataCom.findCurrentPos(array, e.currentTarget);

    let myDelete = dataCom.checkIfDelReply(e.currentTarget);

    dataCom.deleteReplies(e.currentTarget, myDelete);
    e.currentTarget.parentNode.parentNode.remove();

    let xmlhttp0 = new XMLHttpRequest();
    xmlhttp0.addEventListener('readystatechange', (e) => {
        if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
            let responseText = xmlhttp0.responseText;
            console.log(responseText);
        }
    });
    xmlhttp0.open('GET', "php/comment.php?deleteCom=true&DB_id=" + dataCom.dbIndex + 
        "&pos=" + JSON.stringify(array));
    xmlhttp0.send();  
}
