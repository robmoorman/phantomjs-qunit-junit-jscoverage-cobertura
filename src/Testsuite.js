/**
 * @author r.moorman
 */
var Testsuite = {
	
	/** Filesystem. */
	fs: require( "fs" ),
	
	/**
 	 * @param directory
	 * @return Object
 	 */
	get: function( directory )
	{
		console.log( "Working from " + this.fs.workingDirectory );
		
		return {
			workingDirectory: this.fs.workingDirectory,
			tests: File.scan( directory ),
			binPath: this.fs.workingDirectory + "/build/bin",
			sourcePath: this.fs.workingDirectory + "/build/src"
		};
	},
	
	/**
	 * @param suite
	 */
	create: function( suite )
	{
		this.fs.makeTree( suite.binPath );
		this.fs.makeTree( suite.sourcePath );
	},
	
	/**
	 * @param suite
	 */
	clean: function( suite )
	{
		this.remove( suite );
	},
	
	/**
	 * @param suite
	 */
	remove: function( suite )
	{
		this.fs.removeTree( suite.workingDirectory + "/build" );
	}
	
};