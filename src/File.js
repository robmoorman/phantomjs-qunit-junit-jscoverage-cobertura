/**
 * @author r.moorman
 */
var File = {
	
	/** Filesystem. */
	fs: require( "fs" ),
	
	/**
	 * @param fileName
	 * @param content
	 */
	save: function( fileName, content )
	{
		this.fs.write( fileName, content, "w" );
	},
	
	/**
	 * @param files
	 * @param directory
	 * @param cleanWorkingDirectory
	 * @param workingDirectory
	 */
	copy: function( files, directory, cleanWorkingDirectory, workingDirectory )
	{
		for( var i in files ) {
			var copy = directory + "/" + (( cleanWorkingDirectory && workingDirectory ) ? this.cleanPath( files[ i ], workingDirectory ) : this.getFilenameFromPath( files[ i ]));
			
			this.fs.copy( files[ i ], copy );
		}
	},
	
	/**
	 * @param path
	 */
	getFilenameFromPath: function( path )
	{
		var paths = path.split( "/" );
		
		return paths[ paths.length - 1 ];
	},
	
	/**
	 * @param file
	 * @param workingDirectory
	 */
	cleanPath: function( file, workingDirectory )
	{
		file = file.replace( workingDirectory, "" );
		file = file.split( "/" ).join( "." );
		
		while( file.charAt( 0 ) === "." ) {
			file = file.substr( 1, file.length - 1 );
		}
		
		return file;
	},
	
	/**
	 * @param files
	 * @param workingDirectory
	 */
	cleanPaths: function( files, workingDirectory )
	{
		var copies = [];
		
		for( var i in files ) {
			copies[ i ] = this.cleanPath( files[ i ], workingDirectory );
		}
		
		return copies;
	},
	
	/**
	 * @param fileName
	 */
	js: function( fileName ) {
		if( typeof fileName === "string" && this.fs.isFile( fileName ) && fileName.indexOf( ".js" ) !== -1 ) {
			phantom.injectJs( fileName );
		}
		else {
			try {
				for( var i in fileName ) {
					this.js( fileName[ i ]);
				}
			}
			catch( error ) {
				console.log( "Unable to load file " + fileName );
			}
		}
	},
	
	/**
	 * @param directory
	 */
	dir: function( directory ) {
		if( this.fs.isDirectory( directory )) {
			var files = this.scan( directory );
			
			for( var i in files ) {
				this.js( files[ i ]);
			}
		}
		else {
			console.log( "Unable to open directory " + directory );
		}
	},
	
	/**
	 * @param directory
	 * @return Array
	 */
	scan: function( directory ) {
		var files = [];
		var list = this.fs.list( directory );
		
		for( var i = 0; i < list.length; i++ ) {
			if( list[ i ] !== "." && list[ i ] !== ".." ) {
				var file = directory + this.fs.separator + list[ i ];
				
				if( this.fs.isFile( file ) && file.indexOf( ".js" ) !== -1 ) {
					files.push( file );
				}
				else if( this.fs.isDirectory( file )) {
					files = files.concat( this.scan( file ));
				}
			}
		}
		
		return files;
	}
		
};