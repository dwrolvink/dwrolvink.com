# Getting Markdown (+syntax highlighting) to work on my site (as simply as possible)

I'm not a big fan of jquery, node, npm, and the likes. I mean, I like it when starting a big project, but for a simple website with basic functionality, I want to be able to just import a javascript file 
and move on with my life. Mostly because I'm not a frontend developer and as such it takes more effort for me to remember how it all works again. (Also my autism doesn't like all the dependencies in that setup.)

Aside from having to search through a lot of options, actually setting up a markdown to html converter with syntax highlighting was relatively easy.

> My website now uses a Markserv service to translate markdown. This abstracts the whole markdown thing away from the main website, while making it quite a bit more snappy. The downside is that I require a server for this, so I moved my entire site off github.io. You can read about this other method here: [Building this website](http://www.dwrolvink.com/?view=coding/website/building_this_website)

## A markdown converter
I stopped at the first javascript markdown-to-html converter that seemed simple enough, (so I have no idea if better solutions are out there).

I used [Marked](https://marked.js.org/), and installed it by putting the following in my html head:

```html 
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

Then, to convert markdown to html is as easy as:
```javascript
html = marked(markdown);
```		

This won't highlight the syntax though.

## Syntax highlighting
For syntax highlighting I used [highlight.js](https://highlightjs.org/). You go to their website, click "Get version (...)", select all the languages you want support for and click download.
Put the `/styles/` folder in your root (or where-ever you want it), and the highlight.pack.js in your javascript folder. 

Then, you add the following to your html head (adjust the paths for your setup):
```html 
<link rel="stylesheet" href="/styles/default.css">
<script src="/js/highlight.pack.js"></script>
```

On now you can use `<script>hljs.initHighlightingOnLoad();</script>`, but because I add markdown into my articles, and load the articles in after the document has loaded, then convert the markdown
to html, I have to do it exactly after that point:
```javascript
document.querySelectorAll('pre code').forEach((block) => {
	hljs.highlightBlock(block);
});
```
