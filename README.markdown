# PhantomJS QUnit JUnit JSCoverage Cobertura

## Requirements

* [PhantomJS executable](http://www.phantomjs.org/)
* [jQuery qunit.js](https://github.com/jquery/qunit/blob/master/qunit/qunit.js)
* [run-qunit-junit.js](https://github.com/moorinteractive/phantomjs-qunit-junit/blob/master/run-qunit-junit.js)

## Usage

To run QUnit tests and generate a JUnit XML format of the results, the following arguments are required while executing the headless server:

* **--qunit**, path to ***qunit.js***
* **--requires**, path to required javascripts before running your scripts. In general these are your application related scripts and libraries. To make things simple, you can provide multiple files by separating them with a comma. Even directories (and all it's subdirectories) are accepted here. For example ***--requires libs/jquery.js,libs/jquery-ui.js,application*** where jquery are absolute files and application is the directory containing all your custom scripts
* **--tests**, determine which tests should be ran. As well as the argument *requires* you can provided this with multiple files and/or directories.
* **--output**, path where the xml output file should be generated, for example ***--output tests/junit-results.xml***

Take a look at our [samples](https://github.com/moorinteractive/phantomjs-qunit-junit/tree/master/samples), you should find a predefined [ant task](https://github.com/moorinteractive/phantomjs-qunit-junit/blob/master/samples/build.xml) to do all this magic for you and ready to be plugged in into your CI tool!

## Todo

* Inline documentation
* Failures per test
* Time per test
* Fix all tests rapported within latest runned QUnit module