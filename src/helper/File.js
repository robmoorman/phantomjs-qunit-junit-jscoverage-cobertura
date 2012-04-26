var File = {
	
	fs: require( "fs" ),
	
	save: function( fileName, content )
	{
		this.fs.write( fileName, content, "w" );
	},
	
	getJavascriptsFromDirectory: function( directory ) {
		var files = [];
		var list = this.fs.list( directory );
		
		for( var i = 0; i < list.length; i++ ) {
			if( list[ i ] !== "." && list[ i ] !== ".." ) {
				var file = directory + this.fs.separator + list[ i ];
				
				if( this.fs.isFile( file ) && file.indexOf( ".js" ) !== -1 ) {
					files.push( file );
				}
				else if( this.fs.isDirectory( file )) {
					files = files.concat( this.getJavascriptsFromDirectory( file ));
				}
			}
		}
		
		return files;
	}
		
};