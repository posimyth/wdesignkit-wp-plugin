const {
	__,
} = wp.i18n;

const { Fragment } = wp.element;

import axios from 'axios'
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Elementor_file_create from '../widget-builder/file-creation/elementor_file';
import CreatFile from '../widget-builder/file-creation/gutenberg_file';
import Bricks_file_create from '../widget-builder/file-creation/bricks_file';

var img_path = wdkitData.WDKIT_URL;

const GetCount = (count) => {
	let counts = Number(count);
	let array = []
	for (let x = 0; x < counts; x++) {
		array.push(x);
	}

	return array;
}

export const Get_site_url = () => {
	let path_name = window?.location?.pathname ? window.location.pathname : '',
		path_array = path_name.split('/');

	if (path_array.includes('wp-admin')) {
		let index = path_array.findIndex((url) => url == 'wp-admin'),
			filter_array = path_array.slice(0, index + 1),
			final_path = filter_array.join('/'),
			site_url = window.location.origin + final_path;

		return site_url;
	} else {
		let site_url = window.location.origin + window.location.pathname;

		return site_url;
	}
}

const RemoveExtraSpace = (title) => {
	var FinalTitle = title.replace(/\s+/g, '-');
	FinalTitle = FinalTitle.replace(/[^\w-]+/g, '');
	FinalTitle = FinalTitle.toLowerCase();

	return FinalTitle;
}

export const Letter_image = (name) => {
	let user_name = name;
	if (user_name) {
		let user_array = user_name.split(" ");

		if (user_array.length > 1) {
			let ft = user_array[0].charAt(0)
			let sc = user_array[1].charAt(0)

			return ft + sc
		} else {
			let name = user_array[0].charAt(0) + user_array[0].charAt(1);

			return name;
		}
	}
}

/**
 * It is call Main AJAX
 *
 * @version 1.0.0
 */
export const wdKit_fetch_api = async (args) => {

	if (args) {
		return await axios.post(ajaxurl, args, {
			headers: { 'content-type': 'application/json' }
		})
			.then((response) => response.data)
			.catch(error => error);
	} else {
		return false;
	}
}

/**
 * FormData appends attributes, It is use for api call and ajax call
 *
 * @since 1.0.0
 * @version 1.0.18
 */
export const wdKit_Form_data = async (options) => {
	let form = new FormData;

	if (form && options) {

		form.append('action', 'get_wdesignkit');
		form.append('kit_nonce', wdkitData.kit_nonce);
		if (options.w_image) {
			form.append('w_image', options.w_image);
		}
		Object.entries(options).map(([key, val]) => (
			form.append(key, val)
		));
	}

	return wdKit_fetch_api(form);
}

/**
 * Get UserInfo
 *
 * @since 1.0.0
 * @version 1.0.18
 */
export const Get_user_info_data = async () => {

	let site_url = Get_site_url();
	let loginData = get_user_login(),
		builder = window.wdkit_editor == 'wdkit' ? '' : window.wdkit_editor;

	let userEmail = '';
	if (loginData && loginData.user_email) {
		userEmail = loginData.user_email
	}

	let form_arr = {
		'type': 'get_user_info',
		'email': userEmail,
		'builder': builder,
		'site_url': site_url,
	}

	let UserData = await wdKit_Form_data(form_arr);

	// if (!UserData?.data?.success) {
	// 	wkit_logout();
	// }

	window.userData = UserData;

	return UserData;
}

export const Toast_message = (props) => {

	useEffect(() => {
		if (props?.ToastData?.title) {
			setTimeout(async () => {
				if (document.querySelector('.wkit-toast-content.wkit-show-toast')) {
					await document.querySelector('.wkit-toast-content').classList.remove('wkit-show-toast');
				}

				await setTimeout(() => {
					props.wdkit_set_toast('')
				}, 500);
			}, 5000);

			document.querySelector('.wkit-toast-content').classList.add('wkit-show-toast')
		}
	})

	let title = props.ToastData.title ? props.ToastData.title : '',
		subTitle = props.ToastData.subTitle ? props.ToastData.subTitle : '',
		type = props.ToastData.type ? props.ToastData.type : '';

	const close_toast = async () => {
		let get_msg = document.querySelector('.wkit-toast-content');

		if (get_msg) {
			get_msg.classList.remove('wkit-show-toast')
		}

		await setTimeout(() => {
			props.wdkit_set_toast('')
		}, 500);
	}

	if (title) {
		return (
			<div className='wkit-toast-content wkit-show-toast'>
				<div className='wkit-toast-msg-img'>
					{'success' === type ?
						<svg width="39" height="38" viewBox="0 0 39 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M37.3731 22.4881L37.3614 22.4939C35.9903 23.5454 35.4094 25.3347 35.8974 26.9905L35.9032 27.0021C36.6816 29.6338 34.753 32.2887 32.0108 32.3585H31.9992C30.268 32.4049 28.7459 33.5087 28.1707 35.1412V35.147C27.2527 37.738 24.1273 38.7546 21.8674 37.1918C20.4641 36.2336 18.6091 36.1836 17.1327 37.1918H17.1269C14.867 38.7488 11.7415 37.7379 10.8294 35.1411C10.2491 33.5046 8.72922 32.4048 7.00094 32.3584H6.9893C4.24727 32.2886 2.31844 29.6338 3.09695 27.0021L3.10273 26.9904C3.59063 25.3346 3.00969 23.5453 1.63875 22.4938L1.62711 22.4881C-0.551484 20.8149 -0.551484 17.5384 1.62711 15.8653L1.63875 15.8595C3.00969 14.808 3.59063 13.0186 3.09695 11.3629V11.3513C2.31258 8.71963 4.24719 6.06463 6.9893 5.99494H7.00094C8.72633 5.94846 10.2542 4.84463 10.8294 3.21221V3.20642C11.7414 0.615409 14.867 -0.401232 17.1269 1.16158H17.1327C18.5559 2.14338 20.4382 2.14338 21.8674 1.16158C24.1501 -0.414747 27.2581 0.630956 28.1707 3.20642V3.21221C28.7459 4.83885 30.2679 5.94853 31.9992 5.99494H32.0108C34.7529 6.06463 36.6816 8.71963 35.9032 11.3513L35.8974 11.3629C35.4094 13.0186 35.9903 14.808 37.3614 15.8595L37.3731 15.8653C39.5516 17.5384 39.5516 20.8149 37.3731 22.4881Z" fill="#3EB655" /><path d="M19.5004 29.9987C25.477 29.9987 30.322 25.1537 30.322 19.1771C30.322 13.2005 25.477 8.35547 19.5004 8.35547C13.5237 8.35547 8.67871 13.2005 8.67871 19.1771C8.67871 25.1537 13.5237 29.9987 19.5004 29.9987Z" fill="#8BD399" /><path opacity="0.1" d="M27.8093 12.2486C25.9375 10.7087 23.5428 9.7832 20.9321 9.7832C14.9556 9.7832 10.1079 14.6309 10.1079 20.6074C10.1079 23.218 11.0335 25.6128 12.5732 27.4846C10.195 25.5008 8.68018 22.5166 8.68018 19.1755C8.68018 13.1989 13.5237 8.35547 19.5003 8.35547C22.8413 8.35547 25.8255 9.87031 27.8093 12.2486Z" fill="black" /><path d="M16.9257 23.4117L14.5327 20.8658C13.906 20.1989 13.9383 19.1504 14.6049 18.5237C15.2716 17.8962 16.3206 17.9298 16.9467 18.5962L18.0891 19.8111L22.9448 14.2612C23.5467 13.5725 24.5935 13.5026 25.2828 14.1054C25.9716 14.7081 26.0411 15.7547 25.4387 16.4434L19.3797 23.368C18.7342 24.105 17.5951 24.1243 16.9257 23.4117Z" fill="white" /></svg>
						:
						<svg width="39" height="38" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.96273 4.14568L3.14055 14.2293C3.03538 14.4114 2.98 14.6179 2.97998 14.8282C2.97996 15.0385 3.0353 15.2451 3.14044 15.4272C3.24557 15.6093 3.3968 15.7605 3.57891 15.8657C3.76102 15.9708 3.96761 16.0262 4.17789 16.0261H15.8213C16.0316 16.0262 16.2382 15.9708 16.4203 15.8657C16.6024 15.7605 16.7536 15.6093 16.8588 15.4272C16.9639 15.2451 17.0193 15.0385 17.0192 14.8282C17.0192 14.6179 16.9638 14.4114 16.8587 14.2293L11.0371 4.14568C10.932 3.96362 10.7808 3.81244 10.5987 3.70732C10.4167 3.60221 10.2102 3.54688 9.99992 3.54688C9.78969 3.54688 9.58317 3.60221 9.40111 3.70732C9.21904 3.81244 9.06785 3.96362 8.96273 4.14568Z" fill="#EE404C" /><path d="M10.076 7.25391H9.9241C9.55019 7.25391 9.24707 7.55702 9.24707 7.93094V11.167C9.24707 11.5409 9.55019 11.8441 9.9241 11.8441H10.076C10.4499 11.8441 10.753 11.5409 10.753 11.167V7.93094C10.753 7.55702 10.4499 7.25391 10.076 7.25391Z" fill="#FFF7ED" /><path d="M10 14.4122C10.4159 14.4122 10.753 14.0751 10.753 13.6592C10.753 13.2434 10.4159 12.9062 10 12.9062C9.58419 12.9062 9.24707 13.2434 9.24707 13.6592C9.24707 14.0751 9.58419 14.4122 10 14.4122Z" fill="#FFF7ED" /></svg>
					}
				</div>
				<div className='wkit-toast-msg-content'>
					<span className={`wkit-toast-text wkit-${type}-msg`}>{title}</span>
					<p>{subTitle}</p>
				</div>
				<div className="wkit-toast-close">
					<span onClick={() => { close_toast() }}>
						<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
					</span>
				</div>
				<div className={`wkit-toast-progress wkit-${type}-msg-progress`}></div>
			</div>
		);
	}
}

export const set_user_login = (loginDetails) => {

	if (loginDetails) {
		localStorage.setItem('wdkit-login', JSON.stringify(loginDetails))
	}

}

export const get_user_login = () => {
	return JSON.parse(localStorage.getItem('wdkit-login'))
}

export const wkit_logout = async (navigation) => {
	let loginData = get_user_login()

	if (loginData && loginData.user_email) {
		let form_arr = { 'type': 'wkit_logout', 'email': loginData.user_email, 'logout_type': loginData.login_type }
		await wdKit_Form_data(form_arr);

		window.userData = ''
		localStorage.removeItem('wdkit-login');
	}

	window.location.hash = '/login'
}

export const wkit_getCategoryList = (categories) => {

	if (window.wKit_Category) {
		return window.wKit_Category
	}

	window.wKit_Category = []
	if (categories && categories.length > 0) {
		const parentCategory = (id) => {
			let parentList = []
			if (id != '') {
				Object.entries(categories).map(([key, val]) => {
					if (val.parent === id) {
						parentList[val.term_id] = val
					}
				})
			}
			return parentList;
		}
		Object.entries(categories).map(([key, val]) => {
			if (val.parent == 0) {
				window.wKit_Category[val.term_name] = parentCategory(val.term_id)
			}
		})
	}

	return window.wKit_Category
}

export const wkitGetBuilder = (builder_id, builder_list) => {
	let result = ''
	if (builder_id && builder_list) {
		Object.entries(builder_list).map(([key, val]) => {
			if (Number(val.p_id) === Number(builder_id)) {
				result = val.original_slug
			}
		})
	}
	return result || ''
}

export const wkit_SelectWorkSpace = (userData, temp_id = '', action = 'all') => {

	var result = [];
	if (userData && userData.workspace) {
		Object.entries(userData.workspace).map(([key, val]) => {
			if (val.roles === 'admin' || val.roles === "editor") {
				if (action == 'all') {
					result[key] = { 'w_id': val.w_id, 'title': val.work_title }
				} else if ((action == 'copy' || action == 't-copy' || action == 'move')) {
					result[key] = { 'w_id': val.w_id, 'title': val.work_title }
				}
			}
		});
	}

	return result;
}

export const loadingIcon = () => {
	return (
		<div className="wkit-loading-check">
			<img style={{ width: '125px', height: '125px' }} src={img_path + "assets/images/jpg/wdkit_loader.gif"} />
		</div>
	)
}

export const WkitLoader = () => {
	return (
		<div className="wkit-content-loader">
			<div className="wb-contentLoader-circle"></div>
		</div>
	)
}

export const Wkit_popupContent = ({ props, children }) => {

	return (
		<div className={"wkit-model-transp wkit-popup-show"} onClick={(e) => { if (Object.values(e.target.classList).includes('wkit-model-transp')) { children.props.popCloseHandler(false) } }}>
			<div className={"wkit-plugin-model-content"}>
				<a className={"wkit-plugin-popup-close"} onClick={(e) => { children.props.popCloseHandler(false) }}>
					<span>
						<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
					</span>
				</a>
				{children}
			</div>
		</div>
	)
}

export const Wkit_checkBuilder = (builder_id, builderType = 'all', builder_array) => {
	let result = false;
	if (wdkitData.use_editor == 'wdkit' && builderType == 'all') {
		return true;
	} else if (wdkitData.use_editor != 'wdkit' && builderType == 'all') {
		builderType = wdkitData.use_editor
	}

	if (window.userData && window.userData.data && window.userData.data.builder && builder_id) {
		let builders = window.userData.data.builder;
		Object.entries(builders).forEach(([key, value]) => {
			if (value.p_id == Number(builder_id) && value.original_slug == builderType) {
				result = true;
			}
		})
	} else {
		let builders = builder_array;
		builders && Object.entries(builders).forEach(([key, value]) => {
			if (value.p_id == Number(builder_id) && value.original_slug == builderType) {
				result = true;
			}
		})
	}

	return result;
}

export const DeletePopup = (props) => {
	return (
		<div className='wkit-model-transp wkit-popup-show'>
			<div className='wkit-plugin-model-content'>
				<a className={"wkit-plugin-popup-close"} onClick={(e) => { props.setdeleteWsID(-1); }}>
					<span>
						<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
					</span>
				</a>
				<div className="popup-missing">
					<div className="popup-header">{__('Please Confirm')}</div>
					<div className="popup-body">
						<div className="wkit-popup-content-title">
							{__('Are you sure want to permanently delete')}
						</div>
						<div className="wkit-popup-buttons">
							<button className="wkit-popup-confirm wkit-outer-btn-class" onClick={() => { props.setdeleteWsID(-1) }}>
								{__('No')}
							</button>
							<button className="wkit-popup-cancel wkit-btn-class" onClick={() => props.removeFunction()}>
								{props.isLoading ?
									<WkitLoader />
									:
									<span>{__('Yes')}</span>
								}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Template_loop = (props) => {
	var img_path = wdkitData.WDKIT_URL;
	let location = useLocation();
	const navigation = useNavigate();

	const [dataFavorite, setFavorite] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCopyWs, setIsCopyWs] = useState(false);
	const [isAction, setAction] = useState(false);
	const [deleteTempId, setDeleteTempId] = useState(-1);
	const [clickType, setClickType] = useState('');
	let login_array = location.pathname.split('/');

	let template = props.data;
	let builder_icon = '';
	let plugin_name = "";
	if (props.builder && template.post_builder) {
		Object.entries(props.builder).forEach(([key, value]) => {
			if (value.p_id == Number(template.post_builder)) {
				builder_icon = value.plugin_icon;
				plugin_name = value.plugin_name;
			}
		});
	}

	useEffect(() => {
		if (props.favorite && props.favorite.includes(Number(template.id))) {
			setFavorite(true);
		}
	}, [template.id]);

	const manageFavorite = async (temp_id) => {
		setIsLoading(true);
		let initProp = props
		if (temp_id) {
			let loginData = get_user_login()
			var userEmail = ''
			if (loginData && loginData.user_email) {
				userEmail = loginData.user_email
			}
			let form_arr = { 'type': 'manage_favorite', 'email': userEmail, 'template_id': temp_id }
			let res = await wdKit_Form_data(form_arr);
			if (res?.data == 'success') {
				props.wdkit_set_toast(res?.message, res?.description, '', 'success');

				let favIndex = -1;
				if (favIndex = props.favorite.indexOf(temp_id)) {
					if (favIndex > -1) {
						props.favorite.splice(favIndex, 1);
					} else {
						props.favorite.push(temp_id);
					}
				}
				setFavorite(!dataFavorite);
				setIsLoading(false);
				initProp.handler(props.favorite)
			}
		} else {
			return { 'error': false, 'data': __('Not found') }
		}
	}

	const params = useParams();

	const onDeleteTemplate = async () => {
		let loginData = get_user_login()
		let userEmail = ''
		if (loginData && loginData.user_email) {
			userEmail = loginData.user_email
		}
		if (deleteTempId > -1) {
			if (props.setLoading) {
				props.setLoading(true);
			}
			let form_arr = { 'type': 'template_remove', 'email': userEmail, 'template_id': deleteTempId }
			let res = await wdKit_Form_data(form_arr);
			if (res?.success) {
				let userData = await Get_user_info_data()
				props.wdkit_set_toast(res?.message, res?.description, '', 'success');
				props.UpdateUserData(userData);
			} else {
			}
		}
		setDeleteTempId(-1);
	}

	const onRemoveTemplate = async () => {
		if (props.setLoading) {
			props.setLoading(true);
		}

		if (deleteTempId && params && params.id) {
			let form_arr = { 'wid': params.id, 'template_id': deleteTempId, 'wstype': 'temp_remove', 'moveId': params.id }
			let result = await wdkit_Manage_WorkSpace_Api(form_arr);
			if (result?.data?.success) {
				props.wdkit_set_toast(result?.data?.message, result?.data?.description, '', 'success');
			}
			let userData = await Get_user_info_data()
			props.UpdateUserData(userData);
		}

		if (props.setLoading) {
			props.setLoading(false);
		}
	}

	const handleTempChecked = (e) => {
		if (props.handlerMultiSelect) {
			const { value, checked } = e.target;
			if (checked) {
				props.handlerMultiSelect(props.data, 'add');
			} else {
				props.handlerMultiSelect(props.data, 'remove');
			}
		}
	}

	const Check_selected_temp = () => {
		let data = template;
		let find = [];
		if (data.type == 'pagetemplate') {
			let id = props?.checklist?.pages?.findIndex((index) => index.id == data.id)
			if (id > -1) {
				return true
			} else {
				return false
			}
		} else if (data.type == 'section') {
			let id = props?.checklist?.sections?.findIndex((index) => index.id == data.id)
			if (id > -1) {
				return true
			} else {
				return false
			}
		}
	}

	const GetSinglePageSlug = (data) => {
		if (data.type == 'pagetemplate') {
			return 'page';
		} else if (data.type == 'websitekit') {
			return 'kit';
		} else {
			return data.type;
		}
	}

	const SetImageUrl = (url) => {
		if (url) {
			var imageUrl = url.replace(/\s/g, "%20");

			return imageUrl;
		} else {
			return '';
		}
	}

	const [openDropDown, setopenDropDown] = useState(false);
	document.addEventListener('click', (e) => {
		var singleCloseDropdown = e.target.closest(".w-designkit-hover-select");
		var multiCloseDropdown = document.querySelectorAll(".wkit-dropdown-content");
		if (singleCloseDropdown == null) {
			if (multiCloseDropdown.length > 0) {
				multiCloseDropdown.forEach((e, index) => {
					if (openDropDown != true) {
						setopenDropDown(false)
					}
				})
			}
		}
	});

	const GetFirstpathName = () => {
		let pathArray = location.pathname.split('/');

		return pathArray[1];
	}

	const Template_image_link = () => {
		var Temp_url = '';
		if (login_array.includes('my_uploaded')) {
			Temp_url = `${wdkitData.wdkit_server_url}admin/packs/view/${props.data.id}`;
		} else if (login_array.includes('browse')) {
			Temp_url = `${wdkitData.wdkit_server_url}templates/${GetSinglePageSlug(props.data)}/${RemoveExtraSpace(props.data.title)}/${props.data.id}`;
		}

		if (props.type !== "websitekit" && props.type !== "websitekit-view" && (login_array.includes('my_uploaded') || login_array.includes('browse'))) {
			return (
				<a href={Temp_url} target="_blank" rel="noopener noreferrer" className='wkit-temp-link-server'>
					<picture>
						{props.data && props.data.responsive_image &&
							props.data.responsive_image.map((image_data, index) => {
								return (
									<Fragment key={index}>
										<source media={`(min-width: ${image_data.size}px)`} srcSet={SetImageUrl(image_data.url)} />
									</Fragment>
								);
							})
						}
						<img className='wkit-temp-image-content' src={(template.post_image && template.post_image.indexOf("wdesignkit") > -1) ?
							template.post_image : img_path + 'assets/images/placeholder.jpg'} alt={"featured-img"} draggable={false} />
					</picture>
				</a>
			);
		} else {
			return (
				<picture>
					{props.data && props.data.responsive_image &&
						props.data.responsive_image.map((image_data, index) => {
							return (
								<Fragment key={index}>
									<source media={`(min-width: ${image_data.size}px)`} srcSet={SetImageUrl(image_data.url)} />
								</Fragment>
							);
						})
					}
					<img className='wkit-temp-image-content' src={(template.post_image && template.post_image.indexOf("wdesignkit") > -1) ?
						template.post_image : img_path + 'assets/images/placeholder.jpg'} alt={"featured-img"} draggable={false} />
				</picture>
			);
		}
	}

	const Download_template = (id) => {

		let loginData = get_user_login();
		if (props.data.free_pro == "pro" && !loginData) {
			navigation('/login')
			return false;
		}

		if (template.is_activated == 'active') {
			var download_access = false;
			if (props.data.free_pro == "pro" && props?.credits?.pro_template_limit?.meta_value == "1") {

				let builder_name = plugin_name.toLowerCase();
				if (builder_name === "elementor") {
					if (props?.credits?.access_elementor?.meta_value == "1") {
						download_access = true;
					}
				} else if (builder_name === "gutenberg") {
					if (props?.credits?.access_gutenburg?.meta_value == "1") {
						download_access = true;
					}
				} else if (builder_name === "bricks") {
					if (props?.credits?.access_bricks?.meta_value == "1") {
						download_access = true;
					}
				}
			}

			if (props.data.free_pro == "pro" && !download_access) {
				props.wdkit_set_toast("Get Pro Version to Download", '', '', 'danger')
				return false;
			}

			props.handlerTempID(id)
		} else {
			props.wdkit_set_toast('Template Deactivate', 'This Template is Deactivated', '', 'danger');
		}
	}

	const Download_kit = (data, id) => {
		var download_access = false;

		let loginData = get_user_login();
		if (props.data.free_pro == "pro" && !loginData) {
			navigation('/login')
			return false;
		}

		if (data.data.is_activated == 'active') {
			var download_access = false;
			if (data.data.free_pro == "pro" && props?.credits?.pro_template_limit?.meta_value == "1") {

				let builder_name = plugin_name.toLowerCase();
				if (builder_name === "elementor") {
					if (props?.credits?.access_elementor?.meta_value == "1") {
						download_access = true;
					}
				} else if (builder_name === "gutenberg") {
					if (props?.credits?.access_gutenburg?.meta_value == "1") {
						download_access = true;
					}
				} else if (builder_name === "bricks") {
					if (props?.credits?.access_bricks?.meta_value == "1") {
						download_access = true;
					}
				}
			}
		}

		if (data.data.free_pro == "pro" && !download_access) {
			props.wdkit_set_toast("Get Pro Version to Download", '', '', 'danger')
			return false;
		} else {
			navigation(`/${GetFirstpathName()}/kit/${id}?page=${data.currentPage}${data.wsID ? `&wsID=${data.wsID}` : ''}`)
		}
	}

	return (
		<div className={"wdesign-template-boxed"}>
			{template.is_activated != 'active' &&
				<Fragment>
					<div className='wdkit-inner-boxed-deActivate'>
						<div className='wdkit-inner-boxed-deActivate-h1'>{__('Credit Limit Reached!')}</div>
						<div className='wdkit-inner-boxed-deActivate-p'>{__('This Template got disabled until you have more credits to make it active.')}</div>
						<a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
							<button>{__('Buy Credits')}</button>
						</a>
					</div>
					{(!props.filter || (props.filter && props.filter != 'browse')) && !(window.location.hash.search('#/share_with_me') > -1) && !(window.location.hash.search('/kit/') > -1) &&
						<span className='wdkit-inner-boxed-remove'>
							<svg onClick={() => { setDeleteTempId(template.id), setClickType('delete') }} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
								<path fillRule="evenodd" clipRule="evenodd" d="M5.66634 1.83203C5.44533 1.83203 5.23337 1.91983 5.07709 2.07611C4.9208 2.23239 4.83301 2.44435 4.83301 2.66536V3.4987H9.16634V2.66536C9.16634 2.44435 9.07854 2.23239 8.92226 2.07611C8.76598 1.91983 8.55402 1.83203 8.33301 1.83203H5.66634ZM10.1663 3.4987V2.66536C10.1663 2.17913 9.97319 1.71282 9.62937 1.369C9.28555 1.02519 8.81924 0.832031 8.33301 0.832031H5.66634C5.18011 0.832031 4.7138 1.02519 4.36998 1.369C4.02616 1.71282 3.83301 2.17913 3.83301 2.66536V3.4987H2.33301C2.32078 3.4987 2.30865 3.49914 2.29664 3.5H1C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5H1.83301V13.332C1.83301 13.8183 2.02616 14.2846 2.36998 14.6284C2.7138 14.9722 3.18011 15.1654 3.66634 15.1654H10.333C10.8192 15.1654 11.2856 14.9722 11.6294 14.6284C11.9732 14.2846 12.1663 13.8183 12.1663 13.332V4.5H13C13.2761 4.5 13.5 4.27614 13.5 4C13.5 3.72386 13.2761 3.5 13 3.5H11.7027C11.6907 3.49914 11.6786 3.4987 11.6663 3.4987H10.1663ZM2.83301 13.332V4.5H11.1663V13.332C11.1663 13.553 11.0785 13.765 10.9223 13.9213C10.766 14.0776 10.554 14.1654 10.333 14.1654H3.66634C3.44533 14.1654 3.23337 14.0776 3.07709 13.9213C2.9208 13.765 2.83301 13.553 2.83301 13.332ZM7.5 7.33203C7.5 7.05589 7.27614 6.83203 7 6.83203C6.72386 6.83203 6.5 7.05589 6.5 7.33203V11.332C6.5 11.6082 6.72386 11.832 7 11.832C7.27614 11.832 7.5 11.6082 7.5 11.332V7.33203Z" fill="#1E1E1E" />
							</svg>
						</span>
					}
				</Fragment>
			}
			<div className={"wdkit-inner-boxed"}>
				<div className={"top-part"}>
					<div className={'kit-list-pin-icons'}>
						{location?.pathname == '/my_uploaded' &&
							<div className="kit-pin-icon pin-section-pages" onClick={(e) => { manageFavorite(template.id) }}>
								{!dataFavorite ? (
									!isLoading ? (
										<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/svg/unfavourite.svg"} alt="section" />
									) : (
										<svg width="18" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
											<circle cx="50" cy="50" fill="none" stroke="white" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
												<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
											</circle>
										</svg>
									)
								) : (
									!isLoading ? (
										<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/wb-svg/fav-icon-selected.svg"} alt="page" />
									) : (
										<svg width="18" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
											<circle cx="50" cy="50" fill="none" stroke="white" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
												<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
											</circle>
										</svg>
									)
								)}
								<span className="kit-hint-tooltip">{!dataFavorite ? __('Favourite') : __('UnFavourite')}</span>
							</div>
						}
						<div className="kit-pin-icon pin-section-pages">
							{props.data.type == 'section' ?
								<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/svg/sections.svg"} alt="section" />
								:
								(props.data.type == 'pagetemplate' ?
									<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/svg/pages.svg"} alt="page" />
									:
									<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/svg/websitekit.svg"} alt="kit" />)}
							<span className="kit-hint-tooltip">
								{props.data.type == 'section' ? __('Section') : (props.data.type == 'pagetemplate' ? __('Full Page') : __('Page Kit'))}
							</span>
						</div>

						{template.post_status && !props.filter &&
							<div className={"kit-pin-icon pin-public-private"}>
								{template.post_status == "publish" ?
									<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/svg/public.svg"} alt="public" />
									:
									<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/svg/private.svg"} alt="private" />
								}
								<span className="kit-hint-tooltip">{template.post_status == "publish" ? __('Public') : __('Private')}</span>
							</div>
						}
					</div>
					{props.data.free_pro == 'pro' &&
						<div className="wdkit-card-tag">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
							<span>{__('Pro')}</span>
						</div>
					}
					<div className={`wdkit-temp-feature-img ${params.kit_id ? 'wkit-webkit-hover' : ''}`} >
						<label
							htmlFor={"template_" + template.id}
							style={{ cursor: (props.type == "websitekit-view" || props.type == "websitekit") ? 'pointer' : 'default' }}
							onClick={(e) => {
								if (props.type == "websitekit-view") {
									let dom = e.target.closest('.wdkit-inner-boxed');
									if (dom) {
										dom.querySelector('.wdkit-download-temp').click();
									}
								}
							}}>
							<img className="wkit-widget-placeholder-img" src={img_path + 'assets/images/wkit-dummy-bg.png'} draggable={false} />
							{Template_image_link()}
							<input
								type="checkbox"
								id={"template_" + template.id}
								name={"selectTemplate"}
								value={template.id}
								checked={Check_selected_temp(template)}
								onChange={(e) => { handleTempChecked(e) }}
								style={{ display: 'none' }}
							/>
							{params?.kit_id &&
								<div className={Check_selected_temp(template) ? 'wkit-check-mark wkit-selected-inner-kit' : 'wkit-check-mark'}>
									<div className='wkit-checkmark-box-icon'>
										<svg className='wkit-checkmark-icon' xmlns="http://www.w3.org/2000/svg" width="22" height="15" viewBox="0 0 22 15" fill="none">
											<path d="M1.5 7.66659L7.66669 13.8333L20.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>
								</div>
							}
						</label>
					</div>
				</div>
				<div className={"boxed-bottom"}>
					<div className={"template-wrap-title"}>
						{props.data.title &&
							<>
								{login_array.includes('browse') &&
									<a href={`${wdkitData.wdkit_server_url}templates/${GetSinglePageSlug(props.data)}/${RemoveExtraSpace(props.data.title)}/${props.data.id}`} target="_blank" rel="noopener noreferrer" className='wkit-temp-link-server'>
										<div className={"temp-title"}>{props.data.title}</div>
									</a>
								}
								{login_array.includes('my_uploaded') &&
									<a href={`${wdkitData.wdkit_server_url}admin/packs/view/${props.data.id}`} target="_blank" rel="noopener noreferrer" className='wkit-temp-link-server'>
										<div className={"temp-title"}>{props.data.title}</div>
									</a>
								}
								{!login_array.includes('my_uploaded') && !login_array.includes('browse') &&
									<div className={"temp-title"}>{props.data.title}</div>
								}
							</>
						}
						<div className='wkit-download-eye-wrapperd'>
							{props && props.type == "websitekit-view" &&
								<div className="wdkit-download-temp" onClick={() => { Download_kit(props, template.id) }}>
									<img className={"wkit-download-template"} src={img_path + "assets/images/svg/popup-download.svg"} alt="view-kit" draggable={false} />
								</div>
							}
							{props && props.type !== "websitekit" && props.type !== "websitekit-view" &&
								<div onClick={() => { Download_template(template.id) }} className={"wdkit-download-temp"}>
									<img className={"wkit-download-template"} src={img_path + "assets/images/svg/popup-download.svg"} alt="download-svg" draggable={false} />
								</div>
							}
							{(!props.filter || (props.filter && props.filter != 'browse')) && !(window.location.hash.search('#/share_with_me') > -1) && !(window.location.hash.search('#/browse/kit') > -1) && props?.role != 'subscriber' &&
								<div className='w-designkit-hover-select' data-id={props.data.id}>
									<img className={"wkit-select-img"} onClick={(e) => { setopenDropDown(!openDropDown) }} src={img_path + "assets/images/wb-svg/3-dot.svg"} alt={"extra-opt-img"} draggable={false} />
									<div style={{ display: openDropDown == false ? 'none' : "block" }} className={"wkit-dropdown-content"}>
										<div className={"wkit-select-menu-wrapper"}>
											{location?.pathname == '/my_uploaded' &&
												<Fragment>
													{!dataFavorite ?
														<button className={"wkit-design-item"} onClick={() => manageFavorite(template.id)}>
															{!isLoading ?
																<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6306 3.4574C15.2475 3.07416 14.7927 2.77014 14.2921 2.56272C13.7915 2.3553 13.2549 2.24854 12.7131 2.24854C12.1712 2.24854 11.6347 2.3553 11.1341 2.56272C10.6335 2.77014 10.1786 3.07416 9.79558 3.4574L9.00058 4.2524L8.20558 3.4574C7.43181 2.68364 6.38235 2.24894 5.28808 2.24894C4.1938 2.24894 3.14435 2.68364 2.37058 3.4574C1.59681 4.23117 1.16211 5.28063 1.16211 6.3749C1.16211 7.46918 1.59681 8.51864 2.37058 9.2924L3.16558 10.0874L9.00058 15.9224L14.8356 10.0874L15.6306 9.2924C16.0138 8.90934 16.3178 8.45451 16.5253 7.95392C16.7327 7.45333 16.8394 6.91677 16.8394 6.3749C16.8394 5.83304 16.7327 5.29648 16.5253 4.79589C16.3178 4.29529 16.0138 3.84047 15.6306 3.4574Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
																:
																<svg width="20" xmlns="http://www.w3.org/2000/svg" style={{ background: '0 0', display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
																	<circle cx="50" cy="50" fill="none" stroke="#000" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
																		<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
																	</circle>
																</svg>
															}
															{__('Add Favorite')}
														</button>
														:
														<button className={"wkit-design-item"} onClick={() => manageFavorite(template.id)}>
															{!isLoading ?
																<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6306 3.4574C15.2475 3.07416 14.7927 2.77014 14.2921 2.56272C13.7915 2.3553 13.2549 2.24854 12.7131 2.24854C12.1712 2.24854 11.6347 2.3553 11.1341 2.56272C10.6335 2.77014 10.1786 3.07416 9.79558 3.4574L9.00058 4.2524L8.20558 3.4574C7.43181 2.68364 6.38235 2.24894 5.28808 2.24894C4.1938 2.24894 3.14435 2.68364 2.37058 3.4574C1.59681 4.23117 1.16211 5.28063 1.16211 6.3749C1.16211 7.46918 1.59681 8.51864 2.37058 9.2924L3.16558 10.0874L9.00058 15.9224L14.8356 10.0874L15.6306 9.2924C16.0138 8.90934 16.3178 8.45451 16.5253 7.95392C16.7327 7.45333 16.8394 6.91677 16.8394 6.3749C16.8394 5.83304 16.7327 5.29648 16.5253 4.79589C16.3178 4.29529 16.0138 3.84047 15.6306 3.4574Z" fill="#737373" /></svg>
																:
																<svg width="20" xmlns="http://www.w3.org/2000/svg" style={{ background: '0 0', display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
																	<circle cx="50" cy="50" fill="none" stroke="#000" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
																		<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
																	</circle>
																</svg>
															}
															{__('Remove Favorite')}
														</button>
													}
												</Fragment>
											}
											{(!props.wsRoles || props.wsRoles != 'subscriber') &&
												<Fragment>
													{props?.data?.user_id == props?.userinfo?.id &&
														<a href={`${wdkitData.wdkit_server_url}admin/packs/view/${props.data.id}`} target="_blank" rel="noopener noreferrer">
															<button className={"wkit-design-item"}>
																<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9531 2.66989C12.1378 2.48521 12.357 2.33873 12.5983 2.23878C12.8396 2.13884 13.0983 2.0874 13.3594 2.0874C13.6205 2.0874 13.8791 2.13884 14.1204 2.23878C14.3618 2.33873 14.5809 2.48521 14.7656 2.66989C14.9503 2.85456 15.0968 3.0738 15.1967 3.31508C15.2966 3.55637 15.3482 3.81497 15.3482 4.07614C15.3482 4.3373 15.2966 4.59592 15.1967 4.83719C15.0968 5.07848 14.9503 5.29771 14.7656 5.48239L5.27344 14.9745L1.40625 16.0292L2.46094 12.162L11.9531 2.66989Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
																{__('Edit')}
															</button>
														</a>
													}
													<button className={"wkit-design-item"} onClick={() => { setIsCopyWs(template.id), (props.wsRoles ? setAction('copy') : setAction('t-copy')) }}>
														<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_6220_28330)"><path d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="clip0_6220_28330"><rect width="18" height="18" fill="white" /></clipPath></defs></svg>
														{__('Copy to Workspace')}
													</button>
													{!(window.location.hash.search('/kit/') > -1) && !(window.location.hash.search('#/manage_workspace') > -1) &&
														<button className={"wkit-design-item"} onClick={() => { setDeleteTempId(template.id), setClickType('delete') }}>
															<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 5.50006H4.91667M4.91667 5.50006H14.25M4.91667 5.50006L4.91638 13.666C4.91638 13.9754 5.0393 14.2722 5.25809 14.491C5.47688 14.7098 5.77363 14.8327 6.08305 14.8327H11.9164C12.2258 14.8327 12.5225 14.7098 12.7413 14.491C12.9601 14.2722 13.083 13.9754 13.083 13.666V5.49935M6.66638 5.49935V4.33268C6.66638 4.02326 6.7893 3.72652 7.00809 3.50772C7.22688 3.28893 7.52363 3.16602 7.83305 3.16602H10.1664C10.4758 3.16602 10.7725 3.28893 10.9913 3.50772C11.2101 3.72652 11.333 4.02326 11.333 4.33268V5.49935" stroke="#737373" strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round" /></svg>
															{__('Delete')}
														</button>
													}
													{(props.wsRoles == 'admin' || props.wsRoles == 'editor') &&
														<Fragment>
															<button className={"wkit-design-item"} onClick={() => { setIsCopyWs(template.id), (props.wsRoles && setAction('move')) }}>
																<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.625 6.75L2.375 9M2.375 9L4.625 11.25M2.375 9H17.3746M7.62482 3.75L9.87482 1.5M9.87482 1.5L12.1248 3.75M9.87482 1.5V16.5M12.1248 14.25L9.87482 16.5M9.87482 16.5L7.62482 14.25M15.1246 6.75L17.3746 9M17.3746 9L15.1246 11.25" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
																{__('Move to Workspace')}
															</button>
															<button className={"wkit-design-item"} onClick={() => { setDeleteTempId(template.id), setClickType('remove') }}>
																<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 5.50006H4.91667M4.91667 5.50006H14.25M4.91667 5.50006L4.91638 13.666C4.91638 13.9754 5.0393 14.2722 5.25809 14.491C5.47688 14.7098 5.77363 14.8327 6.08305 14.8327H11.9164C12.2258 14.8327 12.5225 14.7098 12.7413 14.491C12.9601 14.2722 13.083 13.9754 13.083 13.666V5.49935M6.66638 5.49935V4.33268C6.66638 4.02326 6.7893 3.72652 7.00809 3.50772C7.22688 3.28893 7.52363 3.16602 7.83305 3.16602H10.1664C10.4758 3.16602 10.7725 3.28893 10.9913 3.50772C11.2101 3.72652 11.333 4.02326 11.333 4.33268V5.49935" stroke="#737373" strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round" /></svg>
																{__('Remove')}
															</button>
														</Fragment>
													}
												</Fragment>
											}
										</div>
									</div>
								</div>
							}
							{deleteTempId > -1 &&
								<DeletePopup deletetype={clickType}
									removeFunction={() => { clickType == 'delete' ? onDeleteTemplate() : onRemoveTemplate() }}
									setdeleteWsID={(id) => { setDeleteTempId(id) }}
								/>
							}
						</div>
					</div>
					<CardRatings
						avg_rating={props.data?.avg_rating}
						total_rating={props.data?.total_rating}
					/>
					<div className={"btn-reviews"}>
						<div className={"btn-img"}>
							<a><img src={img_path + "assets/images/svg/eye.svg"} alt={__("post views")} />{props.data.post_views}</a>
							<hr className="wkit-icon-divider-hr" />
							<a><img src={img_path + "assets/images/svg/download-template.svg"} alt={__("post download")} />{props.data.post_download}</a>
						</div>
						<div className='kit-pin-icon'>
							{props.data.post_builder && builder_icon &&
								<div className="elementor-right-part kit-pin-icon">
									<img src={builder_icon} alt={__("builder icon")} draggable={false} />
								</div>
							}
							<span className="kit-hint-tooltip">{!plugin_name ? __('') : __(plugin_name)}</span>
						</div>
					</div>
				</div>
			</div>
			{
				isCopyWs &&
				<Wkit_popupContent popupclose={() => { props.handlerAfterSuccessImported() }} popCloseHandler={(val) => { setIsCopyWs(false) }}>
					<Wdkit_Copy_Temp_to_Ws
						UpdateUserData={(val) => props.UpdateUserData(val)}
						setloading={(val) => props.setloading(val)}
						userData={props?.userData}
						temp_id={isCopyWs}
						action={isAction}
						popCloseHandler={(val) => setIsCopyWs(false)}
						wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast(title, subtitle, icon, type); }}
					/>
				</Wkit_popupContent>
			}

		</div >
	);
}

export const wdkit_Manage_WorkSpace_Api = async (query) => {
	let loginData = get_user_login()
	let userEmail = ''
	if (loginData && loginData.user_email) {
		userEmail = loginData.user_email
	}
	let form_arr = { 'type': 'manage_workspace', 'email': userEmail }
	form_arr = Object.assign({}, form_arr, query);
	var result = await wdKit_Form_data(form_arr);

	if (result && result.data && result.data.success) {

		if (query && (query.wstype == 't-copy' || query.wstype == 'copy' || query.wstype == 'move' || query.wstype == 'temp_remove') && window.userData && window.userData.data) {
			Object.values(window.userData.data.workspace).map((data, index) => {
				if (Number(query.wid) == data.w_id && (query.wstype == 't-copy' || query.wstype == 'copy' || query.wstype == 'move')) {
					window.userData.data.workspace[index].work_templates.push(query.template_id)
				}
				if ((query.wstype == 'move' || query.wstype == 'temp_remove') && (query.moveId && Number(query.moveId) == data.w_id)) {
					var removeIndex = window.userData.data.workspace[index].work_templates.indexOf(query.template_id);
					if (removeIndex !== -1) {
						window.userData.data.workspace[index].work_templates.splice(removeIndex, 1);
					}
				}
			})
		}
		return result;
	} else {
		return result;
	}
}

export const Kits_loop = (props) => {
	let template = props.data;

	return (
		<div className='wkit-popup-template-boxed'>
			<div className={"wkit-kit-inner-loop"}>
				<div className="wkit-popup-top-part">
					{template.post_status &&
						<div className={"template-status-pin-green"}>
							{template.post_status == "publish" ?
								<img className={"wkit-public-private-temp"} src={img_path + "assets/images/svg/public.svg"} alt="public" />
								:
								<img className={"wkit-public-private-temp"} src={img_path + "assets/images/svg/private.svg"} alt="private" />
							}
						</div>
					}
					<div className={"wdkit-temp-feature-img"}>
						<img src={(template.post_image) ? template.post_image : img_path + 'assets/images/placeholder.jpg'} alt={"featured-img"} />
						{props && props.type == "websitekit" &&
							<Link to={'/my_uploaded/kit/' + template.id} className={"wkit-view"}>
								<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M19.8791 9.49273C17.9962 5.81877 14.2684 3.33301 9.99998 3.33301C5.73158 3.33301 2.00276 5.82051 0.120814 9.49308C0.0413845 9.6502 0 9.82379 0 9.99985C0 10.1759 0.0413845 10.3495 0.120814 10.5066C2.0038 14.1806 5.73158 16.6663 9.99998 16.6663C14.2684 16.6663 17.9972 14.1788 19.8791 10.5063C19.9586 10.3491 20 10.1756 20 9.9995C20 9.82344 19.9586 9.64985 19.8791 9.49273ZM9.99998 14.9997C9.01108 14.9997 8.04438 14.7064 7.22213 14.157C6.39988 13.6076 5.75902 12.8267 5.38058 11.9131C5.00215 10.9995 4.90313 9.99413 5.09606 9.02422C5.28898 8.05432 5.76518 7.1634 6.46445 6.46414C7.16371 5.76488 8.05462 5.28867 9.02453 5.09575C9.99443 4.90282 10.9998 5.00184 11.9134 5.38028C12.827 5.75871 13.6079 6.39958 14.1573 7.22182C14.7067 8.04407 15 9.01077 15 9.99967C15.0003 10.6564 14.8712 11.3067 14.62 11.9135C14.3689 12.5202 14.0006 13.0716 13.5362 13.5359C13.0719 14.0003 12.5205 14.3686 11.9138 14.6197C11.307 14.8709 10.6567 15 9.99998 14.9997ZM9.99998 6.66634C9.70246 6.6705 9.40685 6.71476 9.12116 6.79794C9.35666 7.11796 9.46966 7.51179 9.43969 7.90799C9.40972 8.30419 9.23875 8.67653 8.95779 8.95749C8.67684 9.23844 8.3045 9.40941 7.9083 9.43938C7.51209 9.46935 7.11827 9.35635 6.79824 9.12085C6.61601 9.79224 6.64891 10.5039 6.8923 11.1556C7.1357 11.8073 7.57733 12.3663 8.15505 12.7538C8.73277 13.1414 9.41749 13.338 10.1128 13.3161C10.8081 13.2941 11.4791 13.0546 12.0312 12.6314C12.5833 12.2081 12.9888 11.6224 13.1905 10.9566C13.3923 10.2908 13.3802 9.57856 13.156 8.92001C12.9317 8.26147 12.5066 7.68983 11.9405 7.28555C11.3743 6.88127 10.6957 6.6647 9.99998 6.66634Z" className={"popup-eye"} />
								</svg>
								{__('View All')}</Link>
						}
					</div>
				</div>
				<div className="wkit-popup-boxed-bottom">
					<div className="wrapper-title">
						{props.data.title &&
							<div className="title">{props.data.title}</div>
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export const Wpopup_body_data = () => {
	var img_path = wdkitData.WDKIT_URL;
	return (
		<div className="popup_option_main">

			<div className="wdesignkit-dropdown">
				<div className="wdesign_heading">{__('Page Builder')}</div>
				<button className="wdesignkit-openbtn">
					<img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}
					<img src={img_path + "assets/images/svg/filter_expand_more.svg"} alt="dashborad img" className="open-icon-drop" />
				</button>
				<div className="wdesignkit-dropdown-content">
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 2')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 3')}</a>
				</div>
			</div>

			<div className="wdesignkit-dropdown">
				<div className="wdesign_heading">{__('Section')}</div>
				<button className="wdesignkit-openbtn">
					<img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}
					<img src={img_path + "assets/images/svg/filter_expand_more.svg"} alt="dashborad img" className="open-icon-drop" />
				</button>
				<div className="wdesignkit-dropdown-content">
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 2')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 3')}</a>
				</div>
			</div>

			<div className="wdesignkit-dropdown">
				<div className="wdesign_heading">{__('Page')}</div>
				<button className="wdesignkit-openbtn">
					<img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}
					<img src={img_path + "assets/images/svg/filter_expand_more.svg"} alt="dashborad img" className="open-icon-drop" />
				</button>
				<div className="wdesignkit-dropdown-content">
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 2')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 3')}</a>
				</div>
			</div>
			<div className="wdesignkit-dropdown">
				<div className="wdesign_heading">{__('Kits')}</div>
				<button className="wdesignkit-openbtn">
					<img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}
					<img src={img_path + "assets/images/svg/filter_expand_more.svg"} alt="dashborad img" className="open-icon-drop" />
				</button>
				<div className="wdesignkit-dropdown-content">
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 2')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 3')}</a>
				</div>
			</div>

			<div className="wdesignkit-dropdown">
				<div className="wdesign_heading">{__('Plugin Required')}</div>
				<button className="wdesignkit-openbtn">
					<img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}
					<img src={img_path + "assets/images/svg/filter_expand_more.svg"} alt="dashborad img" className="open-icon-drop" />
				</button>
				<div className="wdesignkit-dropdown-content">
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 1')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 2')}</a>
					<a href="#"><img src={img_path + "assets/images/svg/elementor.svg"} alt="dashborad img" />{__('Option 3')}</a>
				</div>
			</div>
		</div>
	);
}

export const Maintenance_mode = () => {
	return (
		<div className='wkit-maintenance-mode-content'>
			<div className='wkit-maintenance-mode-text'>
				<span className='wkit-maintenance-mode-header'>Website Upgrade in Progress.</span>
				<span className='wkit-maintenance-mode-description'>Our  website is undergoing a transformation to serve you better.</span>
			</div>
			<img className='wkit-maintenance-mode-image' src={img_path + "assets/images/jpg/maintenance_mode.png"} />
		</div>
	);
}

export const Update_notification = () => {
	return (
		<div className='wkit-update-notification'>
			<div className='wkit-notification-text'>
				<span className='wkit-update-notification-header'>Upgrade now for the best experience WDesignKit v1.0.15</span>
			</div>
			<div className='wkit-update-btn-container'>
				<button className='wkit-update-version-btn wkit-pink-btn-class'>Upgrade</button>
			</div>
		</div>
	);
}

export const Deactivate_account = () => {
	return (
		<div className='wkit-deactivate-account-content'>
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
				<path d="M17.9255 8.29136L6.28109 28.4585C6.07076 28.8227 5.96 29.2359 5.95996 29.6564C5.95992 30.077 6.0706 30.4902 6.28087 30.8544C6.49114 31.2186 6.7936 31.5211 7.15782 31.7314C7.52205 31.9416 7.93521 32.0523 8.35578 32.0523H31.6427C32.0632 32.0523 32.4764 31.9416 32.8406 31.7314C33.2048 31.5211 33.5073 31.2186 33.7176 30.8544C33.9278 30.4902 34.0385 30.077 34.0385 29.6564C34.0384 29.2359 33.9277 28.8227 33.7173 28.4585L22.0742 8.29136C21.864 7.92724 21.5616 7.62487 21.1975 7.41465C20.8334 7.20442 20.4203 7.09375 19.9998 7.09375C19.5794 7.09375 19.1663 7.20442 18.8022 7.41465C18.4381 7.62487 18.1357 7.92724 17.9255 8.29136Z" fill="#FFCD38" />
				<path d="M20.152 14.5078H19.8482C19.1004 14.5078 18.4941 15.114 18.4941 15.8619V22.3341C18.4941 23.0819 19.1004 23.6881 19.8482 23.6881H20.152C20.8998 23.6881 21.506 23.0819 21.506 22.3341V15.8619C21.506 15.114 20.8998 14.5078 20.152 14.5078Z" fill="#FFF7ED" />
				<path d="M20.0001 28.8244C20.8318 28.8244 21.506 28.1501 21.506 27.3184C21.506 26.4867 20.8318 25.8125 20.0001 25.8125C19.1684 25.8125 18.4941 26.4867 18.4941 27.3184C18.4941 28.1501 19.1684 28.8244 20.0001 28.8244Z" fill="#FFF7ED" />
			</svg>
			<span>You can't access Pro feature,  limit reached with two active sites. To unlock, deactivate one site or upgrade plan for more</span>
		</div>
	);
}

export const Wkit_user_details = (props) => {

	const [loading, setloading] = useState(false);

	const navigation = useNavigate();

	let loginCheck = get_user_login()
	let location = useLocation();

	const wkit_logout_User = async () => {
		await wkit_logout(navigation);
		props.wdkit_set_toast(['Logged out successfully!', "You're logged out! Remember your login details and sign in again.", '', 'success']);

		let form_array = {
			'type': 'wkit_meta_data',
			'meta_type': 'all'
		}

		await wdKit_Form_data(form_array).then((res) => {

			if (res?.data?.success == true) {
				props.wdkit_set_meta(res?.data)
			}
		});


	}

	const DropDownToggle = () => {
		let dropDown = document.querySelector('.wkit-user-profile');
		if (dropDown) {
			let calssList = dropDown.classList

			if (Object.values(calssList).includes('wdkit-show')) {
				dropDown.classList.remove('wdkit-show');
			} else {
				dropDown.classList.add('wdkit-show');
			}
		}
	}

	const Update_plugin = async () => {
		setloading(true);

		let form_arr = {
			'type': 'update_latest_plugin',
		}

		await wdKit_Form_data(form_arr).then(async (res) => {
			if (res.success) {
				let userData = await Get_user_info_data();
				props.wdkit_set_meta(userData.data)
				props.wdkit_set_toast([res?.message, res?.description, '', 'success']);
			} else {
				props.wdkit_set_toast([res?.message, res?.description, '', 'danger']);
			}

			setloading(false);
		})
	}

	let login_array = location.pathname.split('/');
	return (
		<Fragment>
			{!login_array.includes('login') && !login_array.includes('login-api') && !login_array.includes('builder') &&
				<div className="wkit-user-details-wrapper">
					<div className='wkit-filter-update-btn'>
						{(login_array.includes('browse') || login_array.includes('widget-browse')) && !login_array.includes('kit') &&
							<div className='wkit-filter-humber-menu'>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M0.75 4.2308H12.169C12.5131 5.79731 13.9121 6.97336 15.5805 6.97336C17.2488 6.97336 18.6478 5.79736 18.9919 4.2308H23.25C23.6642 4.2308 24 3.89498 24 3.4808C24 3.06661 23.6642 2.7308 23.25 2.7308H18.9915C18.6467 1.16508 17.2459 -0.0117188 15.5805 -0.0117188C13.9141 -0.0117188 12.5139 1.16489 12.1693 2.7308H0.75C0.335812 2.7308 0 3.06661 0 3.4808C0 3.89498 0.335812 4.2308 0.75 4.2308ZM13.588 3.48277C13.588 3.48009 13.588 3.47738 13.588 3.4747C13.5913 2.37937 14.4851 1.48833 15.5805 1.48833C16.6743 1.48833 17.5681 2.37816 17.5728 3.47297L17.573 3.48398C17.5712 4.58119 16.6781 5.47341 15.5805 5.47341C14.4833 5.47341 13.5904 4.58208 13.5879 3.48553L13.588 3.48277ZM23.25 19.769H18.9915C18.6467 18.2033 17.2459 17.0265 15.5805 17.0265C13.9141 17.0265 12.5139 18.2031 12.1693 19.769H0.75C0.335812 19.769 0 20.1047 0 20.519C0 20.9332 0.335812 21.269 0.75 21.269H12.169C12.5131 22.8355 13.9121 24.0115 15.5805 24.0115C17.2488 24.0115 18.6478 22.8355 18.9919 21.269H23.25C23.6642 21.269 24 20.9332 24 20.519C24 20.1047 23.6642 19.769 23.25 19.769ZM15.5805 22.5115C14.4833 22.5115 13.5904 21.6202 13.5879 20.5237L13.588 20.5209C13.588 20.5182 13.588 20.5155 13.588 20.5129C13.5913 19.4175 14.4851 18.5265 15.5805 18.5265C16.6743 18.5265 17.5681 19.4163 17.5728 20.511L17.573 20.5221C17.5714 21.6194 16.6782 22.5115 15.5805 22.5115ZM23.25 11.2499H11.831C11.4869 9.68339 10.0879 8.50739 8.41955 8.50739C6.75117 8.50739 5.35223 9.68339 5.00808 11.2499H0.75C0.335812 11.2499 0 11.5857 0 11.9999C0 12.4141 0.335812 12.7499 0.75 12.7499H5.00845C5.35331 14.3156 6.75413 15.4924 8.41955 15.4924C10.0859 15.4924 11.4861 14.3158 11.8307 12.7499H23.25C23.6642 12.7499 24 12.4141 24 11.9999C24 11.5857 23.6642 11.2499 23.25 11.2499ZM10.412 11.9979C10.412 12.0007 10.412 12.0033 10.412 12.006C10.4087 13.1013 9.51492 13.9924 8.41955 13.9924C7.32572 13.9924 6.43191 13.1025 6.42717 12.0078L6.42703 11.9968C6.42867 10.8995 7.32188 10.0074 8.41955 10.0074C9.5167 10.0074 10.4096 10.8987 10.4121 11.9953L10.412 11.9979Z" fill="black" />
								</svg>
							</div>
						}
						{props?.wdkit_meta?.Setting?.plugin_version?.success &&
							<Fragment>
								{loading ?
									<a className='wkit-update-latest-btn wkit-pink-btn-class'>
										<div className="wkit-publish-loader">
											<div className="wb-loader-circle"></div>
										</div>
									</a>
									:
									<a className='wkit-update-latest-btn wkit-pink-btn-class' onClick={() => { Update_plugin() }} >
										{__('Update ' + props?.wdkit_meta?.Setting?.plugin_version?.version)}
									</a>
								}
							</Fragment>
						}
					</div>
					<div className="wkit-user-info">

						<div className="wkit-info-data">
							{props?.wdkit_meta?.userinfo ?
								<Fragment>
									<div className="wkit-user-title">{props?.wdkit_meta?.userinfo?.full_name}</div>
									<div className="wkit-desg">{props?.wdkit_meta?.userinfo?.user_email}</div>
								</Fragment>
								: loginCheck ?
									<Fragment>
										<div className='wkit-user-title-loading-wrap'>
											<div className='wkit-user-title-part'>
												<div className="wkit-user-title-loading"></div>
												<div className="wkit-desg-loading"></div>
											</div>
											<div className='wkit-ex-profile-img'></div>
										</div>
									</Fragment>
									:
									<div className='wdkit-login-signUp-btn' onClick={() => { props.wdkit_Login_Route(location.pathname); }}>
										<Link to={'/login'} >
											<button> {__('Login / SignUp')} </button>
										</Link>
									</div>
							}
						</div>
						{loginCheck &&
							<div className="wkit-img wkit-user-profile" onClick={() => DropDownToggle()}>
								{props?.wdkit_meta?.userinfo &&
									<Fragment>
										{props?.wdkit_meta?.userinfo?.user_profile ?
											<img src={props.wdkit_meta.userinfo.user_profile} alt="user-profile" style={{ objectFit: 'cover' }} />
											:
											<div className='wkit-ex-profile-img'>
												{Letter_image(props?.wdkit_meta?.userinfo?.full_name)}
											</div>
										}
									</Fragment>
								}
								{props?.wdkit_meta?.userinfo &&
									<ul className='wkit-user-profile-menu'>
										<div className='wkit-drop-down-outer' style={{ zIndex: '99' }}></div>
										<div className='wkit-profile-dropDown'>
											<li>
												<a href={`${wdkitData.wdkit_server_url}${props?.wdkit_meta?.userinfo?.user_name}`} target="_blank" rel="noopener noreferrer">
													<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M15.875 15.75V14.25C15.875 13.4544 15.5589 12.6913 14.9963 12.1287C14.4337 11.5661 13.6706 11.25 12.875 11.25H6.875C6.07935 11.25 5.31629 11.5661 4.75368 12.1287C4.19107 12.6913 3.875 13.4544 3.875 14.25V15.75M12.8754 5.25C12.8754 6.90685 11.5322 8.25 9.87537 8.25C8.21851 8.25 6.87537 6.90685 6.87537 5.25C6.87537 3.59315 8.21851 2.25 9.87537 2.25C11.5322 2.25 12.8754 3.59315 12.8754 5.25Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
													{__('Profile')}
												</a>
											</li>
											<hr />
											<li>
												<a style={{ cursor: 'pointer' }} onClick={(e) => { wkit_logout_User(navigation, props.wdkit_Login_Route(location.pathname)) }}>
													<svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M7.625 15.75H4.625C4.22718 15.75 3.84564 15.592 3.56434 15.3107C3.28304 15.0294 3.125 14.6478 3.125 14.25V3.75C3.125 3.35218 3.28304 2.97064 3.56434 2.68934C3.84564 2.40804 4.22718 2.25 4.625 2.25H7.625M12.8748 12.7501L16.6248 9.00009M16.6248 9.00009L12.8748 5.25009M16.6248 9.00009L7.625 9" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
													{__('Logout')}
												</a>
											</li>
										</div>
									</ul>
								}
							</div>
						}
					</div>
				</div>
			}
		</Fragment >
	);
}

/**Import Flow*/
export const Wkit_plugin_missing = (props) => {
	var img_path = wdkitData.WDKIT_URL;

	if (!props.template_id && !props.templateData) {
		return '';
	}

	let templateData = '';
	let templateList = [];
	Object.values(props.templateData).map((data) => {
		if (data.id == Number(props.template_id)) {
			templateData = data
			templateList.push(data);
		} else if (props.template_id.pages && props.template_id.sections) {
			if (props.template_id.pages.length > 0) {
				var check = props.template_id.pages.some((e) => Number(e.id) == Number(data.id))
				if (check) {
					templateData = data
					templateList.push(data);
				}
			}
			if (props.template_id.sections.length > 0) {
				var check = props.template_id.sections.some((e) => Number(e.id) == Number(data.id))
				if (check) {
					templateData = data
					templateList.push(data);
				}
			}
		}
	})

	const [stepsPlugin, setStepsPlugin] = useState('step-1');
	const [dataPlugin, setPlugin] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [loadingInstall, setLoadingInstall] = useState(false);
	const [installCompleted, setInstallCompleted] = useState([]);
	const [customMetData, setCustomMetData] = useState('yes');
	const [toggle, setToggle] = useState(false);
	const [nextBtn, setnextBtn] = useState('false');

	const [plugin_loader, setplugin_loader] = useState([]);
	const [install_all, setinstall_all] = useState(false);
	const count_check = useRef([]);

	useEffect(() => {
		// setPlugin(props.pluginData)
		checkPlugin()
	}, [props.template_id]);

	/**
	* 
	* @param {It will check and show there are how many plugin needs to install} dataPlugin 
	* @version 1.0.37
	*/
	useEffect(() => {
		if (dataPlugin.length > 0) {
			let ActivatePluginCheck = dataPlugin.filter(data => data.status !== 'active');
			if (!ActivatePluginCheck.length > 0) {
				if ('wdkit' == wdkitData?.use_editor) {
					setStepsPlugin('step-2')
				} else {
					SuccessImportTemplate(true)
				}
			}
		}
	}, [dataPlugin]);

	const checkPlugin = async () => {
		setIsLoading(true);

		let pluginList = [];
		if (props.pluginData && templateList.length > 0) {
			templateList.map((templateData) => {
				Object.values(props.pluginData).map((plugins, index) => {
					if (templateData.plugins_id.includes(plugins.p_id)) {
						if (pluginList.findIndex((id) => id.p_id == plugins.p_id) > -1) {
						} else {
							pluginList = [...pluginList, plugins]
						}
					}
				})
			})

			if (pluginList) {
				let form_arr = {
					'type': 'check_plugins_depends',
					'plugins': JSON.stringify(pluginList),
					'editor': wdkitData.use_editor
				}

				let res = await wdKit_Form_data(form_arr);
				if (res.data && res.success) {
					setPlugin(res.data.plugins);
					setIsLoading(false);
					Object.values(res.data.plugins).map((plugins, index) => {
						if (plugins.status) {
							installCompleted[index] = plugins.status
						}
					})
					await setInstallCompleted(installCompleted)
					allEqual();
				} else {
					setPlugin([])
					setIsLoading(false);
				}
			} else {
				setIsLoading(false);
			}

		} else {
			setIsLoading(false);
		}
	}

	const allEqual = () => {
		if (installCompleted.length == 0) {
			setnextBtn('false');
		} else {
			var count = 0;
			installCompleted.map((data) => {
				if ('active' == data) {
					count = count + 1;
				}
			})
			if (installCompleted.length == count) {
				setnextBtn('true')
			} else {
				setnextBtn('false')
			}
		}
	}

	/**Plugin Active, Install Set Icon*/
	const plugin_status = (status, p_id, data) => {

		let pro_plugin_link = {
			"the-plus-addons-for-block-editor-pro": 'https://theplusblocks.com/pricing/',
			"theplus_elementor_addon": 'https://theplusaddons.com/pricing/'
		};

		if ((loadingInstall && !status) || (plugin_loader.includes(p_id)) || (install_all && status == 'unavailable')) {
			return (
				<div className="wkit-loading-check">
					<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" style={{ background: '0 0', display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
						<circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
							<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
						</circle>
					</svg>
				</div>
			)
		} else {
			if (status == 'active') {
				return (
					<div className="wkit-complete-check">
						<svg width="12" height="12" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M1.49554 5.97363L3.98608 8.46417L10.4615 1.98877" stroke="white" strokeWidth="1.99243" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				)
			} else if (status == 'inactive' || status == 'unavailable') {
				return (
					<a className="" onClick={() => { setplugin_loader([...count_check.current, data.p_id]), installPluginData('single', data) }}>
						<img className={"wkit-download-template"} src={img_path + "assets/images/svg/popup-download.svg"} alt="popup-logo-img" draggable={false} />
					</a>
				);
			} else if (status == 'warning') {
				return (<div className="wkit-icon-white-bg">
					<span className="wkit-tooltip">{__('Something wen\'t wrong')} <a href="#" style={{ color: "white", textDecoration: "underline" }}>{__('Try Again')}</a></span>
					<a>
						<svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 15C4.14062 15 1 11.8594 1 8C1 4.14062 4.14062 1 8 1C11.8594 1 15 4.14062 15 8C15 11.8594 11.8594 15 8 15ZM8 5.75C8.41406 5.75 8.75 5.41437 8.75 5C8.75 4.58594 8.41406 4.25 8 4.25C7.58594 4.25 7.25 4.58437 7.25 5C7.25 5.41563 7.58437 5.75 8 5.75ZM9.5 11H8.5V7.5C8.5 7.225 8.275 7 8 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.5V11H6.5C6.225 11 6 11.225 6 11.5C6 11.775 6.225 12 6.5 12H9.5C9.77612 12 10 11.7761 10 11.5C10 11.225 9.775 11 9.5 11Z" className="wkit-icon-white" />
						</svg>
					</a>
				</div>)
			} else if (status == 'manually') {
				return (
					<div className="wkit-icon-orange-bg">
						<span className="wkit-tooltip wkit-pro-manually">{__('Install Manually.')}
							<a href={pro_plugin_link?.[data?.original_slug] ? pro_plugin_link[data.original_slug] : '#'} style={{ color: "white", textDecoration: "underline" }}>{__('Learn How?')}</a>
						</span>
						<svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 15C4.14062 15 1 11.8594 1 8C1 4.14062 4.14062 1 8 1C11.8594 1 15 4.14062 15 8C15 11.8594 11.8594 15 8 15ZM8 5.75C8.41406 5.75 8.75 5.41437 8.75 5C8.75 4.58594 8.41406 4.25 8 4.25C7.58594 4.25 7.25 4.58437 7.25 5C7.25 5.41563 7.58437 5.75 8 5.75ZM9.5 11H8.5V7.5C8.5 7.225 8.275 7 8 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.5V11H6.5C6.225 11 6 11.225 6 11.5C6 11.775 6.225 12 6.5 12H9.5C9.77612 12 10 11.7761 10 11.5C10 11.225 9.775 11 9.5 11Z" className="wkit-icon-white" />
						</svg>
					</div>
				)
			}
		}
	}

	/**Install Plugin lugin and Active*/
	const installPluginData = async (type, data) => {
		if (type == 'all') {

			let manual_plugin = Object.values(document.querySelectorAll('.wkit-pro-manually'))
			manual_plugin.length > 0 && manual_plugin.map((data) => {
				if (data.style.display == 'none' || data.style.display == '') {
					data.style.visibility = 'visible';

					setTimeout(() => {
						data.style.visibility = 'hidden';
					}, 2000);
				}
			})

			dataPlugin.map(async (plugin) => {

				if (plugin.status != 'active' && plugin.freepro != '1') {

					if (count_check.current.length > 0) {
						count_check.current.push(plugin.p_id);
					} else {
						count_check.current.push(plugin.p_id);
						await setinstall_all(true);
						await setplugin_loader(count_check.current);
						await Install_plugin(plugin, 2);
						await setplugin_loader([]);
						await setinstall_all(false);
					}
				}
			})

		} else if (type == 'single') {
			if (count_check.current.length > 0) {
				count_check.current.push(data.p_id);
			} else {
				count_check.current.push(data.p_id);
				await setLoadingInstall(true)
				await Install_plugin(data, 2)
				await setLoadingInstall(false)
			}
		}
	}

	/**Install Plugin API Call*/
	const Install_plugin = async (plugin, count) => {
		if (plugin && plugin.p_id) {
			if (plugin.status != 'active') {
				let form_arr = {
					'type': 'install_plugins_depends',
					'plugins': JSON.stringify(plugin),
					'editor': wdkitData.use_editor
				}

				let res1 = await wdKit_Form_data(form_arr);

				if (res1?.success == undefined || res1?.p_id == undefined) {
					if (Number(count) < 3) {
						let newCount = count ? count + 1 : 1;
						await Install_plugin(plugin, newCount);
					}
				} else if (res1?.success) {
					if (dataPlugin && plugin.p_id == res1.p_id) {
						Object.values(dataPlugin).map((data, index) => {
							if (data.p_id == res1.p_id) {
								dataPlugin[index]['status'] = res1.status
							}
							if (data.status) {
								installCompleted[index] = data.status
							}
						})
						await setInstallCompleted(installCompleted)
						allEqual();
					}

					const checkPlugin_widget = async () => {

						const Oa = (e) => {
							return new Promise((resolve, reject) => {
								const r = document.createElement(e.nodeName);

								// Set attributes like id, rel, src, href, type
								["id", "rel", "src", "href", "type"].forEach(attr => {
									if (e[attr]) {
										r[attr] = e[attr];
									}
								});

								// Append inner HTML content if present
								if (e.innerHTML) {
									r.appendChild(document.createTextNode(e.innerHTML));
								}

								// Resolve on load, reject on error
								r.onload = () => {
									resolve(true);
								};

								r.onerror = () => {
									reject(new Error("Error loading asset."));
								};

								// Append to document body
								document.body.appendChild(r);

								// Resolve immediately for <link> or <script> without src
								if ((r.nodeName.toLowerCase() === "link" || (r.nodeName.toLowerCase() === "script" && !r.src))) {
									resolve();
								}
							});
						}

						const fetchAndProcessData = async () => {

							await fetch(document.location.href, { parse: false })
								.then(response => response.text())
								.then(text => {
									// Step 2: Parse the HTML response
									const parser = new DOMParser();
									const doc = parser.parseFromString(text, 'text/html');

									// Step 3: Define IDs to filter
									const idsToInclude = ['wp-blocks-js-after', 'plus-editor-css-css', 'plus-editor-js-js', 'elementor-editor-js-before'];

									// Step 4: Select and filter elements
									const elements = Array.from(doc.querySelectorAll('link[rel="stylesheet"],script')).filter(element => {
										return element.id && (idsToInclude.includes(element.id) || !document.getElementById(element.id));
									});

									// Step 5: Process each element (assuming Oa is a defined function)
									return elements.reduce((promise, element) => {
										return promise.then(() => Oa(element));
									}, Promise.resolve());
								})
								.catch(error => {
									console.error('Error fetching or processing data:', error);
								});
						}

						await fetchAndProcessData();

						if (typeof elementor !== 'undefined') {
							elementor.addWidgetsCache(elementor.getConfig().initial_document.widgets);
						}
					}
					checkPlugin_widget();
				}

				count_check.current.splice(0, 1);
				setplugin_loader(count_check.current);

				if (count_check.current.length > 0) {
					let plugin_id = count_check.current[0];

					let plugin_index = dataPlugin.findIndex((p_data) => p_data.p_id == plugin_id);
					let plugin_data = dataPlugin?.[plugin_index] ? dataPlugin?.[plugin_index] : [];
					await Install_plugin(plugin_data, 2);
				}
			} else {
				let index = count_check.current.findIndex((id) => id == plugin.p_id);
				if (index > -1) {
					count_check.current.splice(index, 1);
					setplugin_loader(count_check.current);
				}
			}
		}
	}

	const SuccessImportTemplate = (checkPlugin) => {
		if (checkPlugin) {
			let checkCustomMeta = false;
			if (customMetData == 'yes') {
				checkCustomMeta = true;
			}

			setStepsPlugin('step-1')
			props.handlerSuccessImport(true, checkCustomMeta)
		}
	}

	const updateSelectValue = (sectionPage, key, value, id) => {
		if (sectionPage == 'pages' && id) {
			props.template_id.pages.map((val, index) => {
				if (val.id === id) {
					// props.template_id.pages[index][key] = value
					props.template_id.pages[index].wp_post_type = value
					props.template_id.pages[index].change = true;
				}
			})
		}
		if (sectionPage == 'sections' && id) {
			props.template_id.sections.map((val, index) => {
				if (val.id === id) {
					// props.template_id.sections[index][key] = value
					props.template_id.sections[index].wp_post_type = value
					props.template_id.sections[index].change = true;
				}
			})
		}
	}

	/**Import Page*/
	const PageList = () => {
		if (props.template_id.pages.length != 0) {
			let lists = Object.entries(props.template_id.pages).map(([key, val], key_index) => {

				let data = props.templateData.filter((i) => val.id == i.id);
				var post_type_val = '';

				if (val?.wp_post_type) {
					post_type_val = val.wp_post_type;
				} else if (Object.keys(wdkitData.post_type_list).includes(val?.type)) {
					post_type_val = val.type;
				}

				if (!Object.keys(wdkitData.post_type_list).includes(post_type_val)) {
					post_type_val = 'page';
					props.template_id.pages[key_index].wp_post_type = post_type_val
					props.template_id.pages[key_index].change = true;
				}

				return (
					<Fragment key={key_index}>
						<li className="kit-page-list">
							{GetPostType(data, val)}

							<span className='section-page-post-type'>
								{Set_PostTypeDD(post_type_val ? post_type_val : 'page', val, 'pages')}
							</span>
						</li>
					</Fragment>
				);
			})

			return (
				<Fragment>
					{wdkitData.use_editor != 'wdkit' &&
						<div className="kit-type-heading">
							{__('List of Pages ') + "(" + props.template_id.pages.length + ")"}
						</div>
					}

					<ul className="kit-pages-sec-lists">{lists}</ul>
				</Fragment>
			)
		}
	}

	/**Import Section*/
	const SectionsList = () => {
		if (props.template_id.sections.length != 0) {
			let lists = Object.entries(props.template_id.sections).map(([key, val], index_key) => {
				let data = props.templateData.filter((i) => val.id == i.id);

				var post_type_val = '';

				if (val?.wp_post_type) {
					post_type_val = val.wp_post_type;
				} else if (Object.keys(wdkitData.post_type_list).includes(val?.type)) {
					post_type_val = val.type;
				}


				if (!Object.keys(wdkitData.post_type_list).includes(post_type_val)) {

					if (val?.post_builder == '1001') {
						post_type_val = 'elementor_library';
					} else {
						post_type_val = 'post';
					}

					props.template_id.sections[index_key].wp_post_type = post_type_val
					props.template_id.sections[index_key].change = true;

				}

				return (
					<Fragment key={index_key}>
						<li className="kit-section-list">
							{GetPostType(data, val)}

							<span className='section-page-post-type'>
								{Set_PostTypeDD(post_type_val ? post_type_val : 'post', val, 'sections')}
							</span>
						</li>
					</Fragment>
				);
			})

			return (<Fragment>
				{wdkitData.use_editor != 'wdkit' &&
					<div className="kit-type-heading">
						{__('List of Sections ') + "(" + props.template_id.sections.length + ")"}
					</div>
				}

				<ul className="kit-pages-sec-lists">{lists}</ul>
			</Fragment>)
		}
	}

	/**Popup Step 2 - Select Post Type*/
	const GetPostType = (data, val) => {

		var Getimages = '';
		if (data[0].post_image && (data[0].post_image.indexOf("wdesignkit") > -1)) {
			Getimages = <img src={data[0].post_image} />
		} else {
			Getimages = img_path + 'assets/images/placeholder.jpg'
		}

		var GetTitle = '';
		if (data[0].title) {
			GetTitle = <span className='wkit-download-temp-title'>{data[0].title}</span>;
		}

		var GetPostType = '';
		if (data[0].wp_post_type == val.type && (val.change === undefined || val.change == false)) {
			let TypeName = '';
			if (wdkitData.post_type_list[val.type]) {
				TypeName = wdkitData.post_type_list[val.type];
			}
		} else {
			GetPostType = "";
		}

		return <div className='section-inner-list'>
			{Getimages}
			{GetTitle}
			{GetPostType}
		</div>;
	}

	/**Click button and Install*/
	const nextSteps = (required = true) => {
		if (stepsPlugin == 'step-1' && (props.type == 'kit_page' || props.type == 'wdkit')) {
			setStepsPlugin('step-2')
		} else if (stepsPlugin == 'step-1' && props.type != 'kit_page' && props.type != 'wdkit') {
			/**Continue Anyway Popup*/
			setStepsPlugin('step-3')
			if (required) {
				SuccessImportTemplate(true)
			} else {
				SuccessImportTemplate(false)
			}
		} else if (stepsPlugin == 'step-2' && ((props.template_id.pages.length != 0) || (props.template_id.sections.length != 0))) {
			setStepsPlugin('step-3')
			if (required) {
				SuccessImportTemplate(true)
			} else {
				SuccessImportTemplate(false)
			}
		}
	}

	/**Dynamic Text Form Post Type*/
	const Set_PostTypeDD = (data, val, type) => {

		return <Fragment>
			<select
				className={"wkit-select"}
				value={data ? data : 'page'}
				onChange={(ev) => {
					updateSelectValue(type, 'type', ev.target.value, val.id);
					setToggle(!toggle)
				}}
			>

				{wdkitData.post_type_list &&
					Object.entries(wdkitData.post_type_list).map(([name, label], key_index) => {
						return (
							<Fragment key={key_index}>
								<option value={name} >{label}</option>
							</Fragment>
						);
					})
				}
			</select>
		</Fragment>
	}

	/**Popup step 1 Plugin Missing Design*/
	const Popup_Step1_PluginMissing = () => {

		var InstallPlugin = '';
		if (dataPlugin.length > 0 && props.pluginData) {
			InstallPlugin = '';
		}

		const Get_plugin_list = () => {

			if (dataPlugin.length > 0 && props.pluginData) {
				return (
					<>
						{Object.values(dataPlugin).map((pluginData, index) => {
							return (
								<Fragment key={index}>
									<div className="wkit-plugin-list-item">
										<div className="wkit-plugin-img-title-wrapper">
											<div className="wkit-plugin-image">
												<img src={pluginData.plugin_icon} alt="plugin-icon" />
											</div>
											<div className={"wkit-plugin-name"}>{pluginData.plugin_name}</div>
										</div>
										{plugin_status(pluginData.status || '', pluginData.p_id, pluginData)}
									</div>
								</Fragment>
							)
						})}
					</>
				);
			} else {
				return (
					<div className='wkit-no-install-plugin'>
						<img src={img_path + "assets/images/jpg/no-plugin.png"} className='no-plugin-img' alt='no-plugin' />
						<h6 className='no-plugin-title'>{__('No need to install any Plugin.')}</h6>
						<p className='no-plugin-desc'>{__('You have selected design which doesn\'t need any plugin to install. Press Next.')}</p>
					</div>
				);
			}
		}

		const Fotter = () => {
			if (nextBtn == 'false' && dataPlugin.length > 0) {
				return (
					<Fragment>
						<button className="wkit-download-select" onClick={(e) => nextSteps()}>
							<span>{__('Continue Anyway')}</span>
							<div className='wkit-continue-toot-tip'>
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 15C4.14062 15 1 11.8594 1 8C1 4.14062 4.14062 1 8 1C11.8594 1 15 4.14062 15 8C15 11.8594 11.8594 15 8 15ZM8 5.75C8.41406 5.75 8.75 5.41437 8.75 5C8.75 4.58594 8.41406 4.25 8 4.25C7.58594 4.25 7.25 4.58437 7.25 5C7.25 5.41563 7.58437 5.75 8 5.75ZM9.5 11H8.5V7.5C8.5 7.225 8.275 7 8 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.5V11H6.5C6.225 11 6 11.225 6 11.5C6 11.775 6.225 12 6.5 12H9.5C9.77612 12 10 11.7761 10 11.5C10 11.225 9.775 11 9.5 11Z" className="wkit-info-svg" /></svg>
								<span className='wkit-continue-toot-tip-text'>{__('It will skip plugin installation and your imported page might not look as expected')}</span>
							</div>
						</button>
						<button key={Math.random().toString()}
							className={"wkit-download-all wkit-btn-class"}
							disabled={loadingInstall ? true : false}
							onClick={() => installPluginData('all')}>
							{!loadingInstall ? __('Install All') : __('Installing')}
						</button>
					</Fragment>
				);
			} else {
				return (
					<button className={"wkit-next-step wkit-btn-class"} onClick={(e) => { nextSteps() }}>{__('Next')}</button>
				);
			}
		}

		return <div className="popup-body">
			<div className="wkit-pluginMissing-text">
				{__('To download this template, you will need to install below listed plugins')}
			</div>

			<div className={(dataPlugin.length > 0 && props.pluginData) ? 'plugin-wrapper' : 'plugin-wrapper no-plugin'}>
				{Get_plugin_list()}
			</div>

			{/* {MetaFiled} */}
			<div className={"wkit-button-popup"}>{Fotter()}</div>
		</div>
	}

	const Popup_PluginMissing_Skeleton = () => {
		return (
			<Fragment>
				<div className="wkit-select-main">
					<div className={"wkit-skeleton-label"} style={{ width: '50%', marginTop: '20px', marginBottom: '40px' }}></div>
					<div className='wkit-save-plugin-wrapper'>
						{[1, 2, 3, 4].map((index, key) => (
							<div className="wkit-plugin-list" key={key} >
								<div className='kit-field-wrap1'>
									<div className='wkit-plugin-skeleton'>
										<div className="wkit-small-img-box"></div>
										<div className="wkit-skeleton-line"></div>
										<div className="wkit-small-check-box"></div>
									</div>
								</div>
							</div>
						))}
					</div>
					<div className='wkit-btn-right'>
						<div className="wkit-skeleton-label"></div>
						<button className={"wkit-btn-skeleton"} style={{ width: '120px', height: '50px' }}></button>
					</div>
				</div>
			</Fragment>
		)
	}

	let plugin_length = dataPlugin.filter((p_data) => p_data.status != 'active').length;
	var install_header = 'Install Missing Plugin';
	if (plugin_length > 1) {
		install_header = 'Install Missing Plugins';
	}

	return (
		<div className="popup-missing">
			{stepsPlugin == 'step-1' &&
				<Fragment>
					<div className="popup-header">{install_header}</div>

					{isLoading &&
						<div className={'import-data-loading'}><Popup_PluginMissing_Skeleton /></div>
					}

					{!isLoading &&
						Popup_Step1_PluginMissing()
					}
				</Fragment>
			}
			{((props.type == 'kit_page' || props.type == 'wdkit') && stepsPlugin == 'step-2') &&
				<Fragment>
					<div className="popup-header">{__('Import Templates')}</div>
					<div className="popup-body">
						<div className="kit-type-flex">
							{props.template_id?.pages?.length != 0 &&
								<div className='wkit-kit-select-content'>
									<span className='wkit-select-count'>Pages: {props.template_id?.pages?.length}</span>
									<div className='kit-type-col'>{PageList()} </div>
								</div>
							}
							{props.template_id?.sections?.length != 0 &&
								<div className='wkit-kit-select-content'>
									<span className='wkit-select-count'>Sections: {props.template_id?.sections?.length}</span>
									<div className='kit-type-col'> {SectionsList()} </div>
								</div>
							}
						</div>
						<div className='wkit-next-step-second'>
							<button className={'wkit-next-step wkit-btn-class'} onClick={(e) => { nextSteps() }}>{__('Import')}</button>
						</div>
					</div>
				</Fragment>
			}
		</div>
	);
}

export const WKit_successfully_import_template = (props) => {
	if (!props.template_id && !props.template_id.pages && !props.template_id.sections) {
		return false;
	}

	if (props.template_id.pages || props.template_id.sections) {
		if (props.template_id.pages?.length > 0) {
			var tmp_id = props.template_id.pages[0].id;
		} else if (props.template_id.sections?.length > 0) {
			var tmp_id = props.template_id.sections[0].id;
		}
		let index = props?.template_list?.findIndex((data) => data.id == tmp_id)
		if (index > -1) {
			var template_name = props?.template_list?.[index]?.title;
		} else {
			var template_name = '';
		}
	}

	const [isLoading, setIsLoading] = useState(false);
	const [resPages, setResPages] = useState({});
	const [resSections, setResSections] = useState({});
	const [successmsg, setsuccessmsg] = useState();
	const [errormsg, seterrormsg] = useState({ 'message': '', 'description': '' });

	useEffect(() => {
		checkPlugin()
	}, [props.template_id]);

	var img_path = wdkitData.WDKIT_URL;

	const checkPlugin = async () => {
		let loginData = get_user_login()
		let userEmail = ''
		if (loginData && loginData.user_email) {
			userEmail = loginData.user_email
			var api_name = 'import_template';
		} else {
			var api_name = 'import/template/free';
		}

		if ((props.template_id.pages && props.template_id.pages.length != 0) || (props.template_id.sections && props.template_id.sections.length != 0)) {
			setIsLoading(true);

			if (props.template_id.pages.length != 0) {
				let form_arr = {
					'type': 'import_multi_template',
					'api_type': api_name,
					'email': userEmail,
					'template_ids': JSON.stringify(props.template_id.pages),
					'editor': (wdkitData.use_editor == 'wdkit' && props.template_id.builder ? props.template_id.builder : wdkitData.use_editor),
					'page_section': 'pages',
					'custom_meta': props.custom_meta_import || false
				}

				let res = await wdKit_Form_data(form_arr);
				if (res?.success) {
					props.wdkit_set_toast(res?.message, res?.description, '', 'success');

					seterrormsg({ 'message': res?.message, 'description': res?.description });
					delete res.success;
					setResPages(res);
					setsuccessmsg(true);
				} else {
					seterrormsg({ 'message': res?.message, 'description': res?.description });
					props.wdkit_set_toast(res?.message, res?.description, '', 'danger');
				}
			}

			if (props.template_id.sections.length != 0) {
				let form_arr = {
					'type': 'import_multi_template',
					'api_type': api_name,
					'email': userEmail,
					'template_ids': JSON.stringify(props.template_id.sections),
					'editor': (wdkitData.use_editor == 'wdkit' && props.template_id.builder ? props.template_id.builder : wdkitData.use_editor),
					'page_section': 'sections',
					'custom_meta': props.custom_meta_import || false
				}

				let res = await wdKit_Form_data(form_arr);

				if (res?.success) {
					props.wdkit_set_toast(res?.message, res?.description, '', 'success');

					seterrormsg({ 'message': res?.message, 'description': res?.description });
					delete res.success;
					setResSections(res)
					setsuccessmsg(true);
				} else {
					props.wdkit_set_toast(res?.message, res?.description, '', 'danger');
					seterrormsg({ 'message': res?.message, 'description': res?.description });
				}
			}

			setIsLoading(false);
		} else if (props.template_id) {
			setIsLoading(true);
			let form_arr = {
				'type': 'import_template',
				'api_type': api_name,
				'email': userEmail,
				'template_id': props.template_id,
				'editor': wdkitData.use_editor,
				'custom_meta': props.custom_meta_import || false
			}
			let res = await wdKit_Form_data(form_arr);
			if (res?.success) {
				seterrormsg({ 'message': res?.message, 'description': res?.description });
				// props.wdkit_set_toast(res?.data?.message, 'subtitle', '', res?.data?.success);

				let tempContent = JSON.parse(res.content)
				if (tempContent && tempContent.content && wdkitData.use_editor == 'gutenberg') {
					let blocks = wp.blocks.parse(tempContent.content)

					//Media Import 
					let blocks_str = JSON.stringify(blocks);
					if (/\.(jpg|png|jpeg|gif|svg|webp)/gi.test(blocks_str)) {
						let form_arr = { 'type': 'media_import', 'email': userEmail, 'content': blocks_str, 'editor': wdkitData.use_editor }
						let media_res = await wdKit_Form_data(form_arr);
						if (media_res.data && media_res.success) {
							blocks = media_res.data
							wp.data.dispatch('core/block-editor').insertBlocks(blocks);
						}
					} else {
						wp.data.dispatch('core/block-editor').insertBlocks(blocks);
					}
					setIsLoading(false);
					setsuccessmsg(true);

					return () => {
						clearTimeout(timeId)
					}
				} else if (tempContent && tempContent.content && tempContent.file_type == 'elementor' && wdkitData.use_editor == 'elementor') {
					setsuccessmsg(true);
					seterrormsg({ 'message': res?.message, 'description': res?.description });


					let content_str = JSON.stringify(tempContent.content);
					if (/\.(jpg|png|jpeg|gif|svg|webp)/gi.test(content_str)) {
						let form_arr = { 'type': 'media_import', 'email': userEmail, 'content': content_str, 'editor': wdkitData.use_editor }
						let media_res = await wdKit_Form_data(form_arr);
						if (media_res.data && media_res.success) {
							tempContent.content = media_res.data
						}
					}

					var win_ele = window.elementor,
						win_el = $e;
					if (win_ele) {
						if (undefined !== win_el) {
							function ele_uniqueID(a) {
								return (
									a.forEach(function (a) {
										(a.id = elementorCommon.helpers.getUniqueId()), 0 < a.elements.length && ele_uniqueID(a.elements);
									}),
									a
								);
							}
							for (var i = 0; i < tempContent.content.length; i++) {
								var sec = { elType: tempContent.content[i].elType, settings: tempContent.content[i].settings };
								sec.elements = ele_uniqueID(tempContent.content[i].elements)
								win_el.run("document/elements/create", {
									container: win_ele.getPreviewContainer(),
									model: sec,
									options: {
										index: 0
									}
								});
							}
						} else {
							var model = new Backbone.Model({
								getTitle: function () {
									return "Wdesignkit Import"
								}
							});
							win_el.channels.data.trigger("template:before:insert", model);
							for (var i = 0; i < tempContent.content.length; i++) win_el.getPreviewView().addChildElement(tempContent.content[i], {
								index: 0
							});
							win_el.channels.data.trigger("template:after:insert", {})
						}
						setIsLoading(false);

						return () => {
							clearTimeout(timeId)
						}
					}
				} else {
					setIsLoading(false);
				}
			} else {
				seterrormsg({ 'message': res?.message, 'description': res?.description });

				// props.wdkit_set_toast(res?.data?.message, 'subtitle', '', res?.data?.success);
				setIsLoading(false);
			}
		} else {
			setIsLoading(false);
		}
	}

	const loopImport = (loop, key) => {
		var ProductImg = <img src={`${wdkitData.wdkit_server_url}images/uploads/wpdk-admin/random-image/placeholder.jpg`} />;

		if (props.template_list) {
			let index = props.template_list.findIndex((data) => data.id == key);

			if (index > -1 && props.template_list[index].post_image) {
				ProductImg = <img src={props.template_list[index].post_image} />
			} else {
				ProductImg = <img src={`${wdkitData.wdkit_server_url}images/uploads/wpdk-admin/random-image/placeholder.jpg`} />
			}
		}

		return (
			<div className={"wkit-success-list-item"}>
				<div className={"wkit-plugin-img-title-wrapper"}> {ProductImg}
					<div className="heading">{loop[key].title}</div>
				</div>
				<a href={loop[key].view} target="_blank" className="wkit-view-temp-btn" rel="noopener noreferrer">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0.666016 8.00033C0.666016 8.00033 3.33268 2.66699 7.99935 2.66699C12.666 2.66699 15.3327 8.00033 15.3327 8.00033C15.3327 8.00033 12.666 13.3337 7.99935 13.3337C3.33268 13.3337 0.666016 8.00033 0.666016 8.00033Z" stroke="#2A2A96" strokeLinecap="round" strokeLinejoin="round" /><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#2A2A96" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					{__('View')}
				</a>
			</div>
		)
	}

	if (window.wdkit_editor != 'wdkit' && successmsg && !isLoading) {

		setTimeout(() => {
			var event = window?.WdkitPopup?.getElements("content");
			if (event) {
				window.WdkitPopupToggle.close(event.get(0)), window.WdkitPopup.destroy()
			}

			let gut_doc = document.querySelector('#wkit-builder-modal');
			if (gut_doc) {
				gut_doc.classList.toggle("wkit-open");
				window.location.hash = '';
			}
		}, 1000);
	}

	return (
		<Fragment>
			<div className="popup-header">{__('Importing Templates')}</div>
			<div className="success-body">

				{isLoading ?
					<div className={'import-data-loading'}>
						<span>{template_name} Importing...</span>
						<div className='wkit-import-progressBar-loader'>
							<div className='wkit-import-data-progressBar-thumb'></div>
						</div>
					</div>
					:
					<div className="success-body">
						<div className={"success-icon-temp"}>
							{successmsg ?
								<svg className='wkit-success-icon' xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M37.8721 23.3124L37.8604 23.3181C36.4893 24.3696 35.9084 26.1589 36.3965 27.8147L36.4022 27.8263C37.1807 30.4581 35.252 33.1129 32.5098 33.1827H32.4982C30.767 33.2292 29.2449 34.3329 28.6697 35.9654V35.9712C27.7518 38.5622 24.6264 39.5788 22.3664 38.016C20.9632 37.0578 19.1081 37.0078 17.6317 38.016H17.6259C15.3661 39.573 12.2405 38.5621 11.3284 35.9653C10.7481 34.3288 9.22824 33.229 7.49996 33.1826H7.48832C4.74629 33.1128 2.81746 30.458 3.59598 27.8263L3.60176 27.8146C4.08965 26.1588 3.50871 24.3695 2.13777 23.3181L2.12613 23.3123C-0.052461 21.6391 -0.052461 18.3626 2.12613 16.6895L2.13777 16.6837C3.50871 15.6322 4.08965 13.8428 3.59598 12.1871V12.1755C2.8116 9.54385 4.74621 6.88885 7.48832 6.81916H7.49996C9.22535 6.77267 10.7532 5.66885 11.3284 4.03642V4.03064C12.2404 1.43963 15.3661 0.422987 17.6259 1.9858H17.6317C19.055 2.9676 20.9372 2.9676 22.3664 1.9858C24.6491 0.409471 27.7572 1.45517 28.6697 4.03064V4.03642C29.2449 5.66306 30.7669 6.77275 32.4982 6.81916H32.5098C35.2519 6.88885 37.1807 9.54385 36.4022 12.1755L36.3965 12.1871C35.9084 13.8428 36.4893 15.6322 37.8604 16.6837L37.8721 16.6895C40.0507 18.3626 40.0507 21.6392 37.8721 23.3124Z" fill="#3EB655"></path><path d="M19.9994 30.821C25.976 30.821 30.821 25.976 30.821 19.9994C30.821 14.0227 25.976 9.17773 19.9994 9.17773C14.0227 9.17773 9.17773 14.0227 9.17773 19.9994C9.17773 25.976 14.0227 30.821 19.9994 30.821Z" fill="#8BD399"></path><path opacity="0.1" d="M28.3088 13.0728C26.437 11.533 24.0423 10.6074 21.4316 10.6074C15.4551 10.6074 10.6074 15.4551 10.6074 21.4316C10.6074 24.0423 11.533 26.437 13.0727 28.3088C10.6945 26.325 9.17969 23.3409 9.17969 19.9998C9.17969 14.0231 14.0232 9.17969 19.9998 9.17969C23.3409 9.17969 26.325 10.6945 28.3088 13.0728Z" fill="black"></path><path d="M17.4247 24.2359L15.0317 21.69C14.405 21.0231 14.4373 19.9746 15.104 19.3479C15.7706 18.7204 16.8196 18.7541 17.4458 19.4205L18.5881 20.6353L23.4438 15.0855C24.0457 14.3967 25.0926 14.3269 25.7819 14.9296C26.4706 15.5323 26.5401 16.5789 25.9377 17.2676L19.8787 24.1923C19.2333 24.9292 18.0941 24.9485 17.4247 24.2359Z" fill="white"></path></svg>
								:
								<span className='wkit-template-error'>
									<svg width="80" height="80" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M17.9255 8.3812L6.28109 28.5484C6.07076 28.9126 5.96 29.3257 5.95996 29.7463C5.95992 30.1669 6.0706 30.58 6.28087 30.9443C6.49114 31.3085 6.7936 31.6109 7.15782 31.8212C7.52205 32.0315 7.93521 32.1422 8.35578 32.1421H31.6427C32.0632 32.1422 32.4764 32.0315 32.8406 31.8212C33.2048 31.6109 33.5073 31.3085 33.7176 30.9443C33.9278 30.58 34.0385 30.1669 34.0385 29.7463C34.0384 29.3257 33.9277 28.9126 33.7173 28.5484L22.0742 8.3812C21.864 8.01708 21.5616 7.71472 21.1975 7.50449C20.8334 7.29427 20.4203 7.18359 19.9998 7.18359C19.5794 7.18359 19.1663 7.29427 18.8022 7.50449C18.4381 7.71472 18.1357 8.01708 17.9255 8.3812Z" fill="#EE404C" />
										<path d="M20.152 14.5977H19.8482C19.1004 14.5977 18.4941 15.2039 18.4941 15.9517V22.4239C18.4941 23.1717 19.1004 23.778 19.8482 23.778H20.152C20.8998 23.778 21.506 23.1717 21.506 22.4239V15.9517C21.506 15.2039 20.8998 14.5977 20.152 14.5977Z" fill="#FFF7ED" />
										<path d="M20.0001 28.9142C20.8318 28.9142 21.506 28.24 21.506 27.4083C21.506 26.5766 20.8318 25.9023 20.0001 25.9023C19.1684 25.9023 18.4941 26.5766 18.4941 27.4083C18.4941 28.24 19.1684 28.9142 20.0001 28.9142Z" fill="#FFF7ED" />
									</svg>
								</span>
							}
						</div>
						{successmsg ?
							<div className="">
								<div className="wkit-success-heading wkit-get-success">{errormsg.message}</div>
								<div className="wkit-desc">{errormsg.description}</div>
							</div>
							:
							<div className="">
								<div className="wkit-success-heading">{errormsg.message}</div>
								<div className="wkit-desc">
									<span>{errormsg.description}</span>
								</div>
							</div>
						}
						{isLoading == false && (Object.keys(resPages).length > 0 || Object.keys(resSections).length > 0) &&
							<div className="wkit-success-wrapper">
								{resPages && Object.keys(resPages).length > 0 &&
									<Fragment>
										<div className='wkit-success-list-content'>
											<div className='wkit-success-col'>
												{wdkitData.use_editor != 'wdkit' &&
													<div className="wkit-plugin-success-heading">{__('Pages (') + Object.keys(resPages).length + ')'}</div>
												}
												{resPages[props.template_id.pages[0].id] && loopImport(resPages, props.template_id.pages[0].id)}
											</div>
										</div>
									</Fragment>
								}
								{resSections && Object.keys(resSections).length > 0 &&
									<Fragment>
										<div className='wkit-success-list-content'>
											<div className='wkit-success-col'>
												{wdkitData.use_editor != 'wdkit' &&
													<div className="wkit-plugin-success-heading">{__('Sections (') + Object.keys(resSections).length + ')'}</div>
												}
												{resSections?.[props.template_id?.sections?.[0]?.id] && loopImport(resSections, props.template_id.sections[0].id)}
											</div>
										</div>
									</Fragment>
								}
							</div>
						}
					</div>
				}
			</div>
		</Fragment>
	);
}

export const WKit_successfully_import_kit = (props) => {
	let totaltemplates = (Number(props.template_id.pages.length) + Number(props.template_id.sections.length));
	if (!props.template_id && !props.template_id.pages && !props.template_id.sections) {
		return false;
	}

	const [isLoading, setIsLoading] = useState(false);
	const [resPages, setResPages] = useState([]);
	const [resSections, setResSections] = useState([]);
	const [loadTemplate, setloadTemplate] = useState();
	const [TempSuccessCount, setTempSuccessCount] = useState(0);
	const [SectionSuccessCount, setSectionSuccessCount] = useState(0);

	const [TempFailCount, setTempFailCount] = useState(0);
	const [SectionFailCount, setSectionFailCount] = useState(0);

	var tempLoop = [];
	var sectionLoop = [];

	var successtempLoop = [];
	var successsectionLoop = [];
	var failtempLoop = [];
	var failsectionLoop = [];

	useEffect(() => {
		checkPlugin()
	}, [props.template_id]);

	var img_path = wdkitData.WDKIT_URL;

	const checkPlugin = () => {
		let loginData = get_user_login()
		let userEmail = ''
		if (loginData && loginData.user_email) {
			userEmail = loginData.user_email
			var api_name = 'import_template';
		} else {
			var api_name = 'import/template/free';
		}

		if ((props.template_id.pages && props.template_id.pages.length != 0) || (props.template_id.sections && props.template_id.sections.length != 0)) {
			setIsLoading(true);

			if (props.template_id.pages.length != 0) {
				var pagestmp = props.template_id?.pages?.length > 0 && props.template_id.pages ? props.template_id.pages : [];

				pagestmp.forEach(async function (self, index) {
					let form_arr = {
						'type': 'import_kit_template',
						'api_type': api_name,
						'website_kit': props.kit_id,
						'email': userEmail,
						'template_ids': JSON.stringify(self),
						'editor': (wdkitData.use_editor == 'wdkit' && props.template_id.builder ? props.template_id.builder : wdkitData.use_editor),
						'page_section': 'pages',
						'custom_meta': props.custom_meta_import || false
					}

					await wdKit_Form_data(form_arr).then((res) => {
						if (res.success) {
							let new_data = Object.assign({}, res[self.id], { 'status': true }, { 'id': self.id })
							tempLoop.push(new_data);
							successtempLoop.push(new_data);
							setTempSuccessCount(successtempLoop.length)
							setResPages(tempLoop);
						} else {
							let new_data = Object.assign({}, res[self.id], { 'status': false }, { 'id': self.id })
							tempLoop.push(new_data);
							failtempLoop.push(new_data);
							setTempFailCount(failtempLoop.length)
							setResPages(tempLoop);
						}
					})
					setloadTemplate(index);
				})

			}
			if (props.template_id.sections.length != 0) {
				var sections = props.template_id?.sections?.length > 0 && props.template_id.sections ? props.template_id.sections : [];

				sections.forEach(async function (self, index) {
					let form_arr = {
						'type': 'import_kit_template',
						'api_type': api_name,
						'website_kit': props.kit_id,
						'email': userEmail,
						'template_ids': JSON.stringify(self),
						'editor': (wdkitData.use_editor == 'wdkit' && props.template_id.builder ? props.template_id.builder : wdkitData.use_editor),
						'page_section': 'sections',
						'custom_meta': props.custom_meta_import || false
					}

					await wdKit_Form_data(form_arr).then((res) => {
						if (res.success) {
							let new_data = Object.assign({}, res[self.id], { 'status': true }, { 'id': self.id })
							sectionLoop.push(new_data);
							successsectionLoop.push(new_data);
							setSectionSuccessCount(successsectionLoop.length)
							setResSections(sectionLoop);
						} else {
							let new_data = Object.assign({}, res[self.id], { 'status': false }, { 'id': self.id })
							sectionLoop.push(new_data);
							failsectionLoop.push(new_data);
							setSectionFailCount(failsectionLoop.length)
							setResSections(sectionLoop);
						}
					})

					setloadTemplate(index);
				})
			}

			setIsLoading(false);
		}
	}

	return (
		<Fragment>
			<div className="popup-header">{__('Importing Templates')}</div>
			<div className="success-body">
				{(resSections.length + resPages.length) == totaltemplates ?
					<div className="wkit-import-kit-success-header">
						{(TempSuccessCount + SectionSuccessCount) === totaltemplates &&
							<Fragment>
								<div className='wkit-import-kit-success-title-content'>
									<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
										<path d="M37.8721 23.3124L37.8604 23.3181C36.4893 24.3696 35.9084 26.1589 36.3965 27.8147L36.4022 27.8263C37.1807 30.4581 35.252 33.1129 32.5098 33.1827H32.4982C30.767 33.2292 29.2449 34.3329 28.6697 35.9654V35.9712C27.7518 38.5622 24.6264 39.5788 22.3664 38.016C20.9632 37.0578 19.1081 37.0078 17.6317 38.016H17.6259C15.3661 39.573 12.2405 38.5621 11.3284 35.9653C10.7481 34.3288 9.22824 33.229 7.49996 33.1826H7.48832C4.74629 33.1128 2.81746 30.458 3.59598 27.8263L3.60176 27.8146C4.08965 26.1588 3.50871 24.3695 2.13777 23.3181L2.12613 23.3123C-0.052461 21.6391 -0.052461 18.3626 2.12613 16.6895L2.13777 16.6837C3.50871 15.6322 4.08965 13.8428 3.59598 12.1871V12.1755C2.8116 9.54385 4.74621 6.88885 7.48832 6.81916H7.49996C9.22535 6.77267 10.7532 5.66885 11.3284 4.03642V4.03064C12.2404 1.43963 15.3661 0.422987 17.6259 1.9858H17.6317C19.055 2.9676 20.9372 2.9676 22.3664 1.9858C24.6491 0.409471 27.7572 1.45517 28.6697 4.03064V4.03642C29.2449 5.66306 30.7669 6.77275 32.4982 6.81916H32.5098C35.2519 6.88885 37.1807 9.54385 36.4022 12.1755L36.3965 12.1871C35.9084 13.8428 36.4893 15.6322 37.8604 16.6837L37.8721 16.6895C40.0507 18.3626 40.0507 21.6392 37.8721 23.3124Z" fill="#3EB655" />
										<path d="M19.9994 30.821C25.976 30.821 30.821 25.976 30.821 19.9994C30.821 14.0227 25.976 9.17773 19.9994 9.17773C14.0227 9.17773 9.17773 14.0227 9.17773 19.9994C9.17773 25.976 14.0227 30.821 19.9994 30.821Z" fill="#8BD399" />
										<path opacity="0.1" d="M28.3088 13.0728C26.437 11.533 24.0423 10.6074 21.4316 10.6074C15.4551 10.6074 10.6074 15.4551 10.6074 21.4316C10.6074 24.0423 11.533 26.437 13.0727 28.3088C10.6945 26.325 9.17969 23.3409 9.17969 19.9998C9.17969 14.0231 14.0232 9.17969 19.9998 9.17969C23.3409 9.17969 26.325 10.6945 28.3088 13.0728Z" fill="black" />
										<path d="M17.4247 24.2359L15.0317 21.69C14.405 21.0231 14.4373 19.9746 15.104 19.3479C15.7706 18.7204 16.8196 18.7541 17.4458 19.4205L18.5881 20.6353L23.4438 15.0855C24.0457 14.3967 25.0926 14.3269 25.7819 14.9296C26.4706 15.5323 26.5401 16.5789 25.9377 17.2676L19.8787 24.1923C19.2333 24.9292 18.0941 24.9485 17.4247 24.2359Z" fill="white" />
									</svg>
									<span className="wkit-import-kit-success-title">{__(`${Number(TempSuccessCount + SectionSuccessCount) > 0 ? Number(TempSuccessCount + SectionSuccessCount) : 0}/${totaltemplates} Successfully Imported`)}</span>
								</div>
								<div className="wkit-import-kit-success-subTitle">{__('Yay! Your kit has been successfully imported')}</div>
							</Fragment>
						}
						{(TempSuccessCount + SectionSuccessCount) === 0 &&
							<Fragment>
								<div className='wkit-import-kit-success-title-content'>
									<svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M17.9255 8.3812L6.28109 28.5484C6.07076 28.9126 5.96 29.3257 5.95996 29.7463C5.95992 30.1669 6.0706 30.58 6.28087 30.9443C6.49114 31.3085 6.7936 31.6109 7.15782 31.8212C7.52205 32.0315 7.93521 32.1422 8.35578 32.1421H31.6427C32.0632 32.1422 32.4764 32.0315 32.8406 31.8212C33.2048 31.6109 33.5073 31.3085 33.7176 30.9443C33.9278 30.58 34.0385 30.1669 34.0385 29.7463C34.0384 29.3257 33.9277 28.9126 33.7173 28.5484L22.0742 8.3812C21.864 8.01708 21.5616 7.71472 21.1975 7.50449C20.8334 7.29427 20.4203 7.18359 19.9998 7.18359C19.5794 7.18359 19.1663 7.29427 18.8022 7.50449C18.4381 7.71472 18.1357 8.01708 17.9255 8.3812Z" fill="#EE404C" />
										<path d="M20.152 14.5977H19.8482C19.1004 14.5977 18.4941 15.2039 18.4941 15.9517V22.4239C18.4941 23.1717 19.1004 23.778 19.8482 23.778H20.152C20.8998 23.778 21.506 23.1717 21.506 22.4239V15.9517C21.506 15.2039 20.8998 14.5977 20.152 14.5977Z" fill="#FFF7ED" />
										<path d="M20.0001 28.9142C20.8318 28.9142 21.506 28.24 21.506 27.4083C21.506 26.5766 20.8318 25.9023 20.0001 25.9023C19.1684 25.9023 18.4941 26.5766 18.4941 27.4083C18.4941 28.24 19.1684 28.9142 20.0001 28.9142Z" fill="#FFF7ED" />
									</svg>
									<div className="wkit-import-kit-fail-title">{__(`${Number(TempSuccessCount + SectionSuccessCount) > 0 ? Number(TempSuccessCount + SectionSuccessCount) : 0}/${totaltemplates} Import Failed!`)}</div>
								</div>
								<div className="wkit-import-kit-fail-subTitle">{__('Ops! Your templates are failed to import. Please Try Again.')}
									<a href={wdkitData.WDKIT_DOC_URL + '/documents/how-to-manage-licence-in-wdesignkit/#Manage-Licence'} style={{ color: "#040483", fontWeight: "500" }} target="_blank" rel="noopener noreferrer">Why Failed?</a>
								</div>
							</Fragment>
						}
						{(TempSuccessCount + SectionSuccessCount) !== 0 && (TempSuccessCount + SectionSuccessCount) !== totaltemplates &&
							<Fragment>
								<div className='wkit-import-kit-success-title-content'>
									<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M17.9255 8.29136L6.28109 28.4585C6.07076 28.8227 5.96 29.2359 5.95996 29.6564C5.95992 30.077 6.0706 30.4902 6.28087 30.8544C6.49114 31.2186 6.7936 31.5211 7.15782 31.7314C7.52205 31.9416 7.93521 32.0523 8.35578 32.0523H31.6427C32.0632 32.0523 32.4764 31.9416 32.8406 31.7314C33.2048 31.5211 33.5073 31.2186 33.7176 30.8544C33.9278 30.4902 34.0385 30.077 34.0385 29.6564C34.0384 29.2359 33.9277 28.8227 33.7173 28.4585L22.0742 8.29136C21.864 7.92724 21.5616 7.62487 21.1975 7.41465C20.8334 7.20442 20.4203 7.09375 19.9998 7.09375C19.5794 7.09375 19.1663 7.20442 18.8022 7.41465C18.4381 7.62487 18.1357 7.92724 17.9255 8.29136Z" fill="#FFBB5C" />
										<path d="M20.152 14.5078H19.8482C19.1004 14.5078 18.4941 15.114 18.4941 15.8619V22.3341C18.4941 23.0819 19.1004 23.6881 19.8482 23.6881H20.152C20.8998 23.6881 21.506 23.0819 21.506 22.3341V15.8619C21.506 15.114 20.8998 14.5078 20.152 14.5078Z" fill="#FFF7ED" />
										<path d="M20.0001 28.8244C20.8318 28.8244 21.506 28.1501 21.506 27.3184C21.506 26.4867 20.8318 25.8125 20.0001 25.8125C19.1684 25.8125 18.4941 26.4867 18.4941 27.3184C18.4941 28.1501 19.1684 28.8244 20.0001 28.8244Z" fill="#FFF7ED" />
									</svg>
									<div className="wkit-import-kit-partial-title">{__(`${Number(TempSuccessCount + SectionSuccessCount) > 0 ? Number(TempSuccessCount + SectionSuccessCount) : 0}/${totaltemplates}  Partially Imported!`)}</div>
								</div>
								<div className="wkit-import-kit-partial-subTitle">{__(`Happy to say your ${Number(TempSuccessCount + SectionSuccessCount)} Templates Imported but sorry to know ${totaltemplates - (TempSuccessCount + SectionSuccessCount)} Failed to Import.`)}
									<a href={wdkitData.WDKIT_DOC_URL + 'documents/how-to-manage-licence-in-wdesignkit/#Manage-Licence'} style={{ color: "#040483", fontWeight: "500" }} target="_blank" rel="noopener noreferrer">Why Failed?</a>
								</div>
							</Fragment>
						}
					</div>
					:
					<div className="wkit-import-kit-success-header">
						<div className='wkit-import-kit-loading-progress-content'>
							<div className="wkit-import-kit-progress-title">{__(`${Number(TempSuccessCount + SectionSuccessCount) > 0 ? Number(TempSuccessCount + SectionSuccessCount) : 0}/${totaltemplates} Importing...`)}</div>
						</div>
						<div className='wkit-import-kit-progressBar-content'>
							<div className='wkit-import-kit-progressBar-thumb' style={{ width: `${(Number(TempSuccessCount + SectionSuccessCount) * 100) / Number(totaltemplates)}%` }}></div>
						</div>
					</div>
				}
				<div className="wkit-success-wrapper">
					{props.template_id.pages.length > 0 &&
						<div className='wkit-success-content'>
							<div className='wkit-success-template-content'>
								<span className='wkit-success-template-count'>{__('Pages :')} {TempSuccessCount}</span>
								{TempFailCount > 0 &&
									<div className='wkit-fail-template-count'>
										<span className='wkit-success-temp-container'>
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58171 18 2 14.4183 2 10C2 5.58171 5.58171 2 10 2C14.4183 2 18 5.58171 18 10ZM9.07464 14.236L15.0102 8.30045C15.2117 8.0989 15.2117 7.7721 15.0102 7.57055L14.2802 6.84065C14.0787 6.63907 13.7519 6.63907 13.5503 6.84065L8.70968 11.6813L6.44971 9.42126C6.24816 9.21971 5.92136 9.21971 5.71977 9.42126L4.98987 10.1511C4.78832 10.3527 4.78832 10.6796 4.98987 10.8811L8.34471 14.2359C8.54629 14.4375 8.87306 14.4375 9.07464 14.236Z" fill="#00A31B" /></svg>
											<span style={{ color: '#00A31B' }}>{TempSuccessCount} {__('Success.')}</span>
										</span>
										<span className='wkit-fail-temp-container'>
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8.96322 4.14666L3.14104 14.2302C3.03587 14.4123 2.98049 14.6189 2.98047 14.8292C2.98045 15.0395 3.03579 15.2461 3.14092 15.4282C3.24606 15.6103 3.39729 15.7615 3.5794 15.8667C3.76151 15.9718 3.9681 16.0271 4.17838 16.0271H15.8218C16.0321 16.0271 16.2387 15.9718 16.4208 15.8667C16.6029 15.7615 16.7541 15.6103 16.8593 15.4282C16.9644 15.2461 17.0197 15.0395 17.0197 14.8292C17.0197 14.6189 16.9643 14.4123 16.8592 14.2302L11.0376 4.14666C10.9325 3.9646 10.7813 3.81341 10.5992 3.7083C10.4172 3.60319 10.2106 3.54785 10.0004 3.54785C9.79018 3.54785 9.58366 3.60319 9.40159 3.7083C9.21953 3.81341 9.06834 3.9646 8.96322 4.14666Z" fill="#EE404C" /><path d="M10.077 7.25684H9.92508C9.55116 7.25684 9.24805 7.55995 9.24805 7.93387V11.17C9.24805 11.5439 9.55116 11.847 9.92508 11.847H10.077C10.4509 11.847 10.754 11.5439 10.754 11.17V7.93387C10.754 7.55995 10.4509 7.25684 10.077 7.25684Z" fill="#FFF7ED" /><path d="M10.001 14.4132C10.4169 14.4132 10.754 14.076 10.754 13.6602C10.754 13.2443 10.4169 12.9072 10.001 12.9072C9.58516 12.9072 9.24805 13.2443 9.24805 13.6602C9.24805 14.076 9.58516 14.4132 10.001 14.4132Z" fill="#FFF7ED" /></svg>
											<span>{TempFailCount} {__('Failed.')}</span>
										</span>
									</div>
								}
							</div>
							<div className='wkit-success-list-content'>
								<div className='wkit-success-col'>
									{props.template_id.pages.map((data, index) => {
										let t_index = resPages.findIndex((t_data) => t_data.id == data.id)

										if (t_index > -1) {
											var status = true;
											var view_link = resPages[t_index].view
											var result = resPages[t_index].status;
										} else {
											var status = false;
										}
										return (
											<div className={`wkit-success-list-item ${status && (result ? '' : 'wkit-import-fail')}`} key={index}>
												<div className={"wkit-plugin-img-title-wrapper"}>
													<img src={data.post_image} />
													<div className="heading">{data.title}</div>
												</div>
												{status ?
													result ?
														<a href={view_link ? view_link : ''} target="_blank" className="wkit-view-temp-btn" rel="noopener noreferrer">
															<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M0.666016 8.00033C0.666016 8.00033 3.33268 2.66699 7.99935 2.66699C12.666 2.66699 15.3327 8.00033 15.3327 8.00033C15.3327 8.00033 12.666 13.3337 7.99935 13.3337C3.33268 13.3337 0.666016 8.00033 0.666016 8.00033Z" stroke="#2A2A96" strokeLinecap="round" strokeLinejoin="round" />
																<path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#2A2A96" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														</a>
														:
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
															<path d="M8.96322 4.14666L3.14104 14.2302C3.03587 14.4123 2.98049 14.6189 2.98047 14.8292C2.98045 15.0395 3.03579 15.2461 3.14092 15.4282C3.24606 15.6103 3.39729 15.7615 3.5794 15.8667C3.76151 15.9718 3.9681 16.0271 4.17838 16.0271H15.8218C16.0321 16.0271 16.2387 15.9718 16.4208 15.8667C16.6029 15.7615 16.7541 15.6103 16.8593 15.4282C16.9644 15.2461 17.0197 15.0395 17.0197 14.8292C17.0197 14.6189 16.9643 14.4123 16.8592 14.2302L11.0376 4.14666C10.9325 3.9646 10.7813 3.81341 10.5992 3.7083C10.4172 3.60319 10.2106 3.54785 10.0004 3.54785C9.79018 3.54785 9.58366 3.60319 9.40159 3.7083C9.21953 3.81341 9.06834 3.9646 8.96322 4.14666Z" fill="#EE404C" />
															<path d="M10.077 7.25684H9.92508C9.55116 7.25684 9.24805 7.55995 9.24805 7.93387V11.17C9.24805 11.5439 9.55116 11.847 9.92508 11.847H10.077C10.4509 11.847 10.754 11.5439 10.754 11.17V7.93387C10.754 7.55995 10.4509 7.25684 10.077 7.25684Z" fill="#FFF7ED" />
															<path d="M10.001 14.4132C10.4169 14.4132 10.754 14.076 10.754 13.6602C10.754 13.2443 10.4169 12.9072 10.001 12.9072C9.58516 12.9072 9.24805 13.2443 9.24805 13.6602C9.24805 14.076 9.58516 14.4132 10.001 14.4132Z" fill="#FFF7ED" />
														</svg>
													:
													<div>
														<svg xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.5s linear infinite' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
															<path d="M2.76054 12.0855C3.58507 12.0855 4.25349 11.4171 4.25349 10.5926C4.25349 9.76803 3.58507 9.09961 2.76054 9.09961C1.936 9.09961 1.26758 9.76803 1.26758 10.5926C1.26758 11.4171 1.936 12.0855 2.76054 12.0855Z" fill="#909BA6" />
															<path d="M12.3661 10.7615C13.0817 10.7615 13.6619 10.1813 13.6619 9.4657C13.6619 8.75006 13.0817 8.16992 12.3661 8.16992C11.6505 8.16992 11.0703 8.75006 11.0703 9.4657C11.0703 10.1813 11.6505 10.7615 12.3661 10.7615Z" fill="#C8D2DC" />
															<path d="M11.1837 4.22581C11.7749 4.22581 12.2541 3.74656 12.2541 3.15538C12.2541 2.56421 11.7749 2.08496 11.1837 2.08496C10.5925 2.08496 10.1133 2.56421 10.1133 3.15538C10.1133 3.74656 10.5925 4.22581 11.1837 4.22581Z" fill="#E9EDF1" />
															<path d="M1.58437 8.4411C2.45939 8.4411 3.16873 7.74905 3.16873 6.89536C3.16873 6.04166 2.45939 5.34961 1.58437 5.34961C0.709345 5.34961 0 6.04166 0 6.89536C0 7.74905 0.709345 8.4411 1.58437 8.4411Z" fill="#7E8B96" />
															<path d="M6.13565 14.0004C6.93113 14.0004 7.57599 13.372 7.57599 12.5969C7.57599 11.8217 6.93113 11.1934 6.13565 11.1934C5.34017 11.1934 4.69531 11.8217 4.69531 12.5969C4.69531 13.372 5.34017 14.0004 6.13565 14.0004Z" fill="#A2ABB8" />
															<path d="M9.83706 13.3863C10.5928 13.3863 11.2054 12.7898 11.2054 12.054C11.2054 11.3182 10.5928 10.7217 9.83706 10.7217C9.08136 10.7217 8.46875 11.3182 8.46875 12.054C8.46875 12.7898 9.08136 13.3863 9.83706 13.3863Z" fill="#B9C3CD" />
															<path d="M3.29894 4.8518C4.21373 4.8518 4.95531 4.12792 4.95531 3.23498C4.95531 2.34204 4.21373 1.61816 3.29894 1.61816C2.38416 1.61816 1.64258 2.34204 1.64258 3.23498C1.64258 4.12792 2.38416 4.8518 3.29894 4.8518Z" fill="#5F6C75" />
															<path d="M12.7751 7.30062C13.4512 7.30062 13.9993 6.76265 13.9993 6.09904C13.9993 5.43543 13.4512 4.89746 12.7751 4.89746C12.0989 4.89746 11.5508 5.43543 11.5508 6.09904C11.5508 6.76265 12.0989 7.30062 12.7751 7.30062Z" fill="#DCE6EB" />
															<path d="M7.40859 3.49393C8.37314 3.49393 9.15507 2.71201 9.15507 1.74746C9.15507 0.782902 8.37314 0.000976562 7.40859 0.000976562C6.44403 0.000976562 5.66211 0.782902 5.66211 1.74746C5.66211 2.71201 6.44403 3.49393 7.40859 3.49393Z" fill="#4E5A61" />
														</svg>
													</div>
												}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					}
					{props.template_id.sections.length > 0 &&
						<div className='wkit-success-content'>
							<div className='wkit-success-template-content'>
								<span className='wkit-success-template-count'>{__('Sections :')} {SectionSuccessCount}</span>
								{SectionFailCount > 0 &&
									<div className='wkit-fail-template-count'>
										<span className='wkit-success-temp-container'>
											<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 10C18 14.4183 14.4183 18 10 18C5.58171 18 2 14.4183 2 10C2 5.58171 5.58171 2 10 2C14.4183 2 18 5.58171 18 10ZM9.07464 14.236L15.0102 8.30045C15.2117 8.0989 15.2117 7.7721 15.0102 7.57055L14.2802 6.84065C14.0787 6.63907 13.7519 6.63907 13.5503 6.84065L8.70968 11.6813L6.44971 9.42126C6.24816 9.21971 5.92136 9.21971 5.71977 9.42126L4.98987 10.1511C4.78832 10.3527 4.78832 10.6796 4.98987 10.8811L8.34471 14.2359C8.54629 14.4375 8.87306 14.4375 9.07464 14.236Z" fill="#00A31B" /></svg>
											<span style={{ color: '#00A31B' }}>{SectionSuccessCount}{__('Success.')}</span>
										</span>
										<span className='wkit-fail-temp-container'>
											<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8.96322 4.14666L3.14104 14.2302C3.03587 14.4123 2.98049 14.6189 2.98047 14.8292C2.98045 15.0395 3.03579 15.2461 3.14092 15.4282C3.24606 15.6103 3.39729 15.7615 3.5794 15.8667C3.76151 15.9718 3.9681 16.0271 4.17838 16.0271H15.8218C16.0321 16.0271 16.2387 15.9718 16.4208 15.8667C16.6029 15.7615 16.7541 15.6103 16.8593 15.4282C16.9644 15.2461 17.0197 15.0395 17.0197 14.8292C17.0197 14.6189 16.9643 14.4123 16.8592 14.2302L11.0376 4.14666C10.9325 3.9646 10.7813 3.81341 10.5992 3.7083C10.4172 3.60319 10.2106 3.54785 10.0004 3.54785C9.79018 3.54785 9.58366 3.60319 9.40159 3.7083C9.21953 3.81341 9.06834 3.9646 8.96322 4.14666Z" fill="#EE404C" /><path d="M10.077 7.25684H9.92508C9.55116 7.25684 9.24805 7.55995 9.24805 7.93387V11.17C9.24805 11.5439 9.55116 11.847 9.92508 11.847H10.077C10.4509 11.847 10.754 11.5439 10.754 11.17V7.93387C10.754 7.55995 10.4509 7.25684 10.077 7.25684Z" fill="#FFF7ED" /><path d="M10.001 14.4132C10.4169 14.4132 10.754 14.076 10.754 13.6602C10.754 13.2443 10.4169 12.9072 10.001 12.9072C9.58516 12.9072 9.24805 13.2443 9.24805 13.6602C9.24805 14.076 9.58516 14.4132 10.001 14.4132Z" fill="#FFF7ED" /></svg>
											<span>{SectionFailCount} {__('Failed.')}</span>
										</span>
									</div>
								}
							</div>
							<div className='wkit-success-list-content'>
								<div className='wkit-success-col'>
									{props.template_id.sections.map((data, index) => {
										let t_index = resSections.findIndex((t_data) => t_data.id == data.id)

										if (t_index > -1) {
											var status = true;
											var view_link = resSections[t_index].view
											var result = resSections[t_index].status;
										} else {
											var status = false;
										}

										return (
											<div className={`wkit-success-list-item ${status && (result ? '' : 'wkit-import-fail')}`} key={index} >
												<div className={"wkit-plugin-img-title-wrapper"}>
													<img src={data.post_image} />
													<div className="heading">{data.title}</div>
												</div>
												{status ?
													result ?
														<a href={view_link ? view_link : ''} target="_blank" className="wkit-view-temp-btn" rel="noopener noreferrer">
															<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M0.666016 8.00033C0.666016 8.00033 3.33268 2.66699 7.99935 2.66699C12.666 2.66699 15.3327 8.00033 15.3327 8.00033C15.3327 8.00033 12.666 13.3337 7.99935 13.3337C3.33268 13.3337 0.666016 8.00033 0.666016 8.00033Z" stroke="#2A2A96" strokeLinecap="round" strokeLinejoin="round" />
																<path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#2A2A96" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														</a>
														:
														<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
															<path d="M8.96322 4.14666L3.14104 14.2302C3.03587 14.4123 2.98049 14.6189 2.98047 14.8292C2.98045 15.0395 3.03579 15.2461 3.14092 15.4282C3.24606 15.6103 3.39729 15.7615 3.5794 15.8667C3.76151 15.9718 3.9681 16.0271 4.17838 16.0271H15.8218C16.0321 16.0271 16.2387 15.9718 16.4208 15.8667C16.6029 15.7615 16.7541 15.6103 16.8593 15.4282C16.9644 15.2461 17.0197 15.0395 17.0197 14.8292C17.0197 14.6189 16.9643 14.4123 16.8592 14.2302L11.0376 4.14666C10.9325 3.9646 10.7813 3.81341 10.5992 3.7083C10.4172 3.60319 10.2106 3.54785 10.0004 3.54785C9.79018 3.54785 9.58366 3.60319 9.40159 3.7083C9.21953 3.81341 9.06834 3.9646 8.96322 4.14666Z" fill="#EE404C" />
															<path d="M10.077 7.25684H9.92508C9.55116 7.25684 9.24805 7.55995 9.24805 7.93387V11.17C9.24805 11.5439 9.55116 11.847 9.92508 11.847H10.077C10.4509 11.847 10.754 11.5439 10.754 11.17V7.93387C10.754 7.55995 10.4509 7.25684 10.077 7.25684Z" fill="#FFF7ED" />
															<path d="M10.001 14.4132C10.4169 14.4132 10.754 14.076 10.754 13.6602C10.754 13.2443 10.4169 12.9072 10.001 12.9072C9.58516 12.9072 9.24805 13.2443 9.24805 13.6602C9.24805 14.076 9.58516 14.4132 10.001 14.4132Z" fill="#FFF7ED" />
														</svg>
													:
													<div>
														<svg xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1.5s linear infinite' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
															<path d="M2.76054 12.0855C3.58507 12.0855 4.25349 11.4171 4.25349 10.5926C4.25349 9.76803 3.58507 9.09961 2.76054 9.09961C1.936 9.09961 1.26758 9.76803 1.26758 10.5926C1.26758 11.4171 1.936 12.0855 2.76054 12.0855Z" fill="#909BA6" />
															<path d="M12.3661 10.7615C13.0817 10.7615 13.6619 10.1813 13.6619 9.4657C13.6619 8.75006 13.0817 8.16992 12.3661 8.16992C11.6505 8.16992 11.0703 8.75006 11.0703 9.4657C11.0703 10.1813 11.6505 10.7615 12.3661 10.7615Z" fill="#C8D2DC" />
															<path d="M11.1837 4.22581C11.7749 4.22581 12.2541 3.74656 12.2541 3.15538C12.2541 2.56421 11.7749 2.08496 11.1837 2.08496C10.5925 2.08496 10.1133 2.56421 10.1133 3.15538C10.1133 3.74656 10.5925 4.22581 11.1837 4.22581Z" fill="#E9EDF1" />
															<path d="M1.58437 8.4411C2.45939 8.4411 3.16873 7.74905 3.16873 6.89536C3.16873 6.04166 2.45939 5.34961 1.58437 5.34961C0.709345 5.34961 0 6.04166 0 6.89536C0 7.74905 0.709345 8.4411 1.58437 8.4411Z" fill="#7E8B96" />
															<path d="M6.13565 14.0004C6.93113 14.0004 7.57599 13.372 7.57599 12.5969C7.57599 11.8217 6.93113 11.1934 6.13565 11.1934C5.34017 11.1934 4.69531 11.8217 4.69531 12.5969C4.69531 13.372 5.34017 14.0004 6.13565 14.0004Z" fill="#A2ABB8" />
															<path d="M9.83706 13.3863C10.5928 13.3863 11.2054 12.7898 11.2054 12.054C11.2054 11.3182 10.5928 10.7217 9.83706 10.7217C9.08136 10.7217 8.46875 11.3182 8.46875 12.054C8.46875 12.7898 9.08136 13.3863 9.83706 13.3863Z" fill="#B9C3CD" />
															<path d="M3.29894 4.8518C4.21373 4.8518 4.95531 4.12792 4.95531 3.23498C4.95531 2.34204 4.21373 1.61816 3.29894 1.61816C2.38416 1.61816 1.64258 2.34204 1.64258 3.23498C1.64258 4.12792 2.38416 4.8518 3.29894 4.8518Z" fill="#5F6C75" />
															<path d="M12.7751 7.30062C13.4512 7.30062 13.9993 6.76265 13.9993 6.09904C13.9993 5.43543 13.4512 4.89746 12.7751 4.89746C12.0989 4.89746 11.5508 5.43543 11.5508 6.09904C11.5508 6.76265 12.0989 7.30062 12.7751 7.30062Z" fill="#DCE6EB" />
															<path d="M7.40859 3.49393C8.37314 3.49393 9.15507 2.71201 9.15507 1.74746C9.15507 0.782902 8.37314 0.000976562 7.40859 0.000976562C6.44403 0.000976562 5.66211 0.782902 5.66211 1.74746C5.66211 2.71201 6.44403 3.49393 7.40859 3.49393Z" fill="#4E5A61" />
														</svg>
													</div>
												}
											</div>
										);
									})}
								</div>
							</div>
						</div>
					}
				</div >
			</div >
		</Fragment >
	);
}

export const Wkit_success_message = () => {

	return (
		<div className="wkit-success">
			<div className="wkit-success-fully-bg">
				<svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M1.49554 5.97363L3.98608 8.46417L10.4615 1.98877" stroke="white" strokeWidth="1.99243" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<div className="wkit-text">{__('Successfully')} </div>
		</div>
	);
}

export const Wkit_failed_message = () => {

	return (
		<div>
			<div className="wkit-failed">
				<div className="wkit-failed-fully-bg">
					<svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 15C4.14062 15 1 11.8594 1 8C1 4.14062 4.14062 1 8 1C11.8594 1 15 4.14062 15 8C15 11.8594 11.8594 15 8 15ZM8 5.75C8.41406 5.75 8.75 5.41437 8.75 5C8.75 4.58594 8.41406 4.25 8 4.25C7.58594 4.25 7.25 4.58437 7.25 5C7.25 5.41563 7.58437 5.75 8 5.75ZM9.5 11H8.5V7.5C8.5 7.225 8.275 7 8 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.5V11H6.5C6.225 11 6 11.225 6 11.5C6 11.775 6.225 12 6.5 12H9.5C9.77612 12 10 11.7761 10 11.5C10 11.225 9.775 11 9.5 11Z" className="wkit-icon-white" />
					</svg>
				</div>
				<div className="wkit-text">{__('Failed')} </div>
			</div>
		</div>
	);
}

export const Wkit_add_workspace = (props) => {

	const Popup_Close = () => {
		if (document.querySelector('.wkit-model-transp.wkit-popup-show')) {
			document.querySelector('.wkit-model-transp.wkit-popup-show').classList.remove("wkit-popup-show")
		}
		props.closePopUp();
	}

	const [ws_name, setWsName] = useState("");
	const [isSaving, setSaving] = useState(false);
	const [successMsg, setSuccessMsg] = useState(false);
	const [errorTextMsg, setErrorTextmsg] = useState("");

	const saveData = async () => {
		if (props.type == 'manage') {
			props.setLoading(true);
		}
		setErrorTextmsg('')
		if (ws_name) {
			setSaving(true)
			let form_arr = { 'builder': window.wdkit_editor, 'title': ws_name, 'wstype': 'add' }
			var result = await wdkit_Manage_WorkSpace_Api(form_arr)
			if (result?.data?.success) {
				let userData = await Get_user_info_data()
				setSuccessMsg(true);
				setSaving(false);
				props.Toast(result?.data?.message, result?.data?.description, 'success');

				const timeId = setTimeout(() => {
					setSuccessMsg(false)
					Popup_Close()
				}, 1000)

				props.UpdateUserData(userData);

				return () => {
					clearTimeout(timeId)
				}
			} else {
				props.Toast(result?.data?.message, result?.data?.description, 'danger');
				setSuccessMsg(false)
				setSaving(false)
			}
		} else {
			setErrorTextmsg('wkit-error-red')
		}
		if (props.type == 'manage') {
			props.setLoading(false);
		}
	}

	const Condition_check = (value) => {
		if (value.length <= 100) {
			return true;
		} else {
			props.Toast(['Limit Reached', 'Limit Reached', '', 'danger'])
			return false;
		}
	}

	return (
		<div className={"wkit-model-transp wkit-popup-show"} >
			<div className={"wkit-plugin-model-content"}>
				<a className={"wkit-plugin-popup-close"} onClick={(e) => { Popup_Close() }}>
					<span>
						<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
					</span>
				</a>
				<div className={"wdesignkit-model-content"}>
					<div className='popup-header'>{__("Add New Workspace")}</div>
					<div className='popup-body wkit-AddWp-popup-body'>
						<label className="wkit-popup-content-title">{__("Workspace Name")}</label>
						<input
							type={"text"}
							name={"workspace-name"}
							className={"wkit-search-share " + errorTextMsg}
							placeholder={__('Enter Workspace Name')}
							value={ws_name}
							onChange={(ev) => {
								if (Condition_check(ev.target.value)) {
									setWsName(ev.target.value)
								}
							}}
						/>
						{!isSaving ?
							<button className={"wkit-add-workspace-btn wkit-btn-class"} onClick={() => saveData()}>{__('Next')}</button>
							:
							<button className={"wkit-add-workspace-btn wkit-btn-class"}>{WkitLoader()}</button>
						}
					</div>
				</div>
			</div>
		</div>
	)
}

export const Wkit_template_Skeleton = (props) => {
	return (
		<div className="wkit-skeleton-main-wrap wkit-skeleton-row">
			{
				Object.values(GetCount(12)).map((data, index) => {
					return (
						<div className="wkit-skeleton-boxed" key={index}>
							<div className="wkit-skeleton-inner-boxed ">
								<ul>
									<li><div className="wkit-small-img-box"></div></li>
									<li><div className="wkit-small-img-box"></div></li>
									<li><div className="wkit-small-img-box"></div></li>
								</ul>
								<div className="wkit-template-bg">
									<div className="wkit-skeleton-square"></div>
								</div>
								<div className="wkit-title-meta-content">
									<div className="template-page-kit-title">
										<div className="wkit-skeleton-line"></div>
									</div>
									<div className="wkit-select">
										<div className="wkit-skeleton-line"></div>
									</div>
								</div>
								<div className="wkit-title-meta-content">
									<div className="wkit-action-inner">
										<div className="wkit-skeleton-line"></div>
									</div>
									<div >
										<div className="wkit-img-border-rounded"></div>
									</div>
								</div>
							</div>
						</div>
					);
				})
			}
		</div>
	);
}

export const Wkit_availble_not = (props) => {
	var type = props?.page ? props?.page : '';
	var img_path = wdkitData.WDKIT_URL;
	var link = props?.link ? props.link : wdkitData.WDKIT_DOC_URL + 'docs/';

	return (
		<div className='wkit-content-not-availble'>
			<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/jpg/empty-dog.png"} alt="section" />
			<h5 className='wkit-common-desc'>{__(`Nothing related found!`)}</h5>
			<a href={link} target="_blank" rel="noopener noreferrer">
				<button type='submit' className='wkit-common-btn wkit-pink-btn-class' >{__(`How to Add ${type}`)}</button>
			</a>
		</div>
	);
}

export const Wkit_mobile_header = (props) => {
	let location = useLocation();
	let pathname = location.pathname.split("/");
	var img_path = wdkitData.WDKIT_URL;
	let login_detail = get_user_login();

	const [BuilderArray, setBuilderArray] = useState([]);
	const [TemplateArray, setTemplateArray] = useState([]);



	useEffect(() => {
		let builders = [];
		if (props?.props?.wdkit_meta?.Setting?.elementor_builder) {
			builders.push('Elementor');
		}
		if (props?.props?.wdkit_meta?.Setting?.gutenberg_builder) {
			builders.push('Gutenberg');
		}
		if (props?.props?.wdkit_meta?.Setting?.bricks_builder) {
			builders.push('Bricks');
		}

		setBuilderArray(builders);

		let templates = [];
		if (props?.props?.wdkit_meta?.Setting?.elementor_template) {
			templates.push('Elementor');
		}
		if (props?.props?.wdkit_meta?.Setting?.gutenberg_template) {
			templates.push('Gutenberg');
		}

		setTemplateArray(templates)
	}, [props?.props?.wdkit_meta?.Setting])


	let temp_validation = (props?.props?.wdkit_meta?.Setting?.template && (TemplateArray.length > 0))
	let builder_validation = (props?.props?.wdkit_meta?.Setting?.builder && (BuilderArray.length > 0))

	const wkit_humber_open = () => {
		document.querySelector(".wkit-hamburger-menu-content").classList.add("wkit-hamburger-content-show");
		document.querySelector(".wkit-opp").style.visibility = "visible";
	}
	const wkit_humber_close = () => {
		document.querySelector(".wkit-hamburger-menu-content.wkit-hamburger-content-show").classList.remove("wkit-hamburger-content-show");
		document.querySelector(".wkit-opp").style.visibility = "hidden";
	}
	if (!(pathname.includes('builder') && pathname.includes('widget-listing'))) {
		return (
			<div className='wkit-mobile-header-main'>
				<a href={wdkitData.wdkit_server_url} target="_blank" rel="noopener noreferrer">
					<img className='wdkit-main-logo' src={img_path + "/assets/images/jpg/Wdesignkit-logo.png"} alt="wdesignkit-logo" />
				</a>
				<div className='wkit-mobile-hamburger-dot'>

					<div className='wkit-hamburger-icon' onClick={() => { wkit_humber_open() }}></div>
					<div className='wkit-opp' onClick={() => { wkit_humber_close() }}>
						<ul className="wkit-hamburger-menu-content">
							<div className="wkit-menu-site-logo">
								<img src={img_path + "assets/images/jpg/Wdesignkit-full-logo-original.png"} alt="wdesignlogo" draggable="false" />
							</div>
							{temp_validation &&
								<li className={pathname.includes("browse") ? 'wkit-mobileMenu-active' : ''}>
									<Link to='/browse'>
										<svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M19 5H5V8H19V5ZM3 8V9.5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V9.5V8V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V8ZM19 19V9.5H5L5 19H19ZM16.3819 12.5H7.61805H6.5C6.22386 12.5 6 12.2761 6 12V11.5C6 11.2239 6.22386 11 6.5 11H7.61805H16.3819H17.5C17.7761 11 18 11.2239 18 11.5V12C18 12.2761 17.7761 12.5 17.5 12.5H16.3819ZM7.86622 15.5C7.7784 15.3482 7.65181 15.2216 7.5 15.1338C7.34819 15.2216 7.2216 15.3482 7.13378 15.5C7.2216 15.6518 7.34819 15.7784 7.5 15.8662C7.65181 15.7784 7.7784 15.6518 7.86622 15.5ZM7 14C6.44772 14 6 14.4477 6 15V16C6 16.5523 6.44772 17 7 17H8C8.55228 17 9 16.5523 9 16V15C9 14.4477 8.55228 14 8 14H7ZM12 15.1338C12.1518 15.2216 12.2784 15.3482 12.3662 15.5C12.2784 15.6518 12.1518 15.7784 12 15.8662C11.8482 15.7784 11.7216 15.6518 11.6338 15.5C11.7216 15.3482 11.8482 15.2216 12 15.1338ZM10.5 15C10.5 14.4477 10.9477 14 11.5 14H12.5C13.0523 14 13.5 14.4477 13.5 15V16C13.5 16.5523 13.0523 17 12.5 17H11.5C10.9477 17 10.5 16.5523 10.5 16V15ZM16.8662 15.5C16.7784 15.3482 16.6518 15.2216 16.5 15.1338C16.3482 15.2216 16.2216 15.3482 16.1338 15.5C16.2216 15.6518 16.3482 15.7784 16.5 15.8662C16.6518 15.7784 16.7784 15.6518 16.8662 15.5ZM16 14C15.4477 14 15 14.4477 15 15V16C15 16.5523 15.4477 17 16 17H17C17.5523 17 18 16.5523 18 16V15C18 14.4477 17.5523 14 17 14H16ZM6.5 7C6.77614 7 7 6.77614 7 6.5C7 6.22386 6.77614 6 6.5 6C6.22386 6 6 6.22386 6 6.5C6 6.77614 6.22386 7 6.5 7ZM9 6.5C9 6.77614 8.77614 7 8.5 7C8.22386 7 8 6.77614 8 6.5C8 6.22386 8.22386 6 8.5 6C8.77614 6 9 6.22386 9 6.5ZM10.5 7C10.7761 7 11 6.77614 11 6.5C11 6.22386 10.7761 6 10.5 6C10.2239 6 10 6.22386 10 6.5C10 6.77614 10.2239 7 10.5 7Z" fill="white"></path></svg>
										{__('Browse Templates')}
									</Link>
								</li>
							}
							{window.wdkit_editor != "wdkit" &&
								<li className={pathname.includes("save_template") ? 'wkit-mobileMenu-active' : ''}>
									<Link to='/save_template'>
										<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M20.625 5.375H4.375V8.625H20.625V5.375ZM4.375 21.625V10.25H12.5V14.8214C12.5 15.6001 13.3679 16.0646 14.0158 15.6327L15.75 14.4765L17.4842 15.6327C18.1321 16.0646 19 15.6001 19 14.8214V10.25H20.625V21.625H4.375ZM17.375 10.25H14.125V13.6068L15.2542 12.854C15.5544 12.6539 15.9456 12.6539 16.2458 12.854L17.375 13.6068V10.25ZM4.375 3.75C3.47754 3.75 2.75 4.47754 2.75 5.375V21.625C2.75 22.5225 3.47754 23.25 4.375 23.25H20.625C21.5225 23.25 22.25 22.5225 22.25 21.625V5.375C22.25 4.47754 21.5225 3.75 20.625 3.75H4.375ZM7.625 7C7.625 7.44873 7.26123 7.8125 6.8125 7.8125C6.36377 7.8125 6 7.44873 6 7C6 6.55127 6.36377 6.1875 6.8125 6.1875C7.26123 6.1875 7.625 6.55127 7.625 7ZM10.0625 7.8125C10.5112 7.8125 10.875 7.44873 10.875 7C10.875 6.55127 10.5112 6.1875 10.0625 6.1875C9.61376 6.1875 9.25 6.55127 9.25 7C9.25 7.44873 9.61376 7.8125 10.0625 7.8125ZM6 14.3125C6 13.8638 6.36377 13.5 6.8125 13.5H8.4375C8.88623 13.5 9.25 13.8638 9.25 14.3125C9.25 14.7612 8.88623 15.125 8.4375 15.125H6.8125C6.36377 15.125 6 14.7612 6 14.3125ZM6.8125 17.5625C6.36377 17.5625 6 17.9263 6 18.375C6 18.8237 6.36377 19.1875 6.8125 19.1875H15.75C16.1987 19.1875 16.5625 18.8237 16.5625 18.375C16.5625 17.9263 16.1987 17.5625 15.75 17.5625H6.8125Z" fill="white" /></svg>										{__('Save Template')}
									</Link></li>
							}
							{window.wdkit_editor == "wdkit" && builder_validation &&
								<li className={pathname.includes("widget-browse") ? 'wkit-mobileMenu-active' : ''}>
									<Link to="/widget-browse">
										<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.85305 0.582239C10.5417 0.10019 11.4583 0.100192 12.1469 0.582239L11 2.2207L2.66749 8.05344L1.52057 6.41497L9.85305 0.582239ZM1.83245 13.6967L1.4181 13.3652C0.375944 12.5314 0.427213 10.9303 1.52057 10.165L1.83245 9.94666L1.4181 9.61518C0.375943 8.78145 0.427214 7.18032 1.52057 6.41497L2.66749 8.05344L6.62467 11.2192L9.75058 13.7199C10.481 14.3043 11.5189 14.3043 12.2494 13.7199L15.3753 11.2192L19.3325 8.05344L11 2.2207L12.1469 0.582239L20.4794 6.41497C21.5727 7.18033 21.624 8.78145 20.5818 9.61518L20.1675 9.94666L20.4794 10.165C21.5727 10.9303 21.624 12.5315 20.5818 13.3652L20.1675 13.6967L20.4794 13.915C21.5727 14.6803 21.624 16.2815 20.5818 17.1152L16.6247 20.2809L13.4988 22.7816C12.0379 23.9503 9.96207 23.9503 8.50119 22.7816L5.37528 20.2809L1.4181 17.1152C0.375944 16.2815 0.427213 14.6803 1.52057 13.915L1.83245 13.6967ZM3.45999 14.9987L2.66749 15.5534L6.62467 18.7192L9.75058 21.2199C10.481 21.8043 11.5189 21.8043 12.2494 21.2199L15.3753 18.7192L19.3325 15.5534L18.54 14.9987L16.6247 16.5309L13.4988 19.0316C12.0379 20.2003 9.96207 20.2003 8.50119 19.0316L5.37528 16.5309L3.45999 14.9987ZM16.6247 12.7809L18.54 11.2487L19.3325 11.8034L15.3753 14.9692L12.2494 17.4699C11.5189 18.0543 10.481 18.0543 9.75058 17.4699L6.62467 14.9692L2.66749 11.8034L3.45999 11.2487L5.37528 12.7809L8.50119 15.2816C9.96207 16.4503 12.0379 16.4503 13.4988 15.2816L16.6247 12.7809Z" fill="white"></path></svg>
										{__('Browse Widgets')}
									</Link></li>
							}
							{temp_validation &&
								<li className={pathname.includes("my_uploaded") ? 'wkit-mobileMenu-active' : ''}>
									<Link to="/my_uploaded">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16H15V10H19L12 3L5 10H9V16ZM12 5.83L14.17 8H13V14H11V8H9.83L12 5.83ZM5 18H19V20H5V18Z" fill="white" /></svg>
										{__('My Templates')}
									</Link>
								</li>
							}
							{(temp_validation == true || builder_validation == true) &&
								<>
									<li className={pathname.includes("share_with_me") ? 'wkit-mobileMenu-active' : ''}>
										<Link to='/share_with_me'>
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08ZM18 4C18.55 4 19 4.45 19 5C19 5.55 18.55 6 18 6C17.45 6 17 5.55 17 5C17 4.45 17.45 4 18 4ZM6 13C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11C6.55 11 7 11.45 7 12C7 12.55 6.55 13 6 13ZM18 20.02C17.45 20.02 17 19.57 17 19.02C17 18.47 17.45 18.02 18 18.02C18.55 18.02 19 18.47 19 19.02C19 19.57 18.55 20.02 18 20.02Z" fill="white" /></svg>
											{__('Shared with Me')}
										</Link>
									</li>
									<li className={pathname.includes("manage_workspace") ? 'wkit-mobileMenu-active' : ''}><Link to='/manage_workspace' ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15C7.1 15 8 15.9 8 17C8 18.1 7.1 19 6 19C4.9 19 4 18.1 4 17C4 15.9 4.9 15 6 15ZM6 13C3.8 13 2 14.8 2 17C2 19.2 3.8 21 6 21C8.2 21 10 19.2 10 17C10 14.8 8.2 13 6 13ZM12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5ZM12 3C9.8 3 8 4.8 8 7C8 9.2 9.8 11 12 11C14.2 11 16 9.2 16 7C16 4.8 14.2 3 12 3ZM18 15C19.1 15 20 15.9 20 17C20 18.1 19.1 19 18 19C16.9 19 16 18.1 16 17C16 15.9 16.9 15 18 15ZM18 13C15.8 13 14 14.8 14 17C14 19.2 15.8 21 18 21C20.2 21 22 19.2 22 17C22 14.8 20.2 13 18 13Z" fill="white" /></svg>Manage Workspace</Link></li>
								</>
							}
							{window.wdkit_editor == "wdkit" &&
								<Fragment>
									<li className={pathname.includes("activate") ? 'wkit-mobileMenu-active' : ''}>
										<Link to="/activate">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8ZM12 10C12.3453 10 12.6804 9.95625 13 9.87398V11.2192L12.291 11.042C12.1 10.9942 11.9 10.9942 11.709 11.042L11 11.2192V9.87398C11.3196 9.95625 11.6547 10 12 10ZM16 6C16 6.3453 15.9562 6.68038 15.874 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9C2 7.89543 2.89543 7 4 7H8.12602C8.04375 6.68038 8 6.3453 8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6ZM9 9H4V20H20V9H15V12.2438C15 13.0245 14.2663 13.5974 13.509 13.408L12 13.0308L10.491 13.408C9.73366 13.5974 9 13.0245 9 12.2438V9ZM7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44771 18 7 18H17C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16H7Z" fill="white" /></svg>
											{__('Manage Licence')}
										</Link></li>
									{builder_validation == true &&
										<li className={pathname.includes("widget-listing") ? 'wkit-mobileMenu-active' : ''}>
											<Link to="/widget-listing">
												<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M14 2V6H18V2H14ZM13 0C12.4477 0 12 0.447715 12 1V7C12 7.55228 12.4477 8 13 8H19C19.5523 8 20 7.55228 20 7V1C20 0.447715 19.5523 0 19 0H13ZM2 14V18H6V14H2ZM1 12C0.447715 12 0 12.4477 0 13V19C0 19.5523 0.447715 20 1 20H7C7.55228 20 8 19.5523 8 19V13C8 12.4477 7.55228 12 7 12H1ZM14 18V14H18V18H14ZM12 13C12 12.4477 12.4477 12 13 12H19C19.5523 12 20 12.4477 20 13V19C20 19.5523 19.5523 20 19 20H13C12.4477 20 12 19.5523 12 19V13ZM2 5C2 6.65685 3.34315 8 5 8C6.65685 8 8 6.65685 8 5C8 3.34315 6.65685 2 5 2C3.34315 2 2 3.34315 2 5ZM5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C5.9441 10 6.82709 9.73834 7.5804 9.28357L9.25232 11.1645C9.61924 11.5772 10.2513 11.6144 10.6641 11.2475C11.0769 10.8806 11.1141 10.2485 10.7471 9.83573L9.05251 7.9293C9.6486 7.10608 10 6.09408 10 5C10 2.23858 7.76142 0 5 0Z" fill="white"></path></svg>
												{__('My Widgets')}
											</Link>
										</li>
									}
									<li className={pathname.includes("settings") ? 'wkit-mobileMenu-active' : ''}>
										<Link to="/settings">
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 2C4.55228 2 5 2.44772 5 3V10C5 10.5523 4.55228 11 4 11C3.44772 11 3 10.5523 3 10V3C3 2.44772 3.44772 2 4 2ZM5 15H7C7.55228 15 8 14.5523 8 14C8 13.4477 7.55228 13 7 13H4H1C0.447715 13 0 13.4477 0 14C0 14.5523 0.447715 15 1 15H3V21C3 21.5523 3.44772 22 4 22C4.55228 22 5 21.5523 5 21V15ZM13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V12ZM12 2C12.5523 2 13 2.44772 13 3V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H12H9C8.44771 9 8 8.55228 8 8C8 7.44772 8.44771 7 9 7H11V3C11 2.44772 11.4477 2 12 2ZM20 15H23C23.5523 15 24 15.4477 24 16C24 16.5523 23.5523 17 23 17H21V21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21V17H17C16.4477 17 16 16.5523 16 16C16 15.4477 16.4477 15 17 15H20ZM20 2C20.5523 2 21 2.44772 21 3V12C21 12.5523 20.5523 13 20 13C19.4477 13 19 12.5523 19 12V3C19 2.44772 19.4477 2 20 2Z" fill="white" /></svg>
											{__('Settings')}
										</Link>
									</li>
									{/* <li>
										<a href='https://wordpress.org/support/plugin/wdesignkit/' target="_blank" rel="noopener noreferrer" >
											<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.3863 8.61417C23.0767 8.30314 22.6769 8.09771 22.2437 8.0271C21.8106 7.95649 21.3662 8.02431 20.9738 8.2209C19.6025 4.59199 16.1029 2 12 2C7.89711 2 4.39639 4.59308 3.02512 8.22253C2.70593 8.06205 2.35089 7.98618 1.99398 8.00217C1.63707 8.01817 1.29024 8.1255 0.986686 8.3139C0.68313 8.50229 0.433007 8.76545 0.260255 9.07817C0.0875037 9.39089 -0.00209398 9.74272 3.71478e-05 10.1V13.7C0.000105947 14.0759 0.101086 14.4448 0.292434 14.7683C0.483782 15.0919 0.758479 15.3581 1.08784 15.5392C1.41721 15.7203 1.78915 15.8097 2.16485 15.798C2.54055 15.7863 2.90621 15.674 3.22367 15.4727C3.79284 16.7558 4.63552 17.899 5.69274 18.8223C6.74996 19.7457 7.99618 20.4268 9.3442 20.8181C9.38754 20.9304 9.46381 21.0269 9.563 21.0951C9.6622 21.1632 9.77967 21.1998 9.90001 21.2H14.1C14.2591 21.2 14.4117 21.1367 14.5243 21.0242C14.6368 20.9117 14.7 20.7591 14.7 20.6V19.4C14.7 19.2408 14.6368 19.0882 14.5243 18.9757C14.4117 18.8632 14.2591 18.8 14.1 18.8H9.90001C9.74089 18.8 9.58827 18.8632 9.47575 18.9757C9.36323 19.0882 9.30002 19.2408 9.30002 19.4V19.5467C5.99021 18.4181 3.60003 15.2867 3.60003 11.6C3.60003 6.96853 7.36802 3.2 12 3.2C16.632 3.2 20.4 6.96853 20.4 11.6C20.4007 12.4739 20.2649 13.3425 19.9974 14.1745C19.9696 14.2532 19.9586 14.3368 19.9653 14.42C19.9727 14.5128 20.0016 14.6026 20.0498 14.6823C20.2685 15.0968 20.6197 15.4261 21.0474 15.6175C21.4751 15.809 21.9547 15.8516 22.4094 15.7385C22.8642 15.6255 23.268 15.3633 23.5563 14.9939C23.8446 14.6245 24.0008 14.1691 24 13.7005V10.1005C24.001 9.82451 23.9474 9.55102 23.842 9.29589C23.7367 9.04075 23.5818 8.80904 23.3863 8.61417ZM2.10003 14.6C1.86143 14.5997 1.63268 14.5048 1.46396 14.336C1.29524 14.1673 1.20032 13.9386 1.20003 13.7V10.1C1.19955 9.93007 1.24732 9.76352 1.33779 9.61969C1.42826 9.47587 1.5577 9.36069 1.71107 9.28755C1.86443 9.21441 2.03541 9.18632 2.20411 9.20655C2.37281 9.22677 2.5323 9.29448 2.66403 9.4018C2.27442 11.0078 2.31658 12.6883 2.78621 14.2727C2.70322 14.3747 2.59861 14.4569 2.47994 14.5135C2.36127 14.5701 2.23151 14.5997 2.10003 14.6ZM22.8 13.7C22.7997 13.9386 22.7048 14.1673 22.5361 14.336C22.3673 14.5048 22.1386 14.5997 21.9 14.6C21.7692 14.5992 21.6402 14.5695 21.5223 14.5129C21.4044 14.4563 21.3005 14.3743 21.2182 14.2727C21.6855 12.6894 21.7277 11.0109 21.3404 9.40617C21.684 9.13671 22.2229 9.1438 22.5403 9.46071C22.6238 9.54479 22.6897 9.64459 22.7342 9.75432C22.7788 9.86406 22.8012 9.98155 22.8 10.1V13.7Z" fill="white"></path><path d="M17.694 14.785C17.8944 14.386 17.9992 13.9459 18 13.4994V9.70138C17.9991 8.93227 17.6932 8.19491 17.1495 7.65102C16.6057 7.10713 15.8684 6.80112 15.0993 6.80011H8.90073C8.13163 6.80112 7.39433 7.10713 6.85054 7.65102C6.30675 8.19491 6.00088 8.93227 6.00001 9.70138V13.4994C6.00088 14.2684 6.30677 15.0057 6.85057 15.5495C7.39437 16.0933 8.13168 16.3992 8.90073 16.4001H14.9454L17.6798 18.109C17.7846 18.1746 17.907 18.2062 18.0305 18.1996C18.1539 18.1929 18.2722 18.1483 18.3694 18.0719C18.4665 17.9954 18.5376 17.8908 18.573 17.7724C18.6084 17.654 18.6064 17.5275 18.5673 17.4103L17.694 14.785ZM15.4364 15.2895C15.341 15.23 15.2308 15.1984 15.1184 15.1985H8.90073C8.45013 15.1979 8.01813 15.0187 7.69936 14.7003C7.38058 14.3818 7.20102 13.95 7.20001 13.4994V9.70138C7.20059 9.25044 7.37994 8.81814 7.69875 8.49923C8.01755 8.18032 8.4498 8.00083 8.90073 8.00011H15.0993C15.5502 8.00083 15.9824 8.18032 16.3013 8.49923C16.6201 8.81814 16.7994 9.25044 16.8 9.70138V13.4994C16.7984 13.8197 16.7061 14.1331 16.5338 14.4032C16.4863 14.4783 16.4561 14.563 16.4454 14.6512C16.4346 14.7394 16.4436 14.8289 16.4716 14.9132L16.9031 16.207L15.4364 15.2895Z" fill="white"></path><path d="M9.60001 12.2001C9.93138 12.2001 10.2 11.9315 10.2 11.6001C10.2 11.2687 9.93138 11.0001 9.60001 11.0001C9.26864 11.0001 9.00001 11.2687 9.00001 11.6001C9.00001 11.9315 9.26864 12.2001 9.60001 12.2001Z" fill="white"></path><path d="M14.4 12.2001C14.7314 12.2001 15 11.9315 15 11.6001C15 11.2687 14.7314 11.0001 14.4 11.0001C14.0686 11.0001 13.8 11.2687 13.8 11.6001C13.8 11.9315 14.0686 12.2001 14.4 12.2001Z" fill="white"></path><path d="M12 12.2001C12.3314 12.2001 12.6 11.9315 12.6 11.6001C12.6 11.2687 12.3314 11.0001 12 11.0001C11.6686 11.0001 11.4 11.2687 11.4 11.6001C11.4 11.9315 11.6686 12.2001 12 12.2001Z" fill="white"></path></svg>
											<span className="wkit-menu-text">{__('Support')}</span>
											</a>
											</li> */}

								</Fragment>
							}
							<div className='wkit-mobile-menu-logout'>
								{login_detail ?
									<span className="wkit-menu-text wkit-menu-logout-text" onClick={() => wkit_logout()}>{__('Logout')}</span>
									:
									<Link className="wkit-menu-text wkit-menu-logout-text" to='/login' onClick={() => wkit_logout()}>{__('Login')}</Link>
								}
							</div>

						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export const Wkit_browse_template_Skeleton = (props) => {
	return (
		<div className='wkit-browse-skeleton-main wkit-skeleton-main-wrap '>
			<div className='wkit-browse-skeleton-left-side'>
				<div className="wkit-skeleton-boxed wkit-browse-inner" >
					<div className="wkit-skeleton-line" style={{ "width": "100%" }}></div>
					<div className='wkit-innerbox-flex' style={{ marginBottom: 40 }}>
						<div className="wkit-small-img-box"></div>
						<div className="wkit-small-img-box"></div>
					</div>
					<div className="wkit-skeleton-line" style={{ "width": "100%" }}></div>
					<div className="wkit-filter-small-line">
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
					</div>
					<div className="wkit-skeleton-line" style={{ "width": "100%" }}></div>
					<div className="wkit-filter-small-line">
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
						<div className="wkit-skeleton-line"></div>
					</div>
				</div>
			</div>
			<div className='wkit-skeleton-right-side'>
				<div className="wkit-skeleton-main-wrap wkit-skeleton-row">
					{
						Object.values(GetCount(12)).map((data, index) => {
							return (
								<div className="wkit-skeleton-boxed" key={index}>
									<div className="wkit-skeleton-inner-boxed ">
										<ul>
											<li><div className="wkit-small-img-box"></div></li>
											<li><div className="wkit-small-img-box"></div></li>
											<li><div className="wkit-small-img-box"></div></li>
										</ul>
										<div className="wkit-template-bg">
											<div className="wkit-skeleton-square"></div>
										</div>
										<div className="wkit-title-meta-content">
											<div className="template-page-kit-title">
												<div className="wkit-skeleton-line"></div>
											</div>
											<div className="wkit-select">
												<div className="wkit-skeleton-line"></div>
											</div>
										</div>
										<div className="wkit-title-meta-content">
											<div className="wkit-action-inner">
												<div className="wkit-skeleton-line"></div>
											</div>
											<div >
												<div className="wkit-img-border-rounded"></div>
											</div>
										</div>
									</div>
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	);
}

export const Wkit_workspace_skeleton = () => {
	return (
		<div className="wkit-skeleton-main-wrap wkit-skeleton-row">
			{
				Object.values(GetCount(6)).map((data, index) => {
					return (
						<div className="wkit-skeleton-boxed wkit-workspace-boxed" key={index}>
							<div className="wkit-skeleton-inner-boxed ">
								<ul>
									<li><div className="wkit-small-img-box"></div></li>
									<li><div className="wkit-small-img-box"></div></li>
									<li><div className="wkit-small-img-box"></div></li>
								</ul>
								<div className="wkit-template-bg">
									<div className="wkit-skeleton-square"></div>
								</div>
								<div className="wkit-title-meta-content">
									<div className="template-page-kit-title">
										<div className="wkit-skeleton-line"></div>
									</div>
								</div>
								<div className="wkit-title-meta-content">
									<div className="wkit-action-inner">
										<div className="wkit-skeleton-line"></div>
									</div>
									<div >
										<div className="wkit-img-border-rounded"></div>
									</div>
								</div>
							</div>
						</div>
					);
				})
			}
		</div>
	);
}

export const Wdkit_Copy_Temp_to_Ws = (props) => {
	const params = useParams();
	if (!props.temp_id) {
		return '';
	}

	const [select_type, setSelectType] = useState(null);
	const [selectWork, setSelectWork] = useState([]);
	const [errorSelectMsg, setErrorSelectmsg] = useState("");
	const [isSaving, setSaving] = useState(false);

	useEffect(() => {
		setSelectWork(wkit_SelectWorkSpace(props.userData, props.temp_id, props.action))
	}, []);

	const clickData = async () => {
		if (props.action == 'move') {
			props.setloading(true);
		}
		setErrorSelectmsg('')
		if (select_type) {
			setSaving(true)
			let form_arr = { 'wid': select_type, 'template_id': props.temp_id, 'wstype': props.action }
			if (params && params.id && props.action == 'move') {
				form_arr = Object.assign({}, form_arr, { 'current_wid': params.id })
			}
			var result = await wdkit_Manage_WorkSpace_Api(form_arr);
			if (result?.data?.success) {
				setSaving(false)
				props.wdkit_set_toast(result?.data?.message, result?.data?.description, '', 'success');
			} else {
				setSaving(false)
				props.wdkit_set_toast(result?.data?.message, result?.data?.description, '', 'danger');
			}

			const timeId = setTimeout(() => {
				props.popCloseHandler(false)
			}, 1000)

			if (props.action == 'move') {
				let userData = await Get_user_info_data()
				props.UpdateUserData(userData);
				props.setloading(false);
			}

			return () => {
				clearTimeout(timeId)
			}
		}

	}

	return (
		<div className="wkit-copy-move-ws-wrap">
			<div className={"wkit-ws-label-heading"}>{__('Copy to Workspace')}</div>
			<div className={"wkit-ws-content dropdown-custom-width"}>
				<select className={"wkit-select-workspace " + errorSelectMsg} onChange={(ev) => setSelectType(ev.target.value)}>
					<option value={''}>{__('Select Workspace')}</option>
					{selectWork &&
						selectWork.map((item, index) => {
							return <option value={item.w_id} key={index}>{item.title}</option>
						})
					}
				</select>
				<div className='wkit-copy-wrap'>
					{!isSaving ?
						< button
							type="button"
							className='btn-workspace-add wkit-pink-btn-class'
							onClick={() => clickData()}>
							{props.action == 'move' ? __('Move') : __('Copy')}
						</button>
						:
						<button className='btn-workspace-add wkit-pink-btn-class'>{WkitLoader()}</button>
					}
				</div>
			</div>
		</div >
	)
}

export const CardRatings = (props) => {

	const maxStars = 5;
	const rating = props.avg_rating;

	const FilledStarIcon = () => (
		<svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fillRule="evenodd" clipRule="evenodd" d="M9.35279 0.230779L11.9212 5.68903L17.6625 6.56451C17.8112 6.58761 17.9344 6.69674 17.9807 6.84619C18.027 6.99563 17.9884 7.15959 17.8809 7.2694L13.7272 11.5171L14.7079 17.5162C14.7337 17.6709 14.6731 17.8275 14.5517 17.9199C14.4302 18.0124 14.2691 18.0246 14.1362 17.9515L9.00059 15.1197L3.86502 17.9523C3.73217 18.0257 3.57094 18.0137 3.44943 17.9212C3.32793 17.8288 3.26734 17.6722 3.29327 17.5174L4.27397 11.5171L0.119103 7.2694C0.0116435 7.15959 -0.027039 6.99563 0.0192579 6.84619C0.0655548 6.69674 0.188839 6.58761 0.337471 6.56451L6.07884 5.68903L8.64838 0.230779C8.71377 0.0896426 8.85058 0 9.00059 0C9.1506 0 9.28741 0.0896426 9.35279 0.230779Z" fill="#F0B137" />
		</svg>
	);

	const HalfFilledStarIcon = () => (
		<svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.53121 5.90199L9.00056 0.656576L11.4687 5.90191L11.5823 6.14313L11.8458 6.18332L17.4134 7.0323L13.3697 11.1675L13.193 11.3483L13.2338 11.5978L14.1833 17.4065L9.24202 14.6818L9.00055 14.5487L8.7591 14.6819L3.81791 17.4073L4.76742 11.5978L4.80821 11.3482L4.63141 11.1675L0.586611 7.0323L6.15421 6.18332L6.41769 6.14314L6.53121 5.90199ZM17.5236 6.91968L17.5234 6.91982L17.5236 6.91968ZM0.476449 6.91968C0.476503 6.91973 0.476557 6.91979 0.476611 6.91984L0.476541 6.91977L0.476449 6.91968Z" stroke="#F0B137" />
			<path d="M3.86502 17.9523L9.35279 15.1197V0.230779C9.28741 0.0896426 9.1506 0 9.00059 0C8.85058 0 8.71377 0.0896426 8.64838 0.230779L6.07884 5.68903L0.337471 6.56451C0.188839 6.58761 0.0655548 6.69674 0.0192579 6.84619C-0.027039 6.99563 0.0116435 7.15959 0.119103 7.2694L4.27397 11.5171L3.29327 17.5174C3.26734 17.6722 3.32793 17.8288 3.44943 17.9212C3.57094 18.0137 3.73217 18.0257 3.86502 17.9523Z" fill="#F0B137" />
		</svg>
	);

	const EmptyStarIcon = () => (
		<svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.53121 5.90199L9.00056 0.656576L11.4687 5.90191L11.5823 6.14313L11.8458 6.18332L17.4134 7.0323L13.3697 11.1675L13.193 11.3483L13.2338 11.5978L14.1833 17.4065L9.24202 14.6818L9.00055 14.5487L8.7591 14.6819L3.81791 17.4073L4.76742 11.5978L4.80821 11.3482L4.63141 11.1675L0.586611 7.0323L6.15421 6.18332L6.41769 6.14314L6.53121 5.90199ZM17.5236 6.91968L17.5234 6.91982L17.5236 6.91968ZM0.476449 6.91968C0.476503 6.91973 0.476557 6.91979 0.476611 6.91984L0.476541 6.91977L0.476449 6.91968Z" stroke="#F0B137" />
		</svg>
	);

	return (
		<div className="wdkit-star-rating">
			{Array.from({ length: maxStars }).map((r_data, index) => {
				if (rating >= index + 1) {
					return <FilledStarIcon key={index} />;
				} else if (rating >= index + 0.5) {
					return <HalfFilledStarIcon key={index} />;
				} else {
					return <EmptyStarIcon key={index} />;
				}
			})
			}
			<span>
				({props.total_rating} {props.total_rating <= 1 ? 'Review' : 'Reviews'})
			</span>
		</div>
	);
};

/** widget card structure */
export const Widget_card = (props) => {
	var data = props.widgetData;
	var img_path = wdkitData.WDKIT_URL;
	let index = props.index;
	let location = useLocation();

	let login_array = location.pathname.split('/');

	const [downloading, setdownloading] = useState(false);
	const [Download_index, setDownload_index] = useState(-1);

	const navigation = useNavigate();

	const SetImageUrl = (url) => {
		if (url) {
			var imageUrl = url.replace(/\s/g, "%20");

			return imageUrl;
		} else {
			return '';
		}
	}

	const widget_builder_tooltip = (data) => {
		let index = props.widgetbuilder.findIndex((id) => id.w_id == data.builder);
		if (index > -1 && props.widgetbuilder[index]?.builder_name) {
			return props.widgetbuilder[index].builder_name;
		}
	}

	/** download widget */
	const Download_widget = async (w_data, index) => {

		let login_detail = get_user_login();

		if (login_detail) {
			var api_name = 'widget/download';
		} else {
			var api_name = 'import/widget/free';
			if (w_data.free_pro == "pro") {
				navigation('/login');
				return false;
			}
		}

		var download_access = false;

		if (w_data.free_pro == "pro" && props?.credits?.pro_widget_limit?.meta_value == "1") {

			let builder_name = widget_builder_tooltip(w_data).toLowerCase();
			if (builder_name === "elementor") {
				if (props?.credits?.access_elementor?.meta_value == "1") {
					download_access = true;
				}
			} else if (builder_name === "gutenberg") {
				if (props?.credits?.access_gutenburg?.meta_value == "1") {
					download_access = true;
				}
			} else if (builder_name === "bricks") {
				if (props?.credits?.access_bricks?.meta_value == "1") {
					download_access = true;
				}
			}
		}

		if (w_data.free_pro == "pro" && !download_access) {
			await props.wdkit_set_toast("Get Pro Version to Download", '', '', 'danger')
			return false;
		}

		let id = w_data.id

		setDownload_index(index);

		const Create_widget = async (data) => {
			let json = JSON.parse(data.json);
			let builder = json?.widget_data?.widgetdata?.type;
			let html = JSON.stringify(json?.Editor_data?.html);
			let js = JSON.stringify(json?.Editor_data?.js);
			let css = JSON.stringify(json?.Editor_data?.css);
			let image = data.image;
			let icon = '';

			var widget_data = Object.assign({}, json.widget_data.widgetdata, { 'r_id': data.r_id, 'allow_push': true });
			if (props?.userinfo?.id != w_data?.user_id) {
				widget_data = Object.assign({}, json.widget_data.widgetdata, { 'allow_push': false });
			}

			let widget_obj = Object.assign({}, json.widget_data, { 'widgetdata': widget_data });

			var data = {
				"CardItems": {
					"cardData": json.section_data
				},

				"WcardData": widget_obj,

				"Editor_data": json.Editor_Link,

				"Editor_code": {
					"Editor_codes": [json.Editor_data]
				}
			}

			var response = '';
			if ('elementor' === builder) {
				response = await Elementor_file_create('public_download', data, html, css, js, "", image).then((res) => { return res })
			} else if ('gutenberg' === builder) {
				response = await CreatFile('public_download', data, html, css, js, "", image).then((res) => { return res })
			} else if ('bricks' === builder) {
				response = await Bricks_file_create('public_download', data, html, css, js, "", image).then((res) => { return res })
			}

			if (response?.api?.success) {
				let old_array = [...props.existingwidget]
				old_array.push(w_data.w_unique);

				let new_data = await Get_user_info_data();
				if (new_data?.success) {
					props.wdkit_set_meta(new_data?.data);
				}
				props.setexistingwidget(old_array)
				props.wdkit_set_toast('Downloaded Successfully!', 'Start using or editing it further.', '', 'success');
			}

			setdownloading(false);
			setDownload_index(-1);
		}

		if (window.location.hash.search('#/share_with_me') > -1) {
			var api_data = {
				"api_type": api_name,
				"w_uniq": id,
				"u_id": props.userinfo?.id,
				"d_type": "workspace",
			};
		} else {
			var api_data = {
				"api_type": api_name,
				"w_uniq": id,
				"u_id": props.userinfo?.id,
			};
		}

		let form_arr = { 'type': 'wkit_public_download_widget', 'widget_info': JSON.stringify(api_data) }
		await wdKit_Form_data(form_arr).then(async (result) => {
			if (result?.success) {
				await Create_widget(result)
			} else {
				await props.wdkit_set_toast(result?.message, result?.description, '', 'danger')
				await setdownloading(false);
				await setDownload_index(-1);
			}
		})
	}

	// widget builder icon 
	const widget_builder = (data) => {
		let index = props.widgetbuilder.findIndex((id) => id.w_id == data.builder);
		if (index > -1 && props.widgetbuilder[index]?.builder_icon) {
			return props.widgetbuilder[index].builder_icon;
		} else {
			return `${wdkitData.wdkit_server_url}images/uploads/wpdk-admin/random-image/placeholder.jpg`
		}
	}

	return (
		<div className="wkit-widgetlist-grid-content">
			{data.is_activated != 'active' &&
				<Fragment>
					<div className='wdkit-inner-boxed-deActivate'>
						<div className='wdkit-inner-boxed-deActivate-h1'>{__('Credit Limit Reached!')}</div>
						<div className='wdkit-inner-boxed-deActivate-p'>{__('This Template got disabled until you have more credits to make it active.')}</div>
						<a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
							<button>{__('Buy Credits')}</button>
						</a>
					</div>
					{(!props.filter || (props.filter && props.filter != 'browse')) && !(window.location.hash.search('#/share_with_me') > -1) && !(window.location.hash.search('/kit/') > -1) &&
						<span className='wdkit-inner-boxed-remove'>
							<svg onClick={() => { On_OpenPopup(), setwsID(w_id) }} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
								<path fillRule="evenodd" clipRule="evenodd" d="M5.66634 1.83203C5.44533 1.83203 5.23337 1.91983 5.07709 2.07611C4.9208 2.23239 4.83301 2.44435 4.83301 2.66536V3.4987H9.16634V2.66536C9.16634 2.44435 9.07854 2.23239 8.92226 2.07611C8.76598 1.91983 8.55402 1.83203 8.33301 1.83203H5.66634ZM10.1663 3.4987V2.66536C10.1663 2.17913 9.97319 1.71282 9.62937 1.369C9.28555 1.02519 8.81924 0.832031 8.33301 0.832031H5.66634C5.18011 0.832031 4.7138 1.02519 4.36998 1.369C4.02616 1.71282 3.83301 2.17913 3.83301 2.66536V3.4987H2.33301C2.32078 3.4987 2.30865 3.49914 2.29664 3.5H1C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5H1.83301V13.332C1.83301 13.8183 2.02616 14.2846 2.36998 14.6284C2.7138 14.9722 3.18011 15.1654 3.66634 15.1654H10.333C10.8192 15.1654 11.2856 14.9722 11.6294 14.6284C11.9732 14.2846 12.1663 13.8183 12.1663 13.332V4.5H13C13.2761 4.5 13.5 4.27614 13.5 4C13.5 3.72386 13.2761 3.5 13 3.5H11.7027C11.6907 3.49914 11.6786 3.4987 11.6663 3.4987H10.1663ZM2.83301 13.332V4.5H11.1663V13.332C11.1663 13.553 11.0785 13.765 10.9223 13.9213C10.766 14.0776 10.554 14.1654 10.333 14.1654H3.66634C3.44533 14.1654 3.23337 14.0776 3.07709 13.9213C2.9208 13.765 2.83301 13.553 2.83301 13.332ZM7.5 7.33203C7.5 7.05589 7.27614 6.83203 7 6.83203C6.72386 6.83203 6.5 7.05589 6.5 7.33203V11.332C6.5 11.6082 6.72386 11.832 7 11.832C7.27614 11.832 7.5 11.6082 7.5 11.332V7.33203Z" fill="#1E1E1E" />
							</svg>
						</span>
					}
				</Fragment>
			}
			<div className='wkit-widget-card'>
				<div className='wkit-widget-card-top-part'>
					<div className="wkit-widget-upper-icons">
						{data.status == "private" &&
							<div className="wkit-widget-public-icon">
								<img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/private.svg"} alt="private" draggable={false} />
								<span className="wkit-widget-icon-tooltip">{__('Private')}</span>
							</div>
						}
						{data.status == "public" &&
							<div className="wkit-widget-public-icon">
								<img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/public.svg"} alt="public" draggable={false} />
								<span className="wkit-widget-icon-tooltip">{__('Public')}</span>
							</div>
						}
					</div>
					{data.free_pro == 'pro' &&
						<div className="wdkit-card-tag">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
							<span>{__('Pro')}</span>
						</div>
					}
					<div>
						{login_array.includes('widget-browse') &&
							<>
								<img className="wkit-widget-placeholder-img" src={img_path + 'assets/images/wkit-dummy-bg.png'} draggable={false} />
								<a className='wkit-widget-title-heading' href={`${wdkitData.wdkit_server_url}widgets/${RemoveExtraSpace(data.title)}/${data.id}`} target="_blank" rel="noopener noreferrer">
									<picture>
										{data.responsive_image.map((image_data, index) => {
											return (
												<Fragment key={index}>
													<source media={`(min-width: ${image_data.size}px)`} srcSet={SetImageUrl(image_data.url)} />
												</Fragment>
											);
										})}
										<img className="wkit-widget-image-content" src={data.image} alt={"featured-img"} draggable={false} />
									</picture>
								</a>
							</>
						}
						{!login_array.includes('widget-browse') &&
							<picture>
								{data.responsive_image.map((image_data, index) => {
									return (
										<Fragment key={index}>
											<source media={`(min-width: ${image_data.size}px)`} srcSet={SetImageUrl(image_data.url)} />
										</Fragment>
									);
								})}
								<img className="wkit-widget-image-content" src={data.image} alt={"featured-img"} draggable={false} />
							</picture>
						}
					</div>
				</div>
				<div className='wkit-widget-card-bottom-part'>
					<div className='wkit-widget-title-content'>
						{login_array.includes('widget-browse') &&
							<a className='wkit-widget-title-heading' href={`${wdkitData.wdkit_server_url}widgets/${RemoveExtraSpace(data.title)}/${data.id}`} target="_blank" rel="noopener noreferrer">
								<span>{data.title}</span>
							</a>
						}
						{!login_array.includes('widget-browse') &&
							<div className='wkit-widget-title-heading'>
								<span>{data.title}</span>
							</div>
						}
						{props.existingwidget.includes(data.w_unique) ?
							<Link className='wkit-widget-download-activity' to='/widget-listing'>
								<span className='wkit-widget-eye-icon'>
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 10 11" fill="none">
										<path d="M6.49176 5.20895C6.49176 6.03395 5.82509 6.70062 5.00009 6.70062C4.17509 6.70062 3.50842 6.03395 3.50842 5.20895C3.50842 4.38395 4.17509 3.71729 5.00009 3.71729C5.82509 3.71729 6.49176 4.38395 6.49176 5.20895Z" stroke="#19191B" strokeWidth="1.02473" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M5.00006 8.65511C6.47089 8.65511 7.84172 7.78844 8.79589 6.28844C9.17089 5.70094 9.17089 4.71344 8.79589 4.12594C7.84172 2.62594 6.47089 1.75928 5.00006 1.75928C3.52922 1.75928 2.15839 2.62594 1.20422 4.12594C0.829224 4.71344 0.829224 5.70094 1.20422 6.28844C2.15839 7.78844 3.52922 8.65511 5.00006 8.65511Z" stroke="#19191B" strokeWidth="1.02473" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</span>
							</Link>
							:
							<Fragment>
								{(downloading == true && Download_index == index) ?
									<div className='wkit-widget-download-activity'>
										<div className='plugin-download-icon'>
											<div className="wb-download-loader" style={{ display: 'flex' }} >
												<div className="wb-download-loader-circle"></div>
											</div>
										</div>
									</div>
									:
									<div className='wkit-widget-download-activity' onClick={(e) => { Download_widget(data, index), setdownloading(true) }}>
										<div className='plugin-download-icon'>
											<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 12" fill="none">
												<path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B" />
												<path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B" />
											</svg>
										</div>
									</div>
								}
							</Fragment>
						}
					</div>
					<CardRatings
						avg_rating={props?.widgetData?.avg_rating}
						total_rating={props?.widgetData?.total_rating}
					/>
					<div className="wkit-widget-info-content">
						<div className="wkit-widget-info-icons-content">
							<div className="wkit-widget-info-icons">
								<img src={img_path + "/assets/images/svg/eye.svg"} alt="wb-view-icon" />
								<label>{props?.widgetData?.views ? props.widgetData.views : 0}</label>
							</div>
							<hr className="wkit-icon-divider-hr" />
							<div className="wkit-widget-info-icons">
								<img src={img_path + "/assets/images/svg/download-template.svg"} alt="wb-view-icon" />
								<label>{props?.widgetData?.download ? props.widgetData.download : 0}</label>
							</div>
						</div>
						<div className="wkit-widget-builder-icon">
							<img src={widget_builder(data)} draggable={false} />
							<span className="wkit-widget-builder-tooltip">{!widget_builder_tooltip(data) ? __('') : __(widget_builder_tooltip(data))}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Page_header = (props) => {
	return (
		<div className='wkit-upload-heading'>
			<div className='wkit-share-icon-heading'>
				{props.svg}
				{props.loader ?
					<span className='wkit-upload-heading-skeleton'></span>
					:
					<span className='wkit-share-heading'>{props.title}</span>
				}
			</div>
			{props.loader ?
				<span className='wkit-upload-heading-skeleton'></span>
				:
				props.custom_dropdown && props.custom_dropdown()
			}
		</div>
	);
}

export const PopupContent = (props) => {

	const [Open, setOpen] = useState(false);

	useEffect(() => {

		if (props.OpenPopup) {
			setOpen(true);
		} else {
			setOpen(false);
		}
	}, [props.OpenPopup])


	if (Open) {
		return (
			<div className='wkit-plugin-popup-main-content'>
				<div className='wkit-plugin-popup-outer' onClick={() => { setOpen(false), props.closePopup() }}></div>
				<div className='wkit-plugin-popup-content'>
					<div className='wkit-plugin-popup-header'>
						<span>{props.heading}</span>
						<a className="wkit-plugin-popup-close" onClick={() => { setOpen(false), props.closePopup() }}>
							<svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
						</a>
					</div>
					<div className='wkit-plugin-popup-body'>
						{props.body()}
					</div>
				</div>
			</div>
		);
	}
}