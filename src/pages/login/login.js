import '../login/login.scss';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

const { __ } = wp.i18n;

const { form_data, wkit_set_user_login, get_userinfo } = wp.wkit_Helper;

const Wdkit_Login = (props) => {

    var ImgPath = wdkitData.WDKIT_ASSETS;
    const navigation = useNavigate();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setsocialLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    /** get unique 8 character string */
    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    /** login with email and password */
    const handleSubmit = async e => {
        e.preventDefault();
        if (!username) {
            props.wdkit_set_toast(["Please fill all fields", 'Missing information! Complete all fields.', '', 'danger'])

            return;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(username)) {
            props.wdkit_set_toast(["Invalid Login Details", 'Login Error: Check your details and try again.', '', 'danger'])

            return;
        }

        if (!password) {
            props.wdkit_set_toast(["Please fill all fields", 'Missing information! Complete all fields.', '', 'danger'])
            return;
        }

        setIsLoading(true);

        let form_arr = {
            'type': 'wkit_login',
            'user_email': username,
            'user_password': password
        }

        let resp = await form_data(form_arr).then(result => result);

        if (resp?.success) {
            wkit_set_user_login(Object.assign({}, { 'user_email': username }, resp, { 'login_type': 'normal' }))

            let user_data = await get_userinfo();
            props.wdkit_set_meta(user_data.data);

            if (resp.messages) {
                props.wdkit_set_toast([resp?.messages, resp?.description, '', 'success']);
            }

            setIsLoading(false)

            if (props.LoginRoutes) {
                navigation(`/${props.LoginRoutes}`)
            } else {
                navigation(`/browse`)
            }

            return;
        } else {
            if (resp?.message) {
                props.wdkit_set_toast([resp?.message, resp?.description, '', 'danger']);
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

                let form_array = { 'type': 'social_login', 'state': unique_id }
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

                    if (props.LoginRoutes) {
                        navigation(`/${props.LoginRoutes}`)
                    } else {
                        navigation(`/my_uploaded`)
                    }
                } else {
                    props.wdkit_set_toast(["Invalid Login Details", 'Login Error: Check your details and try again.', '', 'danger'])
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

                let form_array = { 'type': 'social_login', 'state': unique_id }
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

                    if (props.LoginRoutes) {
                        navigation(`/${props.LoginRoutes}`)
                    } else {
                        navigation(`/my_uploaded`)
                    }
                } else {
                    props.wdkit_set_toast(["Invalid Login Details", 'Login Error: Check your details and try again.', '', 'danger'])
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

        return <span>Continue with {__(text)}</span>

    }

    return (
        <div className={"wkit-login"}>
            <div className="wkit-login-right-side">
                <div className='login-right-heading'>
                    <div className='login-right-h2'>Extend Your Design Capacity with <span><img src={ImgPath + "images/jpg/group.png"} alt="Wdesignkit" /></span></div>
                    <div className='login-right-p'>No time to design? Get Wdesignkit today and jump-start your Elementor & Gutenberg websites</div>
                    <img src={ImgPath + "images/jpg/carousel-slider.png"} alt="Login" className='login-right-img' />
                    {/* <iframe src="https://www.youtube.com/embed/yG_oyhz-oAY" className="wkit-video-edit"></iframe> */}
                </div>
            </div>
            <div className={"wkit-login-left-side"}>
                <div className={"wkit-login-heading"}>
                    <span>{__('Login to WDesignKit')}</span>
                    <div className={"wkit-login-desc"}>{__('Explore, Download or Manage your Designs and Widgets.')}</div>
                </div>
                <div className="wkit-wb-btns">
                    <button className='wkit-wb-btn' onClick={(e) => GoogleLogin()} >
                        <img src={ImgPath + "images/svg/google.svg"} alt="google" />
                        {SocialLoading('Google')}
                    </button>
                    <button className='wkit-wb-btn' onClick={(e) => FacebookLogin()} >
                        <img src={ImgPath + "images/svg/facebook.svg"} alt="facebook" />
                        {SocialLoading('Facebook')}
                    </button>
                </div>
                <div className="wkit-wb-btn-api">
                    <Link to='/login-api' className='wkit-wb-login-api-link'>
                        <button className='wkit-wb-apiKey'>
                            <img src={ImgPath + "images/svg/login-api.svg"} alt="login-api" />
                            <span>{__('Connect via API key')}</span>
                        </button>
                    </Link>
                </div>
                <div className='wkit-wb-main-line'>
                    <div className='wkit-wb-sign-email'>
                        <hr className='wkit-wb-line' />
                        <a className='wkit-wb-line-text'>{__('Or sign in with Email')}</a>
                        <hr className='wkit-wb-line' />
                    </div>
                </div>
                <form autoComplete="off" className='wkit-wb-form' onSubmit={handleSubmit}>
                    <div className='wkit-form-group'>
                        <label className='wkit-label'>{__('Email')}</label>
                        <input type="text" name="email" placeholder='Enter Email Address' className='wkit-input-field' autoComplete="off" required onChange={e => setUserName(e.target.value)} />
                    </div>
                    {/* <div className='wkit-form-group'>
                        <label className='wkit-label'>{__('Password')}</label>
                        <input type="password" name="password" placeholder='Enter your Password' className='wkit-input-field' autoComplete="off" required onChange={e => setPassword(e.target.value)} />
                    </div> */}
                    <div className='wkit-form-group wkit-form-password'>
                        <label className='wkit-label'>{__('Password')}</label>
                        <div className='wkit-login-password-inp'>
                            <input type={showPassword ? "text" : "password"} name="password" placeholder='Enter your Password' className='wkit-input-field' autoComplete="off" required onChange={e => setPassword(e.target.value)} />
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
                        <div className='wkit-remember-text'>
                            <input type="checkbox" id='select-1' className='wkit-check-box wkit-styled-checkbox' />
                            <label htmlFor='select-1'>{__('Remember me')}</label>
                        </div>
                        <a className='wkit-login-desc-text' href={`${wdkitData.wdkit_server_url}password/forgot`} target="_blank" rel="noopener noreferrer" >{__('Forgot Password?')}</a>
                    </div>
                    <button className={"wkit-login-btn"}>
                        {isLoading == true ? (
                            <>
                                <div className="wkit-wb-loginloader">
                                    <div className="wkit-publish-loader" style={{ display: isLoading && 'flex' }}>
                                        <div className="wb-loader-circle"></div>
                                    </div>
                                </div>
                            </>
                        ) : isLoading == "logged" ? (
                            __("Logged in")
                        ) : (
                            __("Log in")
                        )}
                    </button>
                    <div className='wkit-login-desc-text'>{__("Don't have an account?")}
                        <a href={`${wdkitData.wdkit_server_url}signup`} target="_blank" style={{ color: "#C22076" }}>
                            {__(' Sign Up')}
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Wdkit_Login;