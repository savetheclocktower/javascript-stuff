//= require <prototype>

//
// NOTE: In case the version number doesn't tip you off... this is really
// preliminary code. I welcome you to try it out and tell me if it sucks;
// I'll try to make it suck less. Thanks!
//
// Prototype History Manager
// =========================
//
// A port of YUI's Browser History Manager with a slightly different API.
//
// INSTRUCTIONS:
// First: to get this working across all browsers you need both a hidden
// INPUT field _and_ a hidden IFRAME. Somewhere on your page (preferably
// at the bottom) you'll need to tell the history manager where these things
// are. For example:
//
// <input type="hidden" id="history_field" />
// <iframe id="history_iframe" style="display: none;"></iframe>
// <script type="text/javascript" charset="utf-8">
//   History.stateField = $('history_manager');
//   History.iframe = $('history_iframe');
// </script>
//
// The `History` object functions as an instance of Hash. While the page is
// loading, any calls to `History.set` will determine the _initial_ value
// of any key-value pair. After the window load event fires, any key/value
// pairs are serialized and placed into the URL hash.
//
// Now, whenever `History.set` is called, the URL hash will change, and the
// browser will treat that change as a "page navigation."
//
// Whenever the value of a key changes, whether by updating the value through
// `History.set`, using Back/Forward, or hacking the URL, the history manager
// will fire a custom event for each key that changed, in the form of
// `hash:changed:[name_of_key]`. The event object's `memo` property will
// have several properties: `initialState`, `previousState`, and
// `currentState`, informing you what the value used to be and what it is now.
//
//
// DETAILED EXAMPLE:
//
// (during page load)
// History.set("foo", "bar");
// History.set("baz", "thud");
//
// (when page loads)
// URL hash set to "#foo=bar&baz=thud"
//
// (later...)
// History.set("foo", "blerg");
// URL hash set to "#foo=blerg&baz=thud"
// `document` fires custom event: `hash:changed:foo`
//   event.memo.initialState:  "bar"
//   event.memo.previousState: "bar"
//   event.memo.currentState:  "blerg"
//
// (later still...)
// User clicks on Back button
// URL hash set to "#foo=bar&baz=thud"
// `document` fires custom event: `hash:changed:foo`
//   event.memo.initialState:  "bar"
//   event.memo.previousState: "blerg"
//   event.memo.currentState:  "bar"
//
//

(function() {
  var VERSION = "0.1";
  
  var _iframe = null;
  var _stateField = null;
  
  var _initialized = false;
  
  var _uniqueStates = [];
  
  var _originalHash = null;
  var _historyHash = null;
  
  var DEBUG = false;
  
  function _debug() {
    if (!DEBUG) return;
    return console.log(arguments);
  }  
  
  function _initialize() { 
    _stateField = History.stateField;
    _iframe     = History.iframe;
    _debug("in _initialize");
    
    // Unserialize the hash from the hidden field.
    _historyHash = new $HistoryHash(_stateField.value);
    
    if (Prototype.Browser.IE) {
      _checkIFrameLoaded();
    } else {
      // Poll for hash changes.
      var counter = history.length, hash = _getHash();
      
      window.setInterval( function() {
        var newHash = _getHash(), newCounter = history.length;
        
        if (newHash !== hash) {
          hash = newHash;
          _historyHash.updateWithURLHash(newHash);
          _storeStates();
        } else if (newCounter !== counter && Prototype.Browser.WebKit) {
          hash = newHash, counter = newCounter;
          var uniqueState = _uniqueStates[counter - 1];
          _historyHash.updateWithURLHash(uniqueState);
          _storeStates();
        }
      }, 50);
      
      // At this point, window.History is an ordinary hash. Extract its
      // values, then replace it with a $HistoryHash instance.
      _originalHash = window.History;
      _historyHash.update(_originalHash.toObject());
      
      console.log(_originalHash);
      window._old = _originalHash;
      
      window.History = _historyHash;
      window.History.VERSION = VERSION;      
      
      _initialized = true;
    }    
  }
  
  function _getHash() {
    var href = top.location.href, i = href.indexOf("#");
    return i >= 0 ? href.substr(i + 1) : null;
  }
  
  function _setHash(hash) {
    top.location.hash = hash;
  }
  
  function _updateHash(historyHash) {
    _setHash(historyHash.toURLHash());
  }
  
  function  _storeStates() {
    var initialStates = [], currentStates = [];
    
    _historyHash.each( function(pair) {
      initialStates.push([pair.key, pair.value.initialState].join('='));
      currentStates.push([pair.key, pair.value.currentState].join('='));
    });
    
    _stateField.value = initialStates.join("&") + "|" + currentStates.join("&");
    
    if (Prototype.Browser.WebKit) {
      _stateField.value += "|" + _uniqueStates.join(",");
    }
  }
  
  function _updateIFrame(uniqueState) {
    var html = '<html><body><div id="state">' + uniqueState +
     '</div></body></html>';
     
    try {
      var doc = _iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
    } catch (e) {
      return false;
    }
  }
  
  function _getUniqueStateForIE() {
    var doc = _iframe.contentWindow.document;
    var elem = doc.getElementById("state");
    
    return elem ? elem.innerText : null;
  }  
  
  function _checkIFrameLoaded() {    
    if (!_iframe.contentWindow || _iframe.contentWindow.document) {
      // Not ready yet. Keep trying.
      window.setTimeout(_checkIFrameLoaded, 10);
      return;
    }
    
    var uniqueState = _getUniqueStateForIE();    
    var hash = _getHash();
    
    // Keep polling to see if the values we have above are no longer
    // current. If so, fire off the observers.
    window.setInterval( function() {
      var newUniqueState = _getUniqueStateForIE();
      var newHash = _getHash();
      
      if (newUniqueState !== uniqueState) {
        uniqueState = newUniqueState;
        _historyHash.updateWithURLHash(uniqueState);                
        hash = newHash;
        _setHash(hash);
        _storeStates();
      } else if (newHash !== hash) {
        // Hash changed on its own.
        hash = newHash;
        _updateIFrame(newHash);
        _historyHash.updateWithURLHash(hash);
      }
    }, 50);
    
    _initialized = true;        
  }  
  
  
  var $HistoryHash = Class.create(Hash, {
    initialize: function(uniqueState) {
      this.uniqueState = uniqueState;    
      this._object = {};
      
      var parts = uniqueState.split("|");
      
      var initialStates = {};
      var currentStates = {};
      
      if (parts.length >= 2) {
        var iParts = parts[0].split("&");
        iParts.each( function(part) {
          var pair = part.split("=");
          initialStates[pair[0]] = pair[1];
        });
        var cParts = parts[1].split("&");
        cParts.each( function(part) {
          var pair = part.split("=");
          currentStates[pair[0]] = pair[1];
        });
      }
      
      this._object = {};
      
      Object.keys(currentStates).each( function(state) {
        this._object[state] = {
          initialState: initialStates[state],
          currentState: currentStates[state]
        };
      }, this);
    },
    
    updateWithURLHash: function(hash) {
      if (!hash) {
        return;
      }
      var pairs = hash.split('&');
      
      pairs.each( function(p) {
        pair = p.split('=');
        this.set(pair[0], pair[1]);
      }, this);
    },
  
    /**
     *  History.set(key, value)
     *  
     *  Sets a key/value pair, updating the URL and triggering a new
     *  navigation state in the browser.
     *  - key (String): The key to set.
     *  - value (String): The value to set.
    **/
    set: function($super, key, value) {
      var item;
      if (!this.get(key)) {
        if (_initialized) {
          throw new Error("New key cannot be set after initialization!");
        } else {
          item = { initialState: value };
        }        
      } else {
        item = this._object[key];
      }
      if (item.currentState && item.currentState !== value) {
        _debug("in set", arguments);
        // Value has changed. Fire an event.
        var memo = Object.clone(item);
        memo.previousState = item.currentState;
        memo.currentState  = value;
        document.fire("hash:changed:" + key, memo);
      }
      item.currentState = value;
      item = $super(key, item);
      _updateHash(this);
      return item;
    },
    
    /**
     *  Hash.get(key)
     *  Retrieves the _current_ value of the item in the URL hash with the
     *  given key.
     *  - key (String): The key to retrieve.
    **/    
    get: function($super, key) {
      var value = $super(key);
      return value ? value.currentState : null;
    },
  
    toURLHash: function() {
      function toURLPair(pair) {
        return [pair.key, pair.value.currentState].join('=');
      }
      return "#" + this.map(toURLPair).join('&');
    }
  });
  
  Event.observe(window, 'load', _initialize);
  
  window.History = new Hash();
  window.History.VERSION = VERSION;
})();