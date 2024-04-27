#! /usr/bin/env node
import { Command } from 'commander';
import { createTTFromSVGs } from 'utils/font';
import { packageJSON } from 'utils/packageJson.js';
import { readConfig, throwIfNotValidDirectory } from 'utils/readConfig';
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

			if (config.htmlPath) {
				throwIfNotValidDirectory(config.htmlPath, 'HTML Path does not exist');
			}

			const { fontelloConfig } = createTTFromSVGs(
				config.svgDirectory,
				config.targetFontDirectory,
				config.fontName,
			);
		});

	program.parse();
})();
