module( "Application" );

test( "isInitialized", function() {
    Application.initialize();
    
    ok( Application.defaults.initialized, "application is initialized" );
});