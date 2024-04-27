#! /usr/bin/env node
import { Command } from 'commander';
import { relative, resolve } from 'path';
import { createDemoHTML } from 'utils/createDemoHTML.js';
import { createTTFromSVGs } from 'utils/font';
import { packageJSON } from 'utils/packageJson.js';
import {
	readConfig,
	throwIfNotValidDirectory,
	writeFileEvenIfParentDirectoryDoesNotExist,
} from 'utils/readConfig';
import { renderTitle } from 'utils/renderTitle.js';

(async () => {
	renderTitle();

	const program = new Command();

	program
		.name('my-node-app')
		.description('⚡️ Your ultimkte CLI app.')
		.version(packageJSON.version, '-v, --version', 'display the version number')
		.option('--config', 'Font generator Config')
		.action(async (str, options) => {
			if (!str.config) return;

			const config = readConfig(options.args[0]);

			throwIfNotValidDirectory(config.svgDirectory, 'SVG Directory');
			throwIfNotValidDirectory(
				config.targetFontDirectory,
				'Target Font Directory',
			);

			const fontelloConfig = await createTTFromSVGs(
				config.svgDirectory,
				config.targetFontDirectory,
				config.fontName,
			);

			if (config.htmlPath) {
				const fontPath = resolve(
					config.targetFontDirectory,
					`${config.fontName}.ttf`,
				);
				const fontPathRelativeToHTMLPath = relative(
					config.htmlPath,
					fontPath,
				).replaceAll('\\', '/');

				const htmlContent = createDemoHTML(
					fontelloConfig,
					fontPathRelativeToHTMLPath,
				);
				writeFileEvenIfParentDirectoryDoesNotExist(
					resolve(config.htmlPath, 'demo.html'),
					htmlContent,
				);
			}

			if (config.fontelloConfigOutput) {
				writeFileEvenIfParentDirectoryDoesNotExist(
					config.fontelloConfigOutput,
					JSON.stringify(fontelloConfig),
				);
			}
		});

	program.parse();
})();
