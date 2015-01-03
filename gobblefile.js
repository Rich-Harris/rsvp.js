var gobble = require( 'gobble' ),
	version = require( 'git-repo-version' ),
	lib,
	tests;

lib = gobble( 'lib' ).transform( 'esperanto-bundle', {
	entry: 'rsvp',
	type: 'umd',
	name: 'RSVP',
	strict: true,
	banner: require( 'fs' ).readFileSync( './config/versionTemplate.txt' )
		.toString().replace( /VERSION_PLACEHOLDER_STRING/, version() ) + '\n'
});

tests = gobble([
	// the test suite plus dependencies
	gobble([ lib, 'test' ]).transform( 'browserify', {
		entries: ['./index.js'],
		dest: 'browserify.js'
	}),

	// rsvp.js (required by web worker test)
	lib,

	// static files
	gobble( 'test' ).include( '{index.html,worker.js}' ),

	// json3
	gobble( 'node_modules/json3/lib' ).include( 'json3.js' ),

	// mocha
	gobble( 'node_modules/mocha' ).include( 'mocha.{js,css}' )
]).moveTo( 'test' );

// minify if building, rather than serving
if ( gobble.env() === 'production' ) {
	lib = gobble([
		lib,
		lib.transform( 'uglifyjs', {
			ext: '.min.js'
		})
	]).transform( 'sorcery' ); // collapse sourcemaps
}

module.exports = gobble([ lib, tests ]);