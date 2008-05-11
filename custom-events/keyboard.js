/*
 *  Fires a "key:foo" event for each of the keys that has a corresponding
 *  constant in Prototype. For instance, pressing Escape will fire a "key:esc"
 *  event. The original event is attached to the custom event's "memo"
 *  property.
 */

(function() {
  var KEYS = {};  
  KEYS[Event.KEY_ESC]      = "esc";
  KEYS[Event.KEY_UP]       = "up";
  KEYS[Event.KEY_DOWN]     = "down";
  KEYS[Event.KEY_LEFT]     = "left";
  KEYS[Event.KEY_RIGHT]    = "right";
  KEYS[Event.KEY_RETURN]   = "enter";  
  KEYS[Event.KEY_DELETE]   = "delete";
  KEYS[Event.KEY_HOME]     = "home";
  KEYS[Event.KEY_END]      = "end";
  KEYS[Event.KEY_PAGEUP]   = "pageup";
  KEYS[Event.KEY_PAGEDOWN] = "pagedown";
  KEYS[Event.KEY_INSERT]   = "insert";
    
  function handler(event) {
    if (event.keyCode && KEYS[event.keyCode]) {
      event.element().fire("key:" + KEYS[event.keyCode], event);
    }
  }
    
  document.observe("keydown", handler);
})();