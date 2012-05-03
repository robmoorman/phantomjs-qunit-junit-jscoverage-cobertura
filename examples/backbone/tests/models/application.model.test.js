module( "models.ApplicationModel" );

test( "defaultNumberIsSet", function() {
    var model = new ApplicationModel();
    
    strictEqual( model.get( "number" ), ApplicationModel.DEFAULT_NUMBER, "default number is set" );
});