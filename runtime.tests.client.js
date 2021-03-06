function equals(a, b) {
  return !!(EJSON.stringify(a) === EJSON.stringify(b));
}


Tinytest.add('Client - Runtime - test environment', function(test) {
  test.isTrue(typeof _Runtime !== 'undefined', 'test environment initialized _Runtime');
  test.isTrue(typeof Runtime !== 'undefined', 'test environment not initialized Runtime');

  var text = window._runtime_before && window._runtime_before();

  test.equal('Hello before', text, 'The before.js is not loaded');

  var text = window._runtime_after && window._runtime_after();

  test.equal('Hello after', text, 'The after.js is not loaded');
});

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
