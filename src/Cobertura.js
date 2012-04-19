/**
 * @author r.moorman
 */
var Cobertura = {	
	
	/**
	 * @param page
	 */
	generateReport: function( page ) {
		return page.evaluate( function() {
			function getClassPath( file )
			{
				if( file.indexOf( "." ) !== -1 ) {
					var paths = file.split( "." );
					paths.pop();
					paths.pop();
					
					return paths.join( "." );
				}
				else {
					return "";
				}
			};
			
			function getFileName( file )
			{
				if( file.indexOf( "." ) !== -1 ) {
					var paths = file.split( "." );
					
					while( paths.length > 2 ) {
						paths.shift();
					}
					
					return paths.join( "." );
				}
				else {
					return file;
				}
			};
			
			var report = {
				packages: {}
			};
			
			var files = 0;
			var packages = 0;
			var testableLines = 0;
			var testedLines = 0;
			var untestedLines = 0;
			
			if( _$jscoverage ) {
				for( var file in _$jscoverage ) {
					if( !_$jscoverage.hasOwnProperty( file )) {
						continue;
					}
					
					var coverage = _$jscoverage[ file ];
					var classPath = getClassPath( file );
					var fileName = getFileName( file );
					
					files++;
					
					if( !report.packages[ classPath ]) {
						packages++;
						
						report.packages[ classPath ] = {
							classes: {},
							testableLines: 0,
							testedLines: 0,
							untestedLines: 0
						};
					}
					
					report.packages[ classPath ].classes[ file ] = {
						source: coverage.source,
						file: file,
						classPath: classPath,
						fileName: fileName,
						testableLines: 0,
						testedLines: 0,
						untestedLines: 0,
						coverage: {}
					};
					
					for( var i = 0; i < coverage.source.length; i++ ) {
						var i = parseInt( i, 10 );
						var cvg = coverage[ i + 1 ];
						var hits = 0;
						
						if( cvg !== undefined ) {
							testableLines++;
							report.packages[ classPath ].testableLines++;
							report.packages[ classPath ].classes[ file ].testableLines++;
							
							if( cvg > 0 ) {
								hits = cvg;
								testedLines++;
								report.packages[ classPath ].testedLines++;
								report.packages[ classPath ].classes[ file ].testedLines++;
							}
							
							report.packages[ classPath ].classes[ file ].coverage[ i ] = {
								hits: hits
							};
						}
						else {
							untestedLines++;
							report.packages[ classPath ].untestedLines++;
							report.packages[ classPath ].classes[ file ].untestedLines++;
						}
					}
				}
			}
			
			var lines = [];
			
			lines.push( "<?xml version='1.0' encoding='UTF-8'?>" );
			lines.push( "<!DOCTYPE coverage SYSTEM 'http://cobertura.sourceforge.net/xml/coverage-03.dtd'>" );
			lines.push( "<coverage line-rate='" + ( testedLines / testableLines ) + "' branch-rate='0' version='3.5.1' timestamp='" + ( new Date()).getTime().toString() + "'>" );
			lines.push( "\t<sources/>" );
			lines.push( "\t<packages>" );
			
			for( var file in report.packages ) {
				lines.push( "\t\t<package name='" + file + "' line-rate='" + ( report.packages[ file ].testedLines / report.packages[ file ].testableLines ) + "' branch-rate='0' complexity='0'>" );
				lines.push( "\t\t\t<classes>" );
				
				for( var clazz in report.packages[ file ].classes ) {
					lines.push( "\t\t\t\t<class name='" + clazz + "' filename='" + report.packages[ file ].classes[ clazz ].fileName + "' line-rate='" + ( report.packages[ file ].classes[ clazz ].testedLines / report.packages[ file ].classes[ clazz ].testableLines ) + "' branch-rate='0'>" );
					lines.push( "\t\t\t\t\t<lines>" );
					
					for( var line in report.packages[ file ].classes[ clazz ].coverage ) {
						lines.push( "\t\t\t\t\t\t<line number='" + ( parseInt( line, 10 ) + 1 ).toString() + "' hits='" + report.packages[ file ].classes[ clazz ].coverage[ line ].hits.toString() +"' branch='false' />" );
					}
					
					lines.push( "\t\t\t\t\t</lines>" );
					lines.push( "\t\t\t\t</class>" );
				}
				
				lines.push( "\t\t\t</classes>" );
				lines.push( "\t\t</package>" );
			} 
			
			lines.push( "\t</packages>" );
			lines.push( "</coverage>" );
			
			console.log( "Coverage measured (" + Math.round(( testedLines / testableLines ) * 100 ) + "%):" );
			console.log( "\t" + packages + " packages" );
			console.log( "\t" + files + " files" );
			
			return lines.join( "\n" );
		});
	}
	
};