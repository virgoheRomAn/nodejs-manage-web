import type { App, Directive } from 'vue';

/**
 * 图片懒加载
 * @directive 默认方式：v-lazyLoading
 */
const lazyLoadingDirective: Directive = {
	mounted(el, { value }) {
		let lazyImageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry, index) => {
				let lazyImage: any = entry.target;
				// 相交率，默认是相对于浏览器视窗
				if (entry.intersectionRatio > 0) {
					lazyImage.src = value;
					// 当前图片加载完之后需要去掉监听
					lazyImageObserver.unobserve(lazyImage);
				}
			});
		});
		lazyImageObserver.observe(el);
	},
};

export function setupLazyLoadingDirective(app: App) {
	app.directive('lazyLoading', lazyLoadingDirective);
}

export default lazyLoadingDirective;
