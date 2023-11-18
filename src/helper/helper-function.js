const {
	__,
} = wp.i18n;
const { Fragment } = wp.element;
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import Elementor_file_create from '../widget-builder/file-creation/elementor_file';
import CreatFile from '../widget-builder/file-creation/gutenberg_file';

const GetCount = (count) => {
	let counts = Number(count);
	let array = []
	for (let x = 0; x < counts; x++) {
		array.push(x);
	}

	return array;
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

export const Wkit_add = () => {
	document.querySelector('.wkit-model-transp').classList.add('wkit-popup-show');
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
 * @version 1.0.0
 */
export const wdKit_Form_data = async (options) => {
	let form = new FormData;
	if (form && options) {
		form.append('action', 'get_wdesignkit');
		form.append('kit_nonce', wdkitData.kit_nonce);
		form.append('w_image', options.w_image);
		Object.entries(options).map(([key, val]) => (
			form.append(key, val)
		));
	}

	var response = wdKit_fetch_api(form)
	return response;
}

export const Get_user_info_data = async () => {
	let loginData = get_user_login()
	let userEmail = ''
	let builder = window.wdkit_editor == 'wdkit' ? '' : window.wdkit_editor;
	if (loginData && loginData.user_email) {
		userEmail = loginData.user_email
	}
	/**Token is Invalid */
	let form_arr = { 'type': 'get_user_info', 'email': userEmail, 'builder': builder }
	let UserData = await wdKit_Form_data(form_arr);
	if (!UserData?.data?.success) {
		wkit_logout();
	}
	window.userData = await wdKit_Form_data(form_arr);
	if (window.userData?.data?.status) {
		wkit_logout();
	}

	return window.userData
}

export const Show_toast = (msg = 'Toast Message', type = 'success') => {
	let get_msg = document.querySelector('.wkit-toast-content')
	let get_msg_text = document.querySelector('.wkit-toast-text')

	get_msg.classList.add('wkit-show-toast')
	get_msg_text.textContent = msg;
	get_msg_text.classList.add(`wkit-${type}-toast`)

	setTimeout(async () => {
		await get_msg.classList.remove('wkit-show-toast')
	}, 3000);
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
			}, 3000);

			document.querySelector('.wkit-toast-content').classList.add('wkit-show-toast')
		}
	})

	let get_msg = document.querySelector('.wkit-toast-content')

	const close_toast = async () => {
		if (get_msg) {
			get_msg.classList.remove('wkit-show-toast')
		}

		await setTimeout(() => {
			props.wdkit_set_toast('')
		}, 500);
	}

	if (props.ToastData.title) {
		return (
			<div className='wkit-toast-content'>
				<div className='wkit-toast-msg-content'>
					<span className={`wkit-toast-text wkit-${props.ToastData.type}-msg`}>{props.ToastData.title}</span>
					<p>{props.ToastData.subTitle}</p>
				</div>
				<label className="wkit-toast-close" onClick={() => { close_toast() }}>&times;</label>
			</div>
		);
	}
}

export const set_user_login = (loginDetails) => {
	if (loginDetails) {
		// sessionStorage.setItem('wdkit-login', JSON.stringify(loginDetails))
		localStorage.setItem('wdkit-login', JSON.stringify(loginDetails))
	}
}

export const get_user_login = () => {
	return JSON.parse(localStorage.getItem('wdkit-login'))
}

export const wkit_logout = async (navigation) => {
	let loginData = get_user_login()
	if (loginData && loginData.user_email) {
		if (loginData.login_type == 'api') {
			localStorage.removeItem('wdkit-login')
		} else {
			let form_arr = { 'type': 'wkit_logout', 'email': loginData.user_email }
			let res = await wdKit_Form_data(form_arr);

			window.userData = ''
			localStorage.removeItem('wdkit-login')
		}

		window.location.hash = '/login'
	}
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
			<svg width="15" height="15" xmlns="http://www.w3.org/2000/svg" style={{ background: '0 0', display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg>
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
					<span>&times;</span>
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

///////////////////////////////////////////s;kgd sdfpos g;fodpm sdlmbv juodsfl bldsfj///////////////////////////////////
export const DeletePopup = (props) => {
	return (
		<div className='wkit-model-transp wkit-popup-show'>
			<div className='wkit-plugin-model-content'>
				<a className={"wkit-plugin-popup-close"} onClick={(e) => { props.setdeleteWsID(-1); }}>
					<span>&times;</span>
				</a>
				<div className="popup-missing">
					<div className="popup-header">{__('Please Confirm')}</div>
					<div className="popup-body">
						<div className="wkit-popup-content-title">
							Are you sure want to permanently delete
						</div>
						<div className="wkit-popup-buttons">
							<button className="wkit-popup-confirm" onClick={() => { props.setdeleteWsID(-1) }}>
								No
							</button>
							<button className="wkit-popup-cancel" onClick={() => props.removeFunction()}>
								{props.isLoading ?
									<WkitLoader />
									:
									<span>Yes</span>
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

	const [dataFavorite, setFavorite] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isCopyWs, setIsCopyWs] = useState(false);
	const [isAction, setAction] = useState(false);
	const [deleteTempId, setDeleteTempId] = useState(-1);
	const [clickType, setClickType] = useState('');

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

	const Download_template = (id) => {
		if (template.is_activated == 'active') {
			props.handlerTempID(id)
		} else {
			props.wdkit_set_toast('Template Deactivate', 'This Template is Deactivated', '', 'danger');
		}
	}

	return (
		<div className={"wdesign-template-boxed"}>
			{template.is_activated != 'active' &&
				<Fragment>
					<div className='wdkit-inner-boxed-deActivate'>
						<div className='wdkit-inner-boxed-deActivate-h1'>Credit Limit Reached!</div>
						<div className='wdkit-inner-boxed-deActivate-p'>This Template got disabled until you have more credits to make it active.</div>
						<a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
							<button>Buy Credits</button>
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
								{props.data.type == 'section' ? __('Section') : (props.data.type == 'pagetemplate' ? __('Page') : __('Website Kit'))}
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
							<span>Pro</span>
						</div>
					}
					<div className={"wdkit-temp-feature-img"}>
						<label htmlFor={"template_" + template.id}>
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
								<img src={(template.post_image && template.post_image.indexOf("wdesignkit") > -1) ?
									template.post_image : img_path + 'assets/images/placeholder.jpg'} alt={"featured-img"} />
							</picture>
							<input
								type="checkbox"
								id={"template_" + template.id}
								name={"selectTemplate"}
								value={template.id}
								checked={Check_selected_temp(template)}
								onChange={(e) => { handleTempChecked(e) }}
								style={{ display: 'none' }}
							/>
							{Check_selected_temp(template) &&
								<div className='wkit-check-mark'>
									<div className='wkit-checkmark-icon'></div>
								</div>
							}
						</label>
					</div>
				</div>
				<div className={"boxed-bottom"}>
					<div className={"template-wrap-title"}>
						{props.data.title &&
							<a href={`${wdkitData.wdkit_server_url}${GetSinglePageSlug(props.data)}/${props.data.title}/${props.data.id}`} target="_blank" rel="noopener noreferrer">
								<div className={"temp-title"}>{props.data.title}</div>
							</a>
						}
						<div className='wkit-download-eye-wrapperd'>
							{props && props.type == "websitekit-view" &&
								// <Link to={`/${GetFirstpathName()}/kit/${template.id}?page=${props.currentPage}${props.wsID && `&wsID=${props.wsID}`}`} className={"wdkit-download-temp"}>
								<Link to={`/${GetFirstpathName()}/kit/${template.id}?page=${props.currentPage}${props.wsID ? `&wsID=${props.wsID}` : ''}`} className={"wdkit-download-temp"}>
									<img className={"wkit-download-template"} src={img_path + "assets/images/svg/view-kit.svg"} alt="view-kit" />
								</Link>
							}
							{props && props.type !== "websitekit" && props.type !== "websitekit-view" &&
								<div onClick={() => { Download_template(template.id) }} className={"wdkit-download-temp"}>
									<img className={"wkit-download-template"} src={img_path + "assets/images/svg/popup-download.svg"} alt="download-svg" />
								</div>
							}
							{(!props.filter || (props.filter && props.filter != 'browse')) && !(window.location.hash.search('#/share_with_me') > -1) && !(window.location.hash.search('#/browse/kit') > -1) && props?.role != 'subscriber' &&
								<div className='w-designkit-hover-select' data-id={props.data.id}>
									<img className={"wkit-select-img"} onClick={(e) => { setopenDropDown(!openDropDown) }} src={img_path + "assets/images/svg/select.svg"} alt={"extra-opt-img"} />
									<div style={{ display: openDropDown == false ? 'none' : "block" }} className={"wkit-dropdown-content"}>
										<div className={"wkit-select-menu-wrapper"}>
											{location?.pathname == '/my_uploaded' &&
												<Fragment>
													{!dataFavorite ?
														<button className={"wkit-design-item"} onClick={() => manageFavorite(template.id)}>
															{!isLoading ?
																<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M12.2876 2.49318C10.6376 1.36818 8.60013 1.89318 7.50013 3.18068C6.40013 1.89318 4.36263 1.36193 2.71263 2.49318C1.83763 3.09318 1.28763 4.10568 1.25013 5.17443C1.16263 7.59943 3.31263 9.54318 6.59388 12.5244L6.65638 12.5807C7.13138 13.0119 7.86263 13.0119 8.33763 12.5744L8.40638 12.5119C11.6876 9.53693 13.8314 7.59318 13.7501 5.16818C13.7126 4.10568 13.1626 3.09318 12.2876 2.49318V2.49318ZM7.56263 11.5932L7.50013 11.6557L7.43763 11.5932C4.46263 8.89943 2.50013 7.11818 2.50013 5.31193C2.50013 4.06193 3.43763 3.12443 4.68763 3.12443C5.65013 3.12443 6.58763 3.74318 6.91888 4.59943H8.08763C8.41263 3.74318 9.35013 3.12443 10.3126 3.12443C11.5626 3.12443 12.5001 4.06193 12.5001 5.31193C12.5001 7.11818 10.5376 8.89943 7.56263 11.5932Z" fill="#19191B" />
																</svg>
																:
																<svg width="20" xmlns="http://www.w3.org/2000/svg" style={{ background: '0 0', display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
																	<circle cx="50" cy="50" fill="none" stroke="#000" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
																		<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
																	</circle>
																</svg>
															}{__('Add Favorite')}
														</button>
														:
														<button className={"wkit-design-item"} onClick={() => manageFavorite(template.id)}>
															{!isLoading ?
																<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
																	<path d="M12.2876 2.49318C10.6376 1.36818 8.60013 1.89318 7.50013 3.18068C6.40013 1.89318 4.36263 1.36193 2.71263 2.49318C1.83763 3.09318 1.28763 4.10568 1.25013 5.17443C1.16263 7.59943 3.31263 9.54318 6.59388 12.5244L6.65638 12.5807C7.13138 13.0119 7.86263 13.0119 8.33763 12.5744L8.40638 12.5119C11.6876 9.53693 13.8314 7.59318 13.7501 5.16818C13.7126 4.10568 13.1626 3.09318 12.2876 2.49318Z" fill="#19191B" />
																</svg>
																:
																<svg width="20" xmlns="http://www.w3.org/2000/svg" style={{ background: '0 0', display: 'block', shapeRendering: 'auto' }} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
																	<circle cx="50" cy="50" fill="none" stroke="#000" strokeWidth="6" r="44" strokeDasharray="207.34511513692632 71.11503837897544">
																		<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" />
																	</circle>
																</svg>
															}{__('Remove Favorite')}
														</button>
													}
												</Fragment>
											}
											{(!props.wsRoles || props.wsRoles != 'subscriber') &&
												<Fragment>
													{props?.data?.user_id == props?.userinfo?.id &&
														<a href={`${wdkitData.wdkit_server_url}admin/packs/view/${props.data.id}`} target="_blank" rel="noopener noreferrer">
															<button className={"wkit-design-item"}>
																<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																	<path d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z" />
																	<path d="M8.7875 5.6375L9.3625 6.2125L3.7 11.875H3.125V11.3L8.7875 5.6375V5.6375ZM11.0375 1.875C10.8812 1.875 10.7187 1.9375 10.6 2.05625L9.45625 3.2L11.8 5.54375L12.9437 4.4C13.1875 4.15625 13.1875 3.7625 12.9437 3.51875L11.4813 2.05625C11.3563 1.93125 11.2 1.875 11.0375 1.875V1.875ZM8.7875 3.86875L1.875 10.7812V13.125H4.21875L11.1312 6.2125L8.7875 3.86875V3.86875Z" fill="#19191B" />
																</svg>
																{__('Edit')}
															</button>
														</a>
													}
													<button className={"wkit-design-item"} onClick={() => { setIsCopyWs(template.id), (props.wsRoles ? setAction('copy') : setAction('t-copy')) }}>
														<svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
															<path d="M8.375 0.625H1.5C0.8125 0.625 0.25 1.1875 0.25 1.875V10C0.25 10.3438 0.53125 10.625 0.875 10.625C1.21875 10.625 1.5 10.3438 1.5 10V2.5C1.5 2.15625 1.78125 1.875 2.125 1.875H8.375C8.71875 1.875 9 1.59375 9 1.25C9 0.90625 8.71875 0.625 8.375 0.625ZM10.875 3.125H4C3.3125 3.125 2.75 3.6875 2.75 4.375V13.125C2.75 13.8125 3.3125 14.375 4 14.375H10.875C11.5625 14.375 12.125 13.8125 12.125 13.125V4.375C12.125 3.6875 11.5625 3.125 10.875 3.125ZM10.25 13.125H4.625C4.28125 13.125 4 12.8438 4 12.5V5C4 4.65625 4.28125 4.375 4.625 4.375H10.25C10.5938 4.375 10.875 4.65625 10.875 5V12.5C10.875 12.8438 10.5938 13.125 10.25 13.125Z" fill="#19191B" />
														</svg>
														{__('Copy to Workspace')}
													</button>
													{!(window.location.hash.search('/kit/') > -1) && !(window.location.hash.search('#/manage_workspace') > -1) &&
														< button className={"wkit-design-item"} onClick={() => { setDeleteTempId(template.id), setClickType('delete') }}>
															<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path d="M10 5.625V11.875H5V5.625H10ZM9.0625 1.875H5.9375L5.3125 2.5H3.125V3.75H11.875V2.5H9.6875L9.0625 1.875ZM11.25 4.375H3.75V11.875C3.75 12.5625 4.3125 13.125 5 13.125H10C10.6875 13.125 11.25 12.5625 11.25 11.875V4.375Z" fill="#19191B" />
															</svg>
															{__('Delete')}
														</button>
													}
													{(props.wsRoles == 'admin' || props.wsRoles == 'editor') &&
														<Fragment>
															<button className={"wkit-design-item"} onClick={() => { setIsCopyWs(template.id), (props.wsRoles && setAction('move')) }}>
																<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
																	<path d="M11.8375 2.26875L10.9688 1.21875C10.8 1.00625 10.5437 0.875 10.25 0.875H2.75C2.45625 0.875 2.2 1.00625 2.025 1.21875L1.1625 2.26875C0.98125 2.48125 0.875 2.7625 0.875 3.0625V10.875C0.875 11.5625 1.4375 12.125 2.125 12.125H10.875C11.5625 12.125 12.125 11.5625 12.125 10.875V3.0625C12.125 2.7625 12.0188 2.48125 11.8375 2.26875ZM2.9 2.125H10.1L10.6187 2.75H2.3875L2.9 2.125ZM2.125 10.875V4H10.875V10.875H2.125ZM4 7.75H5.59375V9.625H7.40625V7.75H9L6.5 5.25L4 7.75Z" fill="#19191B" />
																</svg>
																{__('Move to Workspace')}
															</button>
															<button className={"wkit-design-item"} onClick={() => { setDeleteTempId(template.id), setClickType('remove') }}>
																<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 9 13" fill="none">
																	<path d="M7 4.625V10.875H2V4.625H7ZM6.0625 0.875H2.9375L2.3125 1.5H0.125V2.75H8.875V1.5H6.6875L6.0625 0.875ZM8.25 3.375H0.75V10.875C0.75 11.5625 1.3125 12.125 2 12.125H7C7.6875 12.125 8.25 11.5625 8.25 10.875V3.375Z" fill="#19191B" />
																</svg>
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
							<a><img src={img_path + "assets/images/svg/download-template.svg"} alt={__("post download")} />{props.data.post_download}</a>
							{/* <a><img src={img_path + "assets/images/svg/heart.svg"} alt={__("post like")} />{props.data.post_like}</a> */}
						</div>
						<div className='kit-pin-icon'>
							{props.data.post_builder && builder_icon &&
								<div className="elementor-right-part kit-pin-icon">
									<img src={builder_icon} alt={__("builder icon")} />
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
		// Show_toast(result.data.message, 'success')

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
		// Show_toast('Operation fail', 'danger')
		return result;
	}
}

export const Kits_loop = (props) => {
	var img_path = wdkitData.WDKIT_URL;
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

export const Wkit_popup_search = () => {
	var img_path = wdkitData.WDKIT_URL;
	return (
		<div className="wkit_search_btn_main">
			<div className="search_wrapper">
				<input type="search" className="wkit_search_input" placeholder="Type to Search" />
				<button type="submit" className="wkit_search_button"> <img src={img_path + "assets/images/svg/east.svg"} alt="dashborad img" className="open-icon-drop" /></button>
			</div>
			<div className="wkit-free-pro-wrapper">
				<button type="submit" className="wkit-btn-pro">{__('All')}</button>
				<button type="submit" className="wkit-btn-pro">{__('Free')}</button>
				<button type="submit" className="wkit-btn-pro">{__('Pro')}</button>
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

export const Wkit_user_details = (props) => {

	var img_path = wdkitData.WDKIT_URL;
	const navigation = useNavigate();

	let loginCheck = get_user_login()
	let location = useLocation();

	const wkit_logout_User = async () => {
		let obj = {
			"Setting": props?.wdkit_meta?.Setting,
			"builder": props?.wdkit_meta?.builder,
			"category": props?.wdkit_meta?.category,
			"plugin": props?.wdkit_meta?.plugin,
			"tags": props?.wdkit_meta?.tags,
			"widgetbuilder": props?.wdkit_meta?.widgetbuilder,
		}
		await props.wdkit_set_meta(obj);

		await wkit_logout(navigation);
		props.wdkit_set_toast(['Logged out successfully!', "You're logged out! Remember your login details and sign in again.", '', 'success']);
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

	let login_array = location.pathname.split('/');
	return (
		<Fragment>
			{!login_array.includes('login') && !login_array.includes('login-api') && !login_array.includes('builder') &&
				<div className="wkit-user-details-wrapper">
					{(login_array.includes('browse') || login_array.includes('widget-browse')) &&
						<div className='wkit-filter-humber-menu'>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M0.75 4.2308H12.169C12.5131 5.79731 13.9121 6.97336 15.5805 6.97336C17.2488 6.97336 18.6478 5.79736 18.9919 4.2308H23.25C23.6642 4.2308 24 3.89498 24 3.4808C24 3.06661 23.6642 2.7308 23.25 2.7308H18.9915C18.6467 1.16508 17.2459 -0.0117188 15.5805 -0.0117188C13.9141 -0.0117188 12.5139 1.16489 12.1693 2.7308H0.75C0.335812 2.7308 0 3.06661 0 3.4808C0 3.89498 0.335812 4.2308 0.75 4.2308ZM13.588 3.48277C13.588 3.48009 13.588 3.47738 13.588 3.4747C13.5913 2.37937 14.4851 1.48833 15.5805 1.48833C16.6743 1.48833 17.5681 2.37816 17.5728 3.47297L17.573 3.48398C17.5712 4.58119 16.6781 5.47341 15.5805 5.47341C14.4833 5.47341 13.5904 4.58208 13.5879 3.48553L13.588 3.48277ZM23.25 19.769H18.9915C18.6467 18.2033 17.2459 17.0265 15.5805 17.0265C13.9141 17.0265 12.5139 18.2031 12.1693 19.769H0.75C0.335812 19.769 0 20.1047 0 20.519C0 20.9332 0.335812 21.269 0.75 21.269H12.169C12.5131 22.8355 13.9121 24.0115 15.5805 24.0115C17.2488 24.0115 18.6478 22.8355 18.9919 21.269H23.25C23.6642 21.269 24 20.9332 24 20.519C24 20.1047 23.6642 19.769 23.25 19.769ZM15.5805 22.5115C14.4833 22.5115 13.5904 21.6202 13.5879 20.5237L13.588 20.5209C13.588 20.5182 13.588 20.5155 13.588 20.5129C13.5913 19.4175 14.4851 18.5265 15.5805 18.5265C16.6743 18.5265 17.5681 19.4163 17.5728 20.511L17.573 20.5221C17.5714 21.6194 16.6782 22.5115 15.5805 22.5115ZM23.25 11.2499H11.831C11.4869 9.68339 10.0879 8.50739 8.41955 8.50739C6.75117 8.50739 5.35223 9.68339 5.00808 11.2499H0.75C0.335812 11.2499 0 11.5857 0 11.9999C0 12.4141 0.335812 12.7499 0.75 12.7499H5.00845C5.35331 14.3156 6.75413 15.4924 8.41955 15.4924C10.0859 15.4924 11.4861 14.3158 11.8307 12.7499H23.25C23.6642 12.7499 24 12.4141 24 11.9999C24 11.5857 23.6642 11.2499 23.25 11.2499ZM10.412 11.9979C10.412 12.0007 10.412 12.0033 10.412 12.006C10.4087 13.1013 9.51492 13.9924 8.41955 13.9924C7.32572 13.9924 6.43191 13.1025 6.42717 12.0078L6.42703 11.9968C6.42867 10.8995 7.32188 10.0074 8.41955 10.0074C9.5167 10.0074 10.4096 10.8987 10.4121 11.9953L10.412 11.9979Z" fill="black" />
							</svg>

						</div>
					}
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
									<div className='wdkit-login-signUp-btn'>
										<Link to={'/login'} >
											<button> Login / SignUp </button>
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
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="15">
														<path d="M272 304h-96C78.8 304 0 382.8 0 480c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32C448 382.8 369.2 304 272 304zM48.99 464C56.89 400.9 110.8 352 176 352h96c65.16 0 119.1 48.95 127 112H48.99zM224 256c70.69 0 128-57.31 128-128c0-70.69-57.31-128-128-128S96 57.31 96 128C96 198.7 153.3 256 224 256zM224 48c44.11 0 80 35.89 80 80c0 44.11-35.89 80-80 80S144 172.1 144 128C144 83.89 179.9 48 224 48z" />
													</svg>
													{__('Profile')}
												</a>
											</li>
											<li>
												<a style={{ cursor: 'pointer' }} onClick={(e) => { wkit_logout_User(navigation) }}>
													<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15">
														<path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22v72H192c-17.7 0-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32H320v72c0 9.6 5.7 18.2 14.5 22s19 2 26-4.6l144-136z" />
													</svg>{__('Logout')}
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

	/**Check User Login Or Not*/
	if (props.pageNow && props.pageNow == 'browse') {
		const history = props.navigation;
		let loginData = get_user_login(),
			checkLogin = '';

		if (loginData && loginData.user_email) {
			checkLogin = loginData.user_email
		} else {
			history('/login')
			return;
		}
	}

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
	const [installPlugin, setInstallPlugin] = useState('');
	const [loadingInstall, setLoadingInstall] = useState(false);
	const [installCompleted, setInstallCompleted] = useState([]);
	const [customMetData, setCustomMetData] = useState('yes');
	const [toggle, setToggle] = useState(false);
	const [nextBtn, setnextBtn] = useState('false');

	useEffect(() => {
		// setPlugin(props.pluginData)
		checkPlugin()
	}, [props.template_id]);

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
		if ((loadingInstall && !status) || (installPlugin && installPlugin == p_id)) {
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
			} else if (status == 'inactive') {
				return (
					<a className="" onClick={() => { installPluginData('single', data) }}>
						<img className={"wkit-download-template"} src={img_path + "assets/images/svg/popup-download.svg"} alt="popup-logo-img" />
					</a>
				);
			} else if (status == 'warning') {
				return (<div className="wkit-icon-white-bg">
					<span className="wkit-tooltip">{__('Something won\'t wrong')} <a href="#" style={{ color: "white", textDecoration: "underline" }}>{__('Try Again')}</a></span>
					<a>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 15C4.14062 15 1 11.8594 1 8C1 4.14062 4.14062 1 8 1C11.8594 1 15 4.14062 15 8C15 11.8594 11.8594 15 8 15ZM8 5.75C8.41406 5.75 8.75 5.41437 8.75 5C8.75 4.58594 8.41406 4.25 8 4.25C7.58594 4.25 7.25 4.58437 7.25 5C7.25 5.41563 7.58437 5.75 8 5.75ZM9.5 11H8.5V7.5C8.5 7.225 8.275 7 8 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.5V11H6.5C6.225 11 6 11.225 6 11.5C6 11.775 6.225 12 6.5 12H9.5C9.77612 12 10 11.7761 10 11.5C10 11.225 9.775 11 9.5 11Z" className="wkit-icon-white" />
						</svg>
					</a>
				</div>)
			} else if (status == 'manually') {
				return (
					<div className="wkit-icon-orange-bg">
						<span className="wkit-tooltip wkit-pro-manually">{__('Install Manually.')}
							<a href="#" style={{ color: "white", textDecoration: "underline" }}>{__('Learn How?')}</a>
						</span>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
			for (let plugin of dataPlugin) {
				let manual_plugin = Object.values(document.querySelectorAll('.wkit-pro-manually'))
				manual_plugin.length > 0 && manual_plugin.map((data) => {
					if (data.style.display == 'none' || data.style.display == '') {
						data.style.display = 'flex';

						setTimeout(() => {
							data.style.display = 'none';
						}, 2000);
					}
				})

				if (plugin.status != 'active' && plugin.status != 'manually') {
					await setInstallPlugin(plugin.p_id)
					await setLoadingInstall(true)
				}

				await Install_plugin(plugin, 2)
				await setInstallPlugin('')
				await setLoadingInstall(false)
			}
		} else if (type == 'single') {
			await setInstallPlugin(data?.p_id)
			await setLoadingInstall(true)
			await Install_plugin(data, 2)
			await setInstallPlugin('')
			await setLoadingInstall(false)
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
				}
			}
		}
	}

	const SuccessImportTemplate = (checkPlugin) => {
		// if ((checkPlugin && allEqual(installCompleted)) || (!checkPlugin)) {

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
					props.template_id.pages[index][key] = value
					props.template_id.pages[index].wp_post_type = value
					props.template_id.pages[index].change = true;
				}
			})
		}
		if (sectionPage == 'sections' && id) {
			props.template_id.sections.map((val, index) => {
				if (val.id === id) {
					props.template_id.sections[index][key] = value
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

				return (
					<Fragment key={key_index}>
						<li className="kit-page-list">
							{GetPostType(data, val)}

							<div className='section-page-post-type'>
								{/* {(val.change === undefined || val.change == false) &&
									Set_DDChangeTxt(val, 'pages')
								} */}
								{/* {val.change && val.change == true && */}
								{Set_PostTypeDD(data, val, 'pages')}
								{/* } */}
							</div>
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

				return (
					<Fragment key={index_key}>
						<li className="kit-section-list">
							{GetPostType(data, val)}

							<div className='section-page-post-type'>
								{/* {(val.change === undefined || val.change == false) &&
									Set_DDChangeTxt(val, 'sections')
								} */}

								{/* {val.change && val.change == true && */}
								{Set_PostTypeDD(data, val, 'sections')}
								{/* } */}
							</div>
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
				value={val?.wp_post_type ? val?.wp_post_type : val?.type}
				onChange={(ev) => {
					updateSelectValue(type, 'type', ev.target.value, val.id);
					setToggle(!toggle)
				}}>

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
			InstallPlugin = <div className="wkit-pluginMissing-text">
				{__('To download this template you need to install below listed plugin')}
			</div>
		}

		var GetList = [];
		if (dataPlugin.length > 0 && props.pluginData) {
			GetList = Object.values(dataPlugin).map((pluginData, index) => {
				return (
					<Fragment key={index}>
						<div className="wkit-plugin-list-item">
							<div className="wkit-plugin-img-title-wrapper">
								<div className="wkit-plugin-image">
									<img src={pluginData.plugin_icon} alt={"plugin-icon"} />
								</div>
								<div className={"wkit-plugin-name"}>{pluginData.plugin_name}</div>
							</div>
							{plugin_status(pluginData.status || '', pluginData.p_id, pluginData)}
						</div>
					</Fragment>
				)
			})
		} else {
			GetList = <div className={'wkit-no-install-plugin'}>
				<img src={img_path + "assets/images/svg/no-plugin.svg"} className='no-plugin-img' alt={'no-plugin'} />
				<h6 className='no-plugin-title'>{__('No need to install any Plugin.')}</h6>
				<p className='no-plugin-desc'>{__('You have selected design which doesn\'t need any plugin to install. Press Next.')}</p>
			</div>
		}

		var MetaFiled = [];
		if (props.type == 'kit_page' || props.type == 'wdkit') {
			MetaFiled = <div className="wkit-checkbox-wrap">
				<input type="checkbox" id={"wkit_custom_metadata"} name={"wkit_custom_metadata"} className='wkit-checkbox-input' value={'yes'} checked={(customMetData == 'yes') ? 'checked' : ''} onChange={(event) => setCustomMetData((event.target.checked ? 'yes' : ''))} />
				<label htmlFor={"wkit_custom_metadata"}>
					<span className="wkit-checkbox-label">{__('Import Theme Builder Settings?')}</span>
				</label>
				<span className="wkit-tooltip-pin-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20"><path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" /></svg><span className="kit-hint-tooltip">{__('If you accept this, Your Nexter Builder/Elementor Theme Builder Settings will be added. Make sure to test after this import with settings to avoid any conflict with existing setting of site.')}</span></span>
			</div>
		}

		var button = "";
		if (isLoading != true) {
			if (nextBtn == 'false' && dataPlugin.length > 0) {
				button = <Fragment>
					<button className="wkit-download-select" onClick={(e) => nextSteps()}>
						<span>{__('Continue Anyway')}</span>
						<div className='wkit-continue-toot-tip'>
							<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58125 0 0 3.58125 0 8C0 12.4187 3.58125 16 8 16C12.4187 16 16 12.4187 16 8C16 3.58125 12.4187 0 8 0ZM8 15C4.14062 15 1 11.8594 1 8C1 4.14062 4.14062 1 8 1C11.8594 1 15 4.14062 15 8C15 11.8594 11.8594 15 8 15ZM8 5.75C8.41406 5.75 8.75 5.41437 8.75 5C8.75 4.58594 8.41406 4.25 8 4.25C7.58594 4.25 7.25 4.58437 7.25 5C7.25 5.41563 7.58437 5.75 8 5.75ZM9.5 11H8.5V7.5C8.5 7.225 8.275 7 8 7H7C6.725 7 6.5 7.225 6.5 7.5C6.5 7.775 6.725 8 7 8H7.5V11H6.5C6.225 11 6 11.225 6 11.5C6 11.775 6.225 12 6.5 12H9.5C9.77612 12 10 11.7761 10 11.5C10 11.225 9.775 11 9.5 11Z" className="wkit-info-svg" /></svg>
							<span className='wkit-continue-toot-tip-text'>{__('It will skip plugin installation and your imported page might not look as expected')}</span>
						</div>
					</button>
					<button key={Math.random().toString()}
						className={"wkit-download-all"}
						disabled={loadingInstall ? true : false}
						onClick={() => installPluginData('all')}>
						{!loadingInstall ? __('Install All') : __('Installing')}
					</button>
				</Fragment>
			} else {
				button = <button className={"wkit-next-step"} onClick={(e) => { nextSteps() }}>{__('Next')}</button>
			}
		}

		return <div className="popup-body">
			{InstallPlugin}

			<div className={(dataPlugin.length > 0 && props.pluginData) ? 'plugin-wrapper' : 'plugin-wrapper no-plugin'}>{GetList}</div>

			{MetaFiled}
			<div className={"wkit-button-popup"}>{button}</div>
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

	return (
		<div className="popup-missing">
			{stepsPlugin == 'step-1' &&
				<Fragment>
					<div className="popup-header">{__('Plugin Missing')}</div>

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
							<button className={'wkit-next-step'} onClick={(e) => { nextSteps() }}>{__('Import')}</button>
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
		}

		if ((props.template_id.pages && props.template_id.pages.length != 0) || (props.template_id.sections && props.template_id.sections.length != 0)) {
			setIsLoading(true);

			if (props.template_id.pages.length != 0) {
				let form_arr = {
					'type': 'import_multi_template',
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
			let form_arr = { 'type': 'import_template', 'email': userEmail, 'template_id': props.template_id, 'editor': wdkitData.use_editor, 'custom_meta': props.custom_meta_import || false }
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

	return (
		<Fragment>
			{isLoading ?
				<div className={'import-data-loading'}>
					{loadingIcon()}
				</div>
				:
				<div className="success-body">
					<div className={"success-icon-temp"}>
						{successmsg ?
							<img src={img_path + "assets/images/jpg/successfully.png"} alt="success-icon" />
							:
							<img src={img_path + "assets/images/jpg/error.png"} alt="success-icon" />
						}
					</div>
					{successmsg ?
						<div className="">
							<div className="wkit-success-heading">{errormsg.message}</div>
							<div className="wkit-desc">{errormsg.description}</div>
						</div>
						:
						<div className="">
							<div className="wkit-success-heading">{errormsg.message}</div>
							<div className="wkit-desc">{errormsg.description}</div>
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
		}

		if ((props.template_id.pages && props.template_id.pages.length != 0) || (props.template_id.sections && props.template_id.sections.length != 0)) {
			setIsLoading(true);

			if (props.template_id.pages.length != 0) {
				var pagestmp = props.template_id?.pages?.length > 0 && props.template_id.pages ? props.template_id.pages : [];

				pagestmp.forEach(async function (self, index) {
					let form_arr = {
						'type': 'import_kit_template',
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
			<div className="popup-header">{__('Import Templates')}</div>
			<div className="success-body">
				{(resSections.length + resPages.length) == totaltemplates ?
					<div className="wkit-import-kit-success-header">
						<div className='wkit-import-kit-success-title-content'>
							<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
								<path d="M37.8721 23.3124L37.8604 23.3181C36.4893 24.3696 35.9084 26.1589 36.3965 27.8147L36.4022 27.8263C37.1807 30.4581 35.252 33.1129 32.5098 33.1827H32.4982C30.767 33.2292 29.2449 34.3329 28.6697 35.9654V35.9712C27.7518 38.5622 24.6264 39.5788 22.3664 38.016C20.9632 37.0578 19.1081 37.0078 17.6317 38.016H17.6259C15.3661 39.573 12.2405 38.5621 11.3284 35.9653C10.7481 34.3288 9.22824 33.229 7.49996 33.1826H7.48832C4.74629 33.1128 2.81746 30.458 3.59598 27.8263L3.60176 27.8146C4.08965 26.1588 3.50871 24.3695 2.13777 23.3181L2.12613 23.3123C-0.052461 21.6391 -0.052461 18.3626 2.12613 16.6895L2.13777 16.6837C3.50871 15.6322 4.08965 13.8428 3.59598 12.1871V12.1755C2.8116 9.54385 4.74621 6.88885 7.48832 6.81916H7.49996C9.22535 6.77267 10.7532 5.66885 11.3284 4.03642V4.03064C12.2404 1.43963 15.3661 0.422987 17.6259 1.9858H17.6317C19.055 2.9676 20.9372 2.9676 22.3664 1.9858C24.6491 0.409471 27.7572 1.45517 28.6697 4.03064V4.03642C29.2449 5.66306 30.7669 6.77275 32.4982 6.81916H32.5098C35.2519 6.88885 37.1807 9.54385 36.4022 12.1755L36.3965 12.1871C35.9084 13.8428 36.4893 15.6322 37.8604 16.6837L37.8721 16.6895C40.0507 18.3626 40.0507 21.6392 37.8721 23.3124Z" fill="#3EB655" />
								<path d="M19.9994 30.821C25.976 30.821 30.821 25.976 30.821 19.9994C30.821 14.0227 25.976 9.17773 19.9994 9.17773C14.0227 9.17773 9.17773 14.0227 9.17773 19.9994C9.17773 25.976 14.0227 30.821 19.9994 30.821Z" fill="#8BD399" />
								<path opacity="0.1" d="M28.3088 13.0728C26.437 11.533 24.0423 10.6074 21.4316 10.6074C15.4551 10.6074 10.6074 15.4551 10.6074 21.4316C10.6074 24.0423 11.533 26.437 13.0727 28.3088C10.6945 26.325 9.17969 23.3409 9.17969 19.9998C9.17969 14.0231 14.0232 9.17969 19.9998 9.17969C23.3409 9.17969 26.325 10.6945 28.3088 13.0728Z" fill="black" />
								<path d="M17.4247 24.2359L15.0317 21.69C14.405 21.0231 14.4373 19.9746 15.104 19.3479C15.7706 18.7204 16.8196 18.7541 17.4458 19.4205L18.5881 20.6353L23.4438 15.0855C24.0457 14.3967 25.0926 14.3269 25.7819 14.9296C26.4706 15.5323 26.5401 16.5789 25.9377 17.2676L19.8787 24.1923C19.2333 24.9292 18.0941 24.9485 17.4247 24.2359Z" fill="white" />
							</svg>
							<div className="wkit-import-kit-success-title">{__(`${Number(TempSuccessCount + SectionSuccessCount) > 0 ? Number(TempSuccessCount + SectionSuccessCount) : 0}/${totaltemplates} Successfully Imported`)}</div>
						</div>
						<div className="wkit-import-kit-success-subTitle">{__('Yay! Your template has been successfully imported')}</div>
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
								<span className='wkit-success-template-count'>Pages : {TempSuccessCount}</span>
								{TempFailCount > 0 &&
									<div className='wkit-fail-template-count'>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
											<path d="M8.96322 4.14666L3.14104 14.2302C3.03587 14.4123 2.98049 14.6189 2.98047 14.8292C2.98045 15.0395 3.03579 15.2461 3.14092 15.4282C3.24606 15.6103 3.39729 15.7615 3.5794 15.8667C3.76151 15.9718 3.9681 16.0271 4.17838 16.0271H15.8218C16.0321 16.0271 16.2387 15.9718 16.4208 15.8667C16.6029 15.7615 16.7541 15.6103 16.8593 15.4282C16.9644 15.2461 17.0197 15.0395 17.0197 14.8292C17.0197 14.6189 16.9643 14.4123 16.8592 14.2302L11.0376 4.14666C10.9325 3.9646 10.7813 3.81341 10.5992 3.7083C10.4172 3.60319 10.2106 3.54785 10.0004 3.54785C9.79018 3.54785 9.58366 3.60319 9.40159 3.7083C9.21953 3.81341 9.06834 3.9646 8.96322 4.14666Z" fill="#EE404C" />
											<path d="M10.077 7.25684H9.92508C9.55116 7.25684 9.24805 7.55995 9.24805 7.93387V11.17C9.24805 11.5439 9.55116 11.847 9.92508 11.847H10.077C10.4509 11.847 10.754 11.5439 10.754 11.17V7.93387C10.754 7.55995 10.4509 7.25684 10.077 7.25684Z" fill="#FFF7ED" />
											<path d="M10.001 14.4132C10.4169 14.4132 10.754 14.076 10.754 13.6602C10.754 13.2443 10.4169 12.9072 10.001 12.9072C9.58516 12.9072 9.24805 13.2443 9.24805 13.6602C9.24805 14.076 9.58516 14.4132 10.001 14.4132Z" fill="#FFF7ED" />
										</svg>
										<span>{TempFailCount} Failures.</span>
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
								<span className='wkit-success-template-count'>Sections : {SectionSuccessCount}</span>
								{SectionFailCount > 0 &&
									<div className='wkit-fail-template-count'>
										<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
											<path d="M8.96322 4.14666L3.14104 14.2302C3.03587 14.4123 2.98049 14.6189 2.98047 14.8292C2.98045 15.0395 3.03579 15.2461 3.14092 15.4282C3.24606 15.6103 3.39729 15.7615 3.5794 15.8667C3.76151 15.9718 3.9681 16.0271 4.17838 16.0271H15.8218C16.0321 16.0271 16.2387 15.9718 16.4208 15.8667C16.6029 15.7615 16.7541 15.6103 16.8593 15.4282C16.9644 15.2461 17.0197 15.0395 17.0197 14.8292C17.0197 14.6189 16.9643 14.4123 16.8592 14.2302L11.0376 4.14666C10.9325 3.9646 10.7813 3.81341 10.5992 3.7083C10.4172 3.60319 10.2106 3.54785 10.0004 3.54785C9.79018 3.54785 9.58366 3.60319 9.40159 3.7083C9.21953 3.81341 9.06834 3.9646 8.96322 4.14666Z" fill="#EE404C" />
											<path d="M10.077 7.25684H9.92508C9.55116 7.25684 9.24805 7.55995 9.24805 7.93387V11.17C9.24805 11.5439 9.55116 11.847 9.92508 11.847H10.077C10.4509 11.847 10.754 11.5439 10.754 11.17V7.93387C10.754 7.55995 10.4509 7.25684 10.077 7.25684Z" fill="#FFF7ED" />
											<path d="M10.001 14.4132C10.4169 14.4132 10.754 14.076 10.754 13.6602C10.754 13.2443 10.4169 12.9072 10.001 12.9072C9.58516 12.9072 9.24805 13.2443 9.24805 13.6602C9.24805 14.076 9.58516 14.4132 10.001 14.4132Z" fill="#FFF7ED" />
										</svg>
										<span>{SectionFailCount} Failures.</span>
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
	var img_path = wdkitData.WDKIT_URL;
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
				setSuccessMsg(true)
				setSaving(false)
				props.Toast("Workspace is added", 'Workspace add successfully', 'success')

				const timeId = setTimeout(() => {
					setSuccessMsg(false)
					Popup_Close()
				}, 1000)

				props.UpdateUserData(userData);

				return () => {
					clearTimeout(timeId)
				}
			} else {
				props.Toast("workspace not added", 'workspace can not be add! check your limit', 'danger')
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

	return (
		<div className={"wkit-model-transp wkit-popup-show"} >
			<div className={"wkit-plugin-model-content"}>
				<a className={"wkit-plugin-popup-close"} onClick={(e) => { Popup_Close() }}><span>&times;</span></a>
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
							onChange={(ev) => setWsName(ev.target.value)}
						/>
						{!isSaving ?
							<button className={"wkit-add-workspace-btn"} onClick={() => saveData()}>{__('Next')}</button>
							:
							<button className={"wkit-add-workspace-btn"}>{WkitLoader()}</button>
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
	var link = props?.page && props?.page == 'widget' ? 'https://blog.wdesignkit.com/docs/create-custom-elementor-widget-using-free-wdesignkit-widget-builder' : 'https://blog.wdesignkit.com/docs/export-templates-from-elementor-site-to-cloud';

	return (
		<div className='wkit-content-not-availble'>
			<img className={"wkit-pin-img-temp"} src={img_path + "assets/images/jpg/empty-dog.png"} alt="section" />
			{/* <h5 className='wkit-common-desc'>{__(`It seems to be empty! Want to add ${type}?`)}</h5> */}
			<h5 className='wkit-common-desc'>{__(`Nothing related found!`)}</h5>
			{/* <a href={link} target="_blank" rel="noopener noreferrer">
				<button type='submit' className='wkit-common-btn' >{__(`How to Add ${type}`)}</button>
			</a> */}
		</div>
	);
}

export const Wkit_mobile_header = () => {
	let location = useLocation();
	let pathname = location.pathname.split("/");
	var img_path = wdkitData.WDKIT_URL;

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
				<img className='wdkit-main-logo' src={img_path + "/assets/images/jpg/Wdesignkit-logo.png"} alt="wdesignkit-logo" />
				<div className='wkit-mobile-hamburger-dot'>

					<div className='wkit-hamburger-icon' onClick={() => { wkit_humber_open() }}></div>
					<div className='wkit-opp' onClick={() => { wkit_humber_close() }}>
						<ul className="wkit-hamburger-menu-content">
							<div className="wkit-menu-site-logo">
								<img src={img_path + "assets/images/jpg/Wdesignkit-full-logo.png"} alt="wdesignlogo" draggable="false" />
							</div>
							<li className={pathname.includes("browse") ? 'wkit-mobileMenu-active' : ''}>
								<Link to='/browse'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.72571 3.28983C6.16881 4.21597 3.46801 7.26324 3.05493 11H7.05009C7.2743 8.23681 8.1991 5.58442 9.72571 3.28983ZM14.2743 3.28983C15.8009 5.58442 16.7257 8.23681 16.9499 11H20.9451C20.532 7.26324 17.8312 4.21597 14.2743 3.28983ZM14.9424 11C14.6912 8.28683 13.6697 5.70193 12 3.5508C10.3303 5.70193 9.30879 8.28683 9.05759 11H14.9424ZM9.05759 13H14.9424C14.6912 15.7132 13.6697 18.2981 12 20.4492C10.3303 18.2981 9.30879 15.7132 9.05759 13ZM7.05009 13H3.05493C3.46801 16.7368 6.16881 19.784 9.72571 20.7102C8.1991 18.4156 7.2743 15.7632 7.05009 13ZM14.2743 20.7102C15.8009 18.4156 16.7257 15.7632 16.9499 13H20.9451C20.532 16.7368 17.8312 19.784 14.2743 20.7102ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="white" /></svg>
									Design Browse
								</Link>
							</li>
							{window.wdkit_editor != "wdkit" &&
								<li className={pathname.includes("save_template") ? 'wkit-mobileMenu-active' : ''}><Link to='/save_template'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M22 2H2V6H22V2ZM2 22L2 8H12V13.6263C12 14.5847 13.0682 15.1564 13.8656 14.6248L16 13.2019L18.1344 14.6248C18.9318 15.1564 20 14.5847 20 13.6263V8H22V22H2ZM18 8H14V12.1315L15.3898 11.2049C15.7593 10.9586 16.2407 10.9586 16.6102 11.2049L18 12.1315V8ZM2 0C0.895431 0 0 0.89543 0 2V22C0 23.1046 0.89543 24 2 24H22C23.1046 24 24 23.1046 24 22V2C24 0.895431 23.1046 0 22 0H2ZM6 4C6 4.55228 5.55228 5 5 5C4.44772 5 4 4.55228 4 4C4 3.44772 4.44772 3 5 3C5.55228 3 6 3.44772 6 4ZM9 5C9.55228 5 10 4.55228 10 4C10 3.44772 9.55228 3 9 3C8.44771 3 8 3.44772 8 4C8 4.55228 8.44771 5 9 5ZM4 13C4 12.4477 4.44772 12 5 12H7C7.55228 12 8 12.4477 8 13C8 13.5523 7.55228 14 7 14H5C4.44772 14 4 13.5523 4 13ZM5 17C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19H16C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17H5Z" fill="white" /></svg>Save Template</Link></li>
							}
							{window.wdkit_editor == "wdkit" &&
								<li className={pathname.includes("widget-browse") ? 'wkit-mobileMenu-active' : ''}><Link to="/widget-browse"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6C10 6.87124 9.72146 7.67742 9.24857 8.33435L10.7071 9.79289C11.0976 10.1834 11.0976 10.8166 10.7071 11.2071C10.3166 11.5976 9.68342 11.5976 9.29289 11.2071L7.70517 9.61938C7.18792 9.8635 6.6099 10 6 10C3.79086 10 2 8.20914 2 6ZM6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8ZM14 3C14 2.44772 14.4477 2 15 2H21C21.5523 2 22 2.44772 22 3V9C22 9.55228 21.5523 10 21 10H15C14.4477 10 14 9.55228 14 9V3ZM16 4V8H20V4H16ZM2 15C2 14.4477 2.44772 14 3 14H9C9.55228 14 10 14.4477 10 15V21C10 21.5523 9.55228 22 9 22H3C2.44772 22 2 21.5523 2 21V15ZM4 16V20H8V16H4ZM14 15C14 14.4477 14.4477 14 15 14H21C21.5523 14 22 14.4477 22 15V21C22 21.5523 21.5523 22 21 22H15C14.4477 22 14 21.5523 14 21V15ZM16 16V20H20V16H16Z" fill="white" /></svg>Widget Browse</Link></li>
							}
							<li className={pathname.includes("my_uploaded") ? 'wkit-mobileMenu-active' : ''}><Link to="/my_uploaded"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 16H15V10H19L12 3L5 10H9V16ZM12 5.83L14.17 8H13V14H11V8H9.83L12 5.83ZM5 18H19V20H5V18Z" fill="white" /></svg>My Templates</Link></li>
							<li className={pathname.includes("share_with_me") ? 'wkit-mobileMenu-active' : ''}><Link to='/share_with_me'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08C17.24 16.08 16.56 16.38 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.35C15.11 18.56 15.08 18.78 15.08 19C15.08 20.61 16.39 21.92 18 21.92C19.61 21.92 20.92 20.61 20.92 19C20.92 17.39 19.61 16.08 18 16.08ZM18 4C18.55 4 19 4.45 19 5C19 5.55 18.55 6 18 6C17.45 6 17 5.55 17 5C17 4.45 17.45 4 18 4ZM6 13C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11C6.55 11 7 11.45 7 12C7 12.55 6.55 13 6 13ZM18 20.02C17.45 20.02 17 19.57 17 19.02C17 18.47 17.45 18.02 18 18.02C18.55 18.02 19 18.47 19 19.02C19 19.57 18.55 20.02 18 20.02Z" fill="white" /></svg>Shared with me</Link></li>
							<li className={pathname.includes("manage_workspace") ? 'wkit-mobileMenu-active' : ''}><Link to='/manage_workspace' ><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15C7.1 15 8 15.9 8 17C8 18.1 7.1 19 6 19C4.9 19 4 18.1 4 17C4 15.9 4.9 15 6 15ZM6 13C3.8 13 2 14.8 2 17C2 19.2 3.8 21 6 21C8.2 21 10 19.2 10 17C10 14.8 8.2 13 6 13ZM12 5C13.1 5 14 5.9 14 7C14 8.1 13.1 9 12 9C10.9 9 10 8.1 10 7C10 5.9 10.9 5 12 5ZM12 3C9.8 3 8 4.8 8 7C8 9.2 9.8 11 12 11C14.2 11 16 9.2 16 7C16 4.8 14.2 3 12 3ZM18 15C19.1 15 20 15.9 20 17C20 18.1 19.1 19 18 19C16.9 19 16 18.1 16 17C16 15.9 16.9 15 18 15ZM18 13C15.8 13 14 14.8 14 17C14 19.2 15.8 21 18 21C20.2 21 22 19.2 22 17C22 14.8 20.2 13 18 13Z" fill="white" /></svg>Manage Workspace</Link></li>
							{window.wdkit_editor == "wdkit" &&
								<Fragment>
									<li className={pathname.includes("activate") ? 'wkit-mobileMenu-active' : ''}><Link to="/activate"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8ZM12 10C12.3453 10 12.6804 9.95625 13 9.87398V11.2192L12.291 11.042C12.1 10.9942 11.9 10.9942 11.709 11.042L11 11.2192V9.87398C11.3196 9.95625 11.6547 10 12 10ZM16 6C16 6.3453 15.9562 6.68038 15.874 7H20C21.1046 7 22 7.89543 22 9V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V9C2 7.89543 2.89543 7 4 7H8.12602C8.04375 6.68038 8 6.3453 8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6ZM9 9H4V20H20V9H15V12.2438C15 13.0245 14.2663 13.5974 13.509 13.408L12 13.0308L10.491 13.408C9.73366 13.5974 9 13.0245 9 12.2438V9ZM7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44771 18 7 18H17C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16H7Z" fill="white" /></svg>Manage Licence</Link></li>
									<li className={pathname.includes("widget-listing") ? 'wkit-mobileMenu-active' : ''}><Link to="/widget-listing"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10.8535 0.582239C11.5422 0.10019 12.4587 0.100192 13.1474 0.582239L12.0005 2.2207L3.66798 8.05344L2.52106 6.41497L10.8535 0.582239ZM2.83294 13.6967L2.41859 13.3652C1.37643 12.5314 1.4277 10.9303 2.52106 10.165L2.83294 9.94666L2.41859 9.61518C1.37643 8.78145 1.4277 7.18032 2.52106 6.41497L3.66798 8.05344L7.62516 11.2192L10.7511 13.7199C11.4815 14.3043 12.5194 14.3043 13.2499 13.7199L16.3758 11.2192L20.3329 8.05344L12.0005 2.2207L13.1474 0.582239L21.4799 6.41497C22.5732 7.18033 22.6245 8.78145 21.5823 9.61518L21.168 9.94666L21.4799 10.165C22.5732 10.9303 22.6245 12.5315 21.5823 13.3652L21.168 13.6967L21.4799 13.915C22.5732 14.6803 22.6245 16.2815 21.5823 17.1152L17.6252 20.2809L14.4992 22.7816C13.0384 23.9503 10.9626 23.9503 9.50168 22.7816L6.37577 20.2809L2.41859 17.1152C1.37643 16.2815 1.4277 14.6803 2.52106 13.915L2.83294 13.6967ZM4.46048 14.9987L3.66798 15.5534L7.62516 18.7192L10.7511 21.2199C11.4815 21.8043 12.5194 21.8043 13.2499 21.2199L16.3758 18.7192L20.3329 15.5534L19.5404 14.9987L17.6252 16.5309L14.4992 19.0316C13.0384 20.2003 10.9626 20.2003 9.50168 19.0316L6.37577 16.5309L4.46048 14.9987ZM17.6252 12.7809L19.5404 11.2487L20.3329 11.8034L16.3758 14.9692L13.2499 17.4699C12.5194 18.0543 11.4815 18.0543 10.7511 17.4699L7.62516 14.9692L3.66798 11.8034L4.46048 11.2487L6.37577 12.7809L9.50168 15.2816C10.9626 16.4503 13.0384 16.4503 14.4992 15.2816L17.6252 12.7809Z" fill="white" /></svg>My Widgets</Link></li>
									<li className={pathname.includes("settings") ? 'wkit-mobileMenu-active' : ''}><Link to="/settings"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M4 2C4.55228 2 5 2.44772 5 3V10C5 10.5523 4.55228 11 4 11C3.44772 11 3 10.5523 3 10V3C3 2.44772 3.44772 2 4 2ZM5 15H7C7.55228 15 8 14.5523 8 14C8 13.4477 7.55228 13 7 13H4H1C0.447715 13 0 13.4477 0 14C0 14.5523 0.447715 15 1 15H3V21C3 21.5523 3.44772 22 4 22C4.55228 22 5 21.5523 5 21V15ZM13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V12ZM12 2C12.5523 2 13 2.44772 13 3V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H12H9C8.44771 9 8 8.55228 8 8C8 7.44772 8.44771 7 9 7H11V3C11 2.44772 11.4477 2 12 2ZM20 15H23C23.5523 15 24 15.4477 24 16C24 16.5523 23.5523 17 23 17H21V21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21V17H17C16.4477 17 16 16.5523 16 16C16 15.4477 16.4477 15 17 15H20ZM20 2C20.5523 2 21 2.44772 21 3V12C21 12.5523 20.5523 13 20 13C19.4477 13 19 12.5523 19 12V3C19 2.44772 19.4477 2 20 2Z" fill="white" /></svg>Settings</Link></li>
								</Fragment>
							}

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
							className='btn-workspace-add'
							onClick={() => clickData()}>
							{props.action == 'move' ? __('Move') : __('Copy')}
						</button>
						:
						<button className='btn-workspace-add'>{WkitLoader()}</button>
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
				({props.total_rating} {props.total_rating == 1 ? 'Review' : 'Reviews'})
			</span>
		</div>
	);
};

/** widget card structure */
export const Widget_card = (props) => {
	var data = props.widgetData;
	var img_path = wdkitData.WDKIT_URL;
	let index = props.index;

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

	/** download widget */
	const Download_widget = async (w_data, index) => {
		let login_detail = get_user_login();
		if (login_detail == null) {
			navigation('/login');
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

			if (builder == "elementor") {
				await Elementor_file_create('add', data, html, css, js, "", image)
					.then((res) => {
						if (res?.api?.success) {
							let old_array = [...props.existingwidget]
							old_array.push(w_data.w_unique);
							props.setexistingwidget(old_array)
						}
					})
			} else if (builder == "gutenberg") {
				CreatFile('add', data, html, css, js, "", image, "", icon)
			}
			setdownloading(false);
			setDownload_index(-1);
		}

		var api_data = {
			"type": 'widget/download',
			"w_uniq": id,
			"u_id": props.userinfo?.id
		};

		let form_arr = { 'type': 'wkit_public_download_widget', 'widget_info': JSON.stringify(api_data) }
		await wdKit_Form_data(form_arr).then(async (result) => {
			if (result?.success) {
				await props.wdkit_set_toast(result?.message, result?.description, '', 'success')
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
						<div className='wdkit-inner-boxed-deActivate-h1'>Credit Limit Reached!</div>
						<div className='wdkit-inner-boxed-deActivate-p'>This Template got disabled until you have more credits to make it active.</div>
						<a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
							<button>Buy Credits</button>
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
								<img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/private.svg"} alt="private" />
								<span className="wkit-widget-icon-tooltip">Private</span>
							</div>
						}
						{data.status == "public" &&
							<div className="wkit-widget-public-icon">
								<img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/public.svg"} alt="public" />
								<span className="wkit-widget-icon-tooltip">Public</span>
							</div>
						}
					</div>
					{data.free_pro == 'pro' &&
						<div className="wdkit-card-tag">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
							<span>Pro</span>
						</div>
					}
					<div>
						<picture>
							{data.responsive_image.map((image_data, index) => {
								return (
									<Fragment key={index}>
										<source media={`(min-width: ${image_data.size}px)`} srcSet={SetImageUrl(image_data.url)} />
									</Fragment>
								);
							})}
							<img className="wkit-widget-image-content" src={data.image} alt={"featured-img"} />
						</picture>
					</div>
				</div>
				<div className='wkit-widget-card-bottom-part'>
					<div className='wkit-widget-title-content'>
						{props.type == 'widget-browse' ?
							<a className='wkit-widget-title-heading' href={`${wdkitData.wdkit_server_url}widget/${data.title}/${data.id}`} target="_blank" rel="noopener noreferrer">
								<span>{data.title}</span>
							</a>
							:
							<div className='wkit-widget-title-heading'>
								<span>{data.title}</span>
							</div>
						}
						<div className='wkit-widget-download-activity'>
							{props.existingwidget.includes(data.w_unique) ?
								<Link className='wkit-widget-eye-icon' to='/widget-listing'>
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 10 11" fill="none">
										<path d="M6.49176 5.20895C6.49176 6.03395 5.82509 6.70062 5.00009 6.70062C4.17509 6.70062 3.50842 6.03395 3.50842 5.20895C3.50842 4.38395 4.17509 3.71729 5.00009 3.71729C5.82509 3.71729 6.49176 4.38395 6.49176 5.20895Z" stroke="#19191B" strokeWidth="1.02473" strokeLinecap="round" strokeLinejoin="round" />
										<path d="M5.00006 8.65511C6.47089 8.65511 7.84172 7.78844 8.79589 6.28844C9.17089 5.70094 9.17089 4.71344 8.79589 4.12594C7.84172 2.62594 6.47089 1.75928 5.00006 1.75928C3.52922 1.75928 2.15839 2.62594 1.20422 4.12594C0.829224 4.71344 0.829224 5.70094 1.20422 6.28844C2.15839 7.78844 3.52922 8.65511 5.00006 8.65511Z" stroke="#19191B" strokeWidth="1.02473" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
								:
								<Fragment>
									{(downloading == true && Download_index == index) ?
										<div className='plugin-download-icon'>
											<div className="wb-download-loader" style={{ display: 'flex' }} >
												<div className="wb-download-loader-circle"></div>
											</div>
										</div>
										:
										<div className='plugin-download-icon' onClick={(e) => { Download_widget(data, index), setdownloading(true) }}>
											<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 12" fill="none">
												<path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B" />
												<path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B" />
											</svg>
										</div>
									}
								</Fragment>
							}
						</div>
					</div>
					<CardRatings
						avg_rating={props?.widgetData?.avg_rating}
						total_rating={props?.widgetData?.total_rating}
					/>
					<div className="wkit-widget-info-content">
						<div className="wkit-widget-info-icons-content">
							<div className="wkit-widget-info-icons">
								<img src={img_path + "/assets/images/wb-svg/view-icon.svg"} alt="wb-view-icon" />
								<label>{props?.widgetData?.views ? props.widgetData.views : 0}</label>
							</div>
							<hr className="wkit-icon-divider-hr" />
							<div className="wkit-widget-info-icons">
								<img src={img_path + "/assets/images/wb-svg/download-icon.svg"} alt="wb-view-icon" />
								<label>{props?.widgetData?.download ? props.widgetData.download : 0}</label>
							</div>
						</div>
						<div className="wkit-widget-builder-icon">
							<img src={widget_builder(data)} />
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
				<span className='wkit-share-heading'>{props.title}</span>
			</div>
			{props.custom_dropdown && props.custom_dropdown()}
		</div>
	);
}