# PhantomJS QUnit JUnit

## Requirements

* [PhantomJS executable](http://www.phantomjs.org/)
* [JSCoverage executable](http://siliconforks.com/jscoverage/)
* [QUnit.js, QUnit.css and QUnit-coverage.js](https://github.com/moorinteractive/phantomjs-qunit-junit/tree/master/lib/)
* [Coverage.js](https://github.com/moorinteractive/phantomjs-qunit-junit/blob/master/coverage.js)

## Usage

In prior to record the coverage of the QUnit tests for your application related Javascripts we are obliged to initialize the coverage environment on our local filesystem. Therefore we use the PhantomJS executable, the best way to see this in action is to look at our [Ant task example](https://github.com/moorinteractive/phantomjs-qunit-junit/blob/master/examples/jquery/build.xml):

### Step 1: initialize the environment

***path/to/phantomjs*** *path/to/coverage.js* prepare *path/to/tests* --src *path/to/application/src* --libs *path/to/libraries* --templates *path/to/templates*

### Step 2: initialize jscoverage

***path/to/jscoverage*** build/src build/bin

### Step 3: generate junit and cobertura reports

***path/to/phantomjs*** *path/to/coverage.js* run *path/to/tests* --libs *path/to/libraries* --qunit *path/to/(qunit.js,qunit.css,qunit-coverage.js)* --templates *path/to/templates* --junit *path/to/junit-output.xml* --cobertura *path/to/cobertura-output.xml*

## Output files

The output files can directly be used by CI tools like [Jenkins](http://jenkins-ci.org/).

* [Example of exported JUnit report for QUnit tests](https://github.com/moorinteractive/phantomjs-qunit-junit/blob/master/examples/jquery/reports/junit.xml)
* [Example of exported Cobertura report for coverage](https://github.com/moorinteractive/phantomjs-qunit-junit/blob/master/examples/jquery/reports/cobertura.xml)