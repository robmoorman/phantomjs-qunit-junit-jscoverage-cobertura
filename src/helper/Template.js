var Template = {
	
	fs: require( "fs" ),
	
	get: function( template, context )
	{
		var output = this.fs.read( template );
		
		for( var i in context ) {
			output = output.replace( "{{ " + i + " }}", context[ i ]);
		}
		
		return output;
	},
	
	getScripts: function( files )
	{
		var scripts = [];
		
		for( var i in files ) {
			scripts.push( "<script type='text/javascript' src='" + files[ i ] + "'></script>" );
		}
		
		return scripts.join( "\n" );
	},
	
	getScriptsFromDirectory: function( directory, stripOffDirectory )
	{
		var files = File.getJavascriptsFromDirectory( directory );
		
		if( !stripOffDirectory ) {
			return this.getScripts( files );
		}
		else {
			var filesStripped = [];
			
			for( var i in files ) {
				filesStripped.push( files[ i ].split( directory + "/", 2 ).join( "" ));
			}
			
			return this.getScripts( filesStripped );
		}
	}
	
};