import figlet from 'figlet';

export const renderTitle = () => {
	const text = figlet.textSync('SVG to TTF', {
		font: 'Small',
	});
	const creditText = figlet.textSync('credits - fontello, svg2ttf', {
		font: 'Bigfig',
	});
	console.log(`\n${text}\n${creditText}\n`);
};
