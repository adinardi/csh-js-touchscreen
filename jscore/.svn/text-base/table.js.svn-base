/**
 * @param {number} rows
 * @param {Array} columns Array of column objects
 *    Column Object: {string} id, {string} name, {number} size
 * @param {boolean | null} headers Show a header row?
 */
thetr.Table = function(args) {
  this.columns = args.columns;
  this.rowCount = 0;
  this.enableHeader = args.headers || false;
  
  this.rootNode = null;
  this.headerRowElement = null;
  this.rows = [];
  
  this.setRowCount({count: args.rows});
};

thetr.Table.prototype.getRootNode = function() {
  if (!this.rootNode) {
    this.rootNode = document.createElement('div');
    if (this.enableHeader) {
      this.rootNode.appendChild(this.getHeaderRow());
    }
    //this.buildRows();
    //this.setRowCount({count: this.rowCount});
  }
  
  return this.rootNode;
};

/**
 * Set the number of rows this table contains
 * @param {number} count The number of rows
 */
thetr.Table.prototype.setRowCount = function(args) {
  var newCount = args.count;
  
  // See if this is how many rows we're already displaying.
  if (this.rowCount == newCount) {
    return;
  }
  var rootNode = this.getRootNode();
  if (this.rowCount > newCount) {
    for (var iter = this.rowCount, row; row = this.rows[iter] && iter > newCount; iter--) {
      try {
        rootNode.removeChild(row.rootNode);
      } catch(e) {
        // Uh yeah. Guess we're okay.
      }
      this.rows.splice(iter, 1);
    }
    //this.rows.splice(newCount, this.rowCount - newCount);
  } else {
    for (var iter = this.rowCount; iter < newCount; iter++) {
      var row = this.getRow({row: iter});
      rootNode.appendChild(row.rootNode);
    }
  }
  
  this.rowCount = newCount;
};

/**
 * Fetch a row object for a specific row #. If it doesn't exist it'll be created.
 * @param {number} row The row number to fetch.
 */
thetr.Table.prototype.getRow = function(args) {
  // See if we have a row, or make one
  if (!this.rows[args.row]) {
    var root = document.createElement('div');
    root.style.clear = 'left';
    var row = {rootNode: root};
    
    for (var iter = 0, col; col = this.columns[iter]; iter++) {
      var colElem = document.createElement('div');
      colElem.style.width = col.size + 'px';
      colElem.style.cssFloat = 'left';
      colElem.style.styleFloat = 'left';
      colElem.style.overflow = 'hidden';
      colElem.innerHTML = '&nbsp;';
      root.appendChild(colElem);
      row[col.id] = colElem;
    }
    this.rows[args.row] = row;
  }
  
  return this.rows[args.row];
};

thetr.Table.prototype.getHeaderRow = function() {
  if (!this.headerRowElement) {
    var root = document.createElement('div');
    root.style.clear = 'left';
    for (var iter = 0, col; col = this.columns[iter]; iter++) {
      var colElem = document.createElement('div');
      colElem.style.width = col.size + 'px';
      colElem.innerHTML = col.name;
      colElem.style.cssFloat = 'left';
      colElem.style.styleFloat = 'left';
      colElem.style.overflow = 'hidden';
      root.appendChild(colElem);
    }
    this.headerRowElement = root;
  }
  
  return this.headerRowElement;
};

/**
 * @param {number} row Row index
 * @param {string} column Column id
 * @param {id | null} value Value to put in cell
 * @param {element | null} element Element to append inside cell
 */
thetr.Table.prototype.setCellContent = function(args) {
  if (args.value) {
    this.rows[args.row][args.column].innerHTML = args.value;
  } else if (args.element) {
    var col = this.rows[args.row][args.column];
    if (col.firstChild) {
      col.removeChild(col.firstChild);
    }
    col.appendChild(args.element);
  }
};