/*

	This file rigs the initial template so we get a pre meteor bundle loading hook
  but only if acually needed

*/


var path = Npm.require('path');
var fs = Npm.require('fs');

// Find the client json path
var clientJsonPath = path.join(__meteor_bootstrap__.serverDir,
        __meteor_bootstrap__.configJson.client);

var clientDir = path.dirname(clientJsonPath);
var clientJson = JSON.parse(fs.readFileSync(clientJsonPath, 'utf8'));


_Runtime = {};

// Insertion landmarks as comments in js code
_Runtime.BEFORE_METEOR = '// PRE_BUNDLE';
_Runtime.AFTER_METEOR = '// POST_BUNDLE';

/*
	Add extra runtime code, can be used to add
*/
_Runtime.addRuntimeCode = function(needle, code) {
	// Load the boilerplate
	var boilerplateHtmlPath = path.join(clientDir, clientJson.page);
	boilerplateHtml =
		fs.readFileSync(boilerplateHtmlPath, 'utf8')
		.replace(needle, code + '\n' + needle);

	// Save the new boilerplate
  	fs.writeFileSync(boilerplateHtmlPath, boilerplateHtml, 'utf8');
};

/*
	Rig the container for the before / pre Meteor bundle loaders
*/
var theBeforeLoaderIsRigged = false;

_Runtime.rigBeforeMeteorLoader = function() {
  var self = this;
	if (!theBeforeLoaderIsRigged) {
		// Only rig once
		theBeforeLoaderIsRigged = true;

		// The prebundle loader code
		var prebundleCode = self.BEFORE_METEOR;

		// Add the prebundle runtime code in the header tag
		self.addRuntimeCode('// ##RUNTIME_CONFIG##', prebundleCode);
    self.addRuntimeCode('\n##RUNTIME_CONFIG##', '<script type="text/javascript">' + prebundleCode + '</script>');
	}
};

/*
	Rig the container for the after / post Meteor bundle loaders
*/
var theAfterLoaderIsRigged = false;

_Runtime.rigAfterMeteorLoader = function() {
  var self = this;
	if (!theAfterLoaderIsRigged) {
		// Only rig once
		theAfterLoaderIsRigged = true;

		// The postbundle loader code
		var postbundleCode = '<script type="text/javascript">';
		postbundleCode += '\n' + self.AFTER_METEOR;
		postbundleCode += '\n</script>';

		// Add the postbundle runtime code in the body tag
		self.addRuntimeCode('<body>', postbundleCode);
	}
};

_Runtime.rigFileLoad = function(filename, where) {
  var self = this;
	if (filename === ''+filename && filename !== '') {
		// Make sure the before loader container is rigged
		if (where === self.BEFORE_METEOR) {
			self.rigBeforeMeteorLoader();
		}

		// Make sure the after loader container is rigged
		if (where === self.AFTER_METEOR) {
			self.rigAfterMeteorLoader();
		}
		// Get the extension
		var ext = filename.split('.');
		var ext = ext[ext.length-1];

		switch(ext) {
			case 'js':
			self.addRuntimeCode(where, "  document.write(\"<script type='text/javascript' src='##ROOT_URL_PATH_PREFIX##" + filename + "\" + location.search + \"'><\\\/script>\");");
			break;
			case 'css':
			self.addRuntimeCode(where, "  document.write(\"<link rel='stylesheet' type='text/css' href='##ROOT_URL_PATH_PREFIX##" + filename + "\" + location.search + \"'\\\/>\");");
			break;
		}
	}
};

