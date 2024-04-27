import fs from 'fs';
import {
	INVALID_JSON_CONFIG,
	NON_EXISTEND_JSON_CONFIG_PATH,
} from '../constants';
import { cli } from './cli-logs';
import { FONT_GENERATE_CONFIG } from './user-schema';

type JsonParseResult<T> =
	| {
			data: T;
			error: false;
	  }
	| {
			data: null;
			error: true;
	  };

const safeJsonParse = <T>(text: string): JsonParseResult<T> => {
	try {
		const json = JSON.parse(text);
		return {
			data: json,
			error: false,
		};
	} catch (e) {
		return {
			data: null,
			error: true,
		};
	}
};

export const readConfig = (configPath: string) => {
	if (!fs.statSync(configPath).isFile) {
		cli.red(NON_EXISTEND_JSON_CONFIG_PATH);
		throw new Error(NON_EXISTEND_JSON_CONFIG_PATH);
	}

	const file = fs.readFileSync(configPath, { encoding: 'utf-8' });

	const { data, error } = safeJsonParse<FONT_GENERATE_CONFIG>(file);

	if (error) {
		cli.red(INVALID_JSON_CONFIG);
		throw new Error(INVALID_JSON_CONFIG);
	}

	return data;
};

export const throwIfNotValidDirectory = (path: string, label: string) => {
	const errorMessage = `${label} path does not exist`;

	try {
		if (!fs.statSync(path).isDirectory) {
			cli.red(errorMessage);
			throw new Error(errorMessage);
		}
	} catch (e) {
		cli.red(errorMessage);
		throw new Error(errorMessage);
	}
};
