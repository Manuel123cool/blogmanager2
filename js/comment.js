"use strict";

let drawCom = {
    drawn: false,
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
            let replyIndex1 = drawCom.wrapper.childNodes.length;
            dataCom.sendData(name.innerHTML, date.innerHTML, p.innerHTML, replyIndex1, 1); 
        }
    },
    draw: function(index1, index2) {
        if (!this.drawn) {
            this.drawn = true; 
            
            dataCom.siteIndex1 = index1;
            dataCom.siteIndex2 = index2;
            console.log("fuck yeaa");
            let submit = document.getElementById("submit");
            submit.addEventListener("click", drawCommentEvent);
        }
    }
}

let dataCom = {
    replyOn: false,
    replyIndex1: 0,
    replyIndex2: 0, 
    siteIndex1: -1,
    siteIndex2: -1,
    sendData: function(name, date, text, replyIndex1, replyIndex2) {
        var xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                var responseText = xmlhttp0.responseText;
                console.log(responseText);
            }
        });
        xmlhttp0.open('POST', "php/comment.php", true);
        xmlhttp0.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp0.send("name=" + name + "&date=" + date + "&comment=" + text + 
            "&replyIndex=" +  replyIndex1 + "&replyIndex2=" + replyIndex2 +
                "&siteIndex1=" + this.siteIndex1 + "&siteIndex2=" + this.siteIndex2);
    },
    getData: function() {
        let xmlhttp0 = new XMLHttpRequest();
        xmlhttp0.addEventListener('readystatechange', (e) => {
            if (xmlhttp0.readyState==4 && xmlhttp0.status==200) {
                let responseText = xmlhttp0.responseText;
            }
        });
        xmlhttp0.open('GET', "comment.php?getData=true&siteIndex1=" + this.siteIndex1 +
                        "&siteIndex2=" + this.siteIndex, true);
        xmlhttp0.send();  
 
    }
}

function drawCommentEvent(e) {
    e.preventDefault();
    drawCom.drawComment(); 
}
    
function replyEvent(e) {
    e.preventDefault();
      
    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "cancel reply";        
    replyCancel.addEventListener("click", cancelReplyEvent);
    
    dataCom.replyOn = true;
}

function cancelReplyEvent(e) {
    e.preventDefault();

    let replyCancel = document.getElementById("reply_cancel");
    replyCancel.innerHTML = "";        

    dataCom.replyOn = false;
}
