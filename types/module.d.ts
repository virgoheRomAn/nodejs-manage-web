// 申明外部 npm 插件模块
declare module 'vue-grid-layout';
declare module 'qrcodejs2-fixes';
declare module 'splitpanes';
declare module 'js-cookie';
declare module 'crypto-js';
declare module 'jquery';
declare module '@wangeditor/editor-for-vue';
declare module 'js-table2excel';
declare module 'file-saver';
declare module 'qs';
declare module 'ip';
declare module 'lrz';

// 声明一个模块，防止引入文件时报错
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
declare module '*.scss';
declare module '*.ts';
declare module '*.js';

// 声明文件，*.vue 后缀的文件交给 vue 模块来处理
declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}
