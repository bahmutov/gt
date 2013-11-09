console.log('loading tests, takes a few seconds');

var smallTests = [
'./small/pluckTest',
'../src/utils/test/joinArgumentsTest',
'./small/oneFailsTest',
'./small/teardownExceptionTest'
];

var mediumTests = [
];

var largeTests = [
'./large/loadingCrashTest',
'./large/twoFailingTest',
'./large/skipTest'
];

smallTests.forEach(require);
mediumTests.forEach(require);
largeTests.forEach(require);
