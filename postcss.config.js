module.exports = {
	plugins: [
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		require('autoprefixer')({
			overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8', '> 1%'],
			grid: true
		})
	]
};
