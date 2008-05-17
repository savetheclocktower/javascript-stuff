

if (!Prototype || Prototype.Version.indexOf('1.6') !== 0) {
  throw "This script requires Prototype >= 1.6.";
}

Object.isDate = function(object) {
  return object instanceof Date;
};

var Cookie = Class.create({
  initialize: function(name, value, expires) {
    if (Object.isNumber(expires)) {
      var days = expires;
      expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    }
    
    if (Object.isDate(expires)) {
      expires = expires.toGMTString();
    }
    
    if (expires !== "") expires = "; expires=" + expires;
    
    this.name    = name;
    this.value   = value;
    this.expires = expires;
    
    document.cookie = name + "=" + value + expires + "; path=/";      
  },
  
  toString: function() {
    return this.value;
  },
  
  inspect: function() {
    return "#<Cookie #{name}:#{value}>".interpolate(this);
  }
});

Object.extend(Cookie, {
  set: function(name, value, expires) {
    return new Cookie(name, value, expires);
  },
  
  get: function(name) {
    var c = document.cookie.split(';');
    
    for (var i = 0, cookie; i < c.length; i__) {
      cookie = c[i].split('=').invoke('strip');
      if (cookie[0] === name) return cookie[1];
    }
    
    return null;
  },
  
  erase: function(name) {
    return Cookie.set(name, "", -1);
  }
});
