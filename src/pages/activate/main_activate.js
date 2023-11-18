import './activation.scss';
import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Page_header } from '../../helper/helper-function';
const { Fragment } = wp.element;

const {
    __,
} = wp.i18n;

const {
    wkit_get_user_login,
    form_data,
} = wp.wkit_Helper;

var arraydata = [
    { 'id': 'accoridion-1', accordion_title: 'Reflects your audience’s needs.', content: 'By easily connecting your different ad accounts to WASK' },
    { 'id': 'accoridion-2', accordion_title: 'Coverrs a board range of intent (transactional, informational, etc.).', content: 'By easily connecting your different ad accounts to WASK' },
    { 'id': 'accoridion-3', accordion_title: 'ands new user to the website by solving problems.', content: 'By easily connecting your different ad accounts to WASK' },
    { 'id': 'accoridion-4', accordion_title: 'By easily connecting your different ad accounts to WASK,', content: 'By easily connecting your different ad accounts to WASK' },
    { 'id': 'accoridion-5', accordion_title: 'Drives internal pageviews to other important pages.', content: 'By easily connecting your different ad accounts to WASK' },
]

const Activate = (props) => {

    let data = wkit_get_user_login()
    if (!data) {
        props.wdkit_Login_Route('activate');
        return <Navigate to='/login' />
    }

    const history = useNavigate();
    const [apiData, setApiData] = useState(props?.wdkit_meta?.useractivate ? props?.wdkit_meta?.useractivate : { nexter: [], tpag: [], tpae: [] });
    const [userCredits, setUserCredits] = useState({ "templates": 0, "widgets": 0, 'workspace': 0 });
    const [checkApi, setCheckApi] = useState(false)
    const [errorMsg, setErrorMsg] = useState({})
    const [accordianFaq, setaccordianFaq] = useState(0);

    useEffect(() => {
        let user_credits = {
            'templates': props?.wdkit_meta?.creadit?.templates_limit,
            'widgets': props?.wdkit_meta?.creadit?.widgets_limit,
            'workspace': props?.wdkit_meta?.creadit?.workspace_limit
        }

        setUserCredits(user_credits);
    }, [props?.wdkit_meta])

    const pinMessage = (license = '', checkActive = '') => {
        if (checkActive == 'active' && license == 'valid') {
            return __('Verified')
        } else if (checkActive == 'expired' && license == 'expired') {
            return __('Expired')
        } else if (checkActive == 'inactive') {
            return __('Unverified')
        }
    }

    const activate_msg = (license = '', type = 'inactive', product = '') => {
        let output = '';
        if (type == 'active' && license == 'valid') {
            let pro_name = '';
            if (product == 'tpae') {
                pro_name = 'The Plus Addons for Elementor PRO'
            } else if (product == 'tpag') {
                pro_name = 'The Plus Addons for Gutenberg PRO'
            } else if (product == 'nexter') {
                pro_name = 'NexterWP'
            }
            output = <Fragment><span className='activate-msg'><svg width="16" height="14" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.90625 4.33113L3.35409 6.72334L9.08426 0.993164" stroke="white" strokeWidth="1.00139" /></svg></span>{__('Congratulations ! ' + pro_name + ' Version is Activated')}</Fragment>
        } else if (type == 'expired' && license == 'expired') {
            output = <Fragment><span className='expired-msg'><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5918 4.20605L4.20625 11.5916" stroke="white" strokeWidth="1.00117" /><path d="M11.502 11.501L4.1164 4.11543" stroke="white" strokeWidth="1.00117" /></svg></span>{__('Your Licence Key is Expired !!! Please Activate Now')}</Fragment>
        } else if (type == 'inactive') {
            output = <Fragment><span className='inactivate-msg'><svg width="3" height="36" viewBox="0 0 2 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.171875 0.585938H1.95512L1.70037 8.73793H0.426625L0.171875 0.585938Z" fill="white" /><rect x="0.425781" y="9.75684" width="1.27375" height="1.27375" fill="white" /></svg></span>{__('Its\'s time to enter licence key, you\'re just one step away from getting PRO')}</Fragment>
        }
        return output
    }

    const toggleClick = (product = '') => {
        if (product) {
            if (product == 'tpae') {
                if (apiData.tpae.toggle) {
                    apiData.tpae.toggle = false
                } else {
                    apiData.tpae.toggle = true
                }
            } else if (product == 'tpag') {
                if (apiData.tpag.toggle) {
                    apiData.tpag.toggle = false
                } else {
                    apiData.tpag.toggle = true
                }
            } else if (product == 'nexter') {
                if (apiData.nexter.toggle) {
                    apiData.nexter.toggle = false
                } else {
                    apiData.nexter.toggle = true
                }
            }
            setApiData({ ...apiData })
        }
    }

    const submitApi = async (type, product_action = 'activate') => {

        setCheckApi(type)
        setErrorMsg({})

        let loginData = wkit_get_user_login()
        let userEmail = ''

        if (loginData && loginData.user_email) {
            userEmail = loginData.user_email
        }
        if (userEmail == '') {
            return history('/login')
        }
        let apiKey = '';
        if (type == 'tpae' && apiData.tpae.ApiKey && apiData.tpae.ApiKey != '') {
            apiKey = apiData.tpae.ApiKey
        } else if (type == 'tpag' && apiData.tpag.ApiKey && apiData.tpag.ApiKey != '') {
            apiKey = apiData.tpag.ApiKey
        } else if (type == 'nexter' && apiData.nexter.ApiKey && apiData.nexter.ApiKey != '') {
            apiKey = apiData.nexter.ApiKey
        }
        if (apiKey == '') {
            setErrorMsg({ product: type, message: 'API key is Empty' });
            setCheckApi(false)
            return;
        }

        let args = { 'type': 'wkit_activate_key', 'email': userEmail, 'product': type, 'apikey': apiKey, 'product_action': product_action }
        let res = await form_data(args);

        if (res && res.data && res.data) {
            let data = res.data;
            if (data.success == false && data.message == 'Your API key is Deactivated') {
                apiData[type] = { toggle: true }
            } else {
                apiData[type].license = data.license ? data.license : ''
                apiData[type].ApiKey = data.ApiKey && data.ApiKey
                apiData[type].status = data.status ? data.status : false
                apiData[type].success = data.success ? data.success : false
            }
            if (data.templates_limit != undefined) {
                setUserCredits({ templates: data.templates_limit || 0, widgets: data.widgets_limit || 0, workspace: data.workspace_limit || 1 })
            }
            setCheckApi(false)
            setApiData({ ...apiData })
            if (props?.wdkit_meta) {
                if (props?.wdkit_meta?.useractivate && props?.wdkit_meta?.useractivate[type]) {
                    props.wdkit_meta.useractivate[type] = apiData[type]
                }
            }
        }
        setCheckApi(false)
    }

    const disbaleasa = (index) => {
        if (accordianFaq == index) {
            setaccordianFaq(-1)
        } else {
            setaccordianFaq(index)
        }
    }


    return (
        <div className='wkit-activate-key-wrapper'>
            <Page_header
                title={'Activate Licence'}
                svg={<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="wkit-activate-icon-data">
                    <path d="M33 15V9C33 7.35 31.65 6 30 6H6C4.35 6 3.015 7.35 3.015 9V15C4.665 15 6 16.35 6 18C6 19.65 4.665 21 3 21V27C3 28.65 4.35 30 6 30H30C31.65 30 33 28.65 33 27V21C31.35 21 30 19.65 30 18C30 16.35 31.35 15 33 15ZM30 12.81C28.215 13.845 27 15.795 27 18C27 20.205 28.215 22.155 30 23.19V27H6V23.19C7.785 22.155 9 20.205 9 18C9 15.78 7.8 13.845 6.015 12.81L6 9H30V12.81ZM13.605 24L18 21.18L22.395 24L21.06 18.96L25.095 15.66L19.89 15.345L18 10.5L16.095 15.33L10.89 15.645L14.925 18.945L13.605 24Z" fill="#040483" />
                </svg>}
            />
            <div className='wkit-active-subheading'>{__('Activate from your existing Purchase Key.')}</div>

            <div className='wkit-activation-key-accordion'>
                <div className={`wkit-activation-loop product-tpae ` + ((apiData.tpae.toggle) ? 'key-active-toggle' : '')}>
                    <div className='activation-acc-title' onClick={() => toggleClick('tpae')}>
                        <svg className="active-product-icon" width="45" height="45" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.302" d="M14.6496 11.5176H13.3509V13.3496H11.5176V14.6482H13.3509V16.4816H14.6496V14.6482H16.4802V13.3496H14.6496V11.5176Z" fill="white" />
                            <path opacity="0.302" d="M14.0006 0.591797H9.09262V13.3518H5.14062V14.6505H9.09796V16.4825H10.3966V1.89046H13.9966C14.9479 1.8929 15.8597 2.27078 16.5339 2.94192C17.208 3.61307 17.5899 4.52322 17.5966 5.47446V7.98646H18.9006V5.47313C18.8936 4.17746 18.3745 2.93714 17.4565 2.02269C16.5386 1.10825 15.2963 0.59389 14.0006 0.591797" fill="white" />
                            <path opacity="0.302" d="M14.6482 5.14062H13.3496V9.09796H11.5176V10.3966H26.1096V13.9966C26.1071 14.9479 25.7293 15.8597 25.0581 16.5339C24.387 17.208 23.4768 17.5899 22.5256 17.5966H20.0149V18.9006H22.5282C23.8253 18.8936 25.0668 18.3734 25.9815 17.4537C26.8962 16.534 27.4096 15.2897 27.4096 13.9926V9.08862H14.6496V5.14062" fill="white" />
                            <path opacity="0.302" d="M18.9129 11.5176H17.6063V26.1096H14.0063C13.0551 26.1068 12.1435 25.7288 11.4694 25.0577C10.7953 24.3867 10.4133 23.4767 10.4063 22.5256V20.0149H9.09961V22.5282C9.10666 23.8253 9.62686 25.0668 10.5465 25.9815C11.4662 26.8962 12.7105 27.4096 14.0076 27.4096H18.9129V14.6496H22.8703V13.3509H18.9129V11.5176Z" fill="white" />
                            <path opacity="0.302" d="M7.98646 9.09961H5.47313C4.177 9.10665 2.93627 9.62612 2.02176 10.5446C1.10724 11.4632 0.593186 12.7061 0.591797 14.0023V18.9129H13.3518V22.8689H14.6505V18.9129H16.4825V17.6063H1.89046V14.0063C1.8929 13.0548 2.27096 12.1427 2.9424 11.4686C3.61383 10.7944 4.52432 10.4126 5.4758 10.4063H7.98646V9.09961Z" fill="white" />
                            <path d="M18.8995 13.3516H11.5195V14.6502H18.8995V13.3516Z" fill="white" />
                            <path d="M10.3944 9.09375H9.0957V18.9044H10.3944V9.09375Z" fill="white" />
                            <path d="M18.9034 9.09961H11.5234V10.3983H18.9034V9.09961Z" fill="white" />
                            <path d="M18.8897 17.6035H11.5137V18.9022H18.8897V17.6035Z" fill="white" />
                        </svg>

                        <span className='wkit-product-name'>{__('The Plus Addons for Elementor')}</span>
                        {(apiData.tpae.license && apiData.tpae.status) &&
                            <span className={'wkit-activate-status active-' + apiData.tpae.status}>{pinMessage(apiData.tpae.license || '', apiData.tpae.status || '')}</span>
                        }
                        <span className='wkit-acc-toggle-icon'>
                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.11953 6.71043L5.99953 2.83043L9.87953 6.71043C10.2695 7.10043 10.8995 7.10043 11.2895 6.71043C11.6795 6.32043 11.6795 5.69043 11.2895 5.30043L6.69953 0.71043C6.30953 0.32043 5.67953 0.32043 5.28953 0.71043L0.699532 5.30043C0.309532 5.69043 0.309532 6.32043 0.699532 6.71043C1.08953 7.09043 1.72953 7.10043 2.11953 6.71043Z" fill="#040483" />
                            </svg>
                        </span>
                    </div>
                    <div className='activation-acc-content'>
                        <div className='wkit-form-activate'>
                            {(apiData.tpae.license && apiData.tpae.license == 'valid' && apiData.tpae.status && apiData.tpae.status == "active") ?
                                <Fragment>
                                    <span className={'wkit-input-active-key'}>{'**** **** **** ' + apiData.tpae.ApiKey}</span>
                                    <button className='wkit-submit-deactivate' onClick={() => submitApi('tpae', 'deactivate')}>{(checkApi && checkApi == 'tpae') ? <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" stroke-dasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg> : __('Deactivate')}</button>
                                </Fragment>
                                :
                                <Fragment>
                                    <input type="text" className='wkit-input-activate-key product-tpae' onChange={(e) => { apiData.tpae.ApiKey = e.target.value; setApiData({ ...apiData }) }} placeholder='XXXXXXXXX6789'/>
                                    <button className={'wkit-submit-activate'} onClick={() => submitApi('tpae')}>{(checkApi && checkApi == 'tpae') ? <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" stroke-dasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg> : __('Activate')}</button>
                                    <a href="#" target="_blank" className='wkit-no-key'>{__('Don\'t have a key ?')}</a>
                                </Fragment>
                            }
                        </div>
                        <div className={'wkit-activate-message ' + (errorMsg && errorMsg.product == 'tpae' ? 'kit-error-msg' : '')}>{activate_msg(apiData.tpae.license || '', apiData.tpae.status || '', 'tpae')}{((errorMsg && errorMsg.product == 'tpae') ? errorMsg.message : '')}</div>
                    </div>
                </div>

                <div className={`wkit-activation-loop product-tpag ` + ((apiData.tpag.toggle) ? 'key-active-toggle' : '')}>
                    <div className='activation-acc-title' onClick={() => toggleClick('tpag')}>
                        <svg className="active-product-icon" width="45" height="45" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M14.6885 11.5254H13.3925V13.3521H11.5645V14.6481H13.3925V16.4761H14.6885V14.6481H16.5138V13.3521H14.6885V11.5254Z" fill="white" /><path opacity="0.3" d="M14.0378 0.626953H9.14445V13.351H5.20312V14.647H9.14846V16.4736H10.4445V1.92295H14.0378C14.9866 1.92504 15.8962 2.30159 16.5688 2.97074C17.2415 3.63989 17.6228 4.54752 17.6298 5.49629V8.00029H18.9271V5.49495C18.9204 4.20225 18.4025 2.96471 17.4864 2.05262C16.5703 1.14053 15.3305 0.627993 14.0378 0.626953" fill="white" /><path opacity="0.3" d="M14.6871 5.16406H13.3911V9.1094H11.5645V10.4054H26.1151V13.9987C26.113 14.9482 25.7359 15.8584 25.0659 16.5312C24.3959 17.2039 23.4873 17.5848 22.5378 17.5907H20.0378V18.8881H22.5378C23.831 18.881 25.0688 18.3624 25.9807 17.4454C26.8926 16.5285 27.4045 15.2879 27.4044 13.9947V9.10139H14.6871V5.16406Z" fill="white" /><path opacity="0.3" d="M18.9271 11.5254H17.6284V26.0761H14.0378C13.0888 26.0743 12.1788 25.6979 11.5059 25.0287C10.8329 24.3596 10.4515 23.4517 10.4444 22.5027V19.9987H9.14844V22.4987C9.15548 23.7919 9.67415 25.0297 10.5911 25.9416C11.508 26.8535 12.7486 27.3654 14.0418 27.3654H18.9351V14.6481H22.8818V13.3521H18.9271V11.5254Z" fill="white" /><path opacity="0.3" d="M8.03935 9.10938H5.53402C4.24131 9.11607 3.00377 9.63402 2.09168 10.5501C1.17959 11.4662 0.667055 12.706 0.666016 13.9987V18.892H13.39V22.8374H14.686V18.8881H16.5127V17.5894H1.96202V13.9987C1.96375 13.0495 2.34033 12.1393 3.0098 11.4663C3.67928 10.7934 4.58745 10.4121 5.53668 10.4054H8.03935V9.10938Z" fill="white" /><path d="M10.4426 1.92295H14.0359C14.9849 1.92468 15.8949 2.30108 16.5678 2.97027C17.2407 3.63945 17.6222 4.54729 17.6292 5.49629V8.00029H18.9266V5.49495C18.9199 4.20202 18.4017 2.96428 17.4854 2.05215C16.569 1.14002 15.3289 0.62764 14.0359 0.626953L9.14258 0.626953V16.4723H10.4426V1.92295Z" fill="white" /><path d="M17.8277 13.3516H13.3904V14.6476H17.6304V26.0756H14.0397C13.0907 26.0738 12.1808 25.6974 11.5078 25.0282C10.8349 24.3591 10.4534 23.4512 10.4464 22.5022V19.9996H9.15039V22.5049C9.15744 23.7981 9.6761 25.0359 10.593 25.9478C11.5099 26.8597 12.7505 27.3716 14.0437 27.3716H18.9371V13.3516H17.8277Z" fill="white" /></svg>

                        <span className='wkit-product-name'>{__('The Plus Addons for Gutenberg')}</span>
                        {(apiData.tpag.license && apiData.tpag.status) &&
                            <span className={'wkit-activate-status active-' + apiData.tpag.status}>{pinMessage(apiData.tpag.license || '', apiData.tpag.status || '')}</span>
                        }
                        <span className='wkit-acc-toggle-icon'><svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.11953 6.71043L5.99953 2.83043L9.87953 6.71043C10.2695 7.10043 10.8995 7.10043 11.2895 6.71043C11.6795 6.32043 11.6795 5.69043 11.2895 5.30043L6.69953 0.71043C6.30953 0.32043 5.67953 0.32043 5.28953 0.71043L0.699532 5.30043C0.309532 5.69043 0.309532 6.32043 0.699532 6.71043C1.08953 7.09043 1.72953 7.10043 2.11953 6.71043Z" fill="#040483" /></svg></span>
                    </div>
                    <div className='activation-acc-content'>
                        <div className='wkit-form-activate'>
                            {(apiData.tpag.license && apiData.tpag.license == 'valid' && apiData.tpag.status && apiData.tpag.status == "active") ?
                                <Fragment>
                                    <span className={'wkit-input-active-key'}>{'**** **** **** ' + apiData.tpag.ApiKey}</span>
                                    <button className='wkit-submit-deactivate' onClick={() => submitApi('tpag', 'deactivate')}>{(checkApi && checkApi == 'tpag') ? <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" stroke-dasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg> : __('Deactivate')}</button>
                                </Fragment>
                                :
                                <Fragment>
                                    <input type="text" className='wkit-input-activate-key product-tpag' onChange={(e) => { apiData.tpag.ApiKey = e.target.value; setApiData({ ...apiData }) }} placeholder='XXXXXXXXX6789'/>
                                    <button className={'wkit-submit-activate'} onClick={() => submitApi('tpag')}>{(checkApi && checkApi == 'tpag') ? <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" stroke-dasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg> : __('Activate')}</button>
                                    <a href="#" target="_blank" className='wkit-no-key'>{__('Don\'t have a key ?')}</a>
                                </Fragment>
                            }
                        </div>
                        <div className={'wkit-activate-message' + (errorMsg && errorMsg.product == 'tpag' ? 'kit-error-msg' : '')}>{activate_msg(apiData.tpag.license || '', apiData.tpag.status || '', 'tpag')}{((errorMsg && errorMsg.product == 'tpag') ? errorMsg.message : '')}</div>
                    </div>
                </div>
                <div className={`wkit-activation-loop product-nexter ` + ((apiData.nexter.toggle) ? 'key-active-toggle' : '')}>
                    <div className='activation-acc-title' onClick={() => toggleClick('nexter')}>
                        <svg className="active-product-icon" width="45" height="45" viewBox="0 0 5 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.27273 20.4249L4.25928 23.5003H0V19.2275H3.08089C3.10778 19.2275 3.12796 19.2385 3.15101 19.2415C3.2828 19.2566 3.41202 19.29 3.53516 19.341C3.57549 19.3549 3.61487 19.3729 3.65232 19.3898C3.66192 19.3967 3.67249 19.4007 3.68209 19.4077C3.88343 19.5004 4.04789 19.662 4.14788 19.8655C4.1546 19.8765 4.15748 19.8824 4.16132 19.8894C4.18039 19.9308 4.19614 19.9737 4.20838 20.0178C4.21863 20.0472 4.22634 20.0775 4.23143 20.1084C4.25759 20.2117 4.27145 20.318 4.27273 20.4249Z" fill="white" /><path d="M4.27272 0.506765V16.1828C4.27272 16.4274 4.14844 16.6391 3.89313 16.8213C3.62936 17.0051 3.30258 17.1002 2.96923 17.0902H0V0.000135859H3.56461C3.74365 -0.00299344 3.91868 0.0480148 4.06173 0.14501C4.12719 0.18506 4.18069 0.239019 4.21749 0.302114C4.25429 0.36521 4.27326 0.435499 4.27272 0.506765Z" fill="white" /></svg>

                        <span className='wkit-product-name'>{__('NexterWP')}</span>
                        {(apiData.nexter.license && apiData.nexter.status) &&
                            <span className={'wkit-activate-status active-' + apiData.nexter.status}>{pinMessage(apiData.nexter.license || '', apiData.nexter.status || '')}</span>
                        }
                        <span className='wkit-acc-toggle-icon'><svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.11953 6.71043L5.99953 2.83043L9.87953 6.71043C10.2695 7.10043 10.8995 7.10043 11.2895 6.71043C11.6795 6.32043 11.6795 5.69043 11.2895 5.30043L6.69953 0.71043C6.30953 0.32043 5.67953 0.32043 5.28953 0.71043L0.699532 5.30043C0.309532 5.69043 0.309532 6.32043 0.699532 6.71043C1.08953 7.09043 1.72953 7.10043 2.11953 6.71043Z" fill="#040483" /></svg></span>
                    </div>
                    <div className='activation-acc-content'>
                        <div className='wkit-form-activate'>
                            {(apiData.nexter.license && apiData.nexter.license == 'valid' && apiData.nexter.status && apiData.nexter.status == "active") ?
                                <Fragment>
                                    <span className={'wkit-input-active-key'}>{'**** **** **** ' + apiData.nexter.ApiKey}</span>
                                    <button className='wkit-submit-deactivate' onClick={() => submitApi('nexter', 'deactivate')}>{(checkApi && checkApi == 'nexter') ? <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" stroke-dasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg> : __('Deactivate')}</button>
                                </Fragment>
                                :
                                <Fragment>
                                    <input type="text" className='wkit-input-activate-key product-nexter' onChange={(e) => { apiData.nexter.ApiKey = e.target.value; setApiData({ ...apiData }) }} placeholder='XXXXXXXXX6789'/>
                                    <button className={'wkit-submit-activate'} onClick={() => submitApi('nexter')}>{(checkApi && checkApi == 'nexter') ? <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#fff" strokeWidth="6" r="44" stroke-dasharray="207.34511513692632 71.11503837897544"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1.8518518518518516s" values="0 50 50;360 50 50" keyTimes="0;1" /></circle></svg> : __('Activate')}</button>
                                    <a href="#" target="_blank" className='wkit-no-key'>{__('Don\'t have a key ?')}</a>
                                </Fragment>
                            }
                        </div>
                        <div className={'wkit-activate-message' + (errorMsg && errorMsg.product == 'nexter' ? 'kit-error-msg' : '')}>{activate_msg(apiData.nexter.license || '', apiData.nexter.status || '', 'nexter')}{((errorMsg && errorMsg.product == 'nexter') ? errorMsg.message : '')}</div>
                    </div>
                </div>
            </div>

            <div className='wkit-active-subheading'>{__('Your Current Status of Storage.')}</div>
            <div className='wkit-grid-row'>
                <div className='wkit-grid-col'>
                    <div className='wkit-box-bg wkit-flex wkit-p-15 wkit-justify-content'>
                        <div className='wkit-icon-box'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M34 3H6C4.34315 3 3 4.34315 3 6V13H37V6C37 4.34315 35.6569 3 34 3ZM0 13V16V34C0 37.3137 2.68629 40 6 40H25.332H28.332H34C37.3137 40 40 37.3137 40 34V16V13V6C40 2.68629 37.3137 0 34 0H6C2.68629 0 0 2.68629 0 6V13ZM28.332 37H34C35.6569 37 37 35.6569 37 34V16H28.332L28.332 37ZM25.332 16H3V34C3 35.6569 4.34315 37 6 37H25.332L25.332 16Z" fill="white" /></svg>
                        </div>
                        <div className='wkit-title-wrap-box'>
                            <div className='wkit-count-num'>{userCredits.templates}</div>
                            <h5 className='wkit-box-title'>{__('Design Templates')}</h5>
                        </div>
                    </div>
                </div>
                <div className='wkit-grid-col'>
                    <div className='wkit-box-bg wkit-flex wkit-p-15 wkit-justify-content'>
                        <div className='wkit-icon-box'>
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M14.7782 3H5.00043C3.89587 3 3.00043 3.89543 3.00043 5V14.7778H12.7782C13.8828 14.7778 14.7782 13.8823 14.7782 12.7778V3ZM5.00043 0C2.23901 0 0.000434875 2.23858 0.000434875 5V14.7778V17.7778H3.00043H12.7782C15.5396 17.7778 17.7782 15.5392 17.7782 12.7778V3V0H14.7782H5.00043ZM3 25.2227H12.7778C13.8823 25.2227 14.7778 26.1181 14.7778 27.2227V37.0004H5C3.89543 37.0004 3 36.105 3 35.0004V25.2227ZM12.7778 22.2227C15.5392 22.2227 17.7778 24.4612 17.7778 27.2227V37.0004V40.0004H14.7778H5C2.23858 40.0004 0 37.7619 0 35.0004V25.2227V22.2227H3H12.7778ZM27.2231 25.2227H37.0009V35.0004C37.0009 36.105 36.1054 37.0004 35.0009 37.0004H25.2231V27.2227C25.2231 26.1181 26.1185 25.2227 27.2231 25.2227ZM22.2231 27.2227C22.2231 24.4612 24.4617 22.2227 27.2231 22.2227H37.0009H40.0009V25.2227V35.0004C40.0009 37.7619 37.7623 40.0004 35.0009 40.0004H25.2231H22.2231V37.0004V27.2227ZM31.1133 0C29.886 0 28.8911 0.994923 28.8911 2.22222V6.66602H24.4449C23.2176 6.66601 22.2227 7.66094 22.2227 8.88824C22.2227 10.1155 23.2176 11.1105 24.4449 11.1105H28.8911V15.5556C28.8911 16.7829 29.886 17.7778 31.1133 17.7778C32.3406 17.7778 33.3355 16.7829 33.3355 15.5556V11.1105H37.7782C39.0055 11.1105 40.0004 10.1155 40.0004 8.88824C40.0004 7.66094 39.0055 6.66602 37.7782 6.66602H33.3355V2.22222C33.3355 0.994922 32.3406 0 31.1133 0Z" fill="white" /></svg>
                        </div>
                        <div className='wkit-title-wrap-box'>
                            <div className='wkit-count-num'>{userCredits.widgets}</div>
                            <h5 className='wkit-box-title'>{__('Custom Widgets')}</h5>
                        </div>
                    </div>
                </div>
                <div className='wkit-grid-col'>
                    <div className='wkit-box-bg wkit-flex wkit-p-15 wkit-justify-content'>
                        <div className='wkit-icon-box'>
                            <svg width="42" height="38" viewBox="0 0 42 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.49935 25.25C10.791 25.25 12.666 27.125 12.666 29.4167C12.666 31.7083 10.791 33.5833 8.49935 33.5833C6.20768 33.5833 4.33268 31.7083 4.33268 29.4167C4.33268 27.125 6.20768 25.25 8.49935 25.25ZM8.49935 21.0833C3.91602 21.0833 0.166016 24.8333 0.166016 29.4167C0.166016 34 3.91602 37.75 8.49935 37.75C13.0827 37.75 16.8327 34 16.8327 29.4167C16.8327 24.8333 13.0827 21.0833 8.49935 21.0833ZM20.9993 4.41667C23.291 4.41667 25.166 6.29167 25.166 8.58333C25.166 10.875 23.291 12.75 20.9993 12.75C18.7077 12.75 16.8327 10.875 16.8327 8.58333C16.8327 6.29167 18.7077 4.41667 20.9993 4.41667ZM20.9993 0.25C16.416 0.25 12.666 4 12.666 8.58333C12.666 13.1667 16.416 16.9167 20.9993 16.9167C25.5827 16.9167 29.3327 13.1667 29.3327 8.58333C29.3327 4 25.5827 0.25 20.9993 0.25ZM33.4993 25.25C35.791 25.25 37.666 27.125 37.666 29.4167C37.666 31.7083 35.791 33.5833 33.4993 33.5833C31.2077 33.5833 29.3327 31.7083 29.3327 29.4167C29.3327 27.125 31.2077 25.25 33.4993 25.25ZM33.4993 21.0833C28.916 21.0833 25.166 24.8333 25.166 29.4167C25.166 34 28.916 37.75 33.4993 37.75C38.0827 37.75 41.8327 34 41.8327 29.4167C41.8327 24.8333 38.0827 21.0833 33.4993 21.0833Z" fill="white" /></svg>
                        </div>
                        <div className='wkit-title-wrap-box'>
                            <div className='wkit-count-num'>{userCredits.workspace}</div>
                            <h5 className='wkit-box-title'>{__('Workspace')}</h5>
                        </div>
                    </div>
                </div>
            </div>

            <a href={`${wdkitData.wdkit_server_url}pricing`} className="wkit-btn-credit" target="_blank" rel="noopener noreferrer">{__('Get Free Credits')}</a>

            <div className='wkit-box-bg wkit-p-15 wkit-mt-15'>
                <div className='wkit-faq-heading wkit-flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="25" fill="#030383"><path d="M208 0C322.9 0 416 78.8 416 176C416 273.2 322.9 352 208 352C189.3 352 171.2 349.7 153.9 345.8C123.3 364.8 79.13 384 24.95 384C14.97 384 5.93 378.1 2.018 368.9C-1.896 359.7-.0074 349.1 6.739 341.9C7.26 341.5 29.38 317.4 45.73 285.9C17.18 255.8 0 217.6 0 176C0 78.8 93.13 0 208 0zM164.6 298.1C179.2 302.3 193.8 304 208 304C296.2 304 368 246.6 368 176C368 105.4 296.2 48 208 48C119.8 48 48 105.4 48 176C48 211.2 65.71 237.2 80.57 252.9L104.1 277.8L88.31 308.1C84.74 314.1 80.73 321.9 76.55 328.5C94.26 323.4 111.7 315.5 128.7 304.1L145.4 294.6L164.6 298.1zM441.6 128.2C552 132.4 640 209.5 640 304C640 345.6 622.8 383.8 594.3 413.9C610.6 445.4 632.7 469.5 633.3 469.9C640 477.1 641.9 487.7 637.1 496.9C634.1 506.1 625 512 615 512C560.9 512 516.7 492.8 486.1 473.8C468.8 477.7 450.7 480 432 480C350 480 279.1 439.8 245.2 381.5C262.5 379.2 279.1 375.3 294.9 369.9C322.9 407.1 373.9 432 432 432C446.2 432 460.8 430.3 475.4 426.1L494.6 422.6L511.3 432.1C528.3 443.5 545.7 451.4 563.5 456.5C559.3 449.9 555.3 442.1 551.7 436.1L535.9 405.8L559.4 380.9C574.3 365.3 592 339.2 592 304C592 237.7 528.7 183.1 447.1 176.6L448 176C448 159.5 445.8 143.5 441.6 128.2H441.6z" /></svg>{__('The FAQs')}
                </div>
                <p className='wkit-faq-desc'>{__('Everything you need to know about the products.')}</p>
            </div>

            <ul className="faqs-accordion-text">
                {
                    Object.values(arraydata).map((data, index) => {
                        return (
                            <li key={index}>
                                <div className="faqs-accordion-wrappper" onClick={() => disbaleasa(index)}>
                                    <div className="wkit-faq-acc-title" >
                                        <div className="wkit-faq-dots"></div>{data.accordion_title}
                                    </div>
                                    <div className="wkit-plus-icon-acc">
                                        {index == accordianFaq ?
                                            <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.5" y="0.5" width="21" height="21" rx="5.5" fill="white" stroke="#040483" />
                                                <path d="M6.91797 11H15.0846" stroke="#040483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            :
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="20" height="20" rx="5" fill="#040483" />
                                                <path d="M10 5.91699V14.0837" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M5.91797 10H14.0846" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                    </div>
                                    {index == accordianFaq &&
                                        <div className="faqs-content-wrapper" v-if="accordion_faq == data.id">{data.content}</div>
                                    }
                                </div>
                            </li>

                        )
                    })
                }

            </ul>
        </div>
    );
}

export default Activate;