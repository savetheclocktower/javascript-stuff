Form.GhostedField = Class.create({
  initialize: function(element, title, options) {
    this.element = $(element);
    this.title = title;
    
    this.isGhosted = true;
    
    if (options.cloak) {
      // Wrap the native getValue function so that it never returns the
      // ghosted value. This is optional because it presumes the ghosted
      // value isn't valid input for the field.
      this.element.getValue = this.element.getValue.wrap(this.wrappedGetValue.bind(this));      
    }    
    
    this.addObservers();
    this.onBlur();
  },
  
  wrappedGetValue: function($proceed) {
    var value = $proceed();
    return value === this.title ? "" : value;
  },
  
  addObservers: function() {
    this.element.observe('focus', this.onFocus.bind(this));
    this.element.observe('blur',  this.onBlur.bind(this));
    
    var form = this.element.up('form');
    if (form) {
      form.observe('submit', this.onSubmit.bind(this));
    }
    
    // Firefox's bfcache means that form fields need to be re-initialized
    // when you hit the "back" button to return to the page.
    if (Prototype.Browser.Gecko) {
      window.addEventListener('pageshow', this.onBlur.bind(this), false);
    }
  },
  
  onFocus: function() {
    if (this.isGhosted) {
      this.element.setValue('');
      this.setGhosted(false);
    }
  },
  
  onBlur: function() {
    var value = this.element.getValue();
    if (value.blank() || value == this.title) {
      this.setGhosted(true);
    } else {
      this.setGhosted(false);
    }
  },
  
  setGhosted: function(isGhosted) {
    this.isGhosted = isGhosted;
    this.element[isGhosted ? 'addClassName' : 'removeClassName']('ghosted');
    if (isGhosted) {
      this.element.setValue(this.title);
    }    
  },

  // Hook into the enclosing form's `onsubmit` event so that we clear any
  // ghosted text before the form is sent.
  onSubmit: function() {
    if (this.isGhosted) {
      this.element.setValue('');
    }
  }
});