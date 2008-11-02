/*
 *  A script for fixing the Q tag in Internet Explorer.
 *  
 *  Inspired by [http://plugins.jquery.com/project/QinIE].
 *  
 *  KNOWN ISSUES:
 *  Doesn't yet handle quotation marks from non-American locales.
 *  
 *  NOTE:
 *  This script does no browser checking. Load it via an IE 
 *  conditional comment.
 *  
 */
(function() {
  var QUOTES = {
    'single': ["&lsquo;", "&rsquo"],
    'double': ["&ldquo;", "&rdquo;"]
  };
  
  function fixQuotes(q, quoteType) {
    if (q._handledByPrototype) return;
    var nestedQ = q.down('q');
    if (nestedQ) {
      arguments.callee(nestedQ, quoteType == "double" ? "single" : "double");
    }
    q.insert({ top: QUOTES[quoteType][0], bottom: QUOTES[quoteType][1] });
    q._handledByPrototype = true;
  }
  document.observe("dom:loaded", function() {
    $$('q').each( function(q) { fixQuotes(q, "double"); });
  });
})();