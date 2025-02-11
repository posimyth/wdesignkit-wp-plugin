import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { __ } from '@wordpress/i18n';
import './share_with_me.scss';

import {
    Wkit_template_Skeleton,
    wdKit_Form_data,
    get_user_login,
    Wkit_availble_not,
    Widget_card,
    Page_header
} from '../../helper/helper-function';

const { Fragment } = wp.element;

const {
    Template_loop,
    checkBuilder,
    Plugin_missing,
    Success_import_template,
    wkit_get_user_login,
    wkitGetBuilder
} = wp.wkit_Helper;

/**
 * Share with me Js
 *
 * @since 1.0.0
 * @param {object} props - The properties passed to the Share_with_me component.
 */
const Share_with_me = (props) => {

    var img_path = wdkitData.WDKIT_URL;

    let data = wkit_get_user_login()
    if (!data) {
        props.wdkit_Login_Route('/share_with_me');

        return <Navigate to='/login' />
    }

    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [totalpage, settotalpage] = useState(0);
    const [userData, setuserData] = useState();

    const [shareData, setShareData] = useState([]);
    const [downTempId, setDownloadTempId] = useState('');
    const [successImport, setSuccessImport] = useState(false);
    const [customMetaImport, setCustomMetaImport] = useState(false);
    const [selectBuilder, setSelectBuilder] = useState('all');
    const [selectType, setselectType] = useState('templates');
    const [loading, setloading] = useState(true);

    /**Widget Download  */
    const [existingwidget, setexistingwidget] = useState([]);

    const location = useLocation();
    const yourStateData = location.state;
    useEffect(() => {
        if (yourStateData) {
            setActivePage(yourStateData);
        }
    }, [yourStateData]);

    /** Get shared data from redux  */
    useEffect(() => {
        if (props?.wdkit_meta?.userinfo) {
            setuserData(props?.wdkit_meta);
        }
    }, [props?.wdkit_meta?.userinfo])

    /** main api function to get template and widget list ( count current and total page ) */
    const sharewithTempApi = async () => {
        setloading(true);

        let token = get_user_login();

        if (token) {
            let api_data = {
                "token": token.token,
                "type": selectType == 'widgets' ? 'builder' : selectType == 'templates' ? 'template' : '',
                "current_page": activePage,
                "par_page": perPage,
                "id": userData?.userinfo?.id,
                "builder": window.wdkit_editor
            };

            let form_arr = { 'type': 'shared_with_me', 'api_info': JSON.stringify(api_data) }
            await wdKit_Form_data(form_arr).then(async (res) => {
                await setShareData(res);

                if (selectType == 'widgets') {
                    const WidgetListdata = async (browse_data) => {
                        if (browse_data) {

                            let array = [];

                            const data = props?.wdkit_meta?.widget_list ? props.wdkit_meta.widget_list : [];
                            data.map(async (data) => {
                                if (data?.type == 'plugin' || data?.type == 'done') {

                                    let index = browse_data.findIndex((id) => id.w_unique == data.w_unique);
                                    if (index > -1) {
                                        array.push(data.w_unique);
                                    }
                                }
                            })
                            setexistingwidget(array);
                        }
                    }
                    WidgetListdata(res?.data?.content)
                }

                let Total = (res?.data?.data?.total) ? res.data.data.total : 0
                settotalpage(Math.ceil(Total / perPage))
            })
        }
        setloading(false);

    };

    /** Call function after pagination and filter */
    useEffect(() => {
        if (userData) {
            sharewithTempApi()
        }
    }, [selectType, activePage, userData]);

    /** close popup of download template */
    const Wkit_popup_remove = (e) => {
        if (e) {
            e.currentTarget.closest('.wkit-model-transp.wkit-popup-show').innerHTML = '';
            setDownloadTempId('')
        }
    }

    /** get builder name by id for widget */
    const builder_name = (id) => {
        if (userData?.widgetbuilder) {
            let dataBase = userData?.widgetbuilder;
            let index = dataBase.findIndex((data) => data.w_id == id);
            if (index > -1) {
                return dataBase[index].builder_name.toLowerCase();
            }
        }
    }

    const wdkitBuilderType = (id, post_type, type, temp_builder, builderList) => {
        if (id && post_type && temp_builder) {
            let download = [{ 'id': id, 'type': post_type }]
            if (builderList && temp_builder) {
                temp_builder = wkitGetBuilder(temp_builder, builderList);
            } else {
                temp_builder = ''
            }
            if (type == 'section') {
                setDownloadTempId({ 'pages': [], 'sections': download, 'builder': temp_builder })
            } else {
                setDownloadTempId({ 'pages': download, 'sections': [], 'builder': temp_builder })
            }
        } else {
            setDownloadTempId(id)
        }
    }

    // widget builder icon 
    const widget_builder = (data) => {
        let index = props.wdkit_meta.widgetbuilder.findIndex((id) => id.w_id == data.builder);
        if (index > -1 && props.wdkit_meta?.widgetbuilder[index]?.builder_icon) {
            return props.wdkit_meta.widgetbuilder[index].builder_icon;
        } else {
            return `${wdkitData.wdkit_server_url}images/uploads/wpdk-admin/random-image/placeholder.jpg`
        }
    }

    /** drop-down toggle event for widget action menu */
    const Drop_down_toggle = (e) => {
        let main_object = e.target.closest(".wkit-custom-dropDown")
        let drop_down = main_object.querySelector(".wkit-custom-dropDown-content") ? main_object.querySelector(".wkit-custom-dropDown-content") : "";
        if (drop_down) {
            if (Object.values(drop_down.classList).includes("wkit-show")) {
                drop_down.classList.remove("wkit-show");
                document.querySelector(".wkit-custom-dropDown-header img").style.transform = "rotate(0deg)";
            } else {
                drop_down.classList.add("wkit-show");
                document.querySelector(".wkit-custom-dropDown-header img").style.transform = "rotate(180deg)";
                document.querySelector(".wkit-custom-dropDown-header img").style.transition = "0.3s";
            }
        }
    }

    const custom_dropdown = () => {
        if (window?.wdkit_editor != 'wdkit') {
            return false;
        }
        return (
            <Fragment>
                <div className='wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }} style={{ width: '150px' }}>
                    <div className='wkit-custom-dropDown-header wkit-shareWithMe-drop-down'>
                        {'templates' === selectType &&
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.375 1.5H2.375L2.375 4.5H17.375V1.5ZM0.875 4.5V6V16.5C0.875 17.3284 1.54657 18 2.375 18H17.375C18.2034 18 18.875 17.3284 18.875 16.5V6V4.5V1.5C18.875 0.671573 18.2034 0 17.375 0H2.375C1.54657 0 0.875 0.671573 0.875 1.5V4.5ZM2.375 16.5H17.375V6H2.375L2.375 16.5ZM3.875 8.625C3.875 8.41789 4.04289 8.25 4.25 8.25H15.5C15.7071 8.25 15.875 8.41789 15.875 8.625V9.375C15.875 9.58211 15.7071 9.75 15.5 9.75H4.25C4.04289 9.75 3.875 9.58211 3.875 9.375V8.625ZM4.625 11.25C4.21079 11.25 3.875 11.5858 3.875 12V13.5C3.875 13.9142 4.21079 14.25 4.625 14.25H6.125C6.53921 14.25 6.875 13.9142 6.875 13.5V12C6.875 11.5858 6.53921 11.25 6.125 11.25H4.625ZM8.375 12C8.375 11.5858 8.71079 11.25 9.125 11.25H10.625C11.0392 11.25 11.375 11.5858 11.375 12V13.5C11.375 13.9142 11.0392 14.25 10.625 14.25H9.125C8.71079 14.25 8.375 13.9142 8.375 13.5V12ZM13.625 11.25C13.2108 11.25 12.875 11.5858 12.875 12V13.5C12.875 13.9142 13.2108 14.25 13.625 14.25H15.125C15.5392 14.25 15.875 13.9142 15.875 13.5V12C15.875 11.5858 15.5392 11.25 15.125 11.25H13.625ZM4.625 3.75C5.03921 3.75 5.375 3.41421 5.375 3C5.375 2.58579 5.03921 2.25 4.625 2.25C4.21079 2.25 3.875 2.58579 3.875 3C3.875 3.41421 4.21079 3.75 4.625 3.75ZM8.375 3C8.375 3.41421 8.03921 3.75 7.625 3.75C7.21079 3.75 6.875 3.41421 6.875 3C6.875 2.58579 7.21079 2.25 7.625 2.25C8.03921 2.25 8.375 2.58579 8.375 3ZM10.625 3.75C11.0392 3.75 11.375 3.41421 11.375 3C11.375 2.58579 11.0392 2.25 10.625 2.25C10.2108 2.25 9.875 2.58579 9.875 3C9.875 3.41421 10.2108 3.75 10.625 3.75Z" fill="#737373" /></svg>
                        }
                        {'widgets' === selectType &&
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M9.01515 0.436679C9.53163 0.0751434 10.2191 0.0751432 10.7355 0.436679L16.9849 4.81123C17.8049 5.38524 17.8434 6.58609 17.0617 7.21138L16.751 7.45999L16.9849 7.62373C17.8049 8.19774 17.8434 9.39859 17.0617 10.0239L16.751 10.2725L16.9849 10.4362C17.8049 11.0102 17.8434 12.2111 17.0617 12.8364L14.0939 15.2107L11.7494 17.0862C10.6538 17.9628 9.09692 17.9628 8.00126 17.0862L5.65682 15.2107L2.68894 12.8364C1.90733 12.2111 1.94577 11.0102 2.76579 10.4362L2.99971 10.2725L2.68894 10.0239C1.90733 9.39859 1.94577 8.19774 2.76579 7.62373L2.99971 7.45999L2.68894 7.21138C1.90732 6.58609 1.94578 5.38524 2.76579 4.81123L9.01515 0.436679ZM4.22036 11.249L3.62599 11.6651L6.59387 14.0394L8.9383 15.9149C9.48613 16.3532 10.2646 16.3532 10.8124 15.9149L13.1568 14.0394L16.1247 11.6651L15.5303 11.249L14.0939 12.3982L11.7494 14.2737C10.6538 15.1503 9.09692 15.1503 8.00126 14.2737L5.65682 12.3982L4.22036 11.249ZM14.0939 9.58569L15.5303 8.43652L16.1247 8.85258L13.1568 11.2269L10.8124 13.1024C10.2646 13.5407 9.48613 13.5407 8.9383 13.1024L6.59387 11.2269L3.62599 8.85258L4.22036 8.43652L5.65682 9.58569L8.00126 11.4612C9.09692 12.3378 10.6538 12.3378 11.7494 11.4612L14.0939 9.58569ZM16.1247 6.04008L9.87535 1.66553L3.62599 6.04008L6.59387 8.41438L8.9383 10.2899C9.48613 10.7282 10.2646 10.7282 10.8124 10.2899L13.1568 8.41438L16.1247 6.04008Z" fill="#737373" /></svg>
                        }
                        <span style={{ textTransform: 'capitalize' }}>{selectType}</span>
                        <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} style={{ width: '15px' }} />
                    </div>
                    <div className='wkit-custom-dropDown-content'>
                        <div className='wkit-drop-down-outer'></div>
                        <div className='wkit-custom-dropDown-options' onClick={(e) => { setselectType('templates') }}>
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M17.375 1.5H2.375L2.375 4.5H17.375V1.5ZM0.875 4.5V6V16.5C0.875 17.3284 1.54657 18 2.375 18H17.375C18.2034 18 18.875 17.3284 18.875 16.5V6V4.5V1.5C18.875 0.671573 18.2034 0 17.375 0H2.375C1.54657 0 0.875 0.671573 0.875 1.5V4.5ZM2.375 16.5H17.375V6H2.375L2.375 16.5ZM3.875 8.625C3.875 8.41789 4.04289 8.25 4.25 8.25H15.5C15.7071 8.25 15.875 8.41789 15.875 8.625V9.375C15.875 9.58211 15.7071 9.75 15.5 9.75H4.25C4.04289 9.75 3.875 9.58211 3.875 9.375V8.625ZM4.625 11.25C4.21079 11.25 3.875 11.5858 3.875 12V13.5C3.875 13.9142 4.21079 14.25 4.625 14.25H6.125C6.53921 14.25 6.875 13.9142 6.875 13.5V12C6.875 11.5858 6.53921 11.25 6.125 11.25H4.625ZM8.375 12C8.375 11.5858 8.71079 11.25 9.125 11.25H10.625C11.0392 11.25 11.375 11.5858 11.375 12V13.5C11.375 13.9142 11.0392 14.25 10.625 14.25H9.125C8.71079 14.25 8.375 13.9142 8.375 13.5V12ZM13.625 11.25C13.2108 11.25 12.875 11.5858 12.875 12V13.5C12.875 13.9142 13.2108 14.25 13.625 14.25H15.125C15.5392 14.25 15.875 13.9142 15.875 13.5V12C15.875 11.5858 15.5392 11.25 15.125 11.25H13.625ZM4.625 3.75C5.03921 3.75 5.375 3.41421 5.375 3C5.375 2.58579 5.03921 2.25 4.625 2.25C4.21079 2.25 3.875 2.58579 3.875 3C3.875 3.41421 4.21079 3.75 4.625 3.75ZM8.375 3C8.375 3.41421 8.03921 3.75 7.625 3.75C7.21079 3.75 6.875 3.41421 6.875 3C6.875 2.58579 7.21079 2.25 7.625 2.25C8.03921 2.25 8.375 2.58579 8.375 3ZM10.625 3.75C11.0392 3.75 11.375 3.41421 11.375 3C11.375 2.58579 11.0392 2.25 10.625 2.25C10.2108 2.25 9.875 2.58579 9.875 3C9.875 3.41421 10.2108 3.75 10.625 3.75Z" fill="#737373" />
                            </svg>
                            <span>{__('Templates', 'wdesignkit')}</span>
                        </div>
                        <div className='wkit-custom-dropDown-options' onClick={(e) => { setselectType('widgets') }}>
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9.01515 0.436679C9.53163 0.0751434 10.2191 0.0751432 10.7355 0.436679L16.9849 4.81123C17.8049 5.38524 17.8434 6.58609 17.0617 7.21138L16.751 7.45999L16.9849 7.62373C17.8049 8.19774 17.8434 9.39859 17.0617 10.0239L16.751 10.2725L16.9849 10.4362C17.8049 11.0102 17.8434 12.2111 17.0617 12.8364L14.0939 15.2107L11.7494 17.0862C10.6538 17.9628 9.09692 17.9628 8.00126 17.0862L5.65682 15.2107L2.68894 12.8364C1.90733 12.2111 1.94577 11.0102 2.76579 10.4362L2.99971 10.2725L2.68894 10.0239C1.90733 9.39859 1.94577 8.19774 2.76579 7.62373L2.99971 7.45999L2.68894 7.21138C1.90732 6.58609 1.94578 5.38524 2.76579 4.81123L9.01515 0.436679ZM4.22036 11.249L3.62599 11.6651L6.59387 14.0394L8.9383 15.9149C9.48613 16.3532 10.2646 16.3532 10.8124 15.9149L13.1568 14.0394L16.1247 11.6651L15.5303 11.249L14.0939 12.3982L11.7494 14.2737C10.6538 15.1503 9.09692 15.1503 8.00126 14.2737L5.65682 12.3982L4.22036 11.249ZM14.0939 9.58569L15.5303 8.43652L16.1247 8.85258L13.1568 11.2269L10.8124 13.1024C10.2646 13.5407 9.48613 13.5407 8.9383 13.1024L6.59387 11.2269L3.62599 8.85258L4.22036 8.43652L5.65682 9.58569L8.00126 11.4612C9.09692 12.3378 10.6538 12.3378 11.7494 11.4612L14.0939 9.58569ZM16.1247 6.04008L9.87535 1.66553L3.62599 6.04008L6.59387 8.41438L8.9383 10.2899C9.48613 10.7282 10.2646 10.7282 10.8124 10.2899L13.1568 8.41438L16.1247 6.04008Z" fill="#737373" />
                            </svg>
                            <span>{__('Widgets', 'wdesignkit')}</span>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    return (
        <div className="wkit-share-with-me">
            <Page_header
                title={__('Shared With Me', 'wdesignkit')}
                svg={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12.375 5.875C12.375 3.73489 14.1099 2 16.25 2C18.3901 2 20.125 3.73489 20.125 5.875C20.125 8.01511 18.3901 9.75 16.25 9.75C15.1698 9.75 14.1929 9.30803 13.4901 8.59505L10.4621 10.5004C10.6477 10.9532 10.75 11.449 10.75 11.9687C10.75 12.488 10.6479 12.9834 10.4626 13.436L13.491 15.3416C14.1937 14.6291 15.1703 14.1875 16.25 14.1875C18.3901 14.1875 20.125 15.9224 20.125 18.0625C20.125 20.2026 18.3901 21.9375 16.25 21.9375C14.1099 21.9375 12.375 20.2026 12.375 18.0625C12.375 17.5424 12.4775 17.0462 12.6633 16.593L9.63573 14.6879C8.93292 15.4014 7.95562 15.8437 6.875 15.8437C4.73489 15.8437 3 14.1089 3 11.9687C3 9.82862 4.73489 8.09375 6.875 8.09375C7.95517 8.09375 8.93212 8.53571 9.63486 9.24867L12.6629 7.34334C12.4773 6.89048 12.375 6.39469 12.375 5.875ZM16.25 3.5C14.9383 3.5 13.875 4.56331 13.875 5.875C13.875 7.18669 14.9383 8.25 16.25 8.25C17.5617 8.25 18.625 7.18669 18.625 5.875C18.625 4.56331 17.5617 3.5 16.25 3.5ZM6.875 9.59375C5.56331 9.59375 4.5 10.6571 4.5 11.9687C4.5 13.2804 5.56331 14.3437 6.875 14.3437C8.18669 14.3437 9.25 13.2804 9.25 11.9687C9.25 10.6571 8.18669 9.59375 6.875 9.59375ZM13.875 18.0625C13.875 16.7508 14.9383 15.6875 16.25 15.6875C17.5617 15.6875 18.625 16.7508 18.625 18.0625C18.625 19.3742 17.5617 20.4375 16.25 20.4375C14.9383 20.4375 13.875 19.3742 13.875 18.0625Z" fill="#040483" /></svg>}
                custom_dropdown={() => custom_dropdown()}
            />
            <div className="wdkit-loop">
                {(shareData?.data?.content?.length > 0 && props?.wdkit_meta) && !loading &&
                    <div className="wdesign-kit-main wkit-grid-columns">
                        {Object.values(shareData.data.content).map((data, index) => {
                            return (
                                <Fragment key={index}>
                                    {selectType == 'templates' ?
                                        <Fragment>
                                            {(checkBuilder(data.post_builder, selectBuilder)) &&
                                                <Template_loop
                                                    handler={(val) => setShareData(shareData)}
                                                    handlerTempID={(val) => {
                                                        wdkitData.use_editor == 'wdkit' ?
                                                        wdkitBuilderType(val, data.wp_post_type, data.type, Number(data.post_builder), userData.builder) : setDownloadTempId(val)
                                                    }}
                                                    userinfo={props?.wdkit_meta?.userinfo}
                                                    data={data}
                                                    credits={props?.wdkit_meta?.credits}
                                                    currentPage={activePage}
                                                    builder={props?.wdkit_meta?.builder}
                                                    type={data.type == 'websitekit' ? data.type + '-view' : data.type}
                                                    width={'24%'}
                                                    wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                                />
                                            }
                                        </Fragment>
                                        :
                                        <Fragment key={index}>
                                            <Widget_card
                                                widgetData={data}
                                                existingwidget={existingwidget}
                                                setexistingwidget={(new_array) => { setexistingwidget(new_array) }}
                                                widgetbuilder={props.wdkit_meta.widgetbuilder}
                                                index={index}
                                                wdkit_set_meta={(data) => { props.wdkit_set_meta(data) }}
                                                wdkit_meta={props?.wdkit_meta}
                                                userinfo={props?.wdkit_meta?.userinfo}
                                                type={'share_with_me'}
                                                wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                            />
                                        </Fragment>
                                    }
                                </Fragment>
                            );
                        })}
                    </div>
                }
                {(shareData?.data?.total == 0 || shareData?.data?.data == 'error') && loading == false &&
                    <Wkit_availble_not page={selectType} link={wdkitData.WDKIT_DOC_URL + 'documents/add-templates-and-widgets-in-workspace/'} />
                }
                {loading &&
                    <div style={{ width: "100%" }}>
                        <Wkit_template_Skeleton />
                    </div>
                }
            </div>
            {downTempId &&
                <div className={"wkit-model-transp wkit-popup-show"} >
                    <div className={"wkit-plugin-model-content wkit-import-template"}>
                        <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e), setSuccessImport(false), setDownloadTempId('') }}>
                            <span>
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                            </span>
                        </a>
                        {!successImport ?
                            <Plugin_missing
                                template_id={downTempId}
                                handlerSuccessImport={(val, customMeta) => {
                                    setSuccessImport(val)
                                    setCustomMetaImport(customMeta)
                                }}
                                type={wdkitData.use_editor}
                                templateData={shareData?.data?.content}
                                pluginData={props?.wdkit_meta?.plugin}
                                wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                            />
                            :
                            <Success_import_template
                                template_id={downTempId}
                                custom_meta_import={customMetaImport}
                                template_list={shareData?.data?.content}
                                handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId('') }}
                                wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                            />
                        }
                    </div>
                </div>
            }
            <div className='wkit-wb-paginatelist'>
                {totalpage > 1 &&
                    <div className='wkit-pagination-main'>
                        <ReactPaginate
                            breakLabel={"..."}
                            nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M0.412598 9.52417L4.48371 5.44417L0.412598 1.36417L1.66593 0.11084L6.99926 5.44417L1.66593 10.7775L0.412598 9.52417Z" fill="#8991A4" /></svg>}
                            pageRangeDisplayed={2}
                            pageCount={totalpage}
                            marginPagesDisplayed={1}
                            previousLabel={<svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none"><path d="M7.47754 1.36352L3.40643 5.44352L7.47754 9.52352L6.22421 10.7769L0.890873 5.44352L6.22421 0.110189L7.47754 1.36352Z" fill="#8991A4" /></svg>}
                            pageClassName={"wkit-page-item"}
                            pageLinkClassName={"wkit-pagination-item"}
                            previousClassName={"wkit-next-prev wkit-prev-pagination"}
                            previousLinkClassName={"wkit-pagination-item"}
                            nextClassName={"wkit-next-prev wkit-next-pagination"}
                            nextLinkClassName={"wkit-pagination-item"}
                            breakClassName={"wkit-page-item"}
                            breakLinkClassName={"page-link"}
                            containerClassName={"wkit-pagination"}
                            activeClassName={"active"}
                            onClick={(clickEvent) => {
                                window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: 'smooth'
                                });
                                if (clickEvent.nextSelectedPage != undefined) {
                                    setActivePage(clickEvent.nextSelectedPage + 1)
                                }
                            }}
                            forcePage={activePage - 1}
                            onPageActive={() => { }}
                        />
                    </div>
                }
            </div>
        </div >
    );
}

export default Share_with_me;