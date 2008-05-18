/* Fires a `state:idle` custom event after the user has been inactive for the
 * given number of seconds. Fires a `state:active` event whenever the user
 * interacts with the page.
 *
 * Adapted from kangax's code at:
 * http://thinkweb2.com/projects/prototype/detect-idle-state-with-custom-events/
 */

(function() {
  var SECONDS_BEFORE_IDLE = 300;
  
  var EVENTS = [
    [window, 'scroll'],
    [window, 'resize'],
    [document, 'mousemove'],
    [document, 'keydown']
  ];
  
  var _timer, _idleTime;
  
  function resetTimer() {
    window.clearTimeout(_timer);
    _idleTime = new Date();
    _timer = window.setTimeout(setIdle, SECONDS_BEFORE_IDLE * 1000);
  }
  
  function setIdle() {
    document.fire("state:idle");
  }
  
  function setActive() {
    document.fire("state:active", { idleTime: new Date() - _idleTime });
    resetTimer();
  }
  
  EVENTS.each( function(e) {
    Event.observe(e[0], e[1], setActive);
  });
})();