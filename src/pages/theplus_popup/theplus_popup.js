import axios from 'axios';
import { connect } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { Get_site_url, get_user_login } from '../../helper/helper-function';
import { Change_wdkit_meta, ShowToast } from '../redux/redux_data/store_action';
import { useLocation, useNavigate } from 'react-router-dom';
import { __ } from '@wordpress/i18n';
import '../theplus_popup/theplus_popup.scss';

const {
    form_data,
    wkit_set_user_login,
    get_userinfo
} = wp.wkit_Helper;

const Theplus_popup = (props) => {
    const [PopupType, setPopupType] = useState('');
    const [widget_data, setwidget_data] = useState('');
    const licence_data = useRef('');

    var ImgPath = wdkitData.WDKIT_ASSETS,
        location = useLocation(),
        navigation = useNavigate();

    const ex_content = async () => {
        let wp_header = document.querySelector('#wpadminbar'),
            wp_body = document.querySelector('#wpbody'),
            html = document.querySelector('.wp-toolbar'),
            wdk_dom = document.querySelector('.wkit-main-menu-dashbord'),
            support_icon = document.querySelector('.wkit-support-btn'),
            path_name = window?.location?.pathname ? window.location.pathname : '',
            site_url = window.location.origin + path_name + `?page=theplus_welcome_page#/widgets`;

        html.style.padding = 0;
        wdk_dom.style.padding = 0;
        wp_body.style.padding = 0;
        wp_header.remove();
        support_icon.remove();

        window.parent.postMessage(
            "openPopup",
            site_url
        );
    }

    useEffect(() => {
        ex_content();
    }, [])

    useEffect(() => {

        if (props.wdkit_meta?.success) {
            licence_data.current = props?.wdkit_meta?.credits?.wdkit_licence;
            Get_widget_detail();
        }
    }, [props.wdkit_meta?.success])

    const Get_widget_detail = () => {
        if (location?.search) {
            const params = new URLSearchParams(location.search);
            const id = params.get('id');

            if (id) {
                let api_data = {
                    "free_pro": "",
                    "type": "widget_browse_page",
                    "buildertype": "[\"elementor\"]",
                    "perpage": 1,
                    "page": 1,
                    "search": id
                }

                let form = new FormData();
                form.append('action', 'get_wdesignkit');
                form.append('kit_nonce', wdkitData.kit_nonce);

                Object.entries(api_data).forEach(([key, val]) => {
                    form.append(key, val);
                });

                axios.post(ajaxurl, form).then(async (result) => {
                    if (result?.data?.data?.widgets?.[0]) {
                        let widget_data = result.data.data.widgets[0];
                        setwidget_data(widget_data);
                        Check_widget(widget_data);
                    } else {
                        props.wdkit_set_toast([__("Widget Not Found", 'wdesignkit'), __('Can Not Find Widget, Please Try Again Later!', 'wdesignkit'), '', 'danger'])
                    }
                })
            }
        }
    }

    const Check_widget = (w_data) => {

        if (w_data) {

            if (w_data?.free_pro == 'pro') {
                let login_data = get_user_login();

                if (!login_data) {
                    setPopupType('login');
                    return false;
                } else {
                    if (licence_data?.current?.success && licence_data?.current?.license == 'valid') {
                        navigation(`/download/widget/${w_data.id}`)
                    } else {
                        setPopupType('wdkit_pro');
                    }
                }
            } else {
                navigation(`/download/widget/${w_data.id}`)
            }

        }
    }

    const Login_popup = () => {

        const [username, setUserName] = useState();
        const [password, setPassword] = useState();
        const [showPassword, setShowPassword] = useState(false);
        const [rememberMe, setrememberMe] = useState(false);
        const [socialLoading, setsocialLoading] = useState(false);
        const [isLoading, setIsLoading] = useState(false);

        let site_url = Get_site_url();

        /** get unique 8 character string */
        const keyUniqueID = () => {
            let date = new Date(),
                year = date.getFullYear().toString().slice(-2),
                number = Math.random();

            number.toString(36);

            let uid = number.toString(36).substr(2, 6);

            return uid + year;
        }

        /**Google Login*/
        const GoogleLogin = async (e) => {
            var unique_id = keyUniqueID();

            setsocialLoading('Google')

            var GoogleURL = "https://accounts.google.com/o/oauth2/auth",
                ClientID = "428406150181-7rui8lmg2m9nkqqahreida3j02apfnim.apps.googleusercontent.com",
                RedirectURL = `${wdkitData.wdkit_server_url}api/auth/google/callback-plugin`;

            var url = `${GoogleURL}?client_id=${ClientID}&redirect_uri=${RedirectURL}&response_type=code&scope=email%20profile&state=${unique_id}`,
                top = screen.height / 2 - 520 / 2,
                left = screen.width / 2 - 670 / 2,
                PopupOne = window.open(url, "", "location=1,status=1,resizable=yes,width=670,height=520,top=" + top + ",left=" + left);

            const tp_callback = async () => {
                if (!PopupOne || PopupOne.closed) {

                    let form_array = {
                        'type': 'social_login',
                        'state': unique_id,
                        'login_type': 'normal',
                        'site_url': site_url,
                    }

                    var res = await form_data(form_array).then(async (res) => { return res });

                    if (res?.data?.success == true) {
                        let user_email = res?.data?.user?.user_email,
                            success = res?.data?.success,
                            messages = "Login successfully",
                            token = res?.data?.token

                        const data = {
                            'messages': messages,
                            "success": success,
                            'token': token,
                            'user_email': user_email,
                            'login_type': 'normal'
                        }

                        if (token && user_email) {
                            wkit_set_user_login(data);
                        }

                        let user_data = await get_userinfo();
                        props.wdkit_set_toast([res.messages, res.description, '', 'success']);
                        props.wdkit_set_meta(user_data.data);

                        if (user_data.data.credits.wdkit_licence?.success && user_data.data.credits.wdkit_licence.license == 'valid') {
                            navigation(`/download/widget/${widget_data.id}`)
                        } else {
                            setPopupType('wdkit_pro');
                        }
                    } else {
                        props.wdkit_set_toast([__("Invalid Login Details", 'wdesignkit'), __('Login Error: Check your details and try again.', 'wdesignkit'), '', 'danger'])
                    }

                    setsocialLoading(false)

                    return;
                } else {
                    setTimeout(tp_callback, 100);
                }

                // open(location, '_self').close();
            }
            setTimeout(tp_callback, 100);
        }

        /**FaceBook Login*/
        const FacebookLogin = async (e) => {
            var unique_id = keyUniqueID();

            setsocialLoading('Facebook')

            var FacebookURL = "https://www.facebook.com/v12.0/dialog/oauth",
                ClientID = "590712039607331",
                RedirectURL = encodeURIComponent(`${wdkitData.wdkit_server_url}api/auth/facebook/callback-plugin`);

            var url = `${FacebookURL}?client_id=${ClientID}&redirect_uri=${RedirectURL}&response_type=code&scope=email&state=${unique_id}`,
                top = screen.height / 2 - 520 / 2,
                left = screen.width / 2 - 670 / 2,
                PopupOne = window.open(url, "", "location=1,status=1,resizable=yes,width=670,height=520,top=" + top + ",left=" + left);

            const tp_callback = async () => {
                if (!PopupOne || PopupOne.closed) {

                    let form_array = {
                        'type': 'social_login',
                        'state': unique_id,
                        'site_url': site_url,
                    }
                    var res = await form_data(form_array).then(async (res) => { return res });

                    if (res?.data?.success == true) {
                        let user_email = res?.data?.user?.user_email,
                            success = res.data.success,
                            messages = "Login successfully",
                            token = res.data.token

                        const data = {
                            'messages': messages,
                            "success": success,
                            'token': token,
                            'user_email': user_email,
                            'login_type': 'normal'
                        }

                        if (token && user_email) {
                            wkit_set_user_login(data);
                        }

                        let user_data = await get_userinfo();
                        props.wdkit_set_toast([res.messages, res.description, '', 'success']);
                        props.wdkit_set_meta(user_data.data);

                        if (user_data.data.credits.wdkit_licence?.success && user_data.data.credits.wdkit_licence.license == 'valid') {
                            navigation(`/download/widget/${widget_data.id}`)
                        } else {
                            setPopupType('wdkit_pro');
                        }
                    } else {
                        props.wdkit_set_toast([__("Invalid Login Details", 'wdesignkit'), __('Login Error: Check your details and try again.', 'wdesignkit'), '', 'danger'])
                    }

                    setsocialLoading(false)

                    return;
                } else {
                    setTimeout(tp_callback, 100);
                }
            }
            setTimeout(tp_callback, 100);
        }

        /** login with email and password */
        const handleSubmit = async (e) => {

            e.preventDefault();
            if (!username) {
                props.wdkit_set_toast([__("Please fill all fields", 'wdesignkit'), __('Missing information! Complete all fields.', 'wdesignkit'), '', 'danger'])

                return;
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(username)) {
                props.wdkit_set_toast([__("Invalid Login Details", 'wdesignkit'), __('Login Error: Check your details and try again.', 'wdesignkit'), '', 'danger'])

                return;
            }

            if (!password) {
                props.wdkit_set_toast([__("Please fill all fields", 'wdesignkit'), __('Missing information! Complete all fields.', 'wdesignkit'), '', 'danger'])
                return;
            }

            setIsLoading(true);

            if (rememberMe) {
                var login_type = 'normal';
            } else {
                var login_type = 'session';
            }

            let form_arr = {
                'type': 'wkit_login',
                'user_email': username,
                'user_password': password,
                'login_type': login_type,
                'site_url': site_url,
            }

            let resp = await form_data(form_arr).then(result => result);

            if (resp?.success) {
                if (rememberMe) {
                    wkit_set_user_login(Object.assign({}, { 'user_email': username }, resp, { 'login_type': 'normal' }))
                } else {
                    wkit_set_user_login(Object.assign({}, { 'user_email': username }, resp, { 'login_type': 'session' }))
                }

                let user_data = await get_userinfo();
                props.wdkit_set_meta(user_data.data);
                if (resp.messages) {
                    props.wdkit_set_toast([resp?.messages, resp?.description, '', 'success']);
                }

                if (user_data.data.credits.wdkit_licence.success && user_data.data.credits.wdkit_licence.license == 'valid') {
                    navigation(`/download/widget/${widget_data.id}`)
                } else {
                    setPopupType('wdkit_pro');
                }
                setIsLoading(false)

                setPopupType('wdkit_pro');

                return;
            } else {
                props.wdkit_set_toast([resp?.message, resp?.description, '', 'danger']);
                setIsLoading(false)
                return;
            }
        }

        /** social login loading */
        const SocialLoading = (text) => {

            if (socialLoading == text) {
                return (
                    <>
                        <span className='wkit-main-loader'>
                            <span className="wkit-loader"></span>
                            <span className="wkit-loader"></span>
                            <span className="wkit-loader"></span>
                        </span>
                    </>
                );
            }

            return <span>{__('Login with', 'wdesignkit')} {text}</span>
        }

        return (
            <div className='wkit-login-popup'>
                <div>
                    <p className='wkit-tpae-login-heading'>{__('Login to use WDesignKit Widgets', 'wdesignkit')}</p>
                </div>
                <div className='wkit-tpae-login-btns'>
                    <button className='wkit-tpae-btn' onClick={(e) => { GoogleLogin(e) }}>
                        <img src={ImgPath + "images/svg/google.svg"} alt="google" draggable={false} />
                        {SocialLoading('Google')}
                    </button>
                    <button className='wkit-tpae-btn' onClick={(e) => { FacebookLogin(e) }}>
                        <img src={ImgPath + "images/svg/facebook.svg"} alt="facebook" draggable={false} />
                        {SocialLoading('Facebook')}
                    </button>
                </div>
                <div className='wkit-tpae-sign-email'>
                    <hr className='wkit-tpae-line' />
                    <span className='wkit-tpae-line-text'>{__('OR', 'wdesignkit')}</span>
                    <hr className='wkit-tpae-line' />
                </div>
                <form className='wkit-tpae-login-form' onSubmit={(e) => { handleSubmit(e) }}>
                    <div className='wkit-tpae-login-field'>
                        <label className='wkit-tpae-label' htmlFor='wkit-tpae-mail'>{__('Email', 'wdesignkit')}</label>
                        <input type="email" name="email" id='wkit-tpae-mail' placeholder={__('Enter your email', 'wdesignkit')} className='wkit-input-field' autoComplete="off" required onChange={(e) => { setUserName(e.target.value) }} />
                    </div>
                    <div className='wkit-tpae-login-field'>
                        <label className='wkit-tpae-label' htmlFor='wkit-tpae-password'>{__('Password', 'wdesignkit')}</label>
                        <div className='wkit-login-password-inp'>
                            <input type={showPassword ? "text" : "password"} id='wkit-tpae-password' name="password" placeholder={__('Password', 'wdesignkit')} className='wkit-input-field' autoComplete="off" required onChange={(e) => { setPassword(e.target.value) }} />
                            <span className='wkit-password-eye'>
                                {showPassword ?
                                    <svg onClick={() => { setShowPassword(!showPassword) }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M10.465 10.465C9.46785 11.2251 8.25365 11.6462 7 11.6667C2.91667 11.6667 0.583336 7 0.583336 7C1.30894 5.64777 2.31533 4.46636 3.535 3.535M5.775 2.47334C6.17653 2.37935 6.58762 2.33237 7 2.33334C11.0833 2.33334 13.4167 7 13.4167 7C13.0626 7.66244 12.6403 8.2861 12.1567 8.86083M8.23667 8.23667C8.07646 8.4086 7.88326 8.54651 7.66859 8.64216C7.45393 8.7378 7.22219 8.78924 6.98722 8.79338C6.75225 8.79753 6.51885 8.7543 6.30094 8.66629C6.08304 8.57827 5.88509 8.44727 5.71891 8.28109C5.55274 8.11491 5.42173 7.91697 5.33372 7.69906C5.2457 7.48116 5.20248 7.24776 5.20662 7.01278C5.21077 6.77781 5.2622 6.54608 5.35785 6.33141C5.45349 6.11675 5.5914 5.92355 5.76334 5.76334" stroke="#C0C0E0" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M0.583336 0.583332L13.4167 13.4167" stroke="#C0C0E0" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    :
                                    <svg onClick={() => { setShowPassword(!showPassword) }} xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
                                        <path d="M0.583333 6C0.583333 6 2.91667 1.33333 7 1.33333C11.0833 1.33333 13.4167 6 13.4167 6C13.4167 6 11.0833 10.6667 7 10.6667C2.91667 10.6667 0.583333 6 0.583333 6Z" stroke="#C0C0E0" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M7 7.75C7.9665 7.75 8.75 6.9665 8.75 6C8.75 5.0335 7.9665 4.25 7 4.25C6.0335 4.25 5.25 5.0335 5.25 6C5.25 6.9665 6.0335 7.75 7 7.75Z" stroke="#C0C0E0" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                }
                            </span>
                        </div>
                    </div>
                    <div className='wkit-remember-wrapper'>
                        <label htmlFor='select-1' className='wkit-remember-text'>
                            <input type="checkbox" id='select-1' className='wkit-check-box wkit-styled-checkbox' checked={rememberMe} onChange={(e) => { setrememberMe(e.target.checked) }} />
                            <span className='wkit-login-remember-text'>{__('Remember Me', 'wdesignkit')}</span>
                        </label>
                        <a className='wkit-tpae-page-link' href={`${wdkitData.wdkit_server_url}password/forgot`} target="_blank" rel="noopener noreferrer" >{__('Forgot Password?', 'wdesignkit')}</a>
                    </div>
                    {isLoading == true ? (
                        <div className="wkit-login-btn">
                            <button className='wkit-pink-btn-class wkit-tpae-login-btn wkit-loader-btn'>
                                <div className="wkit-publish-loader" style={{ display: isLoading && 'flex' }}>
                                    <div className="wb-loader-circle"></div>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <button className='wkit-pink-btn-class wkit-tpae-login-btn'>{__('Log in', 'wdesignkit')}</button>
                    )}
                    <div className='wkit-signup-account'>
                        {__('Don\'t have an account?', 'wdesignkit')}
                        <a className='wkit-tpae-page-link' href={`${wdkitData.wdkit_server_url}signup`} target="_blank">&nbsp;{__('Create Account', 'wdesignkit')}</a>
                    </div>
                </form>
            </div>
        )
    }

    const Wdkit_pro = () => {

        const [ShowDropdown, setShowDropdown] = useState(true);

        return (
            <div className='wkit-pro-popup'>
                <div className='wkit-text-content'>
                    <p className='wkit-buy-pro'>
                        {__('Upgrade to WDesignKit Pro for Premium Widgets Access', 'wdesignkit')}
                    </p>
                </div>
                <div className='wkit-widget-switcher'>
                    <div className='wkit-widget-detail'>
                        <div className='wkit-widget-tag'>{widget_data.free_pro}</div>
                        <div className='wkit-tpae-widget-detail'>
                            {widget_data.title}
                            {/* <span className='wkit-widget-status'>{__('NEW', 'wdesignkit')}</span> */}
                        </div>
                        <div className='wkit-tpae-widget-links'>
                            <span className='wkit-widget-link'>{__('Live Demo', 'wdesignkit')}</span>
                        </div>
                    </div>
                    <div className="wkit_block_toggle_btn_cover">
                        <input
                            className="wkit_toggle_btn"
                            type="checkbox"
                            disabled
                        />
                        <label className="switch-label" htmlFor="toggle-tp-design-tool">
                            <span className="switch-button"></span>
                        </label>
                        <img
                            className="wkit_toggle_lock_icon"
                            src={ImgPath + "/images/svg/wkit_lock_icon.svg"}
                            alt="Lock Icon"
                        />
                    </div>
                </div>
                <div className='wkit-widget-btn-group'>
                    <a href={wdkitData.wdkit_server_url + 'pricing'} target='_blank' rel="noopener noreferrer">
                        <button className='wkit-pink-btn-class wkit-pro-btn'>
                            {__('Get WDesignKit Pro', 'wdesignkit')}
                        </button>
                    </a>
                    <button className='wkit-pink-btn-class wkit-pro-btn wkit-transparetn-btn' onClick={() => { setPopupType('activate_license'); }}>{__('Activate WDesignKit', 'wdesignkit')}</button>
                </div>
                <div className='wkit-tpae-details-dropdown'>
                    <div className={`wkit-tpae-question ${ShowDropdown ? 'wkit-show-question' : ''}`}>
                        <span>{__('Why Do I Need WDesignKit Pro if I Have The Plus Addons for Elementor Pro?', 'wdesignkit')}</span>
                        <span className='wkit-dropdown-svg' onClick={(e) => { setShowDropdown(!ShowDropdown) }}>
                            {ShowDropdown ?
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.16797 10H15.8346" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                :
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 4.16675V15.8334" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.16797 10H15.8346" stroke="white" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        </span>
                    </div>
                    <div className={`wkit-tpae-answer ${ShowDropdown ? 'wkit-show-answer' : ''}`}>
                        <span>{__('WDesignKit and The Plus Addons for Elementor are two distinct products. The Plus Addons is entirely focused on Elementor, offering essential and advanced widgets specifically designed for Elementor users.', 'wdesignkit')}</span>
                        <span>{__('WDesignKit, on the other hand, focuses on unique custom widgets created with its easy-to-use Drag and Drop Widget Builder, Cloud Workspace, and many other added benefits.', 'wdesignkit')}
                        </span>
                        <a className='wkit-dropdown-link' href={wdkitData.WDKIT_DOC_URL + 'docs/what-benefits-will-existing-users-of-the-plus-addons-for-elementor-pro-get-with-wdesignkit/'} target='_blank' rel="noopener noreferrer">
                            {__('Explore the differences between The Plus Addons and WDesignKit to see what\'s included in each!', 'wdesignkit')}
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    const Activate_license = () => {
        const [ActivateLoader, setActivateLoader] = useState(false);
        const [isInputEmpty, setInputEmpty] = useState(false);
        const [licenseKey, setLicenseKey] = useState('');

        const AddApiKey = async () => {
            if (!licenseKey.trim()) {
                setInputEmpty(true);
                props.wdkit_set_toast([__('Invalid key entered', 'wdesignkit'), __('Key error, check and fix', 'wdesignkit'), '', 'danger']);
                return;
            } else {
                setActivateLoader(true);
                let token = get_user_login();
                const apiData = {
                    'type': 'active_licence',
                    'token': token.token,
                    'licencekey': licenseKey,
                    'licencename': 'wdkit',
                }
                await form_data(apiData).then(async (result) => {

                    if (result.success) {
                        if (result?.data?.wdkit_licence?.success && result?.data?.wdkit_licence?.license == 'valid') {
                            navigation(`/download/widget/${widget_data.id}`)
                        }
                        props.wdkit_set_toast([result?.message, result?.description, '', 'success']);
                        setActivateLoader(false);
                    } else {
                        props.wdkit_set_toast([result?.message, result?.description, '', 'danger']);
                        setActivateLoader(false);
                    }
                });
            }
            setLicenseKey('');
        };


        return (
            <div className='wkit-tpae-activate-license'>
                <div className='wkit-text-content'>
                    <p className='wkit-tpae-license-text'>
                        {__('Activate Your Pro License to Access Pro Widgets', 'wdesignkit')}
                    </p>
                    <p className='wkit-tpae-license-notice'>
                        {__('Please activate your WDesignKit Pro license to start using advanced Pro widgets.', 'wdesignkit')}
                    </p>
                </div>
                <div className='wkit-activate-license'>
                    <div className={`wkit-enter-key ${isInputEmpty ? 'wkit-empty-license' : ''}`}>
                        <span style={{ display: 'contents' }}>
                            <svg width="30" height="30" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" width="14" height="14" rx="2.33333" fill="white" />
                                <path d="M12.1667 6.62654L9.18994 9.91671L7.50004 8.46779L5.81012 9.91671L2.83337 6.62654L4.52329 5.17762L6.376 7.2227V4.08337H8.62409V7.2227L10.4768 5.17762L11.5543 6.09824L12.1667 6.62654Z" fill="#C22076" />
                            </svg>
                        </span>
                        <input className='wkit-tpae-license-input' type='text' placeholder='XXXXXXXXX6788' value={licenseKey} onChange={(e) => { setLicenseKey(e.target.value); setInputEmpty(false); }} />
                    </div>
                    <div className='wkit-tpae-active-loader wkit-pink-btn-class' onClick={() => AddApiKey()} >
                        {ActivateLoader == true ?
                            <div className="wkit-content-loader">
                                <div className="wb-contentLoader-circle"></div>
                            </div>
                            :
                            <span>{__("Activate", 'wdesignkit')}</span>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='wkit-theplus-popup-parent'>
            {!PopupType ?
                <div className='theplus-wkit-loader-content'>
                    <div className='theplus-wkit-loader-outer'>
                        <div className='theplus-wkit-loader-inner'></div>
                    </div>
                </div>
                :
                <>
                    {PopupType == 'login' && <Login_popup />}
                    {PopupType == 'wdkit_pro' && <Wdkit_pro />}
                    {PopupType == 'activate_license' && <Activate_license />}
                </>
            }
        </div>
    )

}

const activae_page = state => ({
    wdkit_meta: state.wdkit_meta_data.wdkitmeta,
})

const mapDispatchToProps = dispatch => ({
    wdkit_set_toast: data => dispatch(ShowToast(data)),
    wdkit_set_meta: data => dispatch(Change_wdkit_meta(data)),
});

export default connect(activae_page, mapDispatchToProps)(Theplus_popup);