module( "views" );

test( "viewIsAddedToBody", function() {
	MenuView.initialize();
	
	equal( $( "ul#menu" ).length, 1, "menu is added to body" );	
});

test( "itemIsAdded", function() {
	MenuView.addItem( "home" );
	
	equal( $( "ul#menu li" ).length, 0, "item is added" );	
});