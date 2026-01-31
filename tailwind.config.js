/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw',
	content: [
		'./src/**/*.{html,ts}',
		'./projects/**/src/**/*.{html,ts}', // 👈 scan library source
		'./node_modules/angular-ui-kit/**/*.{html,ts}', // optional if published
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
