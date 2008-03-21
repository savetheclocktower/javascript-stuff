/*
 *  Fires a "mouse:wheel" event whenever the mouse wheel is scrolled. Find the
 *  approximate number of rows moved by reading event.memo.delta.
 */

(function() {
  function wheel(event) {
    var realDelta;

    // normalize the delta
    if (event.wheelDelta) // IE & Opera
      realDelta = event.wheelDelta / 120;
    else if (event.detail) // W3C
      realDelta = -event.detail / 3;

    if (!realDelta) return;
    
    var customEvent = event.element().fire("mouse:wheel", {
     delta: realDelta }); 
    if (customEvent.stopped) event.stop();
  }

 document.observe("mousewheel",     wheel);
 document.observe("DOMMouseScroll", wheel);
})();