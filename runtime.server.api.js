/*





*/

Runtime = {};

//Ordered array of runtime package handlers
Runtime.packages = {};

// We use @awwx, Andrews parse package if installed by the user
Runtime.parseUseragent = (Package.useragent)? Package.useragent.parseUseragent:
        function(userAgent) {
          // If the parseUseragent is not installed then return an empty object
          return {};
        };

// A flag true if the before Meteor loader is rigged in the html boilerplate
Runtime.beforeRigged = false;

// A flag true if the after Meteor loader is rigged in the html boilerplate
Runtime.afterRigged = false;

/*
  Runtime.package
  Here we define the conditions for each package and we tell the system where we
  want the package to apply - the default packages are "before" and "after"
  "before" is the only package that loads before Meteor, "after" loads directly
  after Meteor and any other will have to be loaded / lazyloaded manually
*/
Runtime.package = function(packageAssets, handler, where) {
  var self = this;

  // Make sure where is an array and fallback to "after" if falsy
  var whereArray = (_.isArray(where))?where:[where || 'after'];

  // Check that we have a function
  if (typeof handler !== 'function') {
    throw new Error('Runtime package "' + name + '"needs handler as function');
  }

  // Package details for reference
  var details = {
    handler: handler,
    assets: packageAssets
  };

  // Check if before or after is in the where array - make sure we rig the loaders
  for (var key = 0; key < whereArray.length; key++) {

    // We use the opportunity to convert to lowercase
    var value = whereArray[key].toLowerCase();

    // TODO:
    // Add the before js and css loader - would be nice if we could differentiate
    // between formats - it would require that the user told us

    // Rig the before loaders
    if (!self.beforeRigged && value === 'before') {
      _Runtime.rigFileLoad('/runtime/before.js', _Runtime.BEFORE_METEOR);
      _Runtime.rigFileLoad('/runtime/before.css', _Runtime.BEFORE_METEOR);
      self.beforeRigged = true;
    }

    // Rig the after loaders
    if (!self.afterRigged && value === 'after') {
      _Runtime.rigFileLoad('/runtime/after.js', _Runtime.AFTER_METEOR);
      _Runtime.rigFileLoad('/runtime/after.css', _Runtime.AFTER_METEOR);
      self.afterRigged = true;
    }

    // If value is not "before" or "after" then its a custom lazyload package
    // that the user will have to load for them selfs.
    // TODO:
    // If needed a client-side api for lazyloading runtime bundles could be
    // added

    // Create array if not found
    if (typeof self.packages[value] === 'undefined') {
      self.packages[value] = [];
    }

    // Add runtime package handle to runtime handlers
    self.packages[value].push(details);

  } // EO interation
};

Runtime._runHandles = function(scope, format, here) {
  var self = this;
  console.log('Run handlers for ' + format + ' when ' + here);
  // Rig the package scope we start with a object either empty
  // or set by the useragent package
  var api = Runtime.parseUseragent(scope.userAgent);

  // We check to make sure that api is an object
  if (typeof api !== 'object') {
    throw new Error('Unexpected result of parse useragent, api is not an object');
  }

  // Add the query and userAgent for the user to use in validation
  api.query = scope.query;
  api.userAgent = scope.userAgent;

  // The return result string
  var result = '';
console.log(api);
  _.each(self.packages[here], function(package) {

    // Set the Asset specific addFile pr. package
    api.addFile = function(files, where) {

      // Filenames are an array of files
      var filenames = (_.isArray(files))? files : [files];

      // We iterate over one or more files
      _.each(filenames, function(filename) {

        if (filename == ''+filename && filename !== '') {
          // We have a non empty string as filename
          // Now extract the extension
          var ext = filename.split('.').pop().toLowerCase();

          // If where is undefined then it should just be added
          // this would be the common case if only loading after Meteor
          if (ext === format && (where === here || typeof where === 'undefined')) {

            // Add the file to the bundle or die trying, we expect both css and
            // js assets to be of text
            try{
              result += package.assets.getText(filename);
            } catch(err) {
              throw new Error('Runtime bundle "' + here +
                      '" could not add asset: "' + filename +
                      '", Error: ' + (err.trace || err.message));
            }
          }
        } else {
          throw new Error('Runtime addFile requires a filename');
        }

      });
    };

    package.handler(api);
  });

  return result;
};

// Initialize the runtime bundle server
HTTP.methods({
  '/runtime/:filename': function(data) {
    var filename = this.params.filename;

    if (filename !== '') {
      var ext = filename.split('.').pop().toLowerCase();
      var name = filename.slice(0, filename.length - ext.length -1);

      // Set the proper content-type for js and css
      if (ext === 'js') {
        this.setContentType('text/javascript');
      }

      if (ext === 'css') {
        this.setContentType('text/css');
      }

      return Runtime._runHandles(this, ext, name);
    }
  }
});
