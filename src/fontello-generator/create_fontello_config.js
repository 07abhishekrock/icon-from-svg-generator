import fs from 'fs';
import pkg from 'lodash';
import { basename } from 'path';
import svgPath from 'svgpath';
import { v4 } from 'uuid';
import svg_image_flatten from './svg_image_flatten';

const { union } = pkg;

//
// Import svg image from svg files.
//
// data - text content
//

let allocatedRefCode = 0xe800;

function import_svg_image(data, file) {
	// var customIcons = N.app.fontsList.getFont('custom_icons');

	// Allocate reference code, used to show generated font on fontello page
	// That's for internal needs, don't confuse with glyph (model) code
	// var maxRef = _.maxBy(customIcons.glyphs(), function (glyph) {
	//   return utils.fixedCharCodeAt(glyph.charRef);
	// });

	// var allocatedRefCode = (!maxRef) ? 0xe800 : utils.fixedCharCodeAt(maxRef.charRef) + 1;

	var result = svg_image_flatten(data);

	if (result.error) {
		console.error(result.error);
		return;
	}

	// Collect ignored tags and attrs
	// We need to have array with unique values because
	// some tags and attrs have same names (viewBox, style, glyphRef, title).
	//
	var skipped = union(result.ignoredTags, result.ignoredAttrs);

	if (skipped.length > 0) {
		console.error('error skipped tags', { skipped: skipped.toString() });
	} else if (!result.guaranteed) {
		console.error('merge path error');
	}

	// Scale to standard grid
	var scale = 1000 / result.height;
	var d = new svgPath(result.d)
		.translate(-result.x, -result.y)
		.scale(scale)
		.abs()
		.round(1)
		.toString();
	var width = Math.round(result.width * scale); // new width

	var glyphName = basename(file.name.toLowerCase(), '.svg').replace(/\s/g, '-');

	return {
		css: glyphName,
		code: allocatedRefCode,
		charRef: allocatedRefCode++,
		selected: true,
		search: [glyphName],
		svg: {
			path: d,
			width,
		},
	};
}

export const createFinalConfig = (svgs, fontName) => {
	let customIcons = [];

	allocatedRefCode = 0xe800;

	svgs.forEach((svg) => {
		customIcons.push(import_svg_image(svg.svgString, { name: svg.name }));
	});

	const finalConfig = {
		name: fontName,
		css_prefix_text: 'icon-',
		css_use_suffix: false,
		hinting: true,
		units_per_em: 1000,
		ascent: 850,
		glyphs: customIcons.map((s) => ({
			uid: v4(),
			css: s.css,
			code: s.code,
			src: 'custom_icons',
			selected: true,
			svg: s.svg,
			search: s.search,
		})),
	};

	return finalConfig;
};
