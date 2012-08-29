# PhantomJS QUnit JUnit JSCoverage Cobertura

## Requirements

* [PhantomJS executable](http://www.phantomjs.org/)
* [JSCoverage executable](http://siliconforks.com/jscoverage/)
* [QUnit.js, QUnit.css and QUnit-coverage.js](https://github.com/moorinteractive/phantomjs-qunit-junit-jscoverage-cobertura/tree/master/lib/)
* [Coverage.js](https://github.com/moorinteractive/phantomjs-qunit-junit-jscoverage-cobertura/blob/master/coverage.js)

## Usage

In prior to record the coverage of the QUnit tests for your application related Javascripts we are obliged to initialize the coverage environment on our local filesystem. Therefore we use the PhantomJS executable, the best way to see this in action is to look at our [Ant task example](https://github.com/moorinteractive/phantomjs-qunit-junit-jscoverage-cobertura/blob/master/examples/jquery/build.xml):

### Step 1: initialize the environment

***path/to/phantomjs*** *path/to/coverage.js* prepare --config *path/to/config.js*

### Step 2: initialize jscoverage

***path/to/jscoverage*** build-tmp/src build-tmp/bin

### Step 3: generate junit and cobertura reports

***path/to/phantomjs*** *path/to/coverage.js* run --config *path/to/config.js*

## Configuration.js

<pre>
var Config = {

    // path of the temporary directory to store coverage files in (bin and src subdirs are created).
    // this directory is automatically removed by this tool, it's just required for the coverage executable.
    target: "build-tmp",

    // path to the directory containing the testrunner.html
    templates: "coverage/templates",

	// whether to ignore test failures or to break the build in case of test failures
	ignoreFailures: true,

    src: {
       // application related javascripts (which are measured by the coveragetool)
       application: "src",

       // library javascripts used by the application (which are not measured)
       libraries: "libs",

       // path to the directory containing all your qunit tests
       tests: "tests",

       // path to the directory containing the qunit.css, qunit.jss and qunit-coverage.js
       qunit: "coverage/lib",

       // path to the directory with all your mockupdata used bu your qunit tests
       mockups: "mockups"
    },

    // paths where to export you junit and cobertura results
    output: {
        junit: "reports/junit.xml",
        cobertura: "reports/cobertura.xml"
    }

};
</pre>

## Output files

The output files can directly be used by CI tools like [Jenkins](http://jenkins-ci.org/).

* [Example of exported JUnit report for QUnit tests](https://github.com/moorinteractive/phantomjs-qunit-junit-jscoverage-cobertura/blob/master/examples/jquery/reports/junit.xml)
* [Example of exported Cobertura report for coverage](https://github.com/moorinteractive/phantomjs-qunit-junit-jscoverage-cobertura/blob/master/examples/jquery/reports/cobertura.xml)