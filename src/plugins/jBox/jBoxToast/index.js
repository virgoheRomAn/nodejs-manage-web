// @ts-nocheck
import $ from 'jquery';
import jBoxImage from './img/loadImage.js';
import './index.css';

/**
 * 基于jQuery开发的弹出框组件
 * v2.0
 * xjq
 */

/* eslint-disable */
$.jBox = function () {
	let self = this;
	let _OPTS_ = {};
	let _IMG_ = {};
	let _BOXID_ = [];

	//变量
	let isMobile = 'ontouchstart' in window;
	let startEvent, moveEvent, endEvent;
	let _clear_setTimeout_ = 0;
	let _has_box_number_ = 0;

	//默认全局参数
	self.defaults = {
		/**
		 * 显示类型
		 * message：提示框
		 * confirm：确认框
		 */
		module: 'message',

		/**
		 * 遮罩形式
		 * 0-黑色
		 * 1-白色
		 */
		mask_module: '0',

		//boxId
		box_id: '',
		//动画cls，进入|出去
		box_animate: 'fadeInDown|fadeOutUp',
		//预加载图标
		icon_load: true,

		/**
		 * 确认框显示
		 * normal，ios，andriod，custom
		 */
		confirm_type: 'ios',

		/**
		 * 关闭相关
		 * container_close_animate 容器本身是否开启关闭动画
		 * close_animate 是否开启关闭动画
		 * close_time 关闭的延迟时间ms
		 * close_type 关闭方式：1(自动关闭)，2(按钮关闭)，3(不关闭)
		 */
		container_close_animate: false,
		close_animate: true,
		close_time: 1500,
		close_type: 1,

		//移动
		isMove: !isMobile ? true : false,

		//背景关闭
		isMaskClose: false,

		//回掉函数
		initCallback: null, //初始化函数（生成DOM元素之后，样式生效之前）
		initBeforeCallback: null, //初始化之前执行（生成DOM元素之前）
		initAfterCallback: null, //初始化之后执行（给DOM元素添加样式之后）
		ensureCallback: null, //id="jBoxEnsure"的按钮确认回调
		cancelCallback: null, //id="jBoxCancel"的按钮取消回调
		closeCallback: null //关闭函数（关闭弹窗同时移除）
	};

	//box布局
	self.defaults.element = {
		container_cls: '',
		//垂直居中
		vertical: 'center',
		//全屏
		fullscreen: true,
		//是否有遮罩
		mask: true,
		//背景是否透明
		transparent: true,
		//启用阴影
		shadow: true,
		box_width: '',
		box_height: '',
		max_width: $(window).width() * 0.85,
		min_width: '',
		message_max_width: 200,
		confirm_min_width: isMobile ? $(window).width() * 0.85 : 350
	};

	//内容
	self.defaults.content = {
		cont_cls: '',
		close_btn: !isMobile ? false : false,
		title: '',
		title_cls: '',
		title_dir: 'center',
		text: '',
		text_dir: 'center',
		text_cls: ''
	};

	//按钮
	self.defaults.button = {
		btn_cls: '',
		//按钮排列方向
		direction: 'h',
		/**
		 * 按钮数组对象
		 * {href，id，cls，css，close_type，callback}
		 */
		array: []
	};

	//图标
	self.defaults.icon = {
		/**
		 * 图标模式
		 * "img"-图片默认
		 * "font"-字体模式
		 * "none"-不使用图标
		 */
		icon_type: 'img',
		icon_cls: '',
		//图标显示模式：默认：h，可选：v
		direction: !!isMobile ? 'v' : 'v',
		width: '',
		height: '',
		path: 'img/',
		src: '',
		//当前图片的标识
		id: ''
	};

	//全局配置函数-会被initBeforeCallback替换
	self.config = function (option) {
		let defaults = $.extend(true, {}, self.defaults, option);
		self.defaults = defaults;
	};

	//是否开启预加载
	if (self.defaults.icon_load) {
		for (let key in jBoxImage) {
			_IMG_[key] = jBoxImage[key];
		}
	}

	//检测当前是否有jBox弹窗
	self.isHavejBox = function () {
		return $('.jBox-container').length > 0;
	};

	/****************************************************************************************************/
	//消息提示框
	/****************************************************************************************************/
	/**
	 * 提醒函数
	 * @param {String} text
	 * @param {Object} option
	 */
	self.alert = function (text, option) {
		let icon = {
			icon: {
				icon_type: 'none'
			}
		};
		option = $.extend({}, option, icon);
		return __jBox_init(text, option);
	};

	/**
	 * 成功函数
	 * @param {String} text
	 * @param {Object} option
	 */
	self.success = function (text, option) {
		self.defaults.icon.id = 'success';
		return __jBox_init(text, option);
	};

	/**
	 * 错误函数
	 * @param {String} text
	 * @param {Object} option
	 */
	self.error = function (text, option) {
		self.defaults.icon.id = 'error';
		return __jBox_init(text, option);
	};

	/**
	 * 警告函数
	 * @param {String} text
	 * @param {Object} option
	 */
	self.waring = function (text, option) {
		self.defaults.icon.id = 'waring';
		return __jBox_init(text, option);
	};

	/**
	 * 加载函数
	 * @param {String} text
	 * @param {Object} option
	 */
	self.loading = function (text, option) {
		let defs = {
			icon: {
				id: 'loading',
				direction: 'v'
			},
			close_type: 3
		};
		option = $.extend({}, defs, option);
		return __jBox_init(text, option);
	};

	/**
	 * 倒计时函数
	 * @param {String} text
	 * @param {Object} option
	 */
	self.cutdown = function (text, time, option) {
		let defs = {
			element: { fullscreen: true, transparent: false, mask: true },
			icon: {
				finish_close: true,
				cutdown_time: time,
				icon_type: 'cutdown'
			},
			close_type: 3
		};
		option = $.extend({}, defs, option);
		return __jBox_init(text, option);
	};

	/****************************************************************************************************/
	//确认框
	/****************************************************************************************************/
	/**
	 * 确认框参数
	 * @param option
	 */

	function __jBox_confirm_opt(m, option) {
		let defs = {
			mask_module: '0',
			content: {
				title: !option.hideTitle ? option.title || '温馨提示' : '',
				title_dir: 'center',
				text_dir: m === 'prompt' ? 'left' : 'center'
			},
			element: {
				fullscreen: false,
				mask: true,
				transparent: false
			},
			icon: {
				icon_type: 'none'
			},
			button: {
				array:
					m === 'warn'
						? [
								{
									text: option.buttonText || '知道了',
									cls: 'confirm',
									callback: option.confirm || option.callback || ''
								}
						  ]
						: [
								{
									text: '取消',
									cls: 'cancel',
									callback: option.cancel || ''
								},
								{
									text: '确定',
									cls: m === 'prompt' ? 'confirm prompt' : 'confirm',
									callback: option.confirm || option.callback || ''
								}
						  ]
			},
			close_type: 3,
			module: m || 'confirm'
		};

		let opt = $.extend(true, {}, defs, option);
		let text_left = opt.confirm_type === 'andriod' || m === 'prompt';

		opt.content.title_dir = text_left ? 'left' : opt.content.title_dir;
		opt.content.text_dir = text_left ? 'left' : opt.content.text_dir;

		return opt;
	}

	/**
	 * 确认框
	 * @param text
	 * @param option
	 */
	self.confirm = function (text, title, option) {
		let opt = __jBox_confirm_opt('confirm', option);
		opt.content.title = title || opt.title;
		return __jBox_init(text, opt);
	};

	/**
	 * 文本输入框
	 * @param text
	 * @param title
	 * @param option
	 */
	self.prompt = function (text, title, option) {
		let opt = __jBox_confirm_opt('prompt', option);
		opt.content.title = title || opt.title;
		return __jBox_init(text, opt);
	};

	/**
	 * 警告
	 * @param text
	 * @param option
	 */
	self.warn = function (text, title, option) {
		let opt = __jBox_confirm_opt('warn', option);
		opt.content.title = title || opt.title;
		return __jBox_init(text, opt);
	};

	/**
	 * 自定义弹出框
	 * @param {String} text
	 * @param {Object} option
	 */
	self.custom = function (text, option) {
		let defs = {
			confirm_type: 'custom',
			element: {
				fullscreen: false,
				mask: true,
				transparent: false
			},
			icon: {
				icon_type: 'none'
			},
			close_type: 3,
			module: 'custom'
		};
		option = $.extend({}, defs, option);
		return __jBox_init(text, option);
	};

	/****************************************************************************************************/
	//关闭操作
	/****************************************************************************************************/
	/**
	 * 关闭当前提示框
	 * @param callback
	 */
	self.close = function (callback) {
		__jBox_close_box({ close_type: 2 }, callback);
	};

	/**
	 * 逐个关闭
	 * @param callback
	 */
	self.closePick = function (callback) {
		if (!_OPTS_._jBoxId_Ary_) return false;
		let close_box = '#' + _OPTS_._jBoxId_Ary_[_OPTS_._jBoxId_Ary_.length - 1];

		__jBox_close_box({ close_box: close_box, close_type: 2 }, callback);
	};

	/**
	 * 关闭指定ID提示框
	 * @param callback
	 */
	self.closeById = function (id, callback) {
		__jBox_close_box({ close_box: id, close_type: 2 }, callback);
	};

	/**
	 * 关闭所有
	 * @param callback
	 */
	self.closeAll = function (callback) {
		__jBox_close_box({ close_box: '.jBox-layout', close_type: 2 }, callback);
	};

	/****************************************************************************************************/
	//初始化函数
	/****************************************************************************************************/
	/**
	 * 初始化函数
	 * @param text  提示文本
	 * @param option  设置相关属性
	 */
	function __jBox_init(text, option) {
		_OPTS_ = $.extend(true, {}, self.defaults, option);
		_OPTS_._IMG_ = _IMG_;

		_OPTS_.initBeforeCallback && _OPTS_.initBeforeCallback.call(_OPTS_._target_ || this, _OPTS_);

		let _module_ = _OPTS_.module.toString().toLowerCase();
		let _is_message_ = _module_ === 'message';
		_OPTS_._module_ = _module_;
		_OPTS_._is_message_ = _is_message_;

		//创建HTML
		return __jBox_create_html(text);
	}

	/**
	 * 创建HTML
	 * @param text  提示文字
	 */
	function __jBox_create_html(text) {
		let html = '';
		let jBoxId = _OPTS_.box_id || 'jBox' + new Date().getTime();
		_OPTS_.jBoxId = jBoxId;

		if (_OPTS_.close_type === 3) {
			//存储id-逐个关闭
			_BOXID_.push(jBoxId);
			_OPTS_._jBoxId_Ary_ = _BOXID_;
		}

		//样式分割空格分隔
		let container_cls = !isMobile ? 'jBox-container-pc ' : 'jBox-container-h5 ';
		container_cls += _OPTS_._is_message_ ? 'jBox-message ' : 'jBox-confirm __' + _OPTS_.confirm_type + '__ __' + _OPTS_.module + '__ ';
		container_cls += _OPTS_.element.shadow ? 'jBox-shadow ' : '';

		let hasMask = _OPTS_.element.mask;

		if (hasMask) {
			container_cls += 'jBox-mask ';
			container_cls += _OPTS_.element.fullscreen ? 'jBox-fullscreen ' : '';
		}

		if (_OPTS_.element.transparent) {
			container_cls += 'jBox-transparent ';
		} else {
			container_cls += _OPTS_.mask_module === '0' ? 'jBox-black ' : 'jBox-white ';
		}

		container_cls += _OPTS_.element.container_cls || '';

		//构建html主体
		html += '<div class="jBox-container ' + container_cls + '">';
		html += '<div id="' + jBoxId + '" class="jBox-layout animate ' + _OPTS_.box_animate.split('|')[0] + '">';

		html += __create_title_html();
		html += __create_cont_html(text);
		html += __create_button_html();

		html += '</div>';
		html += '</div>';

		//添加到页面上
		if (!self.hasjBoxContainer) {
			$(document.body).append(html);
			todo();
		} else {
			self.closeAll(() => {
				if (_has_box_number_ === 0) {
					$(document.body).append(html);

					// 延迟执行
					setTimeout(() => {
						todo();
					});

					_has_box_number_++;
				}
			});
		}
		// 当前存在 jBox
		self.hasjBoxContainer = true;

		// 执行的动作
		function todo() {
			let $box = $('#' + jBoxId);

			//添加元素
			_OPTS_.jQueryElement = {
				$jBoxContainer: $box.parent(),
				$jBoxBox: $box,
				$jBoxTitle: $box.find('.__title__'),
				$jBoxCont: $box.find('.__content__'),
				$jBoxContBox: $box.find('.__content_box__'),
				$jBoxButton: $box.find('.__button__'),
				$jBoxClose: $box.find('.__close_btn__'),
				$jBoxPrompt: $box.find('.__prompt_label__'),
				$jBoxButtonAry: []
			};

			let btn = _OPTS_.button;

			//按钮数组
			$box.find('.__button__ a').each(function (i) {
				_OPTS_.jQueryElement.$jBoxButtonAry.push($(this));

				$(this).on('click', function () {
					//确认输入框按钮
					if (_OPTS_._module_ === 'prompt' && $(this).hasClass('prompt')) {
						//文本确认框-内容
						let __prompt_value = _OPTS_._module_ === 'prompt' ? _OPTS_.jQueryElement.$jBoxPrompt.find('input').val() : '';
						let __validator_text__ = _OPTS_.prompt_validator && _OPTS_.prompt_validator(__prompt_value);

						if (__validator_text__) {
							_OPTS_.jQueryElement.$jBoxPrompt.find('input').addClass('err').next().remove();
							_OPTS_.jQueryElement.$jBoxPrompt.append('<span>' + __validator_text__ + '</span>');
							return false;
						}

						_OPTS_.prompt = { value: __prompt_value };
					}

					__jBox_close_box({ close_type: btn.array[i].close_type || 2 }, function () {
						btn.array[i].callback && btn.array[i].callback.call(_OPTS_._target_ || this, _OPTS_._module_, _OPTS_);
					});
				});
			});

			//文本确认框
			if (_OPTS_._module_ === 'prompt') {
				_OPTS_.jQueryElement.$jBoxPrompt
					.find('input')
					.on('focus', function () {
						$(this).removeClass('err').next().remove();
					})
					.focus();
			}

			//背景关闭
			if (_OPTS_.isMaskClose) {
				_OPTS_.jQueryElement.$jBoxContainer.on('click', function (event) {
					if (event.target == this) {
						__jBox_close_box({ close_type: 2 });
					}
				});
			}

			//关闭按钮
			_OPTS_.jQueryElement.$jBoxClose.on('click', function () {
				__jBox_close_box({ close_type: 2 });
			});

			_OPTS_.initCallback && opt.initCallback.call(_OPTS_._target_ || $box, _OPTS_);

			//计算布局大小
			__jBox_set_layout($box);

			//自动关闭
			if (_OPTS_._is_message_) {
				__jBox_close_box();
			}

			//倒计时
			if (_OPTS_.icon.icon_type === 'cutdown') {
				_OPTS_.__cut_down__ = setInterval(function () {
					_OPTS_.icon.cutdown_time--;
					if (_OPTS_.icon.cutdown_time < 0) {
						clearInterval(_OPTS_.__cut_down__);
						if (_OPTS_.icon.finish_close) {
							__jBox_close_box({ close_type: 2 }, function () {
								_OPTS_.cutdownFinishCallBack && _OPTS_.cutdownFinishCallBack.call(_OPTS_._target_ || $box, _OPTS_);
							});
						} else {
							_OPTS_.cutdownFinishCallBack && _OPTS_.cutdownFinishCallBack.call(_OPTS_._target_ || $box, _OPTS_);
						}
					} else {
						_OPTS_.jQueryElement.$jBoxContBox.find('.__cutdown__').html(_OPTS_.icon.cutdown_time);
					}
				}, 1000);
			}

			//移动函数绑定-判断模式
			if (!isMobile) {
				startEvent = 'mousedown';
				moveEvent = 'mousemove';
				endEvent = 'mouseup';
			} else {
				startEvent = 'touchstart';
				moveEvent = 'touchmove';
				endEvent = 'touchend';
			}

			//判断是否开启移动
			if (_OPTS_.isMove) {
				_OPTS_.jQueryElement.$jBoxTitle.on(startEvent, startMove);
			}
			return '#' + _OPTS_.jBoxId;
		}
	}

	/**
	 * 创建标题
	 * @returns {String} 返回标题HTML
	 */
	function __create_title_html() {
		let html = '';
		let _close_html_ = _OPTS_.content.close_btn ? '<label class="__colse__"><button class="__close_btn__">&times;</button></label>' : '';
		let _title_cls_ = _OPTS_.content.title_dir.toString().toLowerCase() === 'center' ? '__center__ ' : '';
		_title_cls_ += _OPTS_.isMove ? '__move__ ' : '';
		_title_cls_ += _OPTS_.content.title_cls || '';

		if (_OPTS_._is_message_) {
			html += '';
		} else {
			if (_OPTS_.content.title) {
				html += '<div class="__title__ ' + _title_cls_ + '">';
				html += '<label class="__title_text__">' + _OPTS_.content.title + '</label>';
				html += _close_html_;
				html += '</div>';
			} else {
				html += '<div class="__title__ __min__ ' + _title_cls_ + '">' + _close_html_ + '</div>';
			}
		}

		return html;
	}

	/**
	 * 创建内容布局
	 * @param text
	 * @returns {String}
	 */
	function __create_cont_html(text) {
		let html = '';
		let _cont_cls_ = _OPTS_._module_ === 'prompt' ? '__prompt__ ' : '';
		_cont_cls_ += _OPTS_.content.title ? '__has_title__ ' : '__none_title__ ';
		_cont_cls_ += _OPTS_.content.cont_cls || '';

		let _dir_cls_ = _OPTS_.icon.direction.toString().toLowerCase() === 'h' ? '__hor__ ' : '__ver__ ';
		_dir_cls_ += _OPTS_.content.text_dir.toString().toLowerCase() === 'center' ? '__center__' : '__left__';

		let _text_cls_ = _OPTS_.icon.icon_type.toString().toLowerCase() === 'none' ? '__none__ ' : '';
		_text_cls_ += _OPTS_.content.text_cls || '';

		html += '<div class="__content__ ' + _cont_cls_ + '">';
		html += '<div class="__content_box__ ' + _dir_cls_ + '">';
		html += __create_icon_html();

		if (_OPTS_._module_ === 'prompt') {
			let input_type = _OPTS_.prompt_input_type || 'text';
			let input_value = _OPTS_.prompt_input_value || '请输入内容';
			html += !!text ? '<div class="__content_text__ ' + _text_cls_ + '">' + text + '</div>' : '';
			html += '<label class="__prompt_label__">';
			html += '<input type="' + input_type + '" placeholder="' + input_value + '">';
			html += '</label>';
		} else {
			html += !!text ? '<div class="__content_text__ ' + _text_cls_ + '">' + text + '</div>' : '';
		}

		html += '</div>';
		html += '</div>';

		return html;
	}

	/**
	 * 创建图标布局
	 * @returns {String}
	 */
	function __create_icon_html() {
		let html = '';
		let _icon_ = _OPTS_.icon;
		let _icon_css_ = _icon_.width && _icon_.height ? 'width: ' + _icon_.width + '; height: ' + _icon_.height + ';' : '';
		let _icon_cls_ = _icon_.icon_cls || '';

		switch (_icon_.icon_type.toString().toLowerCase()) {
			case 'img':
				html += '<label class="__icon__ ' + _icon_cls_ + '">';
				html += '<img src="' + _IMG_[_icon_.id] + '" style="' + _icon_css_ + '">';
				html += '</label>';
				break;
			case 'font':
				html += '<label class="__icon__ ' + _icon_cls_ + '>';
				html += '<i class="__icon_font__ ' + _icon_.font + '" " style="' + _icon_css_ + '"></i>';
				html += '</label>';
				break;
			case 'cutdown':
				html = '<label class="__cutdown__ ' + _icon_cls_ + '">' + _icon_.cutdown_time + '</label>';
				break;
			case 'none':
				html = '';
				break;
		}

		return html;
	}

	/**
	 * 创建按钮
	 * @returns {String} 返回按钮HTML
	 */
	function __create_button_html() {
		let html = '';

		let _button_ = _OPTS_.button;
		let _button_cls_ = _button_.direction.toString().toLowerCase() === 'h' ? '__hor__ ' : '__ver__ ';
		_button_cls_ += _button_.btn_cls || '';

		let _length_ = _button_.array.length;
		if (_length_) {
			html += '<div class="__button__ ' + _button_cls_ + '">';
			html += '<div class="__button_row__' + _length_ + '">';

			for (let i = 0; i < _length_; i++) {
				let item = _button_.array[i];
				let href = item.href || 'javascript:;';
				let cls = item.cls || '';
				let id = item.id || '';
				html += '<a class="' + cls + '" id="' + id + '" href="' + href + '">' + item.text + '</a>';
			}

			html += '</div>';
			html += '</div>';
		} else {
			html = '';
		}

		return html;
	}

	/**
	 * 加载图片
	 * @param src
	 * @param callback
	 */
	function loadingImage(src, callback) {
		let path = src;
		let image = new Image();
		image.src = path;
		if (!image.complete) {
			image.onload = function () {
				callback && callback.call(image, src);
			};
			image.onerror = function () {
				console.log('图片加载失败');
			};
		} else {
			// console.log("缓存图片", src);
			callback && callback.call(image, src);
		}
	}

	/**
	 * 将 px 转换成 rem
	 * @param {String} number 需要转换的px
	 */
	function __box_px2rem__(number) {
		const { lib } = window;
		if (!lib) return number;
		if (number.toString().includes('%')) return number;

		const { flexible } = lib;
		return flexible.px2rem(number) + 'rem';
	}

	/**
	 * 设置box位置
	 * @param box 传入的box对象
	 */
	function __jBox_set_layout($box) {
		let _width = $box.outerWidth(true);
		let _height = $box.outerHeight(true);

		let confirm_min_width = parseFloat(_OPTS_.element.confirm_min_width);
		let message_max_width = parseFloat(_OPTS_.element.message_max_width);
		let max_width = _OPTS_._is_message_ ? message_max_width : parseFloat(_OPTS_.element.max_width);
		let min_width = _OPTS_._is_message_ ? parseFloat(_OPTS_.element.min_width) : confirm_min_width;
		let box_width = parseFloat(_OPTS_.element.box_width) || null;
		let box_height = parseFloat(_OPTS_.element.box_height) || null;

		let _is_vertical = _OPTS_.element.vertical.toString().toLowerCase() === 'center';
		let top = _is_vertical ? '50%' : _OPTS_.element.vertical;
		let left = '50%';

		let set_width, set_height;
		if (box_width && !box_height) {
			//设置宽，没有设置高
			set_width = box_width;
			$box.css('width', set_width);
			set_height = _is_vertical ? $box.outerHeight(true) : 'auto';
		} else if (!box_width && box_height) {
			//设置高，没有设置宽
			set_height = box_height;
			$box.css('height', set_height);
			set_width = $box.outerWidth(true);
		} else if (box_width && box_height) {
			//同时设置高宽
			set_width = box_width;
			set_height = elementOpt.height;
		} else {
			//都没设置高宽
			//+1解决中英文在一起出现的问题
			if (_width >= max_width) {
				set_width = max_width;
			} else if (_width <= min_width) {
				set_width = min_width;
			} else {
				set_width = !isMobile ? _width + 1 : _width + 1;
			}

			$box.css('width', set_width);
			set_height = _is_vertical ? $box.outerHeight(true) : 'auto';
		}

		//设置位置
		$box
			.css({
				width: __box_px2rem__(set_width),
				height: !!box_height && __box_px2rem__(set_height),
				top: __box_px2rem__(top),
				left: __box_px2rem__(left),
				marginTop: _is_vertical ? __box_px2rem__(-set_height / 2) : 0,
				marginLeft: __box_px2rem__(-set_width / 2)
			})
			.addClass(_OPTS_.content.content_cls);

		//初始化之后回调
		_OPTS_.initAfterCallback && _OPTS_.initAfterCallback.call(_OPTS_._target_ || $box, _OPTS_);
	}

	/**
	 * 关闭函数
	 * @param box 关闭对象
	 * @param callback 回调函数
	 */
	function __jBox_close_box(opt, callback) {
		//Id在Id组中的位置
		let current;
		let $box;

		if (!!opt && !!opt.close_box) {
			//传入box的ID
			if (opt.close_box.indexOf('.') < 0 && opt.close_box.indexOf('#') > -1) {
				//删除传入的ID
				current = _OPTS_._jBoxId_Ary_.indexOf(opt.close_box.split('#')[1]);
			}
			$box = $(opt.close_box);
		} else {
			//确认框需要手动触发关闭
			if (!_OPTS_._is_message_) {
				current = _OPTS_.jBoxId && _OPTS_._jBoxId_Ary_ && _OPTS_._jBoxId_Ary_.length && _OPTS_._jBoxId_Ary_.indexOf(_OPTS_.jBoxId);
			}

			$box = _OPTS_.jQueryElement && _OPTS_.jQueryElement.$jBoxBox;
		}

		if (current > -1) {
			_OPTS_._jBoxId_Ary_.splice(current, 1);
		}

		if (!$box || !$box.length) return false;

		let container_close_animate = _OPTS_.container_close_animate;
		let close_animate = _OPTS_.close_animate;
		let animate = _OPTS_.box_animate;

		//关闭选项，有配置读配置
		let close_type = opt ? opt.close_type : _OPTS_.close_type;

		//关闭回调
		let __close_callback = function (ele) {
			_OPTS_.closeCallback && _OPTS_.closeCallback.call(_OPTS_._target_ || ele, _OPTS_._module_, _OPTS_);
			callback && callback.call(ele, _OPTS_._module_, _OPTS_);

			if (container_close_animate) {
				$(ele)
					.parent()
					.fadeOut('fast', function () {
						$(this).remove();
					});
			} else {
				$(ele).parent().remove();
			}

			_OPTS_.__cut_down__ && clearInterval(_OPTS_.__cut_down__);
		};

		//关闭方法
		let __close_fun = function () {
			if (close_animate) {
				$box.removeClass(animate.split('|')[0]).addClass(animate.split('|')[1]);
				__jBox_animate($box, function () {
					__close_callback(this);
				});
			} else {
				$box.removeClass(animate.split('|')[0]);
				$box.fadeOut(300, function () {
					__close_callback(this);
				});
			}

			self.hasjBoxContainer = false;
		};

		switch (close_type) {
			case 1:
				_clear_setTimeout_ = window.setTimeout(function () {
					__close_fun();
				}, _OPTS_.close_time);
				break;
			case 2:
				__close_fun();
				break;
			case 3:
				callback && callback.call($box[0], _OPTS_._module_, _OPTS_);
				break;
		}
	}

	/**
	 * 监听动画结束
	 * @param {Function} callback 回掉函数
	 */
	function __jBox_animate(box, callback) {
		let animate_env = __browser_animate_name(box[0]);

		box.one(animate_env + ' animationend', function () {
			callback && callback.call(this);
		});
	}

	/**
	 * 判断浏览器动画名称
	 * @param {Object} el document对象
	 * @returns {String} 动画名称
	 */
	function __browser_animate_name(el) {
		let animations = {
			OAnimation: 'oanimationend',
			MSAnimation: 'MSAnimationEnd',
			MozAnimation: 'mozAnimationEnd',
			WebkitAnimation: 'webkitAnimationEnd'
		};

		for (let t in animations) {
			if (animations.hasOwnProperty(t)) {
				if (el.style[t] !== undefined) {
					return animations[t];
				}
			}
		}
	}

	/**
	 * 移动函数
	 * 支持H5，PC（关闭H5移动）
	 */
	let saveData = {},
		_isMoved_ = false;

	/**
	 * 绑定移动
	 */
	self.bindMove = function (box) {
		let startEvent = 'ontouchstart' in window ? 'touchstart' : 'mousedown';
		$(box).on(startEvent, startMove);
	};

	function startMove(e) {
		let evt = e || window.event;
		let $box = _OPTS_.jQueryElement.$jBoxBox;
		saveData.startX = !isMobile ? evt.clientX || evt.pageX : evt.originalEvent.touches[0].pageX;
		saveData.startY = !isMobile ? evt.clientY || evt.pageY : evt.originalEvent.touches[0].pageY;
		saveData.top = parseFloat($box.css('top'));
		saveData.left = parseFloat($box.css('left'));
		saveData.marginTop = parseFloat($box.css('marginTop'));
		saveData.marginLeft = parseFloat($box.css('marginLeft'));
		if (!_isMoved_) {
			_isMoved_ = true;
			$(document).on(moveEvent, moving);
			$(document).on(endEvent, endMove);
		}
	}

	function moving(e) {
		let evt = e || window.event;
		evt = !isMobile ? evt : evt.originalEvent;
		// 判断默认行为是否可以被禁用
		if (evt.cancelable) {
			// 判断默认行为是否已经被禁用
			if (!evt.defaultPrevented && e.preventDefault) {
				evt.preventDefault();
			}
		}
		let $box = _OPTS_.jQueryElement.$jBoxBox;
		let x = !isMobile ? evt.clientX || evt.pageX : evt.touches[0].pageX;
		let y = !isMobile ? evt.clientY || evt.pageY : evt.touches[0].pageY;
		if (_isMoved_) {
			let mx = x - saveData.startX + saveData.left;
			let my = y - saveData.startY + saveData.top;
			if (saveData.marginLeft + mx <= 0) {
				mx = Math.abs(saveData.marginLeft);
			} else if (saveData.marginLeft + mx >= $(window).width() - $box.width()) {
				mx = $(window).width() - $box.width() + Math.abs(saveData.marginLeft);
			}
			if (saveData.marginTop + my <= 0) {
				my = Math.abs(saveData.marginTop);
			} else if (saveData.marginTop + my >= $(window).height() - $box.height()) {
				my = $(window).height() - $box.height() + Math.abs(saveData.marginTop);
			}
			$box.css({
				top: my + 'px',
				left: mx + 'px'
			});
		}
	}

	function endMove() {
		_isMoved_ = false;
		$(document).off('mousemove', moving);
		$(document).off('mouseup', endMove);
	}
};

const jBox = new $.jBox();

export default jBox;
