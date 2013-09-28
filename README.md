Runtime [![Build Status](https://travis-ci.org/raix/Meteor-runtime.png?branch=master)](https://travis-ci.org/raix/Meteor-runtime)
============

This package add runtime dynamic bundling to Meteor,

##Usage
The runtime packages can be created from packages or from an app

`Runtime.package` Parametres:
* `Assets` - Requires the current Assets object - this is scoped pr. app and package so the bundler needs to be passed a handle. It's used to load `js` and `css` assets into a runtime bundle.
* `packageHandler` - Requires a function to get the wanted runtime bundle.
* `where` - Required, set the bundles where you want to allow use of the `packageHandler`

Example:
```js
	// Add file from assets
	Runtime.package(Assets, function(api) {
	  // The api object:
	  // api.query
	  // api.userAgent
	  //
	  // If user added Andrew's useragent package then the following will be available:
	  // api.browser
	  // api.os { family, major, minor, patch}
	  // api.device
	  //
	  // For adding file dependencies:
	  // api.addFile(filename, where)
	  // 'before', 'after', 'lazy' or 'customName' (two last would require manual loading / lazyloading)
	  //console.log(api.query.tester);
	  api.addFile('test.js', 'before');

	}, ['before', 'after']);
```
*If you install the `useragent` package by @awwx/Andrew this package will automaticly use it for parsing the `api.userAgent`*

Another example:
```js
	// Set the platform `?platform=ios` on the Meteor remote url in cordova
	// and get served platform specific javascript
	Runtime.package(Assets, function(api) {
		if (api.query.platform === 'ios') {
			api.addFile('cordova.ios.js', 'after');
		}
		if (api.query.platform === 'android') {
			api.addFile('cordova.android.js', 'after');
		}
	}, ['after']);
```
*Maybe serve some specific css style layout pr. platform, the platform could be set to a more uniq value eg. `?token=iosXFd3dfsSXfD3dS` if sending api keys to cordova*


Contributions are wellcome, Regz. RaiX, aka Morten