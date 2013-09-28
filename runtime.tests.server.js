function equals(a, b) {
  return !!(EJSON.stringify(a) === EJSON.stringify(b));
}


Tinytest.add('Server - Runtime - test environment', function(test) {
  test.isTrue(typeof _Runtime !== 'undefined', 'test environment initialized _Runtime');
  test.isTrue(typeof Runtime !== 'undefined', 'test environment not initialized Runtime');
});

// Add file from assets
Runtime.package(Assets, function(api) {
  // The api object:
  // - api.query
  // - api.userAgent
  //
  // If user added @awwx / Andrew's useragent package then the following will
  // be available:
  // - api.browser
  // - api.os { family, major, minor, patch}
  // - api.device
  //
  // For adding file dependencies:
  // - api.addFile(filename, where)
  // 'before', 'after', 'lazy' or 'customName'
  // (two last would require manual loading / lazyloading)

  api.addFile('test.before.js', 'before');
  api.addFile('test.after.js', 'after');

}, ['before', 'after']);

// Tinytest.addAsync('Runtime - ', function (test, onComplete) {

// });


//Test API:
//test.isFalse(v, msg)
//test.isTrue(v, msg)
//test.equalactual, expected, message, not
//test.length(obj, len)
//test.include(s, v)
//test.isNaN(v, msg)
//test.isUndefined(v, msg)
//test.isNotNull
//test.isNull
//test.throws(func)
//test.instanceOf(obj, klass)
//test.notEqual(actual, expected, message)
//test.runId()
//test.exception(exception)
//test.expect_fail()
//test.ok(doc)
//test.fail(doc)
//test.equal(a, b, msg)
