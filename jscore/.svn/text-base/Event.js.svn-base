thetr.event = {};

/**
 * Listen for events fired from an object
 * @param {object} on Object to listen on
 * @param {string} action Event to listen for
 * @param {pointer} handler Handler function pointer for responses
 * @param {object | null} scope The scope to call the Handler function in
 */
thetr.event.listen = function(args) {
  var event;
  if (thetr.event.eventsOn[args.on]) {
    event = thetr.event.eventsOn[args.on];
    event.addHandler(args);
    //console.log( 'added to existing');
  } else {
    event = new thetr.event.Event(args);
    thetr.event.eventsById[event.id] = event;
    event.attach();
    //console.log( 'added new');
  }
};

/**
 * Stop Listening to events fired from an object
 * Everything besides on is optional. This will try and remove listeners based
 * on what is passed and the rest are considered "wildcards"
 * @param {object} on Object to stop listening on
 * @param {string | null} action Event to stop listening for
 * @param {pointer | null} handler Handler function pointer
 * @param {object | null} scope Scope for handler
 */
thetr.event.unlisten = function(args) {
  //TODO (angelo): Implement this :)
};

thetr.event.nextEventId = 1;
thetr.event.eventsOn = {};
thetr.event.eventsById = {};

/**
 * Object representing a registered event.
 * 
 */
thetr.event.Event = function(args) {
  this.id = thetr.event.nextEventId++;
  this.on = args.on;
  this.action = args.action;
  this.handlers = [];
  this.handlersByHandler = {};
  this.handlersByScope = {};
  
  this.addHandler(args);
};

/**
 * Add a handler which should be called when this event is fired.
 * @param {pointer} handler Function pointer for handler to call
 * @param {object | null} scope Object which handler should be called on
 */
thetr.event.Event.prototype.addHandler = function(args) {
  if (args.handler) {
    var handler = {handler:args.handler, scope: args.scope, args: args.args};
    this.handlers.push(handler);
    if (!this.handlersByHandler[args.handler]) {
      this.handlersByHandler[args.handler] = {};
    }
    this.handlersByHandler[args.handler] = handler;
    
    if (!this.handlersByScope[args.scope]) {
      this.handlersByScope[args.scope] = {};
    }
    this.handlersByScope[args.scope] = handler;
    
  }
};

/**
 * Attach this Event on to the object/element it handles events for
 */
thetr.event.Event.prototype.attach = function() {
  var callMe = 'thetr.event.Event.fireFromElement(' + this.id + ')';
  this.on['on' + this.action] = function() {eval(callMe);};
  //this.on.thetr_event_code = this.id;
  //this.on['on' + this.action] = thetr.event.Event.fireFromElement;
};

/**
 * Fires off this event to all of the registered handlers
 */
thetr.event.Event.prototype.engage = function() {
  //console.log('engage ' + this.action);
  for (var iter = 0, handler; handler = this.handlers[iter]; iter++) {
    if (handler.scope) {
      //console.log('engage with scope');
      handler.handler.call(handler.scope, handler.args);
    } else {
      //console.log('engaging with window scope');
      handler.handler.call(window, handler.args);
    }
  }
};

/**
 * Static method which is called from the anon function placed on objects we're 
 * handling events for. See attach.
 */
thetr.event.Event.fireFromElement = function(id) {
  //console.log('firing from event: ', id);
  if (thetr.event.eventsById[id]) {
    //console.log('success');
    thetr.event.eventsById[id].engage();
  }
};