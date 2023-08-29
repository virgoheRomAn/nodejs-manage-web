<template>
	<div class="login-container">
		<div class="login-container--layer login-container--layer-area">
			<ul class="circles">
				<li v-for="n in 10" :key="n"></li>
			</ul>
		</div>

		<div class="login-container--layer login-container--layer-time" flex="main:center cross:center">{{ state.time }}</div>

		<div class="login-container--layer login-right">
			<div class="login-right-title">{{ getThemeConfig.globalTitle }} 欢迎您！</div>

			<div class="login-right-warp">
				<span class="login-right-warp-one"></span>
				<span class="login-right-warp-two"></span>

				<div class="login-right-warp-mian">
					<div class="login-right-warp-main-form">
						<el-form ref="ruleFormRef" size="large" class="login-content-form" :model="ruleForm" :rules="rules">
							<el-form-item class="login-animation1" prop="account">
								<el-input text :placeholder="$t('message.account.username')" v-model="ruleForm.account" clearable>
									<template #prefix>
										<i class="fa fa-user"></i>
									</template>
								</el-input>
							</el-form-item>
							<el-form-item class="login-animation2" prop="password">
								<el-input
									:type="state.isShowPassword ? 'text' : 'password'"
									:placeholder="$t('message.account.password')"
									v-model="ruleForm.password"
								>
									<template #prefix>
										<i class="fa fa-lock"></i>
									</template>
									<template #suffix>
										<i
											class="iconfont el-input__icon login-content-password"
											:class="!state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
											@click="state.isShowPassword = !state.isShowPassword"
										></i>
									</template>
								</el-input>
							</el-form-item>
							<el-form-item class="login-animation3">
								<div class="w100" id="captchaBox"></div>
							</el-form-item>
							<el-form-item class="login-animation4">
								<el-button type="primary" class="login-content-submit" round v-waves @click="onSignIn(ruleFormRef)" :loading="state.signInLoading">
									<span>{{ $t('message.account.accountBtnText') }}</span>
								</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>

			<el-button class="login-container--quick" size="default" type="info" v-if="VITE_APP_NODE_ENV === 'development'" @click="dialogVisible = true"
				>快速选择用户</el-button
			>

			<div class="login-right-footer">
				<p class="login-right-footer-copyright">
					<label>{{ getThemeConfig.globalTitle }} v{{ version }}</label>
					<label>构建时间：{{ buildTime }}</label>
				</p>
			</div>
		</div>
	</div>

	<el-dialog title="快速选择用户" v-model="dialogVisible" width="300px">
		<el-row :gutter="12">
			<el-col v-for="(user, index) in users" :key="index" :span="6">
				<div class="login-container--quick-user" @click="handleUserBtnClick(user)">
					<ele-UserFilled />
					<span>{{ user.name }}</span>
				</div>
			</el-col>
		</el-row>
	</el-dialog>

	<ChangePassword ref="changePasswordDialogRef" />
</template>

<script setup lang="ts" name="loginIndex">
import { defineAsyncComponent, onMounted, reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { FormInstance, FormRules } from 'element-plus';
import { useThemeConfig } from '/@/stores/modules/themeConfig';
import { useUserInfo } from '/@/stores/modules/userInfo';
import { NextLoading } from '/@/plugins/loading';
import { jBox } from '/@/plugins/jBox';
import { U } from '/@/utils';
import { initFrontEndControlRoutes } from '/@/router/control';
import { createGeetestCaptcha } from '/@/api/login';

// 引入组件
const ChangePassword = defineAsyncComponent(() => import('./src/changePassword.vue'));

// 定义变量内容
const { buildTime, version, env } = __APP_INFO__;
const { VITE_APP_NODE_ENV } = env;
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const storesThemeConfig = useThemeConfig();
const storesUserInfo = useUserInfo();
const { themeConfig } = storeToRefs(storesThemeConfig);
const timeInterval = ref();
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const changePasswordDialogRef = ref<RefType>();
const ruleForm = reactive({
	account: '',
	password: '',
	secCode: '',
	challenge: '',
	validateStatus: false
});
const rules = reactive<FormRules>({
	account: [{ required: true, trigger: 'blur', message: '用户名不能为空！' }],
	password: [{ required: true, trigger: 'blur', message: '密码不能为空！' }]
});
const state = reactive({
	time: U.dayjs().format('HH:mm:ss'),
	isShowPassword: false,
	signInLoading: false
});
const gt = reactive({
	captcha: {},
	captchaData: {},
	captchaResult: ''
});

// 快捷入口
const users = ref([
	{ name: '管理员', account: 'admin', password: 'Zbj123456' },
	{ name: '徐继强', account: 'xujiqiang', password: 'QQxjq123456' },
	{ name: '李程成a', account: 'lichengchenga', password: '123456bA' }
]);

// 获取布局配置信息
const getThemeConfig = computed(() => themeConfig.value);

// 时间获取
const currentTime = computed(() => U.formatAxis(new Date()));

// 页面加载时
onMounted(async () => {
	// 倒计时
	timeInterval.value = setInterval(() => {
		state.time = U.dayjs().format('HH:mm:ss');
	}, 1000);

	// 加载极验二维码
	const rs = await createGeetestCaptcha();
	if (rs.code === 'SUCCESS') {
		gt.captcha = rs.data;

		const params = {
			gt: rs.data.gt,
			challenge: rs.data.challenge,
			offline: rs.data.offline,
			new_captcha: true,
			product: 'float',
			width: '100%'
		};

		window['initGeetest']({ ...params }, (captcha: EmptyObjectType) => {
			gt.captchaData = captcha;
			captcha.appendTo('#captchaBox');

			captcha.onSuccess(() => {
				gt.captchaResult = captcha.getValidate();
			});
		});
	}
});

// 卸载时候
onUnmounted(() => {
	clearInterval(timeInterval.value);
});

// 登录
const onSignIn = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;

	await formEl.validate(async (valid, fields) => {
		if (valid) {
			const isCaptcha = gt.captchaResult && Object.keys(gt.captchaResult).length !== 0;
			if (!isCaptcha) {
				jBox.waring('请先完成滑块验证！');
				return;
			}

			state.signInLoading = true;

			ruleForm.challenge = (gt.captcha as any).challenge;
			ruleForm.secCode = (gt.captchaResult as any).geetest_seccode;
			ruleForm.validateStatus = import.meta.env.VITE_GT_CAPTCHA === '1';

			// 处理登录逻辑
			const rs: ResponesResult = await storesUserInfo.userLogin(ruleForm);

			if (rs.code === 'SUCCESS') {
				await initFrontEndControlRoutes();

				jBox.success(`登录成功！ ${rs.data.name} ${currentTime.value}，辛苦拉~`, () => {
					state.signInLoading = false;
					NextLoading.start();
					router.push('/home');
				});
			} else {
				state.signInLoading = false;
				gt.captchaResult = '';
				(gt.captchaData as any).reset();
				if (rs.code === 'PERMISSION_ERROR') {
					changePasswordDialogRef.value.openDialog();
				}
			}
		}
	});
};

/**
 * @description 接收选择一个用户快速登录的事件
 * @param {Object} user 用户信息
 */
const handleUserBtnClick = (user: EmptyObjectType) => {
	ruleForm.account = user.account;
	ruleForm.password = user.password;
	dialogVisible.value = false;
};
</script>

<style scoped lang="scss">
.login-container {
	height: 100%;
	background: var(--el-bg-color-page);

	.login-container--quick {
		width: 30%;
		margin-top: 20px;
		display: block;
		border-color: transparent;
		background: transparent;
		color: var(--el-text-color-primary);
	}

	.login-container--layer {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;

		&.login-container--layer-area {
			overflow: hidden;

			// 背景
			.circles {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				overflow: hidden;
				margin: 0px;
				padding: 0px;

				li {
					position: absolute;
					display: block;
					list-style: none;
					width: 20px;
					height: 20px;
					background: #fff;
					animation: loginCirclesAnimate 25s linear infinite;
					bottom: -200px;

					&:nth-child(1) {
						left: 15%;
						width: 80px;
						height: 80px;
						animation-delay: 0s;
					}

					&:nth-child(2) {
						left: 5%;
						width: 20px;
						height: 20px;
						animation-delay: 2s;
						animation-duration: 12s;
					}

					&:nth-child(3) {
						left: 70%;
						width: 20px;
						height: 20px;
						animation-delay: 4s;
					}

					&:nth-child(4) {
						left: 40%;
						width: 60px;
						height: 60px;
						animation-delay: 0s;
						animation-duration: 18s;
					}

					&:nth-child(5) {
						left: 65%;
						width: 20px;
						height: 20px;
						animation-delay: 0s;
					}

					&:nth-child(6) {
						left: 75%;
						width: 150px;
						height: 150px;
						animation-delay: 3s;
					}

					&:nth-child(7) {
						left: 35%;
						width: 200px;
						height: 200px;
						animation-delay: 7s;
					}

					&:nth-child(8) {
						left: 50%;
						width: 25px;
						height: 25px;
						animation-delay: 15s;
						animation-duration: 45s;
					}

					&:nth-child(9) {
						left: 20%;
						width: 15px;
						height: 15px;
						animation-delay: 2s;
						animation-duration: 35s;
					}

					&:nth-child(10) {
						left: 85%;
						width: 150px;
						height: 150px;
						animation-delay: 0s;
						animation-duration: 11s;
					}
				}
			}
		}

		&.login-container--layer-time {
			overflow: hidden;
			font-size: 24em;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.03);
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.login-right {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.login-right-title {
			font-size: 30px;
			color: #333333;
			margin: 0px auto 2em auto;
			text-align: center;
			font-weight: bold;
			animation: logoAnimation 0.3s ease;
			animation-delay: 0.3s;
			color: var(--el-text-color-primary);
		}

		.login-right-footer {
			position: absolute;
			bottom: 10px;
			padding: 1em 0;
			display: flex;
			align-items: center;

			&-copyright {
				padding: 0px;
				margin: 0px;
				margin-bottom: 10px;
				font-size: 14px;
				line-height: 12px;
				text-align: center;
				color: var(--el-text-color-primary);

				a {
					color: var(--el-color-primary);
				}

				label {
					font-weight: 400;
					margin: 0 10px;
					color: var(--el-text-color-secondary);
				}
			}
		}

		.login-right-warp {
			border-radius: 5px;
			width: 450px;
			height: 350px;
			position: relative;
			overflow: hidden;
			background-color: var(--next-color-white-mask);

			.login-right-warp-one,
			.login-right-warp-two {
				position: absolute;
				display: block;
				width: inherit;
				height: inherit;
				&::before,
				&::after {
					content: '';
					position: absolute;
					z-index: 1;
				}
			}
			.login-right-warp-one {
				&::before {
					filter: hue-rotate(0deg);
					top: 0px;
					left: 0;
					width: 100%;
					height: 3px;
					background: linear-gradient(90deg, transparent, var(--el-color-primary));
					animation: loginLeft 3s linear infinite;
				}
				&::after {
					filter: hue-rotate(60deg);
					top: -100%;
					right: 0;
					width: 3px;
					height: 100%;
					background: linear-gradient(180deg, transparent, var(--el-color-primary));
					animation: loginTop 3s linear infinite;
					animation-delay: 0.7s;
				}
			}
			.login-right-warp-two {
				&::before {
					filter: hue-rotate(120deg);
					bottom: 0;
					right: -100%;
					width: 100%;
					height: 3px;
					background: linear-gradient(270deg, transparent, var(--el-color-primary));
					animation: loginRight 3s linear infinite;
					animation-delay: 1.4s;
				}
				&::after {
					filter: hue-rotate(300deg);
					bottom: -100%;
					left: 0px;
					width: 3px;
					height: 100%;
					background: linear-gradient(360deg, transparent, var(--el-color-primary));
					animation: loginBottom 3s linear infinite;
					animation-delay: 2.1s;
				}
			}

			.login-right-warp-mian {
				display: flex;
				flex-direction: column;
				justify-content: center;
				height: 100%;

				.login-right-warp-main-form {
					flex: 1;
					padding: 40px 60px;
					.login-content-main-sacn {
						position: absolute;
						top: 0;
						right: 0;
						width: 50px;
						height: 50px;
						overflow: hidden;
						cursor: pointer;
						transition: all ease 0.3s;
						color: var(--el-color-primary);
						&-delta {
							position: absolute;
							width: 35px;
							height: 70px;
							z-index: 2;
							top: 2px;
							right: 21px;
							background: var(--el-color-white);
							transform: rotate(-45deg);
						}
						&:hover {
							opacity: 1;
							transition: all ease 0.3s;
							color: var(--el-color-primary) !important;
						}
						i {
							width: 47px;
							height: 50px;
							display: inline-block;
							font-size: 48px;
							position: absolute;
							right: 1px;
							top: 0px;
						}
					}
				}
			}
		}
	}

	.login-content-form {
		margin-top: 20px;
		@for $i from 1 through 4 {
			.login-animation#{$i} {
				opacity: 0;
				animation-name: error-num;
				animation-duration: 0.5s;
				animation-fill-mode: forwards;
				animation-delay: calc($i/10) + s;
			}
		}
		.login-content-password {
			display: inline-block;
			width: 20px;
			cursor: pointer;
			&:hover {
				color: #909399;
			}
		}
		.login-content-code {
			width: 100%;
			padding: 0;
			font-weight: bold;
			letter-spacing: 5px;
		}
		.login-content-submit {
			width: 100%;
			letter-spacing: 2px;
			font-weight: 300;
			margin-top: 15px;
		}
	}
}

// 快速选择用户面板
.login-container--quick-user {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	> svg {
		width: 30px;
		margin-bottom: 5px;
	}
}
</style>
