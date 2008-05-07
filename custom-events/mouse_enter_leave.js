/*
 *  Fires "mouse:enter" and "mouse:leave" events as a substitute for the
 *  "mouseenter" and "mouseleave" events. Simulates, in effect, the behavior
 *  of the CSS ":hover" pseudoclass.
 */

(function() {
  function respondToMouseOver(event) {
    var target = event.element();
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire("mouse:enter");
  }
  
  function respondToMouseOut(event) {
    var target = event.element();
    if (event.relatedTarget && !event.relatedTarget.descendantOf(target))
      target.fire("mouse:leave");
  }
    
  
  if (Prototype.Browser.IE) {
    document.observe("mouseenter", function(event) {
      event.element().fire("mouse:enter");
    });
    document.observe("mouseleave", function(event) {
      event.element().fire("mouse:leave");
    });
  } else {
    document.observe("mouseover", respondToMouseOver);
    document.observe("mouseout",  respondToMouseOut);
  }  
})();