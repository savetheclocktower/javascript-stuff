// Mixin for linking an element and a widget instance that controls its
// behavior. (Storing the instance as a property of the element itself
// leads to memory leaks.)
// 
// Usage:
// 
// var TableWidget = Class.create(Bindable, {
//   initialize: function(element, options) {
//     this.element = $(element);
//     this.bindToElement();
//     /* ... */
//   }
// 
//   /* ... */  
// });
// 
// To retrieve an instance:
// 
// $('some_table').getInstanceOf(TableWidget);

var Bindable = {
  bindToElement: function(element) {
    element = element || this.element;
    var id  = element.identify();

    if (this.constructor._instances)
      this.constructor._instances = {};

    this.constructor._instances[id] = this;
  }
};

Element.addMethods({
  getInstanceOf: function(element, klass) {
    element = $(element);
    var instances = klass._instances;

    if (instances && element.id && instances[element.id]) {
      return instances[element.id];
    } else {
      throw "Must call Bindable#bindToElement first."
    }
  }
});