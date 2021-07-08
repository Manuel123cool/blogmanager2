# blogmanager2
A better version of the blogmanger

To  add file creation capability 
```
sudo mkdir page
sudo chmod 777 -R page
```
in the appache main folder of course. <br>

As a note: Dont chmod 777 u main appche folder (I learned that Javscript content can be Index and crowled from google). Second the page is vulnerable to XSS (replace innerHTML with textContent).
