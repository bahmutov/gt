console.log('loading tests, takes a few seconds');

var smallTests = [
'./small/pluckTest',
'../src/utils/test/joinArgumentsTest',
'./small/oneFailsTest',
'./small/teardownExceptionTest',
'./small/setupExceptionTest',
'./small/errorInAsyncTest'
];

var mediumTests = [
];

var largeTests = [
'./large/loadingCrashTest',
'./large/twoFailingTest',
'./large/skipTest',
'./large/bddTest'
];

smallTests.forEach(require);
mediumTests.forEach(require);
largeTests.forEach(require);
