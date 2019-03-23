// [Start here]
// This function is called by index.html, and starts the fetching process
// All other functions in this file are merely there to help this function to complete it's goal.
function LoadCurrentPage(){
	// The URL determines which page is fetched, in this case by ?view=<filename>
	var view = getParameterByName('view');
	if (view) {
		LoadDiv('main',view,false);
	}
	else {
		// Default page
		LoadDiv('main','coding',false);
	}			
}

// Tells GetHTML() to fetch the file, and to call LoadDivExecute() as callback function.
// The third piece of info is the arguments that LoadDivExecute() will be given
function LoadDiv(id, filename, add=false){
	var file = 'http://www.dwrolvink.com/md/' + filename + '.md';

	HTMLLoaderElement = [file, LoadDivExecute, [id, add]];
	GetHTML(HTMLLoaderElement);
	window.history.pushState(name, 'dwrolvink.com', '?view='+filename);
}


// Gets content from a file and returns it to the callback function
function GetHTML(Loader){
	var file = Loader[0];
	var CallbackFunction = Loader[1];
	var CallbackOptions = Loader[2];

	xhttp = new XMLHttpRequest();
	// Define what to do when you get the answer of the request
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				// CallBack
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

// Puts html received from GetHTML into an element with given id.
// add=true can be used to append html instead of replacing it.
function LoadDivExecute(response, options){
	var id = options[0];
	var add = options[1];
	var html = response;

	//html = LoadMarkdown(html);
	SetInnerHTMLByID(id, html, add);
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

// Returns innerhtml of an element with given id
function GetInnerHTMLByID(id){
	return document.getElementById(id).innerHTML;
}    

// Get the value of a GET variable in the URL (like ?view=<value>)
function getParameterByName(name, url) {
	// If no url is given, just ask the window object what the URL is
	if (!url) url = window.location.href;

	// regex magic on the variable name
	name = name.replace(/[\[\]]/g, '\\$&');
	// regex magic on the url to find the value that the variable is set to
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var results = regex.exec(url);
	
	// A valid result looks like this (input: "http://yeetbox/?view=coding"):
	// 0: "?view=coding", 1: "=coding", 2: "coding"
	if (!results) return null; 
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
