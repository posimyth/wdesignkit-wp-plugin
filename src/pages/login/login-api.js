import '../login/login.scss';
import { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";

const {
    __,
} = wp.i18n;

const {
    form_data,
    wkit_set_user_login,
    get_userinfo
} = wp.wkit_Helper;

const Wdkit_Login_Api = (props) => {

    const navigation = useNavigate();
    var ImgPath = wdkitData.WDKIT_ASSETS;
    const [token, settoken] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const TokenInput = useRef();

    const Api_click = async () => {

        setIsLoading(true)

        let form_array = {
            'type': 'api_login',
            'buildertype': window.wdkit_editor,
            'plugin_domain': window.location.origin + window.location.pathname,
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
                'login_type': 'api',
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
            props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'danger']);
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
                    <img src={ImgPath + "images/jpg/log-in-api.png"} alt="Login" className='login-api-right-img' />
                    {/* <iframe src="https://www.youtube.com/embed/yG_oyhz-oAY" className="wkit-video-edit"></iframe> */}
                </div>
            </div>
            <div className={"wkit-login-left-side"}>
                <div>
                    <div className={"wkit-login-heading"}>
                        <span>{__('API')}</span>
                        <div className='wkit-login-desc'>{__('Please copy the key and paste it here')}</div>
                    </div>
                </div>
                <div className='wkit-form-group'>
                    <label className='wkit-login-label'>{__('API Key')}</label>
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
                <button className={"wkit-login-btn"} onClick={(e) => { Check_token(e) }}>{isLoading == true ? __('Please wait...') : isLoading == 'logged' ? __('Logged In') : __('Log In')}</button>
                <Link to='/login' className='wkit-wb-backLogin'>
                    <button className='wkit-login-back-btn'>
                        <img src={ImgPath + "images/svg/left-arrow.svg"} alt="google" />
                        <span>{__('Back to Login')}</span>
                    </button>
                </Link>
                <div className='wkit-login-desc-text'>
                    {__('If you have no Account you can ')}
                    <a href={`${wdkitData.wdkit_server_url}signup`} target="_blank" style={{ color: "#C22076" }}>{__('Sign UP!')}</a>
                </div>
            </div>
        </div>
    );
}
export default Wdkit_Login_Api;