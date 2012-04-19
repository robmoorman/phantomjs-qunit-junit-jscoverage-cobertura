var MenuView = {
	
	element: $( "<ul id='menu'></ul>" ),
	
	initialize: function() {
		this.element.appendTo( "body" );
	},
	
	addItem: function( title ) {
		this.element.append( "<li>" + title + "</li>" );
	}
		
};