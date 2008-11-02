CodeHighlighter.addStyle("html", {
	closingTag: {
	  exp: /(\/?(?:>|&gt;))/,
	  replacement: "<span class=\"tag\">$1</span>"
	},
	comment: {
		exp: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
	},
	tag:  {
	  exp: /((?:<|&lt;)\/?)([a-zA-Z0-9:]+\s?)/,  
		replacement: "<span class=\"$0\">$1$2</span>"
	},
	string: {
		exp: /'[^']*'|"[^"]*"/
	},
	attribute: {
		exp: /\b([a-zA-Z-:]+)(=)/, 
		replacement: "<span class=\"$0\">$1</span>$2"
	},
	doctype: {
		exp: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
	} 	
});
