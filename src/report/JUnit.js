/**
 * @author r.moorman
 */
var JUnit = {
	
	hasFailures: false,
	
	/**
	 * @param page
	 */
	generateReport: function( page, options ) {
		var report = page.evaluate( function() {
			return getReport();
		});
		
		var lines = [];
			
		lines.push( "<?xml version='1.0' encoding='UTF-8'?>" );
		lines.push( "<testsuite tests='" + report.count + "' failures='" + report.failures + "' disabled='0' errors='0' time='" + ( report.time / 1000 ) + "' name='tests'>" );
		
		if (report.failures > 0) {
			this.hasFailures = true;
		}
		
		for( var moduleName in report.modules ) {
			var module = report.modules[ moduleName ];
			
			lines.push( "\t<testsuite tests='" + module.count + "' failures='" + module.failures + "' disabled='0' errors='0' time='" + ( module.time / 1000 ) + "' name='" + moduleName + "'>" );
			
			for( var testName in module.tests ) {
				var test = module.tests[ testName ];
				
				lines.push( "\t\t<testcase name='" + testName + "' status='" + ( test.success ? "pass" : "fail" ) + "' time='" + ( test.time / 1000 ) + "' classname='" + moduleName + "' />" );
			}
			
			lines.push( "\t</testsuite>" );
		}
		
		lines.push( "</testsuite>" );
		
		console.log( "Tests completed (" + report.count + "): " + report.time + "ms." );
		console.log( "\t" + report.passed + " passed" );
		console.log( "\t" + report.failures + " failed" );
		
		return lines.join( "\n" );
	}
	
};