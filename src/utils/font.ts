import fs from 'fs';
//@ts-check
import path from 'path';
//@ts-ignore
import { createFinalConfig } from '../fontello-generator/create_fontello_config.js';
import { FontelloConfig } from './fontello.js';
import { renderAndStoreTTF } from './render-ttf.js';

const createFontelloConfigFromSVGs = (
	glyphs: {
		svgString: string;
		name: string;
	}[],
	fontName: string,
) => {
	const finalConfig = createFinalConfig(glyphs, fontName);
	return finalConfig as FontelloConfig;
};

export const createTTFromSVGs = async (
	svgDirectory: string,
	fontPath: string,
	fontName: string,
) => {
	const allSvgFiles = fs
		.readdirSync(svgDirectory)
		.filter((s) => s.endsWith('.svg'));
	const allSvgContentWithName = allSvgFiles.map((p) => {
		return {
			name: p,
			fileContent: fs.readFileSync(path.resolve(svgDirectory, p), {
				encoding: 'utf-8',
			}),
		};
	});
	const fontelloConfig = createFontelloConfigFromSVGs(
		allSvgContentWithName.map((s) => ({
			name: s.name,
			svgString: s.fileContent,
		})),
		fontName,
	);

	renderAndStoreTTF(fontelloConfig, path.resolve(fontPath, `${fontName}.ttf`));

	return fontelloConfig;
};
