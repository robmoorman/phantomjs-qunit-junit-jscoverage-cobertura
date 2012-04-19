/**
 * @author r.moorman
 */
var Template = {
	
	/** Filesystem. */
	fs: require( "fs" ),
	
	/**
	 * @param template Path to the template file
	 * @param context Context of the template, mapped as an Object
	 * @return String
	 */
	get: function( template, context )
	{
		var output = this.fs.read( template );
		
		for( var i in context ) {
			output = output.replace( "{{ " + i + " }}", context[ i ]);
		}
		
		return output;
	},
	
	/**
 	 * @param files
	 * @return String
 	 */
	getScripts: function( files )
	{
		var scripts = [];
		
		for( var i in files ) {
			scripts.push( "<script type='text/javascript' src='" + files[ i ] + "'></script>" );
		}
		
		return scripts.join( "\n" );
	}
	
};