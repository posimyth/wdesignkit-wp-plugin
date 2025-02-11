import '../login/login.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Get_site_url } from '../../helper/helper-function';
import Incorrect_login from './incorrect_login';
import { __ } from '@wordpress/i18n';

const {
    form_data,
    wkit_set_user_login,
    get_userinfo,
    wkit_get_user_login
} = wp.wkit_Helper;

const Wdkit_Login = (props) => {

    var ImgPath = wdkitData.WDKIT_ASSETS;
    let site_url = Get_site_url();
    let plugin_name = wdkitData?.wdkit_white_label?.plugin_name ? wdkitData?.wdkit_white_label?.plugin_name : "WDesignKit";

    let login_popup1 = {
        icon: true,
        heading: __('Incorrect Login Details', 'wdesignkit'),
        sub_heading: __(`Are you first time trying to login at ${plugin_name} ?`, 'wdesignkit'),
        sub_heading: [{ type: 'normal', text: __(`Are you first time trying to login at ${plugin_name} ?`, 'wdesignkit') }],
        checkbox_text: '',
        note: '',
        ft_btn1_text: __('Yes, I am', 'wdesignkit'),
        ft_btn1_link: '',
        ft_btn1_fun: true,
        ft_btn2_text: __('No, I forgot password', 'wdesignkit'),
        ft_btn2_link: `${wdkitData.wdkit_server_url}password/forgot`,
        ft_btn2_fun: false,
        size: 'small'
    }

    let login_popup2 = {
        icon: false,
        heading: __(`Have you signed up for ${plugin_name} Account?`, 'wdesignkit'),
        sub_heading: '  ',
        sub_heading: [
            { type: 'normal', text: __('You need to signup for ', 'wdesignkit') },
            { type: 'color', text: __(`${plugin_name} account separately`, 'wdesignkit') },
            { type: 'normal', text: __(`as it\'s different from our POSIMYTH Store login. Make sure you signup first and then try to login in ${plugin_name}.`, 'wdesignkit') }
        ],
        checkbox_text: __(`I got it, ${plugin_name} & POSIMYTH Store account is Different.`, 'wdesignkit'),
        note: '',
        ft_btn1_text: __(`Signup for ${plugin_name}`, 'wdesignkit'),
        ft_btn1_link: `${wdkitData.wdkit_server_url}signup`,
        ft_btn2_text: __('Forgot Password', 'wdesignkit'),
        ft_btn2_link: `${wdkitData.wdkit_server_url}password/forgot`,
        ex_link_text: __('Want to know more?', 'wdesignkit'),
        ex_link_url: `${wdkitData.WDKIT_DOC_URL}docs/difference-between-wdesignkit-account-and-posimyth-store-account/`,
        size: 'large'
    }

    const navigation = useNavigate();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setsocialLoading] = useState(false);
    const [rememberMe, setrememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [popup_data, setpopup_data] = useState();

    useEffect(() => {

        let loginData = wkit_get_user_login();

        if (loginData?.success) {
            navigation(`/my_uploaded`)
        }

    }, []);

    /** get unique 8 character string */
    const keyUniqueID = () => {
        let date = new Date(),
            year = date.getFullYear().toString().slice(-2),
            number = Math.random();

        number.toString(36);

        let uid = number.toString(36).substr(2, 6);

        return uid + year;
    }

    /** login with email and password */
    const handleSubmit = async e => {

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

            setIsLoading(false)

            if (props?.LoginRoutes) {
                navigation(`${props.LoginRoutes}`)
            } else {
                navigation(`/browse`)
            }

            return;
        } else {
            if (wdkitData?.wdkit_white_label?.help_link) {
                props.wdkit_set_toast([__("Invalid Login Details", 'wdesignkit'), __('The login Details you entered is not correct. Please verify and try again', 'wdesignkit'), '', 'danger'])
            } else {
                setpopup_data(login_popup1);
            }
            setIsLoading(false)
            return;
        }
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
                        await wkit_set_user_login(data);
                    }

                    let user_data = await get_userinfo();
                    props.wdkit_set_meta(user_data.data);
                    props.wdkit_set_toast([res.messages, res.description, '', 'success']);

                    if (props?.LoginRoutes) {
                        navigation(`${props.LoginRoutes}`)
                    } else {
                        navigation(`/my_uploaded`)
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
                        await wkit_set_user_login(data);
                    }

                    let user_data = await get_userinfo();
                    props.wdkit_set_meta(user_data.data);
                    props.wdkit_set_toast([res.messages, res.description, '', 'success']);

                    if (props?.LoginRoutes) {
                        navigation(`${props.LoginRoutes}`)
                    } else {
                        navigation(`/my_uploaded`)
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

    /** social login loading */
    const SocialLoading = (text) => {

        if (socialLoading == text) {
            return (
                <>
                    <span>
                        <span className="wkit-loader"></span>
                        <span className="wkit-loader"></span>
                        <span className="wkit-loader"></span>
                    </span>
                </>
            );
        }

        return <span>{__('Continue with', 'wdesignkit')} {__(text)}</span>

    }

    return (
        <div className={"wkit-login"}>
            <div className="wkit-login-right-side">
                <div className='login-right-heading'>
                    <div className='login-right-h2'>{__('Extend Your Design Capacity with ', 'wdesignkit')}
                        {(wdkitData?.wdkit_white_label?.plugin_name) ?
                            wdkitData?.wdkit_white_label?.plugin_name
                            :
                            <span style={{ marginLeft: '7px' }}>
                                <img className='wkit-logo-img-login' src={ImgPath + "images/jpg/Wdesignkit-full-logo-original.png"} alt="Wdesignkit" draggable="false" />
                            </span>
                        }
                    </div>
                    <div className='login-right-p'>{__(`No time to design? Get ${wdkitData?.wdkit_white_label?.plugin_name ? wdkitData?.wdkit_white_label?.plugin_name : 'Wdesignkit'} today and jump-start your WordPress websites with Elementor, Gutenberg and Bricks.`, 'wdesignkit')}</div>
                    <img src={ImgPath + "images/jpg/carousel-slider.png"} alt="Login" className='login-right-img' draggable={false} />
                </div>
            </div>
            <div className={"wkit-login-left-side"}>
                <div className={"wkit-login-heading"}>
                    <span>{__('Login to ', 'wdesignkit')}
                        {wdkitData?.wdkit_white_label?.plugin_name ? wdkitData?.wdkit_white_label?.plugin_name : __('WDesignKit', 'wdesignkit')}
                    </span>
                    <div className={"wkit-login-desc"}>{__('Explore, Download, or Manage Your Designs and Widgets.', 'wdesignkit')}</div>
                </div>
                <div className="wkit-wb-btns">
                    <button className='wkit-wb-btn' onClick={(e) => GoogleLogin()} >
                        <img src={ImgPath + "images/svg/google.svg"} alt="google" draggable={false} />
                        {SocialLoading(__('Google', 'wdesignkit'))}
                    </button>
                    <button className='wkit-wb-btn' onClick={(e) => FacebookLogin()} >
                        <img src={ImgPath + "images/svg/facebook.svg"} alt="facebook" draggable={false} />
                        {SocialLoading(__('Facebook', 'wdesignkit'))}
                    </button>
                </div>
                <div className="wkit-wb-btn-api">
                    <Link to='/login-api' className='wkit-wb-login-api-link'>
                        <button className='wkit-wb-apiKey'>
                            <img src={ImgPath + "images/svg/login-api.svg"} alt="login-api" draggable={false} />
                            <span>{__('Connect via Login Key', 'wdesignkit')}</span>
                        </button>
                    </Link>
                </div>
                <div className='wkit-wb-main-line'>
                    <div className='wkit-wb-sign-email'>
                        <hr className='wkit-wb-line' />
                        <a className='wkit-wb-line-text'>{__('Or Sign Up with Email', 'wdesignkit')}</a>
                        <hr className='wkit-wb-line' />
                    </div>
                </div>
                <form autoComplete="off" className='wkit-wb-form' onSubmit={handleSubmit}>
                    <div className='wkit-form-group'>
                        <label className='wkit-label'>{__('Email', 'wdesignkit')}</label>
                        <input type="text" name="email" placeholder='Enter Email Address' className='wkit-input-field' autoComplete="off" required onChange={e => setUserName(e.target.value)} />
                    </div>
                    <div className='wkit-form-group wkit-form-password'>
                        <label className='wkit-label'>{__('Password', 'wdesignkit')}</label>
                        <div className='wkit-login-password-inp'>
                            <input type={showPassword ? "text" : "password"} name="password" placeholder='Enter Your Password' className='wkit-input-field' autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                            <div className='wkit-password-eye'>
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
                            </div>
                        </div>
                    </div>
                    <div className='wkit-remember-wrapper'>
                        <label htmlFor='select-1' className='wkit-remember-text'>
                            <input type="checkbox" id='select-1' className='wkit-check-box wkit-styled-checkbox' checked={rememberMe} onChange={(e) => { setrememberMe(e.target.checked) }} />
                            <span className='wkit-login-remember-text'>{__('Remember Me', 'wdesignkit')}</span>
                        </label>
                        {!(wdkitData?.wdkit_white_label?.help_link) &&
                            <a className='wkit-login-desc-text wkit-login-page-link' href={`${wdkitData.wdkit_server_url}password/forgot`} target="_blank" rel="noopener noreferrer" >{__('Forgot Password?', 'wdesignkit')}</a>
                        }
                    </div>
                    {isLoading == true ? (
                        <div className={"wkit-login-btn"}>
                            <div className="wkit-wb-loginloader">
                                <div className="wkit-publish-loader" style={{ display: isLoading && 'flex' }}>
                                    <div className="wb-loader-circle"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button className={"wkit-login-btn"}>
                            {isLoading == "logged" ? __("Logged in", 'wdesignkit') : __("Log in", 'wdesignkit')}
                        </button>)}
                    {!(wdkitData?.wdkit_white_label?.help_link) &&
                        <div className='wkit-login-desc-text'>{__("Don't have an account? ", 'wdesignkit')}
                            <a className='wkit-login-page-link' href={`${wdkitData.wdkit_server_url}signup`} target="_blank" style={{ color: "#C22076" }}>
                                {__('Sign Up', 'wdesignkit')}
                            </a>
                        </div>
                    }
                </form>
            </div>
            {popup_data &&
                <Incorrect_login
                    data={popup_data}
                    btn1_fun={() => { setpopup_data(login_popup2) }}
                    close_popup={() => { setpopup_data('') }}
                />
            }
        </div>
    );
}
export default Wdkit_Login;