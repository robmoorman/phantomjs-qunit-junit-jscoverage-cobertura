/**
 * @author r.moorman
 */
var Coverage = {
	
	/** Executable arguments. */
	args: [],
	
	/** Executable options. */
	options: {},
	
	/** Required executable options. */
	requiredPrepareOptions: [ "src", "libs", "templates" ],
	requiredRunOptions: [ "libs", "junit", "templates", "cobertura", "qunit" ],
	
	/** Testsuite containing all qunit tests. */
	testSuite: null,
	
	/** The webkit browser. */
	page: null,
	
	/**
 	 * @param args
 	 */
	initialize: function( args ) {
		this.args = args;
		this.options = this.getOptions( args );
		
		this.verify( this.args[ 0 ]);
		
		switch( this.args[ 0 ]) {
			case "prepare":
				this.prepare();
				break;
			case "run":
				this.run();
				break;
		}
	},
	
	/**
 	 * @param args
	 * @return Object
 	 */
	getOptions: function( args ) {
		var options = {};
		
		for( var i = 0; i < args.length; i++ ) {
			if( args[ i ].indexOf( "--" ) === 0 ) {
				if(( i + 1 ) < args.length && args[ i + 1 ].indexOf( "--" ) === 0 ) {
					options[ args[ i ].replace( "--", "" )] = true;
				}
				else if(( i + 1 ) < args.length ) {
					options[ args[ i ].replace( "--", "" )] = args[ i + 1 ];
				}
			}
		}
		
		return options;
	},
	
	/**
	 * @return Boolean
	 */
	verify: function() {
		if( this.args.length < 2 || this.args[ 1 ].indexOf( "--" ) !== -1 ) {
			console.log( "Usage: coverage.js prepare/run <testdir>" );
			
			phantom.exit( 1 );
		}
		else {
			var requiredOptions = ( this.args[ 0 ] === "prepare" ? this.requiredPrepareOptions : this.requiredRunOptions );
			
			for( var i in requiredOptions ) {
				if( !this.options[ requiredOptions[ i ]] ) {
					console.log( "Option " + requiredOptions[ i ] + " not set, usage: coverage.js prepare/run <testdir> --" + requiredOptions[ i ] + " <value>" );
					
					phantom.exit( 1 );
				}
			}
		}
	},
	
	/**
 	 * 
 	 */
	isTestCompeted: function() {
		return this.page.evaluate( function() {
			var el = document.getElementById( "qunit-testresult" );
			return ( el && el.innerText.indexOf( "completed" ) !== -1 );
		});
	},
	
	/**
 	 * 
 	 */
	createReports: function() {
		var cobertura = Cobertura.generateReport( this.page );
		var junit = JUnit.generateReport( this.page );
		
		File.save( this.options.cobertura, cobertura );
		File.save( this.options.junit, junit );
	},
	
	/**
 	 * 
 	 */
	prepare: function() {
		this.testSuite = Testsuite.get( this.args[ 1 ]);
		
		Testsuite.clean( this.testSuite );
		Testsuite.create( this.testSuite );
		
		var libs = File.scan( this.options.libs );
		var libScripts = Template.getScripts( File.cleanPaths( libs, this.options.libs ));
		var sources = File.scan( this.options.src );
		var sourceScripts = Template.getScripts( File.cleanPaths( sources, this.options.src ));
		var scripts = Template.getScripts( File.cleanPaths( this.testSuite.tests, this.args[ 0 ]));
		var testrunner = Template.get( this.options.templates + "/testrunner.html", { libScripts:libScripts, sourceScripts:sourceScripts, scripts:scripts });
		
		File.copy( sources, this.testSuite.sourcePath, true, this.options.src );
		
		File.save( this.testSuite.sourcePath + "/testrunner.html", testrunner );
		
		phantom.exit( 0 );
	},
	
	/**
 	 * 
 	 */
	run: function() {
		this.testSuite = Testsuite.get( this.args[ 1 ]);
		
		File.copy( this.testSuite.tests, this.testSuite.binPath, true, this.args[ 0 ]);
		File.copy( File.scan( this.options.libs ), this.testSuite.binPath, true, this.options.libs );
		File.copy([  this.options.qunit + "/qunit.js", this.options.qunit + "/qunit-coverage.js", this.options.qunit + "/qunit.css" ], this.testSuite.binPath );
		
		this.page = new WebPage();
		this.page.onConsoleMessage = function( value ) {
			console.log( value );
		};
		
		this.page.open( this.testSuite.binPath + "/testrunner.html", function( status ) {
			if( status !== "success" ) {
				throw "Unable to access network";
			}
			else {
				waitFor( function() {
					return Coverage.isTestCompeted();
				}, function() {
					Coverage.createReports();
					Testsuite.remove( Coverage.testSuite );
					phantom.exit( 0 );
				}, 60000);
			}
		});
	}
		
};

Coverage.initialize( phantom.args );