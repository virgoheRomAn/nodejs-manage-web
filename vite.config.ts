import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import autoprefixer from 'autoprefixer';
import colors from 'picocolors';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import progress from 'vite-plugin-progress';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import ip from 'ip';
import dayjs from 'dayjs';
import pkg from './package.json';

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'/#': pathResolve('./types/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
};

/**
 * @description vite.config.ts全局配置
 * @author virgoheRomAn
 * @date 2023-02-28
 */
const viteConfig = defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
	const isBuild = command === 'build';
	const env = loadEnv(mode, process.cwd());

	const { VITE_APP_NODE_ENV, VITE_VIEW_PORT, VITE_SERVICE_PORT, VITE_BASE, VITE_API_BASEURL, VITE_APP_TITLE, VITE_DROP_CONSOLE } = env;
	const { dependencies, devDependencies, name, version } = pkg;
	const __APP_INFO__ = {
		mode,
		env,
		version,
		pkg: { dependencies, devDependencies, name, version },
		buildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
	};

	const build = {
		name: `${colors.green(colors.bold(`${pkg.name}-${pkg.version}`))}`,
		text: `${colors.magenta('Progress:')} :percent | ${colors.magenta('Transforms:')} :current/:total | ${colors.magenta('Time:')} :elapseds`
	};

	console.log(`NODE_ENV: %s`, process.env.NODE_ENV);
	console.log(`VITE_APP_NODE_ENV: %s`, VITE_APP_NODE_ENV);

	return {
		base: '/',
		root: process.cwd(),
		optimizeDeps: {
			include: [
				'@vue/runtime-core',
				'@vue/shared',
				'element-plus/lib/locale/lang/zh-cn',
				'element-plus/lib/locale/lang/en',
				'element-plus/lib/locale/lang/zh-tw'
			]
		},
		plugins: [
			vue(),
			vueJsx(),
			vueSetupExtend(),
			eslintPlugin({ include: ['src/**/*.ts', 'src**/*.tsx', 'src**/*.vue'] }),
			progress({
				format: `${build.name} ${colors.blue('Building')} ${colors.cyan('[:bar]')} ${build.text}`,
				width: 70,
				total: 200,
				complete: '■',
				incomplete: '□'
			}),
			AutoImport({
				imports: [
					'vue',
					'vue-router',
					'pinia',
					{
						'/@/utils/auto': ['B', 'G', 'DT', 'V', 'D'],
						'/@/plugins/jBox': ['jBox'],
						'/@/plugins/storage': ['storage', 'session']
					}
				],
				dts: 'types/auto-imports.d.ts',
				resolvers: [ElementPlusResolver()]
			}),
			Components({
				dts: 'types/components.d.ts',
				deep: false,
				resolvers: [ElementPlusResolver({ importStyle: false })]
			}),
			createHtmlPlugin({
				minify: isBuild,
				template: 'index.html',
				inject: {
					data: {
						base: VITE_BASE,
						apiUrl: VITE_API_BASEURL,
						title: VITE_APP_TITLE
					}
				}
			})
		],
		resolve: {
			alias,
			extensions: ['.js', '.ts', '.json']
		},
		server: {
			host: '0.0.0.0',
			port: (VITE_VIEW_PORT || 11000) as unknown as number,
			open: false,
			hmr: true,
			proxy: {
				[VITE_API_BASEURL]: {
					target: `http://${ip.address()}:${VITE_SERVICE_PORT || 21000}`,
					ws: true,
					changeOrigin: true,
					rewrite: (path) => path.replace(new RegExp(`^${VITE_API_BASEURL}`), '')
				}
			}
		},
		build: {
			outDir: 'dist',
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: VITE_DROP_CONSOLE === 'true' ? true : false,
					drop_debugger: true
				}
			},
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					assetFileNames: (assetInfo) => {
						const info = (assetInfo.name as string).split('.');
						let extType = info[info.length - 1];
						if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name as string)) {
							extType = 'media';
						} else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name as string)) {
							extType = 'images';
						} else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name as string)) {
							extType = 'fonts';
						}
						return `assets/${extType}/[name]-[hash][extname]`;
					},
					entryFileNames: `assets/js/[name].[hash].js`,
					chunkFileNames: `assets/js/[name].[hash].js`,
					compact: true,
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia']
					}
				}
			}
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@import "./src/style/variables.scss";'
				},
				css: {
					charset: false
				}
			},
			postcss: {
				plugins: [
					autoprefixer({
						overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'not ie <= 11'],
						grid: true
					}),
					{
						postcssPlugin: 'internal:charset-removal',
						AtRule: {
							charset: (atRule) => {
								if (atRule.name === 'charset') {
									atRule.remove();
								}
							}
						}
					}
				]
			}
		},
		define: {
			__VERSION__: JSON.stringify(__APP_INFO__.pkg.version),
			__APP_INFO__: JSON.stringify(__APP_INFO__)
		}
	};
});

export default viteConfig;
