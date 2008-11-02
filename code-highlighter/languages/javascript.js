CodeHighlighter.addStyle("javascript", {
	fun: {
    exp:     /\b(function)\s+([a-zA-Z_$]\w*)?\s*\((.*?)\)/,
    replacement: "<span class='function'>$1</span> <span class='entity'>$2</span>(<span class='parameter'>$3</span>)"
  },

  // match stuff like: Sound.prototype.play = function() { … }
  fun2: {
    exp:    /\b([a-zA-Z_?\.$]+\w*)\s+=\s+\b(function)?\s*\((.*?)\)/,
    replacement: "<span class='entity'>$1</span> = <span class='function'>$2</span>(<span class='parameter'>$3</span>)"
  },
  
  fun3: {
    exp: /\b(function)\s*\((.*?)\)/,
    replacement: "<span class='function'>$1</span>(<span class='parameter'>$2</span>)"
  },
  
  variable: {
    exp: /\bvar\s+([A-Za-z_$]+?)\b/,
    replacement: "var <span class='$0'>$1</span>"
  },

  string: {
  	exp: /'[^']*[^\\]'|"[^"]*[^\\]"/
  },

  comment: {
  	exp  : /(\/\/[^\n]*\n)|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
  },

  control: {
    exp: /\b(break|case|catch|continue|default|do|else|finally|for|goto|if|import|package|return|switch|throw|try|while|with)\b/
  },
  
  constant: {
    exp: /\b(false|null|super|this|true)\b/
  },
  
  property: {
    exp: /\b([A-Za-z_$]+?):\s/,
    replacement: "<span class='$0'>$1</span>: "
  },

  number: {
    exp: /\b((0(x|X)[0-9a-fA-F]+)|([0-9]+(\.[0-9]+)?))\b/
  }
});