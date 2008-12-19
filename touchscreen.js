CSH = {};
CSH.runTouch = function() {
  var screenLayout = new CSH.touchscreen.ScreenLayout();
  CSH.ts.StateManager.getInstance().screenLayout = screenLayout;
  
  var bottomBar = new CSH.touchscreen.BottomBar();
  screenLayout.addChild({item: bottomBar.getContent(), location: CSH.touchscreen.ScreenLayout.BOTTOM});
  
  document.body.appendChild(screenLayout.getContent());
  
  thetr.event.listen({
    on:CSH.ts.StateManager.getInstance(),
    action: 'changeuser',
    handler: bottomBar.handleUserChange,
    scope: bottomBar
  });
  thetr.event.listen({
    on:CSH.ts.StateManager.getInstance(),
    action: 'dropping',
    handler: bottomBar.handleDropping,
    scope: bottomBar
  });

  //var displayWelcome = new CSH.ts.DisplayWelcome();
  //CSH.ts.StateManager.getInstance().switchDisplay({display: displayWelcome});
  CSH.ts.StateManager.getInstance().startOver();
};

CSH.touchscreen = {};
// Set up a shorthand of ts for touchscreen scope!
CSH.ts = CSH.touchscreen;

CSH.touchscreen.StateManager = function() {
  this.user = null;
  this.machines = [];
  this.currentMachine = null;
  this.screenLayout = null;
  
  this.displayWelcome = null;
  this.displayChoice = null;
}

CSH.touchscreen.StateManager.prototype.initializeVariables = function() {
  this.displayWelcome = new CSH.ts.DisplayWelcome();
  this.displayChoice = new CSH.ts.DisplayChoice();
  this.displaySlots = new CSH.ts.DisplaySlots();
  
  this.setUpTransistions();
  
  this.loadMachines();
}

CSH.touchscreen.StateManager.prototype.setUpTransistions = function() {
  thetr.event.listen({
    on: this.displayWelcome,
    action: 'authenticated',
    handler: this.handleAuthenticated,
    scope: this
  });
  
  thetr.event.listen({
    on: this.displayChoice,
    action: 'select',
    handler: this.handleMachineSelected,
    scope: this
  });
  
  thetr.event.listen({
    on: this.displaySlots,
    action: 'drop',
    handler: this.handleDrop,
    scope: this
  });
  
  thetr.event.listen({
    on: this.displaySlots,
    action: 'dropping',
    handler: this.handleDropping,
    scope: this
  });
}

CSH.touchscreen.StateManager.prototype.loadMachines = function() {
  // TODO(adinardi): Call remote for machine data
  var req = new thetr.Request({
    url: '/' + touchscreenName + '/main/list_machines',
    handler: this.handleLoadMachines,
    scope: this
  });
  req.send();
  //this.handleLoadMachines();
}

CSH.touchscreen.StateManager.prototype.handleLoadMachines = function(req) {
  var data = eval('[' + req.data + ']');
  var machs = data[0].machines;
  //var d = "[{name:'drink',displayName:'Big Drink',slots:5}]";
  //var data = eval(d);
  this.machines = [];
  for (var iter = 0, m; m = machs[iter]; iter++) {
    var machine = new CSH.Machine(m);
    this.machines.push(machine);
  }
  
  if (this.onupdatemachines) {
    console.log('onupdatemachines');

    this.onupdatemachines();
  }
}

CSH.touchscreen.StateManager.prototype.setUser = function(args) {
  this.user = args.user;
  if (this.onchangeuser) {
    this.onchangeuser();
  }
}

CSH.touchscreen.StateManager.prototype.getUser = function() {
  return this.user;
}

/**
 * @param {CSH.Machine} currentMachine
 */
CSH.touchscreen.StateManager.prototype.setCurrentMachine = function(args) {
  this.currentMachine = args.currentMachine;
  
  if (this.onchangemachine) {
    this.onchangemachine();
  }
}

CSH.touchscreen.StateManager.prototype.getCurrentMachine = function() {
  return this.currentMachine;
}

CSH.touchscreen.StateManager.prototype.clear = function() {
  this.user = null;
  this.currentMachine = null;
  if (this.onchangeuser) {
    this.onchangeuser();
  }
  if (this.onchangemachine) {
    this.onchangemachine();
  }
}

CSH.touchscreen.StateManager.prototype.logout = function() {
  this.clear();
  //this.switchDisplay({display: this.displayWelcome});
  this.startOver();
}

CSH.touchscreen.StateManager.prototype.onchangeuser = null;
CSH.touchscreen.StateManager.prototype.onchangemachine = null;
CSH.touchscreen.StateManager.prototype.ondropping = null;

/**
 * Event for when all machine data is updated.
 */
CSH.touchscreen.StateManager.prototype.onupdatemachines = null;

CSH.touchscreen.StateManager.getInstance = function() {
  if (!CSH.touchscreen.StateManager.instance) {
    CSH.touchscreen.StateManager.instance = new CSH.ts.StateManager();
    CSH.touchscreen.StateManager.instance.initializeVariables();
  }
  
  return CSH.touchscreen.StateManager.instance;
}

CSH.touchscreen.StateManager.prototype.switchDisplay = function(args) {
  if (args.display && this.screenLayout) {
    args.display.resetAndDisplay();
    this.screenLayout.addChild({item: args.display.getContent(), location: CSH.ts.ScreenLayout.MIDDLE});
  }
}

CSH.touchscreen.StateManager.prototype.getMachines = function() {
  return this.machines;
}

CSH.touchscreen.StateManager.prototype.startOver = function() {
  this.screenLayout.topLoc.innerHTML = 'Welcome!';
  this.switchDisplay({display: this.displayWelcome});
}

CSH.touchscreen.StateManager.prototype.handleAuthenticated = function() {
  if (this.machines.length == 1) {
    this.displayChoice.handleChoiceClick({machine: this.machines[0]});
  } else {
    this.screenLayout.topLoc.innerHTML = 'Select a Machine';
    this.switchDisplay({display: this.displayChoice});
  }
}

CSH.touchscreen.StateManager.prototype.handleMachineSelected = function() {
  this.screenLayout.topLoc.innerHTML = 'Select an Item';
  this.switchDisplay({display: this.displaySlots});
}

CSH.touchscreen.StateManager.prototype.handleDrop = function() {
  //this.screenLayout.topLoc.innerHTML = 'Thank you...';
  //this.switchDisplay({display: this.displayWelcome});
  this.logout();
  this.startOver();
}

CSH.touchscreen.StateManager.prototype.handleDropping = function() {
  if (this.ondropping) {
    this.ondropping();
  }
}

/**
 * Manager for the center of the screen
 */
CSH.touchscreen.DisplayManager = function() {
  
}

/**
 * Class which represents a center of the screen displayable item
 */
CSH.touchscreen.Display = function() {
  
}

CSH.touchscreen.Display.prototype.getContent = function() {
  
}

CSH.touchscreen.BottomBar = function() {
  this.root = null;
}

CSH.touchscreen.BottomBar.prototype.getContent = function() {
  if (!this.root) {
    this.root = document.createElement('div');
    this.root.style.height = '50px';
    this.root.style.width = '785px';
    this.root.className = 'bottomBar';
    
    this.switchButton = new CSH.ts.Button({text: 'Switch Machine', height:50, width:200, cssFloat:'left', className:'bottomButtons'});
    this.logoutButton = new CSH.ts.Button({text: 'Logout', height:50, width:200, cssFloat:'left', className:'bottomButtons'});
    this.switchButton.disabled();
    this.logoutButton.disabled();
        
    this.infoPanel = document.createElement('div');
    this.infoPanel.style.width = '378px';
    this.infoPanel.style.height = '50px';
    this.infoPanel.style.cssFloat = 'left';
    this.infoPanel.style.styleFloat = 'left';
    this.infoPanel.className = 'infoPanel';
    
    this.root.appendChild(this.switchButton.getContent());
    this.root.appendChild(this.infoPanel);
    this.root.appendChild(this.logoutButton.getContent());
    
    thetr.event.listen({
      on: this.logoutButton,
      action: 'click',
      handler: this.handleLogoutClick,
      scope: this
    });
    thetr.event.listen({
      on: this.switchButton,
      action: 'click',
      handler: this.handleSwitchClick,
      scope: this
    });
  }
  
  return this.root;
}

CSH.touchscreen.BottomBar.prototype.handleUserChange = function(e) {
  this.getContent();
  //console.log('handling user change');
  var user = CSH.ts.StateManager.getInstance().getUser();
  if (user) {
    this.infoPanel.innerHTML = 'Logged in as ' + user.username + '<br>' + user.credits + ' credits remaining';
    this.logoutButton.enabled();
    this.switchButton.enabled();
  } else {
    this.infoPanel.innerHTML = '';
    this.logoutButton.disabled();
    this.switchButton.disabled();
  }
}

CSH.touchscreen.BottomBar.prototype.handleLogoutClick = function(e) {
  CSH.ts.StateManager.getInstance().logout();
}

CSH.touchscreen.BottomBar.prototype.handleSwitchClick = function(e) {
  CSH.ts.StateManager.getInstance().handleAuthenticated();
}

CSH.touchscreen.BottomBar.prototype.handleDropping = function(e) {
  this.switchButton.disabled();
}

CSH.touchscreen.HeaderBar = function() {
  
}

/**
 * @param {string} text Button display text
 * @param {number} height Height of the button
 * @param {number} width Width of the button
 */
CSH.touchscreen.Button = function(args) {
  this.text = args.text;
  this.height = args.height;
  this.width = args.width;
  this.cssFloat = args.cssFloat;
  this.isenabled = true;
  this.specialClass = args.className;
}

CSH.touchscreen.Button.prototype.onclick = null;

CSH.touchscreen.Button.prototype.getContent = function() {
  if (!this.root) {
    this.root = document.createElement('div');
    this.root.style.height = this.height + 'px';
    this.root.style.width = this.width + 'px';
    this.root.style.cssFloat = this.cssFloat;
    this.root.style.styleFloat = this.cssFloat;
    
    //this.root.className = 'button' + (this.isenabled ? '' : ' buttonDisabled');
    this.updateClass();
    this.root.innerHTML = this.text;
    
    thetr.event.listen({
      on: this.root,
      action: 'click',
      handler: this.handleClick,
      scope: this
    });
  }
  
  return this.root;
}

CSH.touchscreen.Button.prototype.handleClick = function(e) {
  if (this.isenabled && this.onclick) {
    this.onclick();
  }
}

CSH.touchscreen.Button.prototype.setText = function(args) {
  if (args.text && this.text != args.text) {
    this.text = args.text;
    if (this.root) {
      this.root.innerHTML = args.text;
    }
  }
}

CSH.touchscreen.Button.prototype.setContent = function(args) {
  this.getContent();
  
  if (args.content) {
    if (this.root) {
      if (this.root.firstChild) {
        this.root.removeChild(this.root.firstChild);
      }
      this.root.appendChild(args.content);
    }
    
    this.content = args.content;
  }
}

CSH.touchscreen.Button.prototype.setProperties = function(args) {
  this.getContent();
  
  if (args.height) {
    this.height = args.height;
    this.root.style.height = this.height + 'px';
  }
  if (args.width) {
    this.width = args.width;
    this.root.style.width = this.width + 'px';
  }
  if (args.cssFloat) {
    this.root.style.cssFloat = args.cssFloat;
    this.root.style.styleFloat = args.cssFloat;
  }
  if (args.className) {
    this.specialClass = args.className;
    this.updateClass();
  }
}

CSH.touchscreen.Button.prototype.updateClass = function() {
  if (this.root) {
    this.root.className = 'button' + (this.isenabled ? '' : ' buttonDisabled') + (this.specialClass ? ' ' + this.specialClass : '');
  }
}

CSH.touchscreen.Button.prototype.enabled = function() {
  this.isenabled = true;
  /*if (this.root) {
    this.root.className = 'button';
  }*/
  this.updateClass();
}

CSH.touchscreen.Button.prototype.disabled = function() {
  this.isenabled = false;
  /*if (this.root) {
    this.root.className = 'button buttonDisabled';
  }*/
  this.updateClass();
}

CSH.touchscreen.Button.prototype.hide = function() {
  this.getContent();
  
  this.root.style.display = 'none';
}

CSH.touchscreen.Button.prototype.show = function() {
  this.getContent();
  
  this.root.style.display = '';
}