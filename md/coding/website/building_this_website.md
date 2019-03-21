# How I made my website
I have a peculiar website design (backend-wise). Installing it took some figuring out, so I wrote this post to help me remember, and maybe to help some other people out.

Everything will be running on one CentOS 7 server. I won't describe how to install CentOS. Just google how to install the minimal CentOS installation.

## Website setup
I'll have a front-end with an index.html page in which I have the menu and some javascript functions to fetch the current page.

All the content of the website will be written in markdown, and served by [Markserv](https://github.com/markserv/markserv). This means that Markserv gets the markdown file and translates it to html. My front-end will then insert that html to the main page.

## Installing Markserv
- [Installing Markserv](http://www.dwrolvink.com/?view=coding/website/install_markserv)

## Installing Nginx
- [Installing Nginx, and configuring the website](http://www.dwrolvink.com/?view=coding/website/install_nginx)

## Building the fetch http javascript
In the root of your website, make a folder called `js` and make a file called `fetch.js` in there. 
Fill it with the following code:
```javascript
// Wait until the page is done loading so all the functions and elements are known.
window.onload = function () {
    LoadHomePage();
}	
		
// Load default elements on first loading page
function LoadHomePage(){
    // You can control what page is fetched by url: www.dwrolvink.com?view=filename
    // Get this value
    var view = getParameterByName('view');

    // Load the html for in the main div
    // The first argument is the id of the div element in which we'll eventually put the fetched html
    // The last argument is the append toggle (as opposed to replace).
    if (view) {
        LoadDiv('main',view,false);
    }
    else {
        LoadDiv('main','contact',false);
    }
}

// Ask GetHTML to pick up the html for a file, and call back to LoadDivExecute when ready
function LoadDiv(id, name, add=false){
    // Say at which URL we can find the file
    var file = 'http://www.dwrolvink.com/md/' + name + '.md';

    // I wanted to avoid hardcoding a callback function later on, so I made a (very!) rudimentary stack
    HTMLLoaderElement = [file, LoadDivExecute, [id, add]];

    // Where we actually get the HTML
    GetHTML(HTMLLoaderElement);

    // Change the URL in the browser URL view (actually going to previous page doesn't work yet)
    window.history.pushState(name, 'dwrolvink.com', '?view='+name);
}

// Puts HTML received from GetHTML into an element with given id.
// add=true can be used to append html instead of replacing it.
function LoadDivExecute(response, options){
    var id = options[0];
    var add = options[1];
    var html = response;

    //html = LoadMarkdown(html);
    SetInnerHTMLByID(id, html, add);
}

// Gets content from a file and returns it to the callback function
function GetHTML(Loader){
    var file = Loader[0];
    var CallbackFunction = Loader[1];
    var CallbackOptions = Loader[2];

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
        if (this.status == 200) {
            // CallBack (you can also just hardcode a callback function here)
            CallbackFunction(this.responseText, CallbackOptions);
        }
        if (this.status == 404) {
            console.log("File not found.");
        }
    }
} 
// Make the HTML request
xhttp.open("GET", file, true);
xhttp.send();
}

// Sets innerhtml of a given element. 
// Adds it instead of replacing when add=true
function SetInnerHTMLByID(id, html, add=false){
    if (add){
        document.getElementById(id).innerHTML += html;
    }
    else{
        document.getElementById(id).innerHTML = html;
    }
}

// Get the value of a GET variable
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	results = regex.exec(url);

	if (!results) return null;
	if (!results[2]) return '';

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
```

Now, make a file called index.html in your website root, and fill it with the following:
```html
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <script src="/js/fetch.js"></script>
    </head>

    <body>
 
    <main id="main">
    </main>

    </body>
</html>
```
Tip: you can install php on your linux machine and, whilst in the website root, do: `php -S 0.0.0.0:80` to quickly test the setup. (Port 80 won't work if you already have nginx or a similar webserver running).

Spin up your webserver of choice and go to `http://<ip of your webserver>/?view=test`. 
> Make sure you're currently running Markserv and it's reachable at the URL that's listed in fetch.js.

