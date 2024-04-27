import chalk from 'chalk';

export const cli = {
	green(text: string) {
		console.log(chalk.green(text));
	},
	red(text: string) {
		console.log(chalk.red(text));
	},
};
