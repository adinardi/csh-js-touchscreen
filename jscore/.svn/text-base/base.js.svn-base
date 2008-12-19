/**
 * @fileoverview This is the base file for the Lite Web Toolkit JSCore
 */

/**
 * Base namespace.
 */
thetr = {};
thetr.baseLoader = null;
thetr.getBaseLoader = function(baseLoc) {
  if (!thetr.baseLoader) {
    var loader = new thetr.Loader();
    loader.addFiles([
      baseLoc + 'Common.js',
      baseLoc + 'table.js',
      baseLoc + 'dstable.js'
    ]);
    
    thetr.baseLoader = loader;
  }
  return thetr.baseLoader;
};

thetr.argumentChecker = function(var_args) {
  
};

/**
 * Have a sub class inherit from base classes. Multiple inheritance is A-OK. 
 * Subclass ends up with a *magical* this.super() which takes an args object and 
 * calls each superclass's constructor with it in the order of inheritance.
 * Inheritance order is that the first in the array is inherited first, thus the
 * last will take precidence.
 * 
 * @param {class} sub Subclass which is inheriting from base classes
 * @param {class | null} base Base class to inherit from
 * @param {Array<class> | null} bases Base classes to inherit from.
 */
thetr.inherit = function(args) {
  var sub = args.sub;
  var bases = args.bases || [args.base] || [];
  for (var iter = 0, f; f = bases[iter]; iter++) {
    for (var i in f.prototype) {
      sub.prototype[i] = f.prototype[i];
    }
    //sub.prototype['super' +  = f;
  }
  // TODO (adinardi): This is a bit ugly. Also find a way to make them individually callable
  sub.prototype.supers = function(args) {
      for (var iter = 0; s = bases[iter]; iter++) {
        s.call(this, args);
      }
    };
};

thetr.console = {};

thetr.console.log = function(a1) {
  //alert(a1);
  //document.write(a1 + "<br>");
};

if (typeof console == 'undefined') {
  console = thetr.console;
}