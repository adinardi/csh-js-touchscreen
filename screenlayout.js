
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
