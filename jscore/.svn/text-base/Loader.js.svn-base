/**
 * Dynamic Javascript file loader
 * @param {Array<string> | null} Files to load via this Loader
 */
thetr.Loader = function(files) {
  this.files = [];
  this.fileData = [];
  if (files && files.splice != undefined) {
    this.files = this.files.concat(files);
  }
  this.requests = [];
};

/**
 * Event fires after all files in this Loader have been loaded.
 */
thetr.Loader.prototype.onload = null;

/**
 * Indicates whether to use debuggable file loading or not.
 */
thetr.Loader.debug = false;

/**
 * Add additional files to this Loader.
 * @param {Array<string>} files Files to add to this Loader.
 */
thetr.Loader.prototype.addFiles = function(files) {
  if (files.splice == undefined) {
    this.files.push(files);
  } else {
    this.files = this.files.concat(files);
  }
};

/**
 * Initiate file loading. onload event is fired when all files have been loaded.
 */
thetr.Loader.prototype.load = function() {
  if (!thetr.Loader.debug) {
    for (var iter = 0; file = this.files[iter]; iter++) {
      var r = new thetr.Request({
          url:file, 
          post:false, 
          handler:this.loadNext,
          scope: this
        });
      this.requests.push(r);
    }
    this.files = [];
    this.requests[0].send();
  } else {
    this.suckAllFiles();
  }
};

/**
 * Handler for non-debug file loading. Initiates the next file request.
 * @private
 *
 * @param {thetr.Request} req The request currenly being processed.
 */
thetr.Loader.prototype.loadNext = function(req) {
  alert('loadNext');
  eval(req.data);
  this.requests.splice(0, 1);
  if (this.requests.length > 0) {
    this.requests[0].send();
  } else {
    if (this.onload) {
      this.onload();
    }
  }
};

/**
 * Initiates pulling the files in this Loader down via debug mode.
 * @private
 */
thetr.Loader.prototype.suckAllFiles = function() {
  this.suckNextFile();
};

/**
 * Sucks down an individual file in debug mode. 
 * Handler for when the suck completes is suckNextFile.
 * @private
 * @param {string} file The file to suck down.
 */
thetr.Loader.prototype.suckFile = function(file) {
  var s = document.createElement('script');
  s.src = file;
  thetr.event.listen({
      on: s,
      action: 'load',
      handler: this.suckNextFile,
      scope: this
    });
  document.body.appendChild(s);
};

/**
 * Initiate sucking for the next file in the file list.
 * @private
 */
thetr.Loader.prototype.suckNextFile = function() {
  if (this.files[0]) {
    var file = this.files[0];
    this.files.splice(0, 1);
    this.suckFile(file);
  } else {
    if (this.onload) {
      this.onload();
    }
  }
};