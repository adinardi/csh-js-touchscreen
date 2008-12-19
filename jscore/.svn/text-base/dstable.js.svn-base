thetr.DSTable = function(args) {
  this.dataSource = null;
  this.supers(args);
};
thetr.inherit({sub: thetr.DSTable, base: thetr.Table});

/**
 * @param {thetr.DataSource} ds
 */
thetr.DSTable.prototype.setDataSource = function(args) {
  this.dataSource = args.ds;
  thetr.event.listen({
      on: this.dataSource,
      action: 'update',
      handler: this.dsUpdate,
      scope: this
    });
  this.dsUpdate();
};

/**
 * Handler for when the data source tells us to update
 * @handler
 */
thetr.DSTable.prototype.dsUpdate = function() {
  this.refreshDisplay();
};

/**
 * Refresh the information in this table from the dataSource.
 */
thetr.DSTable.prototype.refreshDisplay = function() {
  if (!this.dataSource) {
    return;
  }
  
  var count = this.dataSource.getCount();
  this.setRowCount({count: count});
  
  var colCount = this.columns.length;
  var colNames = this.columns;
  for (var rowIter = 0, row; row = this.rows[rowIter]; rowIter++) {
    for (var colIter = 0, column; column = colNames[colIter]; colIter++) {
      var val = this.dataSource.getValue({row: rowIter, column: column.id});
      row[column.id].innerHTML = val;
    }
  }
};