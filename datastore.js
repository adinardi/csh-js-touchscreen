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


/**
 * @param {string} username
 * @param {number} credits
 * @param {number} admin
 */
CSH.User = function(args) {
  this.username = args.username || args.user || '';
  this.credits = args.credits || args.balance || 0;
  this.isadmin = parseInt(args.admin) || 0;
}

CSH.Machine = function(args) {
  this.name = args.name;
  this.displayName = args.displayName;
  this.numberOfSlots = args.numberOfSlots || args.slots;
  this.slots = [];
};

CSH.Machine.prototype.loadSlots = function() {
  var req = new thetr.Request({
    url: '/' + touchscreenName + '/' + this.name + '/stats_new/',
    handler: this.handleLoadSlots,
    scope: this
  });
  req.send();
}

CSH.Machine.prototype.handleLoadSlots = function(req) {
  var data = (eval('[' + req.data + ']'))[0];
  console.log('slot data: ', data);
  
  if (data.code == 'fail') {
    // Some Failure State.
  } else {
    for (var iter = 0, slot; slot = data.slots[iter]; iter++) {
      var s = new CSH.Slot(slot);
      this.slots[s.slotNum] = s;
    }
  }
  
  if (this.onupdateslots) {
    this.onupdateslots();
  }
}

CSH.Machine.prototype.getSlots = function() {
  return this.slots;
}

CSH.Slot = function(args) {
  this.name = args.name;
  this.price = args.price;
  this.quantity = args.quantity;
  this.slotNum = args.slotNum;
};