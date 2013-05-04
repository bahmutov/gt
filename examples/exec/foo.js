console.log('returning number of input arguments');
// exclude node and script name
var commandLineArgs = process.argv.length - 2;
console.log(commandLineArgs);
process.exit(commandLineArgs);