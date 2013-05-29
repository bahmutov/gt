/*global gt:true, doh:true*/
console.assert(gt, 'gt framework not registered');

global.doh = gt;
doh.register = function (moduleName, tests) {
    gt.module(moduleName);
    console.log('found DOH module', moduleName, 'with', tests.length, 'tests');

    tests.forEach(function (test) {
        gt.test(test.name, test);
    });
};

doh.assertTrue = gt.ok.bind(gt);

doh.assertFalse = function (condition, message) {
    gt.assertTrue(!condition, message);
};

doh.assertEqual = gt.equal.bind(gt);