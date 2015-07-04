'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Vulcanize = require('vulcanize');
var path = require('path');

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		var filePath = ('abspath' in opts) ?
			path.relative(opts.abspath, file.path) :
			file.path;

		(new Vulcanize(opts)).process(filePath, function (err, inlinedHtml) {
			if (err) {
				cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
				return;
			}

			file.contents = new Buffer(inlinedHtml);
			cb(null, file);
		}.bind(this));
	});
};
