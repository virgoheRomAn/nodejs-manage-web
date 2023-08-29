'use strict';
import utils from '/@/utils';
import app from './app';
import pkg from '../../package.json';

const { name, version, author } = pkg;

/**
 * @description 项目相关配置
 * @author virgoheRomAn
 * @date 2021-12-24
 */
export default Object.assign({}, app, {
	// 项目名称
	name: import.meta.env.VITE_APP_TITLE,
	// 请求基本路径
	baseApiUrl: import.meta.env.VITE_API_BASEURL,
	// 构建时间
	buildTime: utils.dayjs().format('YYYY-MM-DD HH:mm:ss'),
	// 项目名称
	proName: name,
	// 项目版本
	proVersion: version,
	// 项目作者
	proAuthor: author,
});
