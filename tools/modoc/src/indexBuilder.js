'use strict';

/**
 Builds the index used to generate the nav bar
 */

var _ = require('underscore');
var util = require('./util');

var HTML_SUFFIX = '-doc.html';

function getDifferentiatorIndex(strings) {
	var minLength = strings.reduce(function (prev, cur) {
		return Math.min(prev, cur.length);
	}, strings[0].length);

	for (var i = 0; i < minLength; i++) {
		for (var j = 0; j < strings.length; j++) {
			var string = strings[j];
			if (string[i] !== strings[0][i]) {
				return i;
			}
		}
	}
}

function getIndex(classes) {
	var files = _.pluck(classes, 'file').filter(Boolean);
	var differentiator = getDifferentiatorIndex(files);

	var groups = _.groupBy(files, function (file) {
		return file.substring(differentiator, file.indexOf(util.PATH_SEPARATOR, differentiator));
	});

	Object.keys(classes).forEach(function (className) {
		var class_ = classes[className];
		if (class_.group) {
			groups[class_.group].push({
				name: class_.constructor.name,
				requirePath: class_.requirePath,
				link: class_.constructor.name + HTML_SUFFIX
			});
		}
	});

	return Object.keys(groups).map(function (name) {
		var group = groups[name];

		return {
			name: name,
			classes: group.map(function (file) {
				if (typeof file === 'object') { return file; }

				var fileName = util.getFileName(file);
				var requirePath = file.substring(differentiator, file.length - 3);
				return {
					name: fileName,
					requirePath: requirePath,
					link: fileName + HTML_SUFFIX
				};
			}).sort(function (classA, classB) {
				return classA.name < classB.name ? -1 :
					classA.name > classB.name ? 1 : 0;
			})
		};
	});
}


exports.getIndex = getIndex;