module( "" );

test( "applicationIsInitialized", function() {
	Application.initialize();
	
	ok( Application.randomNumber !== -1, "randomNumber is set" );	
});