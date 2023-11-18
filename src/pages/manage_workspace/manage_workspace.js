import { Link } from 'react-router-dom';
import './manage_workspace.scss'
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DeletePopup, Page_header, Wkit_workspace_skeleton } from '../../helper/helper-function';

const { Fragment } = wp.element;

const {
    __,
} = wp.i18n;

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
        props.wdkit_Login_Route('manage_workspace');
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
        var limit = userData?.credits?.limit_workspace ? userData?.credits?.limit_workspace : 1;
        return (
            <Fragment>
                <div className='wkit-add-new-workspace-wrapperd'>
                    <div className="wkit-add-new-workspace">
                        <div className="wkit-add-new-content">
                            <div className='wkit-add-new-text'>
                                <span className='wkit-add-new-Title'>{limit == -1 || Wslength < limit ? __('Add New Workspace') : __('Workspace Limit Reached!')}</span>
                                <span className='wkit-add-new-desc'>{limit == -1 || Wslength < limit ? __('Manage and collaborate with ease.') : __('Become a pro or add more workspace credit to create more.')}</span>
                            </div>
                            {limit == -1 || Wslength < limit ?
                                <button className='wkit-add-new-btn' onClick={() => setPopup(true)}>Create Workspace</button>
                                :
                                <div><a className='wkit-btn-buy-now' href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">Upgrade to Pro</a></div>
                            }
                        </div>
                        <div className='wkit-add-new-workspace-img'>
                            <img src={limit == -1 || Wslength < limit ? (img_path + "assets/images/jpg/addWorkspace.png") : (img_path + "assets/images/jpg/free-credit-full.png")} />
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
                <span>{__('by')}</span>
                {data.u_id == user_id && user_profile ?
                    <img src={user_profile} alt="user-img" style={{ borderRadius: "50px" }} />
                    :
                    <img src={shared_user.user_profile} alt="user-img" style={{ borderRadius: "50px" }} />
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
                <div className='wkit-card-menu wkit-custom-dropDown-header'>
                    <svg data-v-20a7cc98="" width="16" height="4" viewBox="0 0 16 4" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                        <path data-v-20a7cc98="" d="M12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 -3.93402e-08 14 -8.74228e-08C12.9 -1.35505e-07 12 0.9 12 2ZM10 2C10 0.9 9.1 -3.01609e-07 8 -3.49691e-07C6.9 -3.97774e-07 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2ZM4 2C4 0.899999 3.1 -5.63877e-07 2 -6.11959e-07C0.9 -6.60042e-07 -3.93403e-08 0.899999 -8.74228e-08 2C-1.35505e-07 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2Z" />
                    </svg>
                </div>
                <div className='wkit-custom-dropDown-content' style={{ width: '130px' }}>
                    <div className='wkit-drop-down-outer'></div>
                    <Link to={'/manage_workspace/workspace_template/' + w_id}>
                        <div className='wkit-custom-dropDown-options'>
                            <span className='wkit-custom-dropDown-icon'>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 4.0625C9.86875 4.0625 11.9812 5.39375 13.0125 7.5C11.9812 9.60625 9.875 10.9375 7.5 10.9375C5.125 10.9375 3.01875 9.60625 1.9875 7.5C3.01875 5.39375 5.13125 4.0625 7.5 4.0625ZM7.5 2.8125C4.375 2.8125 1.70625 4.75625 0.625 7.5C1.70625 10.2437 4.375 12.1875 7.5 12.1875C10.625 12.1875 13.2937 10.2437 14.375 7.5C13.2937 4.75625 10.625 2.8125 7.5 2.8125ZM7.5 5.9375C8.3625 5.9375 9.0625 6.6375 9.0625 7.5C9.0625 8.3625 8.3625 9.0625 7.5 9.0625C6.6375 9.0625 5.9375 8.3625 5.9375 7.5C5.9375 6.6375 6.6375 5.9375 7.5 5.9375ZM7.5 4.6875C5.95 4.6875 4.6875 5.95 4.6875 7.5C4.6875 9.05 5.95 10.3125 7.5 10.3125C9.05 10.3125 10.3125 9.05 10.3125 7.5C10.3125 5.95 9.05 4.6875 7.5 4.6875Z" />
                                </svg>
                            </span>
                            <span>{__('View')}</span>
                        </div>
                    </Link>
                    {data?.roles == 'admin' &&
                        <div className='wkit-custom-dropDown-options' onClick={() => { setdeleteWsID(w_id) }}>
                            <span className='wkit-custom-dropDown-icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="#19191B" >
                                    <path d="M7 4.625V10.875H2V4.625H7ZM6.0625 0.875H2.9375L2.3125 1.5H0.125V2.75H8.875V1.5H6.6875L6.0625 0.875ZM8.25 3.375H0.75V10.875C0.75 11.5625 1.3125 12.125 2 12.125H7C7.6875 12.125 8.25 11.5625 8.25 10.875V3.375Z" ></path>
                                </svg>
                            </span>
                            <span>{__('Delete')}</span>
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
                    <img src={img_path + "assets/images/svg/user.svg"} alt="user img" />
                    <span>{Object.values(data.share_user).length}</span>
                    <span className='wkit-workspace-tool-tip'>Users</span>
                </div>
                {props?.wdkit_meta?.Setting?.template == true &&
                    <div className='wkit-workspace-edit-temp wkit-workspace-detail'>
                        <img src={img_path + "assets/images/svg/edit-double.svg"} alt="edit img" />
                        <span>{data.work_templates.length}</span>
                        <span className='wkit-workspace-tool-tip'>Templates</span>
                    </div>
                }
                {props?.wdkit_meta?.Setting?.builder == true &&
                    <div className='wkit-workspace-edit-widget wkit-workspace-detail'>
                        <img src={img_path + "assets/images/svg/workspace_widget_icon.svg"} alt="edit img" />
                        <span>{data.work_widgets.length}</span>
                        <span className='wkit-workspace-tool-tip'>Widgets</span>
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
                                                <div className='wdkit-inner-boxed-deActivate-h1'>Credit Limit Reached!</div>
                                                <div className='wdkit-inner-boxed-deActivate-p'>This Template got disabled until you have more credits to make it active.</div>
                                                <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                                                    <button>Buy Credits</button>
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
                                        <Link to={'/manage_workspace/workspace_template/' + w_id}>
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
                title={'Manage Workspace'}
                svg={<svg data-v-20a7cc98="" width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="wkit-manage-icon-svg">
                    <path data-v-20a7cc98="" d="M6 18.5C7.65 18.5 9 19.85 9 21.5C9 23.15 7.65 24.5 6 24.5C4.35 24.5 3 23.15 3 21.5C3 19.85 4.35 18.5 6 18.5ZM6 15.5C2.7 15.5 0 18.2 0 21.5C0 24.8 2.7 27.5 6 27.5C9.3 27.5 12 24.8 12 21.5C12 18.2 9.3 15.5 6 15.5ZM15 3.5C16.65 3.5 18 4.85 18 6.5C18 8.15 16.65 9.5 15 9.5C13.35 9.5 12 8.15 12 6.5C12 4.85 13.35 3.5 15 3.5ZM15 0.5C11.7 0.5 9 3.2 9 6.5C9 9.8 11.7 12.5 15 12.5C18.3 12.5 21 9.8 21 6.5C21 3.2 18.3 0.5 15 0.5ZM24 18.5C25.65 18.5 27 19.85 27 21.5C27 23.15 25.65 24.5 24 24.5C22.35 24.5 21 23.15 21 21.5C21 19.85 22.35 18.5 24 18.5ZM24 15.5C20.7 15.5 18 18.2 18 21.5C18 24.8 20.7 27.5 24 27.5C27.3 27.5 30 24.8 30 21.5C30 18.2 27.3 15.5 24 15.5Z" fill="#040483" />
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