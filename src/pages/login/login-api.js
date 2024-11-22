import '../login/login.scss';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Get_site_url } from '../../helper/helper-function';
import Incorrect_login from './incorrect_login';

const {
    __,
} = wp.i18n;

const {
    form_data,
    wkit_set_user_login,
    get_userinfo,
    wkit_get_user_login,
} = wp.wkit_Helper;

const Wdkit_Login_Api = (props) => {

    const navigation = useNavigate();
    let api_login_popup = {
        icon: true,
        heading: 'Wrong or Expired Login Key',
        sub_heading: 'Your login API key seems to be wrong, Ask your webmaster with main WDesignKit Account access for another Login key.',
        sub_heading: [{ type: 'normal', text: 'Your login API key seems to be wrong, Ask your webmaster with main WDesignKit Account access for another Login key.' }],
        checkbox_text: 'I know Purchase key and Login Key is different.',
        note: [
            { type: 'normal', text: 'This Login key is not your WDesignKit\'s Pro Licence\'s Purchase Key. Do you want to know, ' },
            { type: 'link', text: 'How to get Login Key?' }
        ],
        ft_btn1_text: 'Let me Try again',
        ft_btn1_link: '',
        ft_btn1_fun: true,
        ft_btn2_text: 'I need to recheck Login Key',
        ft_btn2_link: `${wdkitData.wdkit_server_url}admin/licence/apikey`,
        ft_btn2_fun: false,
        ex_link_text: '',
        ex_link_url: '',
        size: 'small'
    }
    var ImgPath = wdkitData.WDKIT_ASSETS;
    const [token, settoken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [popup_data, setpopup_data] = useState();

    useEffect(() => {
        let loginData = wkit_get_user_login();

        if (loginData?.success) {
            navigation('/my_uploaded')
        }
    }, [])

    const TokenInput = useRef();

    const Api_click = async () => {
        let site_url = Get_site_url();
        setIsLoading(true)

        let form_array = {
            'type': 'api_login',
            'buildertype': window.wdkit_editor,
            'login_type': 'session',
            'site_url': site_url,
            'token': token,
        }

        var res = await form_data(form_array).then(result => { return result; });
        if (res?.data?.success == true) {

            let user_email = res.data.user.user_email,
                success = res.data.success,
                messages = "Login successfully",
                token = res.token;

            const data = {
                'messages': messages,
                'user_email': user_email,
                'login_type': 'session',
                'token': token,
                "success": success,
            }

            if (token && user_email) {
                await wkit_set_user_login(data);
            }

            let user_data = await get_userinfo();
            props.wdkit_set_meta(user_data.data);
            setIsLoading(false)
            props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'success']);

            navigation('/my_uploaded')
        } else {
            setIsLoading(false)
            setpopup_data(api_login_popup)
        }
    }

    const Check_token = (e) => {
        if (token) {
            Api_click()
        } else {
            props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'danger']);
        }
    }

    return (
        <div className={"wkit-login"}>
            <div className="wkit-login-right-side">
                <div className='login-right-heading'>
                    <img src={ImgPath + "images/jpg/log-in-api.png"} alt="Login" className='login-api-right-img' draggable={false} />
                </div>
            </div>
            <div className={"wkit-login-left-side"}>
                <div>
                    <div className={"wkit-login-heading"}>
                        <span>{__('Login With Key')}</span>
                        <div className='wkit-login-desc'>{__('Enter your Login Key to get access')}</div>
                    </div>
                </div>
                <div className='wkit-form-group'>
                    <label className='wkit-login-label'>{__('Login Key')}</label>
                    <input
                        type="text"
                        name="email"
                        ref={TokenInput}
                        onChange={(e) => { settoken(e.target.value) }}
                        placeholder='23eaf7f0-f4f7-495e-8b86-fad3261282ac'
                        className='wkit-input-field'
                        autoComplete="off"
                        required
                    />
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
                    <button className={"wkit-login-btn"} onClick={(e) => { Check_token(e) }}>{isLoading == 'logged' ? __('Logged In') : __('Login')}</button>
                )}
                <Link to='/login' className='wkit-wb-backLogin'>
                    <button className='wkit-login-back-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none"><path d="M22 11.25C22.6904 11.25 23.25 10.6904 23.25 10C23.25 9.30964 22.6904 8.75 22 8.75L22 11.25ZM1.11612 9.11612C0.627962 9.60427 0.627962 10.3957 1.11612 10.8839L9.07107 18.8388C9.55922 19.327 10.3507 19.327 10.8388 18.8388C11.327 18.3507 11.327 17.5592 10.8388 17.0711L3.76777 10L10.8388 2.92893C11.327 2.44078 11.327 1.64932 10.8388 1.16116C10.3507 0.673009 9.55922 0.673009 9.07107 1.16116L1.11612 9.11612ZM22 8.75L2 8.75L2 11.25L22 11.25L22 8.75Z" fill="#C22076" /></svg>
                        <span>{__('Back to Login')}</span>
                    </button>
                </Link>
                <div className='wkit-login-desc-text'>
                    {__('You need existing account to use this method. ')}
                    <a className="wkit-login-page-link" href={`${wdkitData.wdkit_server_url}signup`} target="_blank" rel="noopener noreferrer" style={{ color: "#C22076" }}>{__('Signup')}</a>
                </div>
                <div className='wkit-login-desc-text'>
                    <a className="wkit-login-page-link" href={wdkitData.WDKIT_DOC_URL + 'documents/create-login-api-key-to-login-to-wdesignkit-account/'} style={{ color: "#C22076" }} target="_blank" rel="noopener noreferrer">
                        {__('How to get Login Key?')}
                    </a>
                </div>
            </div>
            {popup_data &&
                <Incorrect_login
                    data={popup_data}
                    btn1_fun={() => { setpopup_data('') }}
                    close_popup={() => { setpopup_data('') }}
                />
            }
        </div>
    );
}
export default Wdkit_Login_Api;