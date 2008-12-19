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
 * Layout container for the whole screen
 */
CSH.touchscreen.ScreenLayout = function() {
  this.root = null;
}

CSH.touchscreen.ScreenLayout.TOP = 1;
CSH.touchscreen.ScreenLayout.MIDDLE = 2;
CSH.touchscreen.ScreenLayout.BOTTOM = 3;

/**
 * @param {CSH.touchscreen.DisplayItem} item Item to display in the given location
 * @param {number} location Screen location
 */
CSH.touchscreen.ScreenLayout.prototype.addChild = function(args){
  this.getContent();

  var item = args.item;
  var location = args.location;
  
  var locElem = null;
  if (location == CSH.touchscreen.ScreenLayout.TOP) {
    locElem = this.topLoc;
  } else if (location == CSH.touchscreen.ScreenLayout.MIDDLE) {
    locElem = this.middleLoc;
  } else if (location == CSH.touchscreen.ScreenLayout.BOTTOM) {
    locElem = this.bottomLoc;
  }
  
  if (locElem) {
    if (locElem.firstChild) {
      locElem.removeChild(locElem.firstChild);
    }
    locElem.appendChild(item);
  }
}

CSH.touchscreen.ScreenLayout.prototype.getContent = function() {
  if (!this.root) {
    this.root = document.createElement('div');
    this.topLoc = document.createElement('div');
    this.topLoc.className = 'topScreenLocation';
    this.middleLoc = document.createElement('div');
    this.middleLoc.className = 'middleScreenLocation';
    this.bottomLoc = document.createElement('div');
    this.bottomLoc.className = 'bottomScreenLocation';

    this.root.appendChild(this.topLoc);
    this.root.appendChild(this.middleLoc);
    this.root.appendChild(this.bottomLoc);
  }
  
  return this.root;
}
