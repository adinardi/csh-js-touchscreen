/*
Copyright (c) 2008, Angelo DiNardi (adinardi@csh.rit.edu)
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


function ibutton_recieved(id) {
  CSH.ts.StateManager.getInstance().displayWelcome.handleiButton(id);
}

CSH.touchscreen.DisplayWelcome = function() {
  this.root = null;
}

CSH.touchscreen.DisplayWelcome.prototype.onibutton = null;

CSH.touchscreen.DisplayWelcome.prototype.getContent = function() {
  if (!this.root) {
    this.root = document.createElement('div'); 
  }
  
  return this.root;
}

CSH.touchscreen.DisplayWelcome.prototype.resetAndDisplay = function() {
  this.getContent();
  this.root.innerHTML = 'Touch iButton to continue...';
  // + '<div style="height:400px; overflow:auto"><img src="XXVII-VII.jpg" width="800px"></div>';
  
  // Temporary button until I can get iButton stuff.
  var loginBtn = new CSH.ts.Button({text: 'Touch my iButton', height:50, width:200, className:'bottomButtons'});
  if (ibuttonID) {
    this.root.appendChild(loginBtn.getContent());
  }

  thetr.event.listen({
    on: loginBtn,
    action: 'click',
    handler: this.handlemyiButton,
    scope: this
  });
  /*
  var a= document.createElement('div');
  a.innerHTML = '<a href="http://zule.csh.rit.edu/v2/index.html?touch3">Refresh</a>';
  this.root.appendChild(a);
  */
}

CSH.touchscreen.DisplayWelcome.prototype.handlemyiButton = function() {
  ibutton_recieved(ibuttonID);
}

CSH.touchscreen.DisplayWelcome.prototype.handleiButton = function(id) {
  this.root.innerHTML = 'Authenticating...';

  // TODO(adinardi): Call to backend here and auth. This is a placeholder.
  var req = new thetr.Request({
    url: '/' + touchscreenName + '/main/auth_ibutton_new_global?ibutton=' + id,
    handler: this.handleAuthenticated,
    scope: this
  });
  req.send();
  //this.handleAuthenticated();
}

CSH.touchscreen.DisplayWelcome.prototype.handleAuthenticated = function(req) {
  var data = (eval('[' + req.data + ']'))[0];
  console.log('yo', data );
  if (data.code == 'fail') {
    // Failed. Do something.
  } else {
    console.log(new CSH.User(data.user));
    CSH.ts.StateManager.getInstance().setUser({user:new CSH.User(data.user)});
  }
  if (this.onauthenticated) {
    this.onauthenticated();
  } 
}

CSH.touchscreen.DisplayChoice = function() {
  this.root = null;
  this.buttons = [];

  thetr.event.listen({
    on: CSH.ts.StateManager.getInstance(),
    action: 'updatemachines',
    handler: this.handleMachineUpdate,
    scope: this
  });
}

CSH.touchscreen.DisplayChoice.prototype.resetAndDisplay = function() {
  this.getContent();

  //this.root.innerHTML = 'choose';
}

CSH.touchscreen.DisplayChoice.prototype.handleMachineUpdate = function(e) {
  var machines = CSH.ts.StateManager.getInstance().getMachines();
  this.getContent();
  
  this.root.innerHTML = '';
  var width = 266;
  var height = 108;
  
  console.log('machine update');
  for (var iter = 0, machine; machine = machines[iter]; iter++) {
    console.log(machine);
    if (this.buttons[iter]) {
      console.log('reuse button');
      var btn = this.buttons[iter];
      btn.setText({text: machine.displayName});
    } else {
      console.log('add button: ', machine);
      //if (!(machines.length > 2 && iter == 0)) {
        var m = (478 - (machines.length * 108)) / (machines.length+1);
        var b2 = new CSH.ts.Button({text: '&nbsp;', height:m, width:width, className:'emachineButton'});
        this.root.appendChild(b2.getContent());
      //}
      var btn = new CSH.ts.Button({text: machine.displayName, height:height, width:width, className:'machineButton'});
      this.root.appendChild(btn.getContent());
      this.buttons[iter] = btn;
      thetr.event.listen({
        on: btn,
        action: 'click',
        handler: this.handleChoiceClick,
        scope: this,
        args: {machine: machine}
      });
    }
  }
  this.root.style.width = ((width + 2)) + 'px';
}

CSH.touchscreen.DisplayChoice.prototype.getContent = function() {
  if (!this.root) {
    this.root = document.createElement('div');
    this.root.style.marginLeft = 'auto';
    this.root.style.marginRight = 'auto';
  }
  
  return this.root;
}

CSH.touchscreen.DisplayChoice.prototype.handleChoiceClick = function(args) {
  CSH.ts.StateManager.getInstance().setCurrentMachine({currentMachine: args.machine});
  if (this.onselect) {
    this.onselect();
  }
}

CSH.touchscreen.DisplaySlots = function() {
  this.root = null;
  this.slots = [];
  this.maxSlots = 19;
  this.currentSlots = 19;
  
  thetr.event.listen({
    on: CSH.ts.StateManager.getInstance(),
    action: 'changemachine',
    handler: this.handleUpdateMachine,
    scope: this
  });
}

CSH.touchscreen.DisplaySlots.prototype.handleUpdateMachine = function() {
  this.getContent();
  
  //this.root.innerHTML = 'Loading...';
  this.messageDiv.innerHTML = 'Loading...';
  this.slotContainer.style.display = 'none';
  
  this.machine = CSH.ts.StateManager.getInstance().getCurrentMachine();
  if (this.machine) {
    thetr.event.listen({
      on: this.machine,
      action: 'updateslots',
      handler: this.handleUpdateSlots,
      scope: this
    });
    this.machine.loadSlots();
  }
}

CSH.touchscreen.DisplaySlots.prototype.handleUpdateSlots = function() {
  //console.log('handleUpdateSlots');
  var slots = this.machine.getSlots();
  var user_c = parseInt(CSH.ts.StateManager.getInstance().getUser().credits);
  var count = 0;
  for (var iter = 1, slot; slot = this.slots[iter]; iter++) {
    if (slots[iter]) {
      count++;
      slot.button.show();
      var s = slots[iter];
      //slot.setText({text: '<img src="/images/' + s.name.toLowerCase() + '.gif">' + s.name + '<br>' + s.quantity + ' left<br>' + s.price + ' credits'});
      slot.setProperties({
        name: s.name,
        quantity: s.quantity,
        price: s.price
      });
      if (parseInt(s.quantity) <= 0 || parseInt(s.price) > user_c) {
        slot.button.disabled();
      } else {
        slot.button.enabled();
      }
    } else {
      slot.button.disabled();
      slot.button.hide();
    }
  }
  var width = (770 / Math.ceil(count / 4));
  for (var iter = 1, slot; slot = this.slots[iter]; iter++) {
    slot.setProperties({width: width});
  }
  this.messageDiv.innerHTML = '';
  this.slotContainer.style.display = '';
}

CSH.touchscreen.DisplaySlots.prototype.handleClickSlot = function(args) {
  var s = this.machine.getSlots()[args.slotNum];
  if (s) {
    if (this.ondropping) {
      this.ondropping();
    }
    this.slotContainer.style.display = 'none';
    this.messageDiv.innerHTML = 'Dropping a ' + s.name;
  
    var req = new thetr.Request({
      url: '/' + touchscreenName + '/' + this.machine.name + '/drop_drink_new?slot=' + args.slotNum,
      handler: this.handleDropped,
      scope: this
    });
    req.send();
  } else {
    // TODO(adinardi): Failure.
  }
}

CSH.touchscreen.DisplaySlots.prototype.handleDropped = function(req) {
  var data = (eval('[' + req.data + ']'))[0];
  if (data.code == 'success') {
    if (this.ondrop) {
      this.ondrop();
    }
  } else {
    // TODO(adinardi): FAILED
  }
}

CSH.touchscreen.DisplaySlots.prototype.resetAndDisplay = function() {
  this.getContent();
  
  this.messageDiv.innerHTML = 'Loading...';
  this.slotContainer.style.display = 'none';
}

CSH.touchscreen.DisplaySlots.prototype.getContent = function() {
  if (!this.root) {
    this.root = document.createElement('div');
    this.messageDiv = document.createElement('div');
    this.root.appendChild(this.messageDiv);
    this.slotContainer = document.createElement('div');
    
    for (var iter = 1; iter <= this.maxSlots; iter++) {
      //var s = new CSH.ts.Button({text: 'Slot ' + iter, height: 100, width:200, cssFloat:'left'});
      var s = new CSH.ts.SlotRender({height: 100, width:200, cssFloat:'left'});
      this.slots[iter] = s;
      this.slotContainer.appendChild(s.getContent());
      
      thetr.event.listen({
        on:s,
        action: 'click',
        handler: this.handleClickSlot,
        scope: this,
        args: {slotNum: iter}
      });
    }
    this.root.appendChild(this.slotContainer);
  }
  
  return this.root;
}

CSH.touchscreen.SlotRender = function(args) {
  this.button = null;
  
  this.name = null;
  this.price = null;
  this.quantity = null;
  
  this.nameElem = null;
  this.priceElem = null;
  this.quantityElem = null;
  this.imgElem = null;
  
  this.setProperties(args);
}

CSH.touchscreen.SlotRender.prototype.setProperties = function(args) {
  this.getContent();
  
  if (args.name && args.name != this.name) {
    this.name = args.name;
    this.nameElem.innerHTML = this.name;
    //OLD: this.imgElem.src = '/images/' + this.name.toLowerCase() + '.gif';
    this.imgElem.src = 'http://www.csh.rit.edu/~parallax/buttonimage.php?name=' + this.name.toLowerCase() + '&size=50';
  }
  
  if (args.price != undefined && args.price != this.price) {
    this.price = args.price;
    this.priceElem.innerHTML = this.price + ' credits';
  }
  
  if (args.quantity != undefined && args.quantity != this.quantity) {
    this.quantity = args.quantity;
    var qs = '';
    if (this.quantity == 1) {
      qs = 'Available';
    } else if (this.quantity == 0) {
      qs = 'Sold Out';
    } else {
      qs = this.quantity + ' left';
    }
    this.quantityElem.innerHTML = qs;
  }
  
  this.button.setProperties(args);
}

CSH.touchscreen.SlotRender.prototype.getContent = function() {
  if (!this.button) {
    this.button = new CSH.ts.Button({width:50, height:50, className: 'slotButton'});
    this.root = document.createElement('div');
    this.root.className = 'slotContainer';
    
    this.nameElem = document.createElement('div');
    this.nameElem.className = 'slotName';
    
    this.priceElem = document.createElement('div');
    this.priceElem.className = 'slotPrice';
    
    this.quantityElem = document.createElement('div');
    this.quantityElem.className = 'slotQuantity';
    
    this.imgElem = document.createElement('img');
    this.imgElem.className = 'slotImg';
  
    this.root.appendChild(this.imgElem);
    this.root.appendChild(this.quantityElem);
    this.root.appendChild(this.priceElem);
    this.root.appendChild(this.nameElem);
  
    this.button.setContent({content: this.root});
    
    thetr.event.listen({
      on: this.button,
      action: 'click',
      handler: this.handleClick,
      scope: this
    });
  }
  return this.button.getContent();
}

CSH.touchscreen.SlotRender.prototype.handleClick = function() {
  if (this.onclick) {
    this.onclick();
  }
}
