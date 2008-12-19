/**
 * Create a request to a remote resource and load it.
 * @param {string} url The URL to load
 * @param {string | null} post Don't pass for GET, pass POST data to use POST
 * @param {pointer} handler Function handler to call
 * @param {object | null} scope The scope to call the handler function in
 * @param {object | null} args Arbitrary data which a handler can fetch
 */
thetr.Request = function(args) {
  if (!args) {
    args = {};
  }
  
	this.httpReq = null;
	this.args = args.args;
	this.handler = args.handler;
	this.handlerScope = args.scope;
	this.url = args.url;
	this.post = args.post;
}

thetr.Request.prototype.send = function() {
	if( window.XMLHttpRequest && !(window.ActiveXObject)) {
		try {
			this.httpReq = new XMLHttpRequest();
		}catch(e) {}
	}else if( window.ActiveXObject) {
		try {
			this.httpReq = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e) {}
	}
	if( this.httpReq ) {
		//var parentRequest = this;
		//this.httpReq.onreadystatechange = function() { thetr.Request.process({request:parentRequest}); };
		thetr.event.listen({
		    on: this.httpReq,
		    action: 'readystatechange',
		    handler: this.process,
		    scope: this
		  });
		if( this.post ) {
			this.httpReq.open("POST", this.url, true);
			this.httpReq.send(this.post);
		}else{
			this.httpReq.open("GET", this.url, true);
			this.httpReq.send("");
		}
	}
}

thetr.Request.prototype.process = function() {
  //console.log('processing http request: ' + this.httpReq.status);
	if( this.httpReq.readyState == 4 ) {
		if( this.httpReq.status == 200 || this.httpReq.status == 304 ) {
			this.data = this.httpReq.responseText;
			this.xml = this.httpReq.responseXML;
			if( this.handler && this.handlerScope ) {
			  console.log('processing http request: call scope');
				this.handler.call( this.handlerScope, this);
			} else {
			  console.log('processing http request: call window scope');
			  this.handler.call(window, this);
			}
		}
	}
}

/**
 * Process a request object.
 * @param {thetr.Request} request The Request object to process
 */
thetr.Request.process = function( args ) {
  if (!args) {
    args = {};
  }
  
	args.request.process();
}