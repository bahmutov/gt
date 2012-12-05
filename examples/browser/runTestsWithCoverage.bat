@echo off

set istanbul=istanbul
set phantomjhs=phantomjs

echo Instrumenting the folders
echo.

REM ignoring the results, seems there is some error exit code returned
call %istanbul% instrument src --output srcInstrumented
call %istanbul% instrument test --output testInstrumented

echo Running unit tests
echo.
phantomjs runner.js index.html

echo Writing coverage HTML reports
echo.
call %istanbul% report --root . -v html code_coverage_report.json --dir cover
