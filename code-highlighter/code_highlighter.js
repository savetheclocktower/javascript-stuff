/*
 * Code Highlighter
 * 
 * A rewrite of Dan Webb's original Unobtrusive Code Highlighter. Refactored to
 * take advantage of Prototype idioms and to clean out the cruft of legacy
 * browser support.
 * 
 * Tested on:
 *  Firefox 3+
 *  Safari 3+
 * 
 * 
 * Usage:
 *  (1) Include this script on your page.
 *  (2) Include any number of language parsing definitions. Sample definitions
 *      are included.
 *  (3) Assign a class name to any code block you want highlighted. The class
 *      name should be identical to the language definition name passed to
 *      `CodeHighlighter.addStyle`.
 *  (4) Include a stylesheet that highlights your code. You can target parsed
 *      tokens by name: for example, `pre code .string` will highlight anything
 *      with a style rule named "string."
 *
 * Dan's script (and therefore _this_ script) was inspired by star-light,
 * written by the cunning Dean Edwards (http://dean.edwards.name/star-light/).
 *
 */
 
(function() {
  
  var _styleSets = [];
  var _codeElements;
  
  var _rules = _makeRules();
  
  
  var DEFAULT_TEMPLATE = new Template(
    '<span class="#{className}">#{text}</span>');
  
  var $Codes = Class.create(Enumerable, {
    initialize: function(nodes) {
      this.nodes = $A(nodes);
    },
    
    _each: function() {
      return this.nodes._each.apply(this.nodes, arguments);
    }
  });
  
  
  function _makeStyleSet(name, rules, ignoreCase, options) {
    return {
      name: name,
      rules: rules,
      ignoreCase: ignoreCase || false
    };
  }
  
  function _makeRules(styleSet) {
    var rules = [];
    rules.toString = function() {
      return this.pluck('exp').join('|');
    };
    
    if (styleSet) {
      var exp, rule;
      for (var ruleName in styleSet.rules) {
        rule = styleSet.rules[ruleName];
        if (!Object.isString(rule.exp)) {
          exp = String(rule.exp).substr(1, String(rule.exp).length - 2);
        } else {
          exp = rule.exp;
        }
        
        rules.push({
          className: ruleName,
          exp: "(" + exp + ")",
          length: (exp.match(/(^|[^\\])\([^?]/g) || "").length + 1,
          replacement: rule.replacement || null
        });        
      }
    }
    
    return rules;
  }
    
  function _parse(text, rules, ignoreCase) {
    var re = new RegExp(rules, ignoreCase ? "gi" : "g");
    
    return text.replace(re, function() {
      var i = 0, j = 1, rule;
      
      while (rule = rules[i++]) {
        if (arguments[j]) {
          // If no custom replacement is defined, do the simple replacement.
          if (!rule.replacement) {
            return DEFAULT_TEMPLATE.evaluate({
              className: rule.className, text: arguments[0] });
          } else {
            // Replace $0 with the className; then do normal replaces.
            var str = rule.replacement.replace("$0", rule.className);
            for (var k = 1; k <= rule.length - 1; k++) {
              str = str.replace("$" + k, arguments[j + k]);
            }
            return str;
          }
        } else {
          j += rule.length;
        }        
      }      
    });    
  }
  
  function _highlightCode(styleSet) {    
    var parsed;
    
    var stylableElements = _codeElements.select( function(code) {
      return code.className.include(styleSet.name);
    });
    
    var rules = _makeRules(styleSet);
        
    for (var i = 0, element; element = $(stylableElements[i]); i++) {
      text = element.innerHTML;
      
			// EVIL hack to fix IE whitespace badness if it's inside a <pre>
      if (Prototype.Browser.IE && element.parentNode.nodeName === 'PRE') {			  
			  element = element.parentNode;			  
			  text = element.innerHTML;
			  parsed = text.replace(/(<code[^>]*>)([^<]*)<\/code>/i,
			   function() {
			      return arguments[1] + _parse(arguments[2], rules, styleSet.ignoreCase)
			       + "</code>";
			   });
			  parsed = parsed.replace(/\n(\s*)/g, function() {
			    return "\n" + ("&nbsp;".times(arguments[1].length));
			  });
			  
			  parsed = parsed.replace(/\t/g, 
			   "&nbsp".times(CodeHighlighter.TAB_SIZE));
			  parsed = parsed.replace(/\n(<\/\w+>)?/g, "<br />$1");
			  parsed = parsed.replace(/<br \/>[\n\r\s]*<br \/>/g, "<p><br /></p>");
			  
			} else {
			  parsed = _parse(text, rules, styleSet);
			}

		  element.update(parsed);			  
    }
  }
    
  function _initialize() {
    _codeElements = new $Codes(document.getElementsByTagName('code'));  
    _styleSets.each(_highlightCode);
  }
  
  window.CodeHighlighter = {
    TAB_SIZE: 2,    
    addStyle: function(name, rules, ignoreCase, options) {
      _styleSets.push(_makeStyleSet(name, rules, ignoreCase, options));
      
      if (_styleSets.length == 1) {
        document.observe("dom:loaded", _initialize);
      }      
    }
  };
})();