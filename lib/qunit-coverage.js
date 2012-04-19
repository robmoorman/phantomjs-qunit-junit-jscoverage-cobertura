( function() {
	
	var report = {
		modules: {},
		time: 0,
		count: 0,
		passed: 0,
		failures: 0
	};
	
	var currentModuleName;
	var currentModuleStart;
	
	var currentTestName;
	var currentTestStart;
	
	window.getReport = function() {
		return report;
	};
	
	QUnit.moduleStart = function( module ) {
		currentModuleName = module.name;
		currentModuleStart = new Date();
		
		report.modules[ module.name ] = {
			tests:{},
			time: 0,
			count: 0,
			passed: 0,
			failures: 0
		};
	};
	
	QUnit.moduleDone = function( module ) {
		report.modules[ currentModuleName ].time = ( new Date()).getTime() - currentModuleStart.getTime();
	};
	
	QUnit.testStart = function( test ) {
		currentTestName = test.name;
		currentTestStart = new Date();
		
		report.modules[ currentModuleName ].tests[ test.name ] = {
			time: 0,
			success: false
		};
	};
	
	QUnit.testDone = function( test ) {
		report.modules[ currentModuleName ].tests[ test.name ].time = ( new Date()).getTime() - currentTestStart.getTime();
		report.modules[ currentModuleName ].tests[ test.name ].success = ( test.failed ? false : true );
		
		report.modules[ currentModuleName ].count++;
		report.modules[ currentModuleName ].passed += ( !test.failed ? 1 : 0 );
		report.modules[ currentModuleName ].failures += ( test.failed ? 1 : 0 );
		
		report.time += report.modules[ currentModuleName ].tests[ test.name ].time;
		report.count++;
		report.passed += ( !test.failed ? 1 : 0 );
		report.failures += ( test.failed ? 1 : 0 );
	};
	
} ());