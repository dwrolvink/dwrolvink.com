		// Call LoadHomePage when the page is done loading.
		window.onload = function () {
			LoadHomePage();
		}	
		
		// Load default elements on first loading page
        function LoadHomePage(){
			var view = getParameterByName('view');

			// Currently loading the "under construction" message in the header div
			LoadDiv('headerdiv','header',true);

			// Load the html for in the main div
			if (view) {
				LoadDiv('main',view,false);
			}
			else {
				LoadDiv('main','contact',false);
			}
		}

		// Ask GetHTML to pick up the html for a file, and call back to LoadDivExecute when ready
        function LoadDiv(id, name, add=false){
			var file = "Pages/" + name + ".html";

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

		  	html = LoadMarkdown(html);
		  	SetInnerHTMLByID(id, html, add);

		  	DoReplacements();
	  	}

		// Parse current page content and replace the content of blocks for formatting / adding functionality
		function DoReplacements(){
			// get all <pre><code> blocks, and apply highlighting
			document.querySelectorAll('pre code').forEach((block) => {
				hljs.highlightBlock(block);
		  	});
		
			// Replace the eva code (for the pictograms)
			eva.replace();

			// Add code to .column .long articles
			LoadTogglingArticle();		  
	  	}

	  	function LoadTogglingArticle(){
			// Get all <article id="article-[i]">
			document.querySelectorAll("article[id^=article-]").forEach((article) => {
				var section = article.parentElement;
				var id = article.id.split('-')[1];

				var expander = '<div class="expander" id="expander-'+id+'"  onclick="ToggleColumn(this.id)" > \
							<img id="expander-icon-'+id+'" src="Images/triangle.png"  style="width:20px; height: auto; transform: rotate(180deg);" /> \
							</div>';				

				// Add expander button at the bottom of the section that the article is in.
				section.innerHTML += expander;
		  	});			
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

		function LoadMarkdown(html){
			var parts = [],
				parsedHTML = ''; // acc

			// Split html on the occurence of <markdown> and </markdown>
			parts = html.split(/<\/?markdown>/g); // first element is empty or html, second element is markdown, third element is empty or html, etc

			// Foreach part of code, just add it to parsedHTML if it's html; 
			// if it is markdown, parse it and add the resultant html to parsedHTML
			for(var i=0; i<parts.length; i++)
			{
				// Markdown
				if(i%2)
				{
					// acc
					var newpart = '';
					
					// Split the markdown into lines, and get the number of spaces proceeding the first line
					var lines = parts[i].split(/\n/);
					indentation = lines[1].search(/\S/); 

					// for each line, remove the first x characters from the line, where x is the number of proceeding spaces on the first line.
					// (otherwise, the markdown would show the indentation of the document, which should be ignored)
					lines.slice(1,).forEach(function(line){
						if (line){
							if (indentation > 0){
								line = line.slice(indentation);
							}	
						}					
						newpart += line + "\n";
					})					
					
					// convert cleaned markdown to html
					parts[i] = marked(newpart);
				}

				parsedHTML += parts[i];
			}

			return parsedHTML;
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

		function GetMail(){
			var Ihopebotsarestupid = ["d", "w", "rolv", "ink", "@", "gm", "ail.", "com"];
			var str = '';
			Ihopebotsarestupid .forEach(element => {
				str+= element;
			});

			return str;
		}

		function ToggleColumn(expanderID){
			var id = expanderID.split("-")[1];
			console.log(expanderID);
			var expander = document.getElementById("expander-" + id);
			var expanderIcon = document.getElementById("expander-icon-" + id);
			var article = document.getElementById("article-" + id);
			var section = article.parentElement;
			var state = expanderIcon.style.transform;

			if (state == 'rotate(180deg)'){
				// flip icon		
				expanderIcon.style.transform = "rotate(0deg)";

				// expand article
				article.style.maxHeight='999999px';  
				article.style.cursor='auto';
			}
			else{
				// flip icon		
				expanderIcon.style.transform = "rotate(180deg)";

				// fold article
				article.style.maxHeight='20vh';  
				article.style.cursor='pointer';
			}
		}
