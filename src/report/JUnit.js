/**
 * @author r.moorman
 */
var JUnit = {
	
	/**
	 * @param page
	 */
	generateReport: function( page, options ) {
		var report = page.evaluate( function() {
			return getReport();
		});
		
		var lines = [];
			
		lines.push( "<?xml version='1.0' encoding='UTF-8'?>" );
		lines.push( "<testsuites tests='" + report.count + "' failures='" + report.failures + "' disabled='0' errors='0' time='" + ( report.time / 1000 ) + "' name='tests'>" );
		
		for( var moduleName in report.modules ) {
			var module = report.modules[ moduleName ];
			
			lines.push( "\t<testsuite tests='" + module.count + "' failures='" + module.failures + "' disabled='0' errors='0' time='" + ( module.time / 1000 ) + "' name='" + moduleName + "'>" );
			
			for( var testName in module.tests ) {
				var test = module.tests[ testName ];
				
				lines.push( "\t\t<testcase name='" + testName + "' status='" + ( test.success ? "pass" : "fail" ) + "' time='" + ( test.time / 1000 ) + "' classname='" + moduleName + "'>" );
				if (! test.success) {
					var failure = test.failures[0];
					lines.push("\t\t\t<failure message='" + failure.message + "' type='" + failure.type + "'/>")
				}
				lines.push("\t\t</testcase>")			}
			
			lines.push( "\t</testsuite>" );
		}
		
		lines.push( "</testsuites>" );
		
		console.log( "Tests completed (" + report.count + "): " + report.time + "ms." );
		console.log( "\t" + report.passed + " passed" );
		console.log( "\t" + report.failures + " failed" );
		
		return lines.join( "\n" );
	}
	
};