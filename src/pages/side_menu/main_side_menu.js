import { Link, useLocation } from "react-router-dom";

const {
    __,
} = wp.i18n;

const {
    wkit_logout,
    wkit_get_user_login,
    form_data,
    get_userinfo,
} = wp.wkit_Helper;

const { Fragment } = wp.element

window.wdkit_editor = wdkitData.use_editor;

const Side_menu = (props) => {

    let location = useLocation();
    let pathname = location.pathname.split("/");
    var img_path = wdkitData.WDKIT_URL;

    let temp_validation = props?.wdkit_meta?.Setting?.template
    let builder_validation = props?.wdkit_meta?.Setting?.builder

    const Wdkitlogo = () => {
        return <Fragment>
            <div className="wkit-img-logo">
                <a href={wdkitData.wdkit_server_url} target="_blank" rel="noopener noreferrer">
                    <img src={img_path + "assets/images/jpg/Wdesignkit-logo.png"} alt="wdesignlogo" className="wkit-logo" draggable="false" />
                </a>
            </div>
        </Fragment>
    }

    /**ManageLicence Panal Icon Html load Here*/
    const ManageLicenceMenuHTML = () => {

        if (window.wdkit_editor == "wdkit") {
            return <Fragment>
                <div className="heading-title">{__('Manage Licence')}</div>
                <div className="menu-wrapper">
                    <ul>
                        <Link to="/activate">
                            <li className={`wkit-menu ${pathname.includes("activate") && 'active'}`}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10 6C11.1046 6 12 5.10457 12 4C12 2.89543 11.1046 2 10 2C8.89543 2 8 2.89543 8 4C8 5.10457 8.89543 6 10 6ZM10 8C10.3453 8 10.6804 7.95625 11 7.87398V9.21922L10.291 9.04198C10.1 8.99421 9.90005 8.99421 9.70896 9.04198L9 9.21922V7.87398C9.31962 7.95625 9.6547 8 10 8ZM14 4C14 4.3453 13.9562 4.68038 13.874 5H18C19.1046 5 20 5.89543 20 7V18C20 19.1046 19.1046 20 18 20H2C0.895432 20 0 19.1046 0 18V7C0 5.89543 0.895431 5 2 5H6.12602C6.04375 4.68038 6 4.3453 6 4C6 1.79086 7.79086 0 10 0C12.2091 0 14 1.79086 14 4ZM7 7H2V18H18V7H13V10.2438C13 11.0245 12.2663 11.5974 11.509 11.408L10 11.0308L8.49104 11.408C7.73366 11.5974 7 11.0245 7 10.2438V7ZM5 14C4.44772 14 4 14.4477 4 15C4 15.5523 4.44771 16 5 16H15C15.5523 16 16 15.5523 16 15C16 14.4477 15.5523 14 15 14H5Z" fill="white" />
                                </svg>
                                <span className="wkit-menu-text">{__('Manage Licence')}</span>
                            </li>
                        </Link>
                    </ul>
                </div>
            </Fragment>
        }

        return false;
    }

    /**Setting Panal Icon Html load Here*/
    const SettingsMenuHTML = () => {

        if (window.wdkit_editor == "wdkit") {
            return <Fragment>
                <div className="heading-title">{__('Settings')}</div>
                <div className="menu-wrapper">
                    <ul>
                        <Link to='/settings' >
                            <li className={`wkit-menu ${pathname.includes("settings") && 'active'}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4 2C4.55228 2 5 2.44772 5 3V10C5 10.5523 4.55228 11 4 11C3.44772 11 3 10.5523 3 10V3C3 2.44772 3.44772 2 4 2ZM5 15H7C7.55228 15 8 14.5523 8 14C8 13.4477 7.55228 13 7 13H4H1C0.447715 13 0 13.4477 0 14C0 14.5523 0.447715 15 1 15H3V21C3 21.5523 3.44772 22 4 22C4.55228 22 5 21.5523 5 21V15ZM13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V12ZM12 2C12.5523 2 13 2.44772 13 3V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H12H9C8.44771 9 8 8.55228 8 8C8 7.44772 8.44771 7 9 7H11V3C11 2.44772 11.4477 2 12 2ZM20 15H23C23.5523 15 24 15.4477 24 16C24 16.5523 23.5523 17 23 17H21V21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21V17H17C16.4477 17 16 16.5523 16 16C16 15.4477 16.4477 15 17 15H20ZM20 2C20.5523 2 21 2.44772 21 3V12C21 12.5523 20.5523 13 20 13C19.4477 13 19 12.5523 19 12V3C19 2.44772 19.4477 2 20 2Z" fill="white" />
                                </svg>
                                <span className="wkit-menu-text">{__('Settings')}</span>
                            </li>
                        </Link>
                    </ul>
                </div>
            </Fragment>
        }

        return false;
    }

    return (
        <>
            {pathname.includes("widget-listing") && pathname.includes("builder") ? "" :
                <div className="wkit-left-side">
                    <Wdkitlogo />

                    {temp_validation == true &&
                        <div className="menu-wrapper">
                            <ul>
                                <Link to='/browse'>
                                    <li className={`wkit-menu ${pathname.includes("browse") && 'active'}`}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 12H22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="wkit-menu-text">{__('Design Browse')}</span>
                                    </li>
                                </Link>
                                {wdkitData.use_editor != 'wdkit' &&
                                    <Link to="/save_template">
                                        <li className={`wkit-menu ${pathname.includes("save_template") && 'active'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M22 2H2V6H22V2ZM2 22L2 8H12V13.6263C12 14.5847 13.0682 15.1564 13.8656 14.6248L16 13.2019L18.1344 14.6248C18.9318 15.1564 20 14.5847 20 13.6263V8H22V22H2ZM18 8H14V12.1315L15.3898 11.2049C15.7593 10.9586 16.2407 10.9586 16.6102 11.2049L18 12.1315V8ZM2 0C0.895431 0 0 0.89543 0 2V22C0 23.1046 0.89543 24 2 24H22C23.1046 24 24 23.1046 24 22V2C24 0.895431 23.1046 0 22 0H2ZM6 4C6 4.55228 5.55228 5 5 5C4.44772 5 4 4.55228 4 4C4 3.44772 4.44772 3 5 3C5.55228 3 6 3.44772 6 4ZM9 5C9.55228 5 10 4.55228 10 4C10 3.44772 9.55228 3 9 3C8.44771 3 8 3.44772 8 4C8 4.55228 8.44771 5 9 5ZM4 13C4 12.4477 4.44772 12 5 12H7C7.55228 12 8 12.4477 8 13C8 13.5523 7.55228 14 7 14H5C4.44772 14 4 13.5523 4 13ZM5 17C4.44772 17 4 17.4477 4 18C4 18.5523 4.44772 19 5 19H16C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17H5Z" fill="white" />
                                            </svg>
                                            <span className="wkit-menu-text">{__('Save Template')}</span>
                                        </li>
                                    </Link>
                                }
                            </ul>
                        </div>
                    }
                    {window.wdkit_editor == "wdkit" && builder_validation == true &&
                        <>
                            <div className="heading-title">{__('Widget Browse')}</div>
                            <div className="menu-wrapper">
                                <ul>
                                    <Link to="/widget-browse">
                                        <li className={`wkit-menu ${pathname.includes("widget-browse") && 'active'}`}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M14 2V6H18V2H14ZM13 0C12.4477 0 12 0.447715 12 1V7C12 7.55228 12.4477 8 13 8H19C19.5523 8 20 7.55228 20 7V1C20 0.447715 19.5523 0 19 0H13ZM2 14V18H6V14H2ZM1 12C0.447715 12 0 12.4477 0 13V19C0 19.5523 0.447715 20 1 20H7C7.55228 20 8 19.5523 8 19V13C8 12.4477 7.55228 12 7 12H1ZM14 18V14H18V18H14ZM12 13C12 12.4477 12.4477 12 13 12H19C19.5523 12 20 12.4477 20 13V19C20 19.5523 19.5523 20 19 20H13C12.4477 20 12 19.5523 12 19V13ZM2 5C2 6.65685 3.34315 8 5 8C6.65685 8 8 6.65685 8 5C8 3.34315 6.65685 2 5 2C3.34315 2 2 3.34315 2 5ZM5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C5.9441 10 6.82709 9.73834 7.5804 9.28357L9.25232 11.1645C9.61924 11.5772 10.2513 11.6144 10.6641 11.2475C11.0769 10.8806 11.1141 10.2485 10.7471 9.83573L9.05251 7.9293C9.6486 7.10608 10 6.09408 10 5C10 2.23858 7.76142 0 5 0Z" fill="white" />
                                            </svg>
                                            <span className="wkit-menu-text">{__('Widget Browse')}</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </>
                    }
                    {(temp_validation == true || builder_validation == true) &&
                        <hr />
                    }
                    {temp_validation == true &&
                        <>
                            <div className="heading-title">{__('My Templates')}</div>
                            <div className="menu-wrapper">
                                <ul>
                                    <Link to='/my_uploaded'>
                                        <li className={`wkit-menu ${(pathname.includes("my_uploaded")) && 'active'}`}>
                                            <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 13H10V7H14L7 0L0 7H4V13ZM7 2.83L9.17 5H8V11H6V5H4.83L7 2.83ZM0 15H14V17H0V15Z" fill="white" />
                                            </svg>
                                            <span className="wkit-menu-text">{__('My Templates')}</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </>
                    }
                    {(temp_validation == true || builder_validation == true) &&
                        <div className="menu-wrapper">
                            <ul>
                                <Link to='/share_with_me'>
                                    <li className={`wkit-menu ${pathname.includes("share_with_me") && 'active'}`}>
                                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08ZM15 2C15.55 2 16 2.45 16 3C16 3.55 15.55 4 15 4C14.45 4 14 3.55 14 3C14 2.45 14.45 2 15 2ZM3 11C2.45 11 2 10.55 2 10C2 9.45 2.45 9 3 9C3.55 9 4 9.45 4 10C4 10.55 3.55 11 3 11ZM15 18.02C14.45 18.02 14 17.57 14 17.02C14 16.47 14.45 16.02 15 16.02C15.55 16.02 16 16.47 16 17.02C16 17.57 15.55 18.02 15 18.02Z" fill="white" />
                                        </svg>
                                        <span className="wkit-menu-text">{__('Shared with Me')}</span>
                                    </li>
                                </Link>
                            </ul>
                        </div>
                    }
                    {(temp_validation == true || builder_validation == true) &&
                        <>
                            <div className="heading-title">{__('Workspace')}</div>
                            <div className="menu-wrapper">
                                <ul>
                                    <Link to='/manage_workspace'>
                                        <li className={`wkit-menu ${pathname.includes("manage_workspace") && 'active'}`}>
                                            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4 12C5.1 12 6 12.9 6 14C6 15.1 5.1 16 4 16C2.9 16 2 15.1 2 14C2 12.9 2.9 12 4 12ZM4 10C1.8 10 0 11.8 0 14C0 16.2 1.8 18 4 18C6.2 18 8 16.2 8 14C8 11.8 6.2 10 4 10ZM10 2C11.1 2 12 2.9 12 4C12 5.1 11.1 6 10 6C8.9 6 8 5.1 8 4C8 2.9 8.9 2 10 2ZM10 0C7.8 0 6 1.8 6 4C6 6.2 7.8 8 10 8C12.2 8 14 6.2 14 4C14 1.8 12.2 0 10 0ZM16 12C17.1 12 18 12.9 18 14C18 15.1 17.1 16 16 16C14.9 16 14 15.1 14 14C14 12.9 14.9 12 16 12ZM16 10C13.8 10 12 11.8 12 14C12 16.2 13.8 18 16 18C18.2 18 20 16.2 20 14C20 11.8 18.2 10 16 10Z" fill="white" />
                                            </svg>
                                            <span className="wkit-menu-text">{__('Manage Workspace')}</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </>
                    }

                    <ManageLicenceMenuHTML />

                    {window.wdkit_editor == "wdkit" && builder_validation == true &&
                        <>
                            <div className="heading-title">{__('My Widgets')}</div>
                            <div className="menu-wrapper">
                                <ul>
                                    <Link to="/widget-listing" >
                                        <li className={`wkit-menu ${pathname.includes("widget-listing") && 'active'}`}>
                                            <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.85305 0.582239C10.5417 0.10019 11.4583 0.100192 12.1469 0.582239L11 2.2207L2.66749 8.05344L1.52057 6.41497L9.85305 0.582239ZM1.83245 13.6967L1.4181 13.3652C0.375944 12.5314 0.427213 10.9303 1.52057 10.165L1.83245 9.94666L1.4181 9.61518C0.375943 8.78145 0.427214 7.18032 1.52057 6.41497L2.66749 8.05344L6.62467 11.2192L9.75058 13.7199C10.481 14.3043 11.5189 14.3043 12.2494 13.7199L15.3753 11.2192L19.3325 8.05344L11 2.2207L12.1469 0.582239L20.4794 6.41497C21.5727 7.18033 21.624 8.78145 20.5818 9.61518L20.1675 9.94666L20.4794 10.165C21.5727 10.9303 21.624 12.5315 20.5818 13.3652L20.1675 13.6967L20.4794 13.915C21.5727 14.6803 21.624 16.2815 20.5818 17.1152L16.6247 20.2809L13.4988 22.7816C12.0379 23.9503 9.96207 23.9503 8.50119 22.7816L5.37528 20.2809L1.4181 17.1152C0.375944 16.2815 0.427213 14.6803 1.52057 13.915L1.83245 13.6967ZM3.45999 14.9987L2.66749 15.5534L6.62467 18.7192L9.75058 21.2199C10.481 21.8043 11.5189 21.8043 12.2494 21.2199L15.3753 18.7192L19.3325 15.5534L18.54 14.9987L16.6247 16.5309L13.4988 19.0316C12.0379 20.2003 9.96207 20.2003 8.50119 19.0316L5.37528 16.5309L3.45999 14.9987ZM16.6247 12.7809L18.54 11.2487L19.3325 11.8034L15.3753 14.9692L12.2494 17.4699C11.5189 18.0543 10.481 18.0543 9.75058 17.4699L6.62467 14.9692L2.66749 11.8034L3.45999 11.2487L5.37528 12.7809L8.50119 15.2816C9.96207 16.4503 12.0379 16.4503 13.4988 15.2816L16.6247 12.7809Z" fill="white" />
                                            </svg>
                                            <span className="wkit-menu-text">{__('My Widgets')}</span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </>
                    }

                    <SettingsMenuHTML />
                </div >
            }
        </>
    );
}

export default Side_menu;