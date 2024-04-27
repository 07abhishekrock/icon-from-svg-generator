import { compile } from 'ejs';
import fs from 'fs';
import path from 'path';
import svg2ttf from 'svg2ttf';
import svgPath from 'svgpath';
import { cli } from './cli-logs.js';
import { FontelloConfig } from './fontello.js';

const template = `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg">
<metadata>Copyright (C) 2024 by original authors @ fontello.com</metadata>
<defs>
<font id="<%= font.fontname %>" horiz-adv-x="<%= font.ascent - font.descent %>" >
<font-face font-family="<%= font.familyname %>" font-weight="400" font-stretch="normal" units-per-em="<%= font.ascent - font.descent %>" ascent="<%= font.ascent %>" descent="<%= font.descent %>" />
<missing-glyph horiz-adv-x="<%= font.ascent - font.descent %>" /><% glyphs.forEach(function(glyph) { %>
<glyph glyph-name="<%= glyph.css %>" unicode="&#x<%= glyph.code.toString(16) %>;" d="<%= glyph.d %>" horiz-adv-x="<%= glyph.width %>" />
<% }); %></font>
</defs>
</svg>
`;
const getSVGFont = (fontelloConfig: FontelloConfig) => {
	const ejsArgs = {
		...fontelloConfig,
		fontname: fontelloConfig.name,
		ascent: fontelloConfig.ascent,
		descent: -1 * (fontelloConfig.units_per_em - fontelloConfig.ascent),
		familyname: fontelloConfig.name,
	};

	const scale = fontelloConfig.units_per_em / 1000;

	const svgFontTemplate = compile(template);
	const svgFont = svgFontTemplate({
		font: ejsArgs,
		glyphs: fontelloConfig.glyphs.map((s) => ({
			...s,
			d: svgPath(s.svg.path)
				.scale(scale, -scale)
				.translate(0, fontelloConfig.ascent)
				.abs()
				.round(0)
				.rel()
				.toString(),
			width: s.svg.width,
		})),
	});

	return svgFont;
};

export const renderAndStoreTTF = (
	fontelloConfig: FontelloConfig,
	pathToStoreTTFAt: string,
) => {
	const svgFontText = getSVGFont(fontelloConfig);
	const ttfBuffer = svg2ttf(svgFontText);

	try {
		fs.writeFileSync(path.resolve(pathToStoreTTFAt), ttfBuffer.buffer);
	} catch (e) {
		cli.red(
			`Something went wrong when trying to write file - ${e.message.toString()}`,
		);
		throw e;
	}
};
