console.assert(dojoConfig, 'dojoConfig is undefined');
console.assert(Array.isArray(dojoConfig.packages), 'dojoConfig.packages should be an array');
dojoConfig.packages = dojoConfig.packages.concat([
	{
    name: "tests",
    location: "testInstrumented"
  },
  {
    name: "src",
    location: "srcInstrumented"
  }
]);