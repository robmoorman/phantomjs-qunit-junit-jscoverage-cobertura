/**
 * @author r.moorman
 */
var Cobertura = {	
	
	generateReport: function( page, options ) {
		var output = page.evaluate( function() {
			function getClassPath( file ) {
				var paths = file.split( "/" );
				paths.pop();
				
				return paths.join( "." );
			}
			
			var report = {
				files: 0,
				packages: 0,
				testableLines: 0,
				testedLines: 0,
				untestedLines: 0,
				packageMap: {}
			};
			
			if( _$jscoverage ) {
				for( var file in _$jscoverage ) {
					if( !_$jscoverage.hasOwnProperty( file )) {
						continue;
					}
					
					var coverage = _$jscoverage[ file ];
					var classPath = getClassPath( file );
					
					report.files++;
				
					if( !report.packageMap[ classPath ]) {
						report.packages++;
					
						report.packageMap[ classPath ] = {
							testableLines: 0,
							testedLines: 0,
							untestedLines: 0,
							classMap: {}
						};
					}
				
					report.packageMap[ classPath ].classMap[ file ] = {
						source: coverage.source,
						file: file,
						classPath: classPath,
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
							report.testableLines++;
							report.packageMap[ classPath ].testableLines++;
							report.packageMap[ classPath ].classMap[ file ].testableLines++;
						
							if( cvg > 0 ) {
								hits = cvg;
								report.testedLines++;
								report.packageMap[ classPath ].testedLines++;
								report.packageMap[ classPath ].classMap[ file ].testedLines++;
							}
						
							report.packageMap[ classPath ].classMap[ file ].coverage[ i ] = { hits: hits };
						}
						else {
							report.untestedLines;
							report.packageMap[ classPath ].untestedLines++;
							report.packageMap[ classPath ].classMap[ file ].untestedLines++;
						}
					}
				}
			}
			
			return report;
		});
		
		var lines = [];
		
		lines.push( "<?xml version='1.0' encoding='UTF-8'?>" );
		lines.push( "<!DOCTYPE coverage SYSTEM 'http://cobertura.sourceforge.net/xml/coverage-03.dtd'>" );
		lines.push( "<coverage line-rate='" + ( output.testedLines / output.testableLines ) + "' branch-rate='0' version='3.5.1' timestamp='" + ( new Date()).getTime().toString() + "'>" );
		lines.push( "\t<sources/>" );
		lines.push( "\t<packages>" );
		
		for( var file in output.packageMap ) {
			lines.push( "\t\t<package name='" + file + "' line-rate='" + ( output.packageMap[ file ].testedLines / output.packageMap[ file ].testableLines ) + "' branch-rate='0' complexity='0'>" );
			lines.push( "\t\t\t<classes>" );
			
			for( var clazz in output.packageMap[ file ].classMap ) {
				lines.push( "\t\t\t\t<class name='" + clazz + "' filename='" + Config.src.application + "/" + output.packageMap[ file ].classMap[ clazz ].file + "' line-rate='" + ( output.packageMap[ file ].classMap[ clazz ].testedLines / output.packageMap[ file ].classMap[ clazz ].testableLines ) + "' branch-rate='0'>" );
				lines.push( "\t\t\t\t\t<lines>" );
				
				for( var line in output.packageMap[ file ].classMap[ clazz ].coverage ) {
					lines.push( "\t\t\t\t\t\t<line number='" + ( parseInt( line, 10 ) + 1 ).toString() + "' hits='" + output.packageMap[ file ].classMap[ clazz ].coverage[ line ].hits.toString() +"' branch='false' />" );
				}
				
				lines.push( "\t\t\t\t\t</lines>" );
				lines.push( "\t\t\t\t</class>" );
			}
			
			lines.push( "\t\t\t</classes>" );
			lines.push( "\t\t</package>" );
		} 
		
		lines.push( "\t</packages>" );
		lines.push( "</coverage>" );
		
		console.log( "Coverage measured (" + Math.round(( output.testedLines / output.testableLines ) * 100 ) + "%):" );
		console.log( "\t" + output.packages + " packages" );
		console.log( "\t" + output.files + " files" );
		
		return lines.join( "\n" );
	}
	
};