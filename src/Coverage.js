var Coverage = {
	
	fs: require( "fs" ),
	options: {},
	page: null,
	
	initialize: function( args ) {
		this.options = this.getOptions( args );
		
		phantom.injectJs( this.options.config );
		
		switch( args[ 0 ]) {
			case "prepare": this.prepare(); break;
			case "run": this.run(); break;
		}
	},
	
	prepare: function() {
		this.fs.removeTree( Config.target );
		this.fs.makeTree( Config.target + "/src" );
		this.fs.makeTree( Config.target + "/bin" );
		
		this.fs.copyTree( Config.src.application, Config.target + "/src" );
		
		var template = Template.get( Config.templates + "/testrunner.html", {
			libScripts: Template.getScriptsFromDirectory( Config.src.libraries, true ),
			sourceScripts: Template.getScriptsFromDirectory( Config.src.application, true ),
			scripts: Template.getScriptsFromDirectory( Config.src.tests, true )
		});
		
		File.save( Config.target + "/src/testrunner.html", template );
		
		phantom.exit( 0 );
	},
	
	run: function() {
		this.fs.copyTree( Config.src.libraries, Config.target + "/bin" );
		this.fs.copyTree( Config.src.tests, Config.target + "/bin" );
		this.fs.copy( Config.src.qunit + "/qunit.css", Config.target + "/bin/qunit.css" );
		this.fs.copy( Config.src.qunit + "/qunit.js", Config.target + "/bin/qunit.js" );
		this.fs.copy( Config.src.qunit + "/qunit-coverage.js", Config.target + "/bin/qunit-coverage.js" );
		
		if( Config.src.mockups && this.fs.exists( Config.src.mockups )) {
		    this.fs.copyTree( Config.src.mockups, Config.target + "/bin" );
	    }
		
		this.page = new WebPage();
		this.page.onConsoleMessage = function( value ) {
			console.log( value );
		};
		
		this.page.open( Config.target + "/bin/testrunner.html", function( status ) {
			if( status !== "success" ) {
				throw "Unable to access network";
			}
			else {
				waitFor( function() {
					return Coverage.isTestCompeted();
				},
				function() {
					var exitCode = 0;
					Coverage.createReports();
					Coverage.fs.removeTree( Config.target );
					
					if ((JUnit.hasFailures === true) && (Config.ignoreFailures === false)) {
						console.log("Test failures detected and ignoreFailures is set to false");
						console.log("Breaking the build")
						exitCode = 1;
					}
					phantom.exit( exitCode );
				}, 60000);
			}
		});
	},
	
	createReports: function() {
		var junit = JUnit.generateReport( this.page, this.options );
		var cobertura = Cobertura.generateReport( this.page, this.options );
		
		File.save( Config.output.junit, junit );
		File.save( Config.output.cobertura, cobertura );
	},
	
	isTestCompeted: function() {
		return this.page.evaluate( function() {
			var el = document.getElementById( "qunit-testresult" );
			return ( el && el.innerText.indexOf( "completed" ) !== -1 );
		});
	},
	
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
	}
		
};

Coverage.initialize( phantom.args );