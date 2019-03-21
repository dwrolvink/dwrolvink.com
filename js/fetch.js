		// Call LoadHomePage when the page is done loading.
		window.onload = function () {
			LoadHomePage();
		}	
		
		// Load default elements on first loading page
        function LoadHomePage(){
			var view = getParameterByName('view');
			// Currently loading the "under construction" message in the header div
			//LoadDiv('headerdiv','header',true);

			// Load the html for in the main div
			if (view) {
				LoadDiv('main',view,false);
			}
			else {
				LoadDiv('main','coding',false);
			}
		}

		// Ask GetHTML to pick up the html for a file, and call back to LoadDivExecute when ready
        function LoadDiv(id, name, add=false){
			var file = 'http://www.dwrolvink.com/md/' + name + '.md';

			HTMLLoaderElement = [file, LoadDivExecute, [id, add]];
			GetHTML(HTMLLoaderElement);
			window.history.pushState(name, 'dwrolvink.com', '?view='+name);
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
		
		// Gets content from a file and returns it to the callback function
		function GetHTML(Loader){
			var file = Loader[0];
			var CallbackFunction = Loader[1];
			var CallbackOptions = Loader[2];

			// Define what to do when you get the answer of the request
			xhttp = new XMLHttpRequest();
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
