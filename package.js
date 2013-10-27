Package.describe({
    summary: 'Adds Runtime bundler\n'+
         '\u001b[32mv0.0.4\n'+
         '\u001b[33m-----------------------------------------\n'+
         '\u001b[0m Adds Runtime bundles                     \n'+
         '\u001b[0m                                          \n'+
         '\u001b[33m-------------------------------------RaiX\n'
});

Package.on_use(function(api) {
  'use strict';
  api.use(['webapp', 'underscore', 'ejson', 'random'], 'server');

  api.use('http-methods');

  api.imply && api.imply('http-methods');

  // Use the useragent package if its installed
  api.use('useragent', { weak: true });

  // Use the runtime appcache package if its installed
  api.use('runtime-appcache', { weak: true });

  api.export && api.export('Runtime');

  api.export && api.export('_Runtime', { testOnly: true });


  api.add_files('runtime.config.server.js', 'server');
  api.add_files('runtime.client.api.js', 'client');
  api.add_files('runtime.server.api.js', 'server');

});

Package.on_test(function (api) {
  api.use('runtime', ['client', 'server']);
  api.use('test-helpers', ['client', 'server']);
  api.use('http', 'client');

  api.use(['tinytest', 'underscore', 'ejson', 'ordered-dict',
           'random', 'deps']);

  api.add_files('test.before.js', 'server', {isAsset:true});
  api.add_files('test.after.js', 'server', {isAsset:true});

  api.add_files('runtime.tests.server.js', 'server');
  api.add_files('runtime.tests.client.js', 'client');
});
