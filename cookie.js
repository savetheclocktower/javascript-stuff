//= require <prototype>

if (!Prototype || Prototype.Version.indexOf('1.6') !== 0) {
  throw "This script requires Prototype >= 1.6.";
}

Object.isDate = function(object) {
  return object instanceof Date;
};

/** 
 *  class Cookie
 *  Creates a cookie.
**/
var Cookie = Class.create({
  /**
   *  new Cookie(name, value[, expires])
   *  
   *  - name (String): The name of the cookie.
   *  - value (String): The value of the cookie.
   *  - expires (Number | Date): Exact date (or number of days from now) that
   *     the cookie will expire.
  **/
  initialize: function(name, value, expires) {
    if (Object.isNumber(expires)) {
      var days = expires;
      expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    }
    
    if (Object.isDate(expires))
      expires = expires.toGMTString();

    if (!Object.isUndefined(expires) && expires !== "")
      expires = "; expires=" + expires;
    
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

/**
 *  namespace Cookie
**/
Object.extend(Cookie, {
  /**
   *  Cookie.set(name, value, expires)
   *  
   *  Alias of [[Cookie#initialize]].
  **/
  set: function(name, value, expires) {
    return new Cookie(name, value, expires);
  },
  
  /**
   *  Cookie.get(name)
   *  
   *  Returns the value of the cookie with the given name.
   *  - name (String): The name of the cookie to retrieve.
  **/
  get: function(name) {
    var c = document.cookie.split(';');
    
    for (var i = 0, cookie; i < c.length; i++) {
      cookie = c[i].split('=');
      if (cookie[0].strip() === name)
        return cookie[1].strip();
    }
    
    return null;
  },
  
  /**
   *  Cookie.unset(name)
   *  
   *  Deletes a cookie.
   *  - name (String): The name of the cookie to delete.
   *  
  **/
  unset: function(name) {
    return Cookie.set(name, "", -1);
  }
});

Cookie.erase = Cookie.unset;
