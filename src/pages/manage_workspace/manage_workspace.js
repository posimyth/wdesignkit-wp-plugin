import { Link } from 'react-router-dom';
import './manage_workspace.scss'
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DeletePopup, Page_header, Wkit_workspace_skeleton } from '../../helper/helper-function';
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element;

const {
    get_userinfo,
    Add_workspace,
    manage_WorkSpace_Api,
    wkit_get_user_login,
    Letter_image,
} = wp.wkit_Helper;

const Manage_Workspace = (props) => {

    let data = wkit_get_user_login()
    if (!data) {
        props.wdkit_Login_Route('/manage_workspace');
        return <Navigate to='/login' />
    }

    const [userData, setUserData] = useState("loading");
    const [isPopup, setPopup] = useState(false);
    const [isRemove, setIsRemove] = useState(false);
    const [Wslength, setWslength] = useState();
    const [loading, setloading] = useState(true);
    const [isLoading, setisLoading] = useState(false);
    const [deleteWsID, setdeleteWsID] = useState(-1);


    /** To get data from redux */
    useEffect(() => {
        setloading(true)
        setUserData(props?.wdkit_meta);

        if (props?.wdkit_meta?.workspace) {
            setloading(false)
        }
    }, [props?.wdkit_meta]);

    useEffect(() => {
        Check_length();
    }, [userData, data?.work_widgets?.length])

    /** Function for remove workspace from list */
    const removeWs = async (wid) => {

        setloading(true)
        setIsRemove(true)
        setisLoading(true)
        if (!wid) {
            return false;
        }
        let form_arr = { 'wid': wid, 'wstype': 'remove' }
        var result = await manage_WorkSpace_Api(form_arr);
        if (result?.data?.success) {
            if (props?.wdkit_meta.length != 0 && props?.wdkit_meta.workspace) {
                for (var i = 0; i < props?.wdkit_meta.workspace.length; i++) {
                    if (props?.wdkit_meta.workspace[i].w_id === wid) {
                        props?.wdkit_meta.workspace.splice(i, 1);
                    }
                }
            }
            props.wdkit_set_toast([result?.data?.message, result?.data?.description, '', 'success']);
        } else {

        }
        let updated_data = await get_userinfo();
        await props.wdkit_set_meta(updated_data.data)
        await setIsRemove(false)
        setloading(false)
        setisLoading(false)
        setdeleteWsID(-1);
    }

    /** drop-down toggle event of workspace card */
    const Drop_down_toggle = (e) => {
        let main_object = e.target.closest(".wkit-custom-dropDown")
        let drop_down = main_object.querySelector(".wkit-custom-dropDown-content") ? main_object.querySelector(".wkit-custom-dropDown-content") : "";
        if (drop_down) {
            if (Object.values(drop_down.classList).includes("wkit-show")) {
                drop_down.classList.remove("wkit-show");
            } else {
                drop_down.classList.add("wkit-show");
            }
        }
    }

    /** to count user workspace's limit */
    const Check_length = async () => {
        let data = userData?.workspace;
        let user_id = userData?.userinfo?.id;
        let count = 0;

        await data && data.map((data) => {
            if (data.u_id == user_id) {
                count = count + 1
            }
        })

        setWslength(count);
    }

    /** card for add new workspave and credit limit full */
    const Action_card = () => {
        var limit = userData?.credits?.workspace_limit?.meta_value ? userData?.credits?.workspace_limit?.meta_value : 1;
        return (
            <Fragment>
                <div className='wkit-add-new-workspace-wrapperd'>
                    <div className="wkit-add-new-workspace">
                        <div className="wkit-add-new-content">
                            <div className='wkit-add-new-text'>
                                <span className='wkit-add-new-Title'>{limit == "unlimited" || Wslength < limit ? __('New Workspace ?', 'wdesignkit') : __('You have Used Free Credit', 'wdesignkit')}</span>
                                <span className='wkit-add-new-desc'>{limit == "unlimited" || Wslength < limit ? __('Manage and collaborate with ease.', 'wdesignkit') : __('You need to purchase now to add more workspace', 'wdesignkit')}</span>
                            </div>
                            {limit == "unlimited" || Wslength < limit ?
                                <button className='wkit-pink-btn-class' onClick={() => setPopup(true)}>{__('Create Workspace', 'wdesignkit')}</button>
                                :
                                <div><a className='wkit-btn-buy-now wkit-pink-btn-class' href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">{__('Buy Now', 'wdesignkit')}</a></div>
                            }
                        </div>
                        <div className='wkit-add-new-workspace-img'>
                            <img src={limit == "unlimited" || Wslength < limit ? (img_path + "assets/images/jpg/addWorkspace.png") : (img_path + "assets/images/jpg/free-credit-full.png")} draggable="false" />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    /** Function for get user info of workspace */
    const User_info = (data) => {

        let shared_user = data?.share_user[data.u_id] ? data?.share_user[data.u_id] : '';
        let user_name = userData?.userinfo?.full_name ? userData.userinfo.full_name : '';
        let user_profile = userData?.userinfo?.user_profile ? userData.userinfo.user_profile : '';
        let user_id = userData?.userinfo?.id ? userData.userinfo.id : '';

        return (
            <div className='wkit-avatar-name'>
                <span>{__('by', 'wdesignkit')}</span>
                {data.u_id == user_id && user_profile ?
                    <img src={user_profile} alt="user-img" style={{ borderRadius: "50px" }} draggable="false" />
                    :
                    <img src={shared_user.user_profile} alt="user-img" style={{ borderRadius: "50px" }} draggable="false" />
                }
                <span className='wkit-avatar-main-name'>
                    {(data?.u_id == user_id) ?
                        user_name
                        :
                        shared_user.full_name}
                </span>
            </div>
        );
    }

    /** drop down for view and delete btn */
    const Drop_down = (data) => {
        let w_id = data.w_id

        return (
            <div className='wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }} style={{ width: 'max-content' }}>
                <div className='wkit-ws-card-menu wkit-custom-dropDown-header'>
                    <svg data-v-20a7cc98="" width="16" height="4" viewBox="0 0 16 4" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                        <path data-v-20a7cc98="" d="M12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 -3.93402e-08 14 -8.74228e-08C12.9 -1.35505e-07 12 0.9 12 2ZM10 2C10 0.9 9.1 -3.01609e-07 8 -3.49691e-07C6.9 -3.97774e-07 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2ZM4 2C4 0.899999 3.1 -5.63877e-07 2 -6.11959e-07C0.9 -6.60042e-07 -3.93403e-08 0.899999 -8.74228e-08 2C-1.35505e-07 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2Z" />
                    </svg>
                </div>
                <div className='wkit-custom-dropDown-content' style={{ width: '130px' }}>
                    <div className='wkit-drop-down-outer'></div>
                    <Link to={'/manage_workspace/workspace_template/' + w_id}>
                        <div className='wkit-custom-dropDown-options'>
                            <span className='wkit-custom-dropDown-icon'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.75 9C0.75 9 3.75 3 9 3C14.25 3 17.25 9 17.25 9C17.25 9 14.25 15 9 15C3.75 15 0.75 9 0.75 9Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span>{__('View', 'wdesignkit')}</span>
                        </div>
                    </Link>
                    {data?.roles == 'admin' &&
                        <div className='wkit-custom-dropDown-options' onClick={() => { setdeleteWsID(w_id) }}>
                            <span className='wkit-custom-dropDown-icon'>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.75 5.50006H4.91667M4.91667 5.50006H14.25M4.91667 5.50006L4.91638 13.666C4.91638 13.9754 5.0393 14.2722 5.25809 14.491C5.47688 14.7098 5.77363 14.8327 6.08305 14.8327H11.9164C12.2258 14.8327 12.5225 14.7098 12.7413 14.491C12.9601 14.2722 13.083 13.9754 13.083 13.666V5.49935M6.66638 5.49935V4.33268C6.66638 4.02326 6.7893 3.72652 7.00809 3.50772C7.22688 3.28893 7.52363 3.16602 7.83305 3.16602H10.1664C10.4758 3.16602 10.7725 3.28893 10.9913 3.50772C11.2101 3.72652 11.333 4.02326 11.333 4.33268V5.49935" stroke="#737373" strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <span>{__('Delete', 'wdesignkit')}</span>
                        </div>
                    }
                </div>
            </div>
        );
    }

    /** workspace info like template, user and widget number */
    const workspace_info = (data) => {
        return (
            <div className='wkit-top-user'>
                <div className='wkit-live-user wkit-workspace-detail'>
                    <img src={img_path + "assets/images/svg/user.svg"} alt="user img" draggable="false" />
                    <span>{Object.values(data.share_user).length}</span>
                    <span className='wkit-workspace-tool-tip'>{__('Users', 'wdesignkit')}</span>
                </div>
                {props?.wdkit_meta?.Setting?.template == true &&
                    <div className='wkit-workspace-edit-temp wkit-workspace-detail'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M12.1062 3.54375C12.35 3.3 12.35 2.90625 12.1062 2.6625L10.3375 0.89375C10.0938 0.65 9.7 0.65 9.45625 0.89375L6.65 3.7L4.21875 1.26875C3.73125 0.78125 2.9375 0.78125 2.45 1.26875L1.2625 2.45625C0.775 2.94375 0.775 3.7375 1.2625 4.225L3.69375 6.65625L0.875 9.475V12.125H3.525L6.35 9.3L8.78125 11.7313C9.375 12.325 10.175 12.1063 10.55 11.7313L11.7375 10.5437C12.225 10.0562 12.225 9.2625 11.7375 8.775L9.30625 6.34375L12.1062 3.54375ZM2.15 3.3375L3.33125 2.15L4.125 2.94375L3.3875 3.6875L4.26875 4.56875L5.0125 3.825L5.7625 4.575L4.575 5.7625L2.15 3.3375ZM9.16875 7.9875L8.425 8.73125L9.30625 9.6125L10.05 8.86875L10.8438 9.6625L9.65625 10.85L7.225 8.41875L8.4125 7.23125L9.16875 7.9875ZM3.00625 10.875H2.125V9.99375L8.13125 3.9875L8.94375 4.8L9.0125 4.86875L3.00625 10.875ZM9.0125 3.1L9.89375 2.21875L10.775 3.1L9.89375 3.98125L9.0125 3.1Z" fill="#4D69FA" /></svg>
                        <span>{data.work_templates.length}</span>
                        <span className='wkit-workspace-tool-tip'>{__('Templates', 'wdesignkit')}</span>
                    </div>
                }
                {props?.wdkit_meta?.Setting?.builder == true &&
                    <div className='wkit-workspace-edit-widget wkit-workspace-detail'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M6.12111 0.363656C6.55151 0.0623758 7.12436 0.0623748 7.55476 0.363655L12.7626 4.00912C13.4459 4.48746 13.478 5.48816 12.8266 6.00924L12.5676 6.21642L12.7626 6.35287C13.4459 6.83121 13.478 7.83191 12.8266 8.35299L12.5676 8.56017L12.7626 8.69662C13.4459 9.17496 13.478 10.1757 12.8266 10.6967L10.3534 12.6753L8.39967 14.2383C7.48663 14.9687 6.18924 14.9687 5.2762 14.2383L3.3225 12.6753L0.849267 10.6967C0.197919 10.1757 0.229957 9.17496 0.913307 8.69662L1.10823 8.56017L0.849267 8.35299C0.197919 7.83191 0.229957 6.83121 0.913307 6.35287L1.10824 6.21642L0.849267 6.00924C0.197919 5.48816 0.229957 4.48746 0.913307 4.00912L6.12111 0.363656ZM2.12545 9.37394L1.63014 9.72066L4.10337 11.6992L6.05707 13.2622C6.51359 13.6274 7.16228 13.6274 7.6188 13.2622L9.5725 11.6992L12.0457 9.72066L11.5504 9.37394L10.3534 10.3316L8.39967 11.8945C7.48663 12.625 6.18924 12.625 5.2762 11.8945L3.3225 10.3316L2.12545 9.37394ZM10.3534 7.98783L11.5504 7.03019L12.0457 7.37691L9.5725 9.35549L7.6188 10.9185C7.16228 11.2837 6.51359 11.2837 6.05707 10.9185L4.10337 9.35549L1.63014 7.37691L2.12545 7.03019L3.3225 7.98783L5.2762 9.55079C6.18924 10.2812 7.48663 10.2812 8.39967 9.55079L10.3534 7.98783ZM12.0457 5.03316L6.83794 1.3877L1.63013 5.03316L4.10337 7.01174L6.05707 8.5747C6.51359 8.93992 7.16228 8.93992 7.6188 8.5747L9.5725 7.01174L12.0457 5.03316Z" fill="#C22076" /></svg>
                        <span>{data.work_widgets.length}</span>
                        <span className='wkit-workspace-tool-tip'>{__('Widgets', 'wdesignkit')}</span>
                    </div>
                }
            </div>
        );
    }

    /** workspace card loop */
    const Workspace_card_loop = () => {
        return (
            <Fragment>
                {
                    Object.values(userData.workspace).map((data, index) => {
                        let w_id = data.w_id
                        return (
                            <div className='wkit-workspace-wraped' key={index}>
                                <div className='wkit-workspace-box'>
                                    {data?.is_activated != "active" &&
                                        <Fragment>
                                            <div className='wdkit-inner-boxed-deActivate'>
                                                <div className='wdkit-inner-boxed-deActivate-h1'>{__('Credit Limit Reached!', 'wdesignkit')}</div>
                                                <div className='wdkit-inner-boxed-deActivate-p'>{__('This Template got disabled until you have more credits to make it active.', 'wdesignkit')}</div>
                                                <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                                                    <button>{__('Buy Credits', 'wdesignkit')}</button>
                                                </a>
                                            </div>
                                            <span className='wdkit-inner-boxed-remove'>
                                                <svg onClick={() => { setdeleteWsID(w_id) }} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.66634 1.83203C5.44533 1.83203 5.23337 1.91983 5.07709 2.07611C4.9208 2.23239 4.83301 2.44435 4.83301 2.66536V3.4987H9.16634V2.66536C9.16634 2.44435 9.07854 2.23239 8.92226 2.07611C8.76598 1.91983 8.55402 1.83203 8.33301 1.83203H5.66634ZM10.1663 3.4987V2.66536C10.1663 2.17913 9.97319 1.71282 9.62937 1.369C9.28555 1.02519 8.81924 0.832031 8.33301 0.832031H5.66634C5.18011 0.832031 4.7138 1.02519 4.36998 1.369C4.02616 1.71282 3.83301 2.17913 3.83301 2.66536V3.4987H2.33301C2.32078 3.4987 2.30865 3.49914 2.29664 3.5H1C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5H1.83301V13.332C1.83301 13.8183 2.02616 14.2846 2.36998 14.6284C2.7138 14.9722 3.18011 15.1654 3.66634 15.1654H10.333C10.8192 15.1654 11.2856 14.9722 11.6294 14.6284C11.9732 14.2846 12.1663 13.8183 12.1663 13.332V4.5H13C13.2761 4.5 13.5 4.27614 13.5 4C13.5 3.72386 13.2761 3.5 13 3.5H11.7027C11.6907 3.49914 11.6786 3.4987 11.6663 3.4987H10.1663ZM2.83301 13.332V4.5H11.1663V13.332C11.1663 13.553 11.0785 13.765 10.9223 13.9213C10.766 14.0776 10.554 14.1654 10.333 14.1654H3.66634C3.44533 14.1654 3.23337 14.0776 3.07709 13.9213C2.9208 13.765 2.83301 13.553 2.83301 13.332ZM7.5 7.33203C7.5 7.05589 7.27614 6.83203 7 6.83203C6.72386 6.83203 6.5 7.05589 6.5 7.33203V11.332C6.5 11.6082 6.72386 11.832 7 11.832C7.27614 11.832 7.5 11.6082 7.5 11.332V7.33203Z" fill="#1E1E1E" />
                                                </svg>
                                            </span>
                                        </Fragment>
                                    }
                                    <div className='wkit-workspace-card-container'>
                                        <div className='wkit-workspace-mixed'>
                                            {data.work_icon ?
                                                <img src={data.work_icon} alt="workspace-icon" className="wkit-profile-back" draggable="false" />
                                                :
                                                <div className='wkit-profile-back wkit-profile-letter' style={{ textTransform: 'uppercase' }}>
                                                    {Letter_image(data.work_title)}
                                                </div>
                                            }
                                            {workspace_info(data)}
                                        </div>
                                        <Link className='wkit-wp-card-link' to={'/manage_workspace/workspace_template/' + w_id}>
                                            <div className='wkit-user-name'>{data.work_title}</div>
                                        </Link>
                                        <div className='wkit-author-select-wrapper'>
                                            {User_info(data)}
                                            {Drop_down(data)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </Fragment>
        );
    }

    var img_path = wdkitData.WDKIT_URL;

    return (
        <div className="wkit-manage-main">
            <Page_header
                title={__('Manage Workspace', 'wdesignkit')}
                svg={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.6843 6.81612C15.6843 8.67309 14.1299 10.2143 12.1676 10.2143C10.2054 10.2143 8.65098 8.67309 8.65098 6.81612C8.65098 4.95915 10.2054 3.41797 12.1676 3.41797C14.1299 3.41797 15.6843 4.95915 15.6843 6.81612ZM22.0843 17.1865C22.0843 19.0435 20.5299 20.5846 18.5676 20.5846C16.6054 20.5846 15.051 19.0435 15.051 17.1865C15.051 15.3295 16.6054 13.7883 18.5676 13.7883C20.5299 13.7883 22.0843 15.3295 22.0843 17.1865ZM9.28431 17.1865C9.28431 19.0435 7.7299 20.5846 5.76764 20.5846C3.80538 20.5846 2.25098 19.0435 2.25098 17.1865C2.25098 15.3295 3.80539 13.7883 5.76764 13.7883C7.7299 13.7883 9.28431 15.3295 9.28431 17.1865Z" stroke="#040483" strokeWidth="1.5" />
                </svg>}
            />
            <div className='wkit-workspace-wrapper'>
                {userData?.workspace && loading == false &&
                    <div className='wkit-workspace-wrapper-content'>
                        {Workspace_card_loop()}
                        {Action_card()}
                    </div>
                }
                {loading == true &&
                    <Wkit_workspace_skeleton />
                }

                {/* popup */}
                {isPopup &&
                    <Add_workspace
                        type={'manage'}
                        closePopUp={() => { setPopup(false) }}
                        Toast={(title, subTitle, type) => props.wdkit_set_toast([title, subTitle, '', type])}
                        UpdateUserData={(val) => { (props.wdkit_set_meta(val.data)) }}
                        setLoading={(val) => { (setloading(val)) }}
                    />
                }
            </div>
            {Number(deleteWsID) > -1 &&
                <DeletePopup
                    setdeleteWsID={(id) => setdeleteWsID(id)}
                    removeFunction={() => { removeWs(deleteWsID) }}
                    isLoading={isLoading}
                />
            }
        </div>
    );
}

export default Manage_Workspace;