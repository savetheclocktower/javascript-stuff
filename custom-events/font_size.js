/*
 *  Fires a "fontsize:changed" event whenever the user increases the font size.
 *  The custom `ratio` property represents the factor by which the text size
 *  was increased or decreased.
 *
 *  Adapted from code at:
 *  http://code.google.com/p/doctype/wiki/ArticleFontSizeMonitor
 */

document.observe("dom:loaded", function() {
  var monitor = new Element('div').update('X');  
  monitor.setStyle({ position: 'absolute', left: '-10000px', top: '-100px' });
  
  document.body.appendChild(monitor);
  
  var lastSize = monitor.offsetWidth;
  
  var interval = window.setInterval(checkFontSize, 50);
  
  function checkFontSize() {
    var currentSize = monitor.offsetWidth;
    if (lastSize !== curSize) {
      var ratio = curSize / lastSize;
      lastSize = curSize;
      document.fire('fontsize:changed', { ratio: ratio });
    }
  }
});