import { Wkit_workspace_skeleton, Wpopup_body_data, wdKit_Form_data, get_user_login, Wkit_template_Skeleton, Get_user_info_data, Wkit_availble_not, Show_toast, WkitLoader, CardRatings } from '../../helper/helper-function';
const { __ } = wp.i18n;
const { Fragment } = wp.element;
import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from "react-router-dom";
import WS_single_skeleton from './single_workspace_header';
import Elementor_file_create from "../../widget-builder/file-creation/elementor_file";
import CreatFile from "../../widget-builder/file-creation/gutenberg_file";
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const {
    get_userinfo,
    Template_loop,
    form_data,
    Plugin_missing,
    Success_import_template,
    wkit_get_user_login,
    wkitGetBuilder
} = wp.wkit_Helper;

const Workspace_single = (props) => {

    let data = wkit_get_user_login()
    if (!data) {
        return <Navigate to='/login' />
    }

    const params = useParams();

    const [userData, setUserData] = useState("loading");
    const [inp_name, setinp_name] = useState('')
    const [Temp_filter, setTemp_filter] = useState('templates')
    const [builder_filter, setbuilder_filter] = useState('all')
    const [wsData, setwsData] = useState();
    const [downTempId, setDownloadTempId] = useState('');
    const [successImport, setSuccessImport] = useState(false);
    const [customMetaImport, setCustomMetaImport] = useState(false);
    const [OpenPopup, setOpenPopup] = useState('');
    const [openOuter, setopenOuter] = useState(false);
    const [selectedWs, setselectedWs] = useState('');
    const [Popup_ws_data, setPopup_ws_data] = useState(false);
    const [OpenDropdown, setOpenDropdown] = useState(-1);
    const [loading, setloading] = useState(false);
    const [Listdata, setListdata] = useState([]);
    const [existingwidget, setexistingwidget] = useState([]);
    const [downloading, setdownloading] = useState(false);
    const [Download_index, setDownload_index] = useState(-1);
    const [WorkList, setWorkList] = useState([]);
    const [widgetId, setwidgetId] = useState(-1);

    //pagination 
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [start_id, setstart_id] = useState();
    const [end_id, setend_id] = useState();
    const navigation = useNavigate();

    var img_path = wdkitData.WDKIT_URL;

    /** Get data from redux */
    useEffect(() => {
        if (props?.wdkit_meta?.workspace) {
            let index = props?.wdkit_meta?.workspace.findIndex((id) => id.w_id == params.id);
            if (props?.wdkit_meta?.workspace?.[index]?.is_activated == 'active') {
                setUserData(props.wdkit_meta);
                if (props?.wdkit_meta?.workspace) {
                    Object.values(props?.wdkit_meta?.workspace).map((data) => {
                        if (params.id != '' && Number(params.id) === data.w_id) {
                            setwsData(data)
                            setinp_name(data.work_title)
                        }
                    })
                }
                setloading(false);
            } else {
                navigation('/manage_workspace')
                props.wdkit_set_toast(['Workspace Deactivated', 'This Workspace is Deactivated', '', 'danger']);

            }
        }

    }, [props.wdkit_meta]);

    /** set pagination data after any filter or change page */
    useEffect(() => {
        setloading(true);

        if (wsData) {

            let start_id = (activePage - 1) * perPage;
            let end_id = start_id + perPage;

            setstart_id(start_id);
            setend_id(end_id);
        }
        setTimeout(() => {
            setloading(false);
        }, 700);
    }, [builder_filter, Temp_filter, activePage])

    /** filter function called */
    useEffect(() => {
        DataList(Temp_filter)
    }, [wsData, builder_filter, Temp_filter])

    /** filter function */
    const DataList = async (type) => {
        let final_data = [];
        if (type == 'templates') {
            let temp = userData?.template
            let work_temp = wsData?.work_templates

            work_temp?.length > 0 && work_temp.map((t_id) => {
                if (builder_filter == 'all') {
                    var index = temp.findIndex((data) => data.id == t_id)
                } else {
                    var index = temp.findIndex((data) => data.id == t_id && data.builder == builder_filter)
                }

                if (index > -1) {
                    final_data.push(temp[index])
                }
            })
        } else if (type == 'widgets') {

            var widget = [];
            if (userData?.widgettemplate) {
                const builder_name = (id) => {
                    if (userData?.widgetbuilder) {
                        let dataBase = userData?.widgetbuilder;
                        let index = dataBase.findIndex((data) => data.w_id == id);
                        if (index > -1) {
                            return dataBase[index].builder_name.toLowerCase();
                        }
                    }
                }

                let widgetList = [...userData?.widgettemplate]

                widget = widgetList.filter((data) => {
                    if (userData?.Setting[`${builder_name(data.builder)}_builder`]) {
                        return data
                    }
                })
            }

            let work_widget = wsData?.work_widgets
            work_widget && work_widget.map(async (w_id) => {
                if (builder_filter == 'all') {
                    var index = widget.findIndex((data) => data.id == w_id)
                } else {
                    var index = widget.findIndex((data) => data.id == w_id && data.builder == builder_filter)
                }

                if (index > -1) {
                    final_data.push(widget[index])
                }
            })

            WidgetListdata(final_data);

        }
        setListdata(final_data);
    }

    /** Update data after any delete or add or move operation */
    const Update_List = async () => {
        let updated_data = await Get_user_info_data().then(async (result) => { return result })
        await props.wdkit_set_meta(updated_data.data)
        setloading(false)
    }

    /** for handle workspace name  */
    const WKit_input_text = async (title_val) => {
        if (document.querySelector('.wkit-text-field.wkit-hide')) {
            document.querySelector('.wkit-text-field.wkit-hide').classList.remove("wkit-hide")
        } else {
            let userEmail = ''
            if (data && data.user_email) {
                userEmail = data.user_email
            }
            document.querySelector('.wkit-text-field').classList.add("wkit-hide")
            let form_arr = { 'type': 'manage_workspace', 'email': userEmail, 'builder': window.wdkit_editor, 'title': title_val || inp_name, 'wid': params.id, 'wstype': 'edit' }
            var result = await form_data(form_arr)
            if (result && result.data && result.data.success) {
                wsData.work_title = title_val || inp_name
                setwsData({ ...wsData })
                Object.values(props.wdkit_meta.workspace).map((index, data) => {
                    if (params.id != '' && Number(params.id) === data.w_id) {
                        props.wdkit_meta.workspace[index].work_title = title_val || inp_name
                    }
                })
                props.wdkit_set_toast([result?.data?.message, result?.data?.description, '', 'success'])
                Update_List()
            }

        }
    }

    /** for remove popup of copy or move workspace */
    const Wkit_popup_remove = (e) => {
        if (e) {
            e.currentTarget.closest('.wkit-model-transp.wkit-popup-show').innerHTML = '';
            setDownloadTempId('')
        }
    }

    let listLength = 0;
    var profile_Letter = '';
    if (wsData && wsData.work_title) {
        var profile_Letter = wsData.work_title;
        profile_Letter = profile_Letter.match(/\b(\w)/g);
        profile_Letter = profile_Letter.join('').toUpperCase().substr(0, 2);
    }
    let total_count = 0;
    if (wsData && wsData.total_count) {
        Object.values(wsData.total_count).map((data) => {
            total_count = Number(total_count) + Number(data.count)
        })
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

    /** filter drop-down for builder */
    const Change_builder = (type) => {
        if (type && type != "all") {
            if (Temp_filter == 'templates') {
                let builder_array = userData?.builder;
                let index = builder_array.findIndex((id) => id.original_slug == type)
                setbuilder_filter(builder_array[index].p_id);
            } else {
                let builder_array = userData?.widgetbuilder;
                let index = builder_array.findIndex((id) => id.builder_name.toLowerCase() == type)
                setbuilder_filter(builder_array[index].w_id);
            }
        } else {
            setbuilder_filter('all');
        }
    }

    /** get builder name by it's id of template */
    const builder_name = (b_id) => {
        let type = Temp_filter
        if (builder_filter != 'all') {

            if (type == 'templates') {
                let builder_array = userData?.builder
                let index = builder_array.findIndex((id) => id.p_id == b_id)
                return builder_array[index].plugin_name;
            } else if (type == 'widgets') {
                let builder_array = userData?.widgetbuilder
                let index = builder_array.findIndex((id) => id.w_id == b_id)
                return builder_array[index].builder_name;
            }
        } else {
            return 'All'
        }
    }


    /** get builder icon of widget */
    const widget_builder = (data) => {
        let index = props.wdkit_meta.widgetbuilder.findIndex((id) => id.w_id == data.builder);
        if (index > -1 && props.wdkit_meta?.widgetbuilder[index]?.builder_icon) {
            return props.wdkit_meta.widgetbuilder[index].builder_icon;
        } else {
            return `${wdkitData.wdkit_server_url}images/uploads/wpdk-admin/random-image/placeholder.jpg`
        }
    }

    const Popup_Close = () => {
        document.querySelector('.wkit-model-transp.wkit-popup-show').classList.remove("wkit-popup-show")
    }

    const On_OpenPopup = () => {
        document.querySelector('.wkit-model-transp').classList.add("wkit-popup-show")
    }

    const DeletePopup = () => {
        return <div className='wkit-model-transp'>
            <div className='wkit-plugin-model-content'>
                <a className={"wkit-plugin-popup-close"} onClick={(e) => { Popup_Close(e); }}>
                    <span>&times;</span>
                </a>
                <div className="popup-missing">
                    <div className="popup-header">{__('Please Confirm')}</div>
                    <div className="popup-body">
                        <div className="wkit-popup-content-title">
                            Are you sure want to permanently delete
                        </div>
                        <div className="wkit-popup-buttons">
                            <button className="wkit-popup-confirm" onClick={() => Popup_Close()}>
                                No
                            </button>
                            <button className="wkit-popup-cancel" onClick={() => Remove_widget(widgetId)}>
                                {loading == true ?
                                    <WkitLoader />
                                    :
                                    <span>Yes</span>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    /** remove widget from workspace */
    const Remove_widget = async (data) => {
        if (data) {
            setloading(true);
            let token = get_user_login();
            if (token) {

                let api_data = {
                    "token": token.token,
                    "type": 'wd_ws_remove',
                    "widget_id": data?.id,
                    "wid": wsData?.w_id,
                };

                let form_arr = { 'type': 'wkit_manage_widget_workspace', 'workspace_info': JSON.stringify(api_data) }
                await wdKit_Form_data(form_arr).then((res) => {
                    if (res?.success == true) {
                        props.wdkit_set_toast([res?.message, res?.description, '', 'success']);
                        Update_List();
                    } else {
                        props.wdkit_set_toast([res?.message, res?.description, '', 'danger']);
                    }
                })
            }
        }
        setwidgetId(-1);
        setloading(false);
    }

    const manage_to_workspace = async (type) => {
        if (type == 'move') {
            setloading(true);
        }

        let data = Popup_ws_data;

        let token = get_user_login();
        if (token) {
            if (type == 'copy') {
                setOpenPopup('loading')
                var api_data = {
                    "token": token.token,
                    "type": 'wd-copy',
                    "widget_id": data?.id,
                    "current_wid": wsData?.w_id,
                    "wid": selectedWs,
                };
            } else if (type == 'move') {
                setOpenPopup('loading')
                var api_data = {
                    "token": token.token,
                    "type": 'wd-move',
                    "widget_id": data?.id,
                    "current_wid": wsData?.w_id,
                    "wid": selectedWs,
                };
            }


            let form_arr = { 'type': 'wkit_manage_widget_workspace', 'workspace_info': JSON.stringify(api_data) }
            await wdKit_Form_data(form_arr).then(async (res) => {
                if (res?.success == true) {
                    if (type == 'copy') {
                        props.wdkit_set_toast([res?.message, res?.description, '', 'success']);
                        let new_data = await Get_user_info_data().then(async (result) => { return result })
                        props.wdkit_set_meta(new_data.data);
                    } else if (type == 'move') {
                        props.wdkit_set_toast([res?.message, res?.description, '', 'success']);
                        let new_data = await Get_user_info_data().then(async (result) => { return result })
                        props.wdkit_set_meta(new_data.data);
                    }
                } else {
                    props.wdkit_set_toast([res?.message, res?.description, '', 'danger']);
                    setOpenPopup('');
                    setPopup_ws_data('');
                }
            })
        }
        setOpenPopup('');
        setPopup_ws_data('');
        setloading(false);
    }

    /** drop-down toggle event of widget action menu */
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

    /** widget data list after filter */
    const WidgetListdata = async (browse_data) => {
        let array = [];

        let form_arr = { 'type': 'wkit_get_widget_list' }
        await wdKit_Form_data(form_arr)
            .then((response) => {
                const data = response;
                data.map(async (data) => {
                    let index = browse_data.findIndex((id) => id.w_unique == data.widgetdata.widget_id);
                    if (index > -1) {
                        array.push(data.widgetdata.widget_id);
                    }
                })
            })
        setexistingwidget(array);
    }

    /** download widget from workspace */
    const Download_widget = async (w_data, index) => {

        let id = w_data.id
        setDownload_index(index);

        const Create_widget = async (data) => {
            let json = JSON.parse(data.json);
            let builder = json?.widget_data?.widgetdata?.type;
            let html = JSON.stringify(json?.Editor_data?.html);
            let js = JSON.stringify(json?.Editor_data?.js);
            let css = JSON.stringify(json?.Editor_data?.css);
            let image = data.image;
            let icon = '';

            var widget_data = Object.assign({}, json.widget_data.widgetdata, { 'r_id': data.r_id, 'allow_push': true });
            if (props?.wdkit_meta?.userinfo?.id != w_data?.user_id) {
                widget_data = Object.assign({}, json.widget_data.widgetdata, { 'allow_push': false });
            }
            let widget_obj = Object.assign({}, json.widget_data, { 'widgetdata': widget_data });

            var data = {
                "CardItems": {
                    "cardData": json.section_data
                },

                "WcardData": widget_obj,

                "Editor_data": json.Editor_Link,

                "Editor_code": {
                    "Editor_codes": [json.Editor_data]
                }
            }

            if (builder == "elementor") {
                await Elementor_file_create('add', data, html, css, js, "", image)
                    .then((res) => {
                        if (res?.api?.success == true) {
                            let old = [...existingwidget]
                            old.push(w_data.w_unique)
                            setexistingwidget(old)
                        }
                    })
            } else if (builder == "gutenberg") {
                CreatFile('add', data, html, css, js, "", image, "", icon)
            }
            setdownloading(false);
            setDownload_index(-1);
        }

        let token = get_user_login();

        var api_data = {
            "type": 'widget/download',
            "w_uniq": id,
            "d_type": "workspace",
            "u_id": props?.wdkit_meta?.userinfo?.id
        };

        let form_arr = { 'type': 'wkit_public_download_widget', 'widget_info': JSON.stringify(api_data) }
        await form_data(form_arr).then(result => {
            if (result) {
                props.wdkit_set_toast([result.message, result.description, '', 'success'])
            } else {
                props.wdkit_set_toast([result.message, result.description, '', 'danger'])
            }
            Create_widget(result)
        })
    }

    /** widget card loop */
    const Widget_card = (data, index) => {

        const SetImageUrl = (url) => {
            if (url) {
                var imageUrl = url.replace(/\s/g, "%20");

                return imageUrl;
            } else {
                return '';
            }
        }

        return (
            <div className="wkit-widgetlist-grid-content" key={index}>
                {data.is_activated != 'active' &&
                    <Fragment>
                        <div className='wdkit-inner-boxed-deActivate'>
                            <div className='wdkit-inner-boxed-deActivate-h1'>Credit Limit Reached!</div>
                            <div className='wdkit-inner-boxed-deActivate-p'>This Template got disabled until you have more credits to make it active.</div>
                            <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                                <button>Buy Credits</button>
                            </a>
                        </div>
                        <span className='wdkit-inner-boxed-remove'>
                            <svg onClick={() => { On_OpenPopup(), setwsID(w_id) }} xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.66634 1.83203C5.44533 1.83203 5.23337 1.91983 5.07709 2.07611C4.9208 2.23239 4.83301 2.44435 4.83301 2.66536V3.4987H9.16634V2.66536C9.16634 2.44435 9.07854 2.23239 8.92226 2.07611C8.76598 1.91983 8.55402 1.83203 8.33301 1.83203H5.66634ZM10.1663 3.4987V2.66536C10.1663 2.17913 9.97319 1.71282 9.62937 1.369C9.28555 1.02519 8.81924 0.832031 8.33301 0.832031H5.66634C5.18011 0.832031 4.7138 1.02519 4.36998 1.369C4.02616 1.71282 3.83301 2.17913 3.83301 2.66536V3.4987H2.33301C2.32078 3.4987 2.30865 3.49914 2.29664 3.5H1C0.723858 3.5 0.5 3.72386 0.5 4C0.5 4.27614 0.723858 4.5 1 4.5H1.83301V13.332C1.83301 13.8183 2.02616 14.2846 2.36998 14.6284C2.7138 14.9722 3.18011 15.1654 3.66634 15.1654H10.333C10.8192 15.1654 11.2856 14.9722 11.6294 14.6284C11.9732 14.2846 12.1663 13.8183 12.1663 13.332V4.5H13C13.2761 4.5 13.5 4.27614 13.5 4C13.5 3.72386 13.2761 3.5 13 3.5H11.7027C11.6907 3.49914 11.6786 3.4987 11.6663 3.4987H10.1663ZM2.83301 13.332V4.5H11.1663V13.332C11.1663 13.553 11.0785 13.765 10.9223 13.9213C10.766 14.0776 10.554 14.1654 10.333 14.1654H3.66634C3.44533 14.1654 3.23337 14.0776 3.07709 13.9213C2.9208 13.765 2.83301 13.553 2.83301 13.332ZM7.5 7.33203C7.5 7.05589 7.27614 6.83203 7 6.83203C6.72386 6.83203 6.5 7.05589 6.5 7.33203V11.332C6.5 11.6082 6.72386 11.832 7 11.832C7.27614 11.832 7.5 11.6082 7.5 11.332V7.33203Z" fill="#1E1E1E" />
                            </svg>
                        </span>
                    </Fragment>
                }
                <div className='wkit-widget-card'>
                    <div className='wkit-widget-card-top-part'>
                        <div className="wkit-widget-upper-icons">
                            <div className="wkit-widget-public-icon">
                                {data.status == 'public' &&
                                    <Fragment>
                                        <img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/public.svg"} alt="public" />
                                        <span className="wkit-widget-icon-tooltip">Public</span>
                                    </Fragment>
                                }
                                {data.status == 'private' &&
                                    <Fragment>
                                        <img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/private.svg"} alt="private" />
                                        <span className="wkit-widget-icon-tooltip">Private</span>
                                    </Fragment>
                                }
                            </div>
                        </div>
                        <div className='wkit-widget-image-content'>
                            <a href={`${wdkitData.wdkit_server_url}widget/${data.title}/${data.id}`} target="_blank" rel="noopener noreferrer">
                                <picture>
                                    {data?.responsive_image?.length > 0 && data?.responsive_image?.map((image_data, key) => {
                                        return (
                                            <Fragment key={key}>
                                                <source media={`(min-width: ${image_data.size}px)`} srcSet={SetImageUrl(image_data.url)} />
                                            </Fragment>
                                        );
                                    })}
                                    <img className="wkit-widget-image-content" src={data.image} alt={"featured-img"} />
                                </picture>
                            </a>
                        </div>
                    </div>
                    {data?.free_pro == 'pro' &&
                        <div className="wdkit-card-tag">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
                            <span>Pro</span>
                        </div>
                    }
                    <div className='wkit-widget-card-bottom-part'>
                        <div className='wkit-widget-title-content'>
                            <a className='wkit-widget-title-heading' href={`${wdkitData.wdkit_server_url}widget/${data.title}/${data.id}`} target="_blank" rel="noopener noreferrer">
                                <span>{data.title}</span>
                            </a>
                            <div className='wkit-widget-activity-icons'>
                                <div className='wkit-widget-download-activity'>
                                    {(downloading == true && Download_index == index) ?
                                        <div className='plugin-download-icon'>
                                            <div className="wb-download-loader" style={{ display: 'flex' }} >
                                                <div className="wb-download-loader-circle"></div>
                                            </div>
                                        </div>
                                        : downloading == false && existingwidget.includes(data.w_unique) ?
                                            <Link className='plugin-download-icon' to='/widget-listing'>
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.99983 1.43408C4.62811 1.43408 2.49897 2.8328 1.06393 5.08847C0.707861 5.64658 0.554688 6.34486 0.554688 6.99839C0.554688 7.65173 0.707773 8.3498 1.06362 8.90783C2.49866 11.1638 4.62794 12.5627 6.99983 12.5627C9.37156 12.5627 11.5007 11.164 12.9357 8.90831C13.2918 8.3502 13.445 7.65192 13.445 6.99839C13.445 6.34505 13.2919 5.64698 12.936 5.08895C11.501 2.833 9.37173 1.43408 6.99983 1.43408ZM2.30771 5.88033C3.54433 3.93629 5.25339 2.90854 6.99983 2.90854C8.74627 2.90854 10.4553 3.93629 11.692 5.88033L11.6926 5.8813C11.8613 6.14561 11.9705 6.54961 11.9705 6.99839C11.9705 7.44717 11.8613 7.85117 11.6926 8.11549L11.692 8.11645C10.4553 10.0605 8.74627 11.0882 6.99983 11.0882C5.25339 11.0882 3.54433 10.0605 2.30771 8.11645L2.30709 8.11549C2.13838 7.85117 2.02914 7.44717 2.02914 6.99839C2.02914 6.54961 2.13838 6.14561 2.30709 5.8813L2.30771 5.88033ZM5.64926 6.9989C5.64926 6.25106 6.25252 5.64779 7.00036 5.64779C7.74821 5.64779 8.35147 6.25106 8.35147 6.9989C8.35147 7.74674 7.74821 8.35001 7.00036 8.35001C6.25252 8.35001 5.64926 7.74674 5.64926 6.9989ZM7.00036 4.17334C5.43821 4.17334 4.1748 5.43674 4.1748 6.9989C4.1748 8.56106 5.43821 9.82446 7.00036 9.82446C8.56252 9.82446 9.82592 8.56106 9.82592 6.9989C9.82592 5.43674 8.56252 4.17334 7.00036 4.17334Z" fill="#19191B" />
                                                </svg>
                                            </Link>
                                            :
                                            <div className='plugin-download-icon' onClick={(e) => { setdownloading(true), Download_widget(data, index) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 12" fill="none">
                                                    <path d="M6.79116 0.0356951C6.73488 0.0567989 6.64344 0.117764 6.58951 0.171695C6.40192 0.359281 6.41364 0.117764 6.41364 3.55762V6.61995L5.93999 6.1463C5.43351 5.64216 5.34441 5.57885 5.14979 5.57651C4.97862 5.57651 4.86372 5.62575 4.73241 5.75237C4.53779 5.9423 4.49558 6.16271 4.60814 6.40892C4.63627 6.47223 4.92 6.77236 5.50151 7.35154C6.26592 8.11126 6.37144 8.20739 6.50744 8.2707C6.8193 8.41608 7.16164 8.41843 7.48054 8.28008C7.60481 8.22381 7.71736 8.12298 8.48646 7.36091C9.11956 6.7325 9.36342 6.47457 9.39625 6.39954C9.45487 6.27292 9.45722 6.06657 9.40329 5.93995C9.31887 5.73361 9.08205 5.57651 8.86398 5.57651C8.65295 5.57885 8.57322 5.63513 8.06205 6.1463L7.58605 6.61995V3.55762C7.58605 0.117764 7.59778 0.359281 7.41019 0.171695C7.2484 0.00755787 7.01392 -0.0416832 6.79116 0.0356951Z" fill="#19191B" />
                                                    <path d="M1.37381 5.45235C1.22843 5.50394 1.08305 5.65635 1.03147 5.81111C0.996296 5.91897 0.991606 5.98463 1.00568 6.266C1.05726 7.38214 1.3996 8.42558 2.00926 9.33302C2.46181 10.0107 3.15118 10.6743 3.83353 11.0987C5.46083 12.1069 7.44924 12.2781 9.24302 11.5676C10.0074 11.2652 10.6827 10.8056 11.3018 10.1701C12.3405 9.10323 12.9267 7.75027 12.9947 6.26131C13.0111 5.86738 12.9807 5.74311 12.8259 5.58835C12.5961 5.35856 12.235 5.35856 12.0052 5.58835C11.8763 5.71732 11.8364 5.84628 11.82 6.20973C11.8012 6.5849 11.7543 6.90145 11.6629 7.24145C11.2103 8.93909 9.84564 10.2756 8.14096 10.6883C5.57104 11.312 2.98001 9.75275 2.32112 7.18517C2.23905 6.86159 2.16871 6.35745 2.16871 6.07842C2.16871 5.86035 2.11477 5.71028 1.99284 5.58835C1.83105 5.42421 1.59657 5.37497 1.37381 5.45235Z" fill="#19191B" />
                                                </svg>
                                            </div>
                                    }
                                </div>
                                {(wsData.roles == 'admin' || wsData.roles == 'editor') &&
                                    <div className='wkit-widget-options'>
                                        <div className='wkit-widget-options-icon' onClick={() => { setOpenDropdown(index), setopenOuter(true) }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="4" viewBox="0 0 16 4" fill="none">
                                                <path d="M11.7139 2.0007C11.7139 3.02213 12.5497 3.85784 13.5711 3.85784C14.5925 3.85784 15.4282 3.02213 15.4282 2.0007C15.4282 0.979269 14.5925 0.143555 13.5711 0.143555C12.5497 0.143555 11.7139 0.979269 11.7139 2.0007ZM9.85679 2.0007C9.85679 0.979269 9.02108 0.143554 7.99965 0.143554C6.97822 0.143554 6.14251 0.979269 6.14251 2.0007C6.14251 3.02213 6.97822 3.85784 7.99965 3.85784C9.02108 3.85784 9.85679 3.02213 9.85679 2.0007ZM4.28537 2.0007C4.28537 0.979268 3.44965 0.143554 2.42822 0.143554C1.40679 0.143554 0.57108 0.979268 0.57108 2.0007C0.57108 3.02213 1.40679 3.85784 2.42822 3.85784C3.44965 3.85784 4.28537 3.02213 4.28537 2.0007Z" fill="#19191B" />
                                            </svg>
                                        </div>
                                        {OpenDropdown == index &&
                                            <div className='wkit-widget-options-content'>
                                                {props.wdkit_meta?.userinfo?.id == data?.user_id &&
                                                    <a href={`${wdkitData.wdkit_server_url}admin/widgets/edit/${data.id}`} target='_blank' rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                        <div className='wkit-widget-option-item' onClick={() => { setopenOuter(false), setOpenDropdown(-1) }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                                <path d="M7.7875 4.6375L8.3625 5.2125L2.7 10.875H2.125V10.3L7.7875 4.6375ZM10.0375 0.875C9.88125 0.875 9.71875 0.9375 9.6 1.05625L8.45625 2.2L10.8 4.54375L11.9437 3.4C12.1875 3.15625 12.1875 2.7625 11.9437 2.51875L10.4813 1.05625C10.3563 0.93125 10.2 0.875 10.0375 0.875ZM7.7875 2.86875L0.875 9.78125V12.125H3.21875L10.1312 5.2125L7.7875 2.86875Z" fill="#19191B" />
                                                            </svg>
                                                            <span>Edit</span>
                                                        </div>
                                                    </a>
                                                }
                                                <div className='wkit-widget-option-item' onClick={() => {
                                                    setopenOuter(false);
                                                    setOpenDropdown(-1);
                                                    setOpenPopup('copy');
                                                    setPopup_ws_data(data);
                                                    SelectWorkList(data);
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none">
                                                        <path d="M8.375 0.625H1.5C0.8125 0.625 0.25 1.1875 0.25 1.875V10C0.25 10.3438 0.53125 10.625 0.875 10.625C1.21875 10.625 1.5 10.3438 1.5 10V2.5C1.5 2.15625 1.78125 1.875 2.125 1.875H8.375C8.71875 1.875 9 1.59375 9 1.25C9 0.90625 8.71875 0.625 8.375 0.625ZM10.875 3.125H4C3.3125 3.125 2.75 3.6875 2.75 4.375V13.125C2.75 13.8125 3.3125 14.375 4 14.375H10.875C11.5625 14.375 12.125 13.8125 12.125 13.125V4.375C12.125 3.6875 11.5625 3.125 10.875 3.125ZM10.25 13.125H4.625C4.28125 13.125 4 12.8438 4 12.5V5C4 4.65625 4.28125 4.375 4.625 4.375H10.25C10.5938 4.375 10.875 4.65625 10.875 5V12.5C10.875 12.8438 10.5938 13.125 10.25 13.125Z" fill="#19191B" />
                                                    </svg>
                                                    <span>Copy to Workspace</span>
                                                </div>
                                                <div className='wkit-widget-option-item' onClick={() => {
                                                    setopenOuter(false);
                                                    setOpenDropdown(-1);
                                                    setOpenPopup('move');
                                                    setPopup_ws_data(data);
                                                    SelectWorkList(data);
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                                        <path d="M11.8375 2.26875L10.9688 1.21875C10.8 1.00625 10.5437 0.875 10.25 0.875H2.75C2.45625 0.875 2.2 1.00625 2.025 1.21875L1.1625 2.26875C0.98125 2.48125 0.875 2.7625 0.875 3.0625V10.875C0.875 11.5625 1.4375 12.125 2.125 12.125H10.875C11.5625 12.125 12.125 11.5625 12.125 10.875V3.0625C12.125 2.7625 12.0188 2.48125 11.8375 2.26875ZM2.9 2.125H10.1L10.6187 2.75H2.3875L2.9 2.125ZM2.125 10.875V4H10.875V10.875H2.125ZM4 7.75H5.59375V9.625H7.40625V7.75H9L6.5 5.25L4 7.75Z" fill="#19191B" />
                                                    </svg>
                                                    <span>Move from Workspace</span>
                                                </div>
                                                <div className='wkit-widget-option-item' onClick={() => { setopenOuter(false), setOpenDropdown(-1), On_OpenPopup(), setwidgetId(data) }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 9 13" fill="none">
                                                        <path d="M7 4.625V10.875H2V4.625H7ZM6.0625 0.875H2.9375L2.3125 1.5H0.125V2.75H8.875V1.5H6.6875L6.0625 0.875ZM8.25 3.375H0.75V10.875C0.75 11.5625 1.3125 12.125 2 12.125H7C7.6875 12.125 8.25 11.5625 8.25 10.875V3.375Z" fill="#19191B" />
                                                    </svg>
                                                    <span>Remove</span>
                                                </div>
                                            </div>
                                        }
                                        {DeletePopup()}
                                    </div>
                                }
                            </div>
                        </div>
                        <CardRatings
                            avg_rating={data?.avg_rating}
                            total_rating={data?.total_rating}
                        />
                        <div className="wkit-widget-info-content">
                            <div className="wkit-widget-info-icons-content">
                                <div className="wkit-widget-info-icons">
                                    <img src={img_path + "/assets/images/wb-svg/view-icon.svg"} alt="wb-view-icon" />
                                    <label>{data?.views ? data?.views : 0}</label>
                                </div>
                                <hr className="wkit-icon-divider-hr" />
                                <div className="wkit-widget-info-icons">
                                    <img src={img_path + "/assets/images/wb-svg/download-icon.svg"} alt="wb-view-icon" />
                                    <label>{data?.download ? data?.download : 0}</label>
                                </div>
                            </div>
                            <div className="wkit-widget-builder-icon">
                                <img src={widget_builder(data)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /** get valid workspace list for widget to copy */
    const SelectWorkList = async (widget_data) => {
        let workspace_list = [...props.wdkit_meta?.workspace];
        let select_workspace = [];

        await workspace_list?.length > 0 && workspace_list.map((data) => {
            if (data.roles === 'admin' || data.roles === "editor") {
                if (!data?.work_widgets.includes(widget_data.id)) {
                    select_workspace.push(data);
                }
            }
        })

        setWorkList(select_workspace);
    }

    /** copy and move workspace popup */
    const Manage_popup = () => {

        return (
            <Fragment>
                <div className='wkit-ws-popup-outerDiv' onClick={() => { setPopup_ws_data("") }}></div>
                <div className='wkit-ws-popup'>
                    <div className="wkit-plugin-popup-close" onClick={() => { setPopup_ws_data(""); setSuccessImport(false), setDownloadTempId(""); }}>
                        <span>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="#19191B"></path>
                            </svg>
                        </span>
                    </div>
                    <div className="wkit-copy-move-ws-wrap">
                        <div className="wkit-ws-label-heading">
                            <span>{__('Copy to Workspace')}</span>
                        </div>
                        <div className="wkit-ws-content dropdown-custom-width">
                            <select className="wkit-select-workspace" onChange={(e) => { setselectedWs(e.target.value) }}>
                                <option value={''}>{__('Select Workspace')}</option>
                                {WorkList.length > 0 &&
                                    WorkList.map((item, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <option value={item.w_id}>{item.work_title}</option>
                                            </Fragment>
                                        );
                                    })
                                }
                            </select>
                            <div className='wkit-copy-wrap'>
                                {OpenPopup == 'loading' ?
                                    <button className='btn-workspace-add'>{WkitLoader()}</button>
                                    :
                                    <button
                                        type="button"
                                        className='btn-workspace-add'
                                        onClick={() => { if (selectedWs) { manage_to_workspace(OpenPopup) } }}>{OpenPopup}
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

    /** bilder filter for widget and template */
    const Builder_filter = () => {
        return (
            <div className='wkit-single-workspace-filter wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                <div className='wkit-custom-dropDown-header'>
                    <label>{builder_name(builder_filter)}</label>
                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                </div>
                <div className='wkit-custom-dropDown-content'>
                    <div className='wkit-drop-down-outer'></div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('all') }}>
                        <label>{__('All')}</label>
                    </div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('elementor') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                            <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="white" />
                            <path d="M26.6 0H1.4C0.64003 0 0 0.63998 0 1.4V26.6C0 27.36 0.639983 28 1.4 28H26.6C27.3601 28 28 27.36 28 26.6V1.4C28 0.63998 27.3601 0 26.6 0ZM10.28 20.2H7.80001V7.79999H10.28V20.2ZM20.24 20.2H12.76V17.72H20.24V20.2ZM20.24 15.24H12.76V12.76H20.24V15.24ZM20.24 10.28H12.76V7.79999H20.24V10.28Z" fill="#92003B" />
                        </svg>
                        <label>{__('Elementor')}</label>
                    </div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('gutenberg') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                            <path d="M26.6 0H1.4C0.640029 0 0 0.63998 0 1.4V26.6C0 27.3599 0.639982 28 1.4 28H26.6C27.3601 28 28 27.36 28 26.6V1.4C28 0.63998 27.3601 0 26.6 0Z" fill="#287CB2" />
                            <path d="M10.8107 8.42658C8.67739 9.35411 7.86035 11.3416 8.01922 15.1621C8.11 17.1055 8.22348 17.8122 8.6093 18.5189C9.58523 20.374 11.1965 21.169 13.5569 20.9702C15.2363 20.8598 16.4392 20.2194 16.9839 19.2035C17.2108 18.7839 17.3924 17.7681 17.4605 16.6859C17.5512 14.9413 17.5739 14.8751 18.164 14.7426C19.0037 14.5659 20.4563 13.3734 20.4563 12.8433C20.4563 12.225 19.8435 12.3133 18.9584 13.0642C18.4591 13.4838 17.7782 13.7929 16.8931 13.9696C14.3739 14.4555 13.92 14.6321 13.2164 15.4051C12.4448 16.2663 12.3313 16.7743 12.876 16.9951C13.103 17.0835 13.4434 16.8626 13.8973 16.3326C14.5328 15.6038 15.7356 14.9634 16.008 15.2284C16.076 15.3167 16.1441 15.8909 16.1441 16.5534C16.1441 18.8943 15.1682 19.9323 13.0122 19.9323C11.6958 19.9323 10.6065 19.3139 9.92563 18.1656C9.51713 17.503 9.44903 17.0172 9.44903 14.6321C9.44903 11.4741 9.78943 10.4804 11.1285 9.61912C12.7625 8.55909 15.3044 9.15535 15.8945 10.7675C16.3938 12.0483 16.8477 12.3133 17.2789 11.5183C17.4832 11.165 17.4378 10.8779 17.0519 10.105C16.1441 8.24991 13.0576 7.43281 10.8107 8.42658Z" fill="white" />
                        </svg>
                        <label>{__('Gutenberg')}</label>
                    </div>
                </div>
            </div>
        );
    }

    /** filter drop-down for widget and template */
    const Type_dorpDown = () => {
        if (props?.wdkit_meta?.Setting?.builder == false) {
            return false;
        }
        return (
            <div className='wkit-single-workspace-filter wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                <div className='wkit-custom-dropDown-header'>
                    <label>{Temp_filter}</label>
                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                </div>
                <div className='wkit-custom-dropDown-content'>
                    <div className='wkit-drop-down-outer'></div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { setTemp_filter('templates'), setbuilder_filter('all') }}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.75 1.25H1.25V3.75H13.75V1.25ZM0 3.75V5V13.75C0 14.4404 0.559644 15 1.25 15H13.75C14.4404 15 15 14.4404 15 13.75V5V3.75V1.25C15 0.559644 14.4404 0 13.75 0H1.25C0.559644 0 0 0.559644 0 1.25V3.75ZM1.25 13.75H13.75V5H1.25L1.25 13.75ZM2.5 7.1875C2.5 7.01491 2.63991 6.875 2.8125 6.875H12.1875C12.3601 6.875 12.5 7.01491 12.5 7.1875V7.8125C12.5 7.98509 12.3601 8.125 12.1875 8.125H2.8125C2.63991 8.125 2.5 7.98509 2.5 7.8125V7.1875ZM3.125 9.375C2.77982 9.375 2.5 9.65482 2.5 10V11.25C2.5 11.5952 2.77982 11.875 3.125 11.875H4.375C4.72018 11.875 5 11.5952 5 11.25V10C5 9.65482 4.72018 9.375 4.375 9.375H3.125ZM6.25 10C6.25 9.65482 6.52982 9.375 6.875 9.375H8.125C8.47018 9.375 8.75 9.65482 8.75 10V11.25C8.75 11.5952 8.47018 11.875 8.125 11.875H6.875C6.52982 11.875 6.25 11.5952 6.25 11.25V10ZM10.625 9.375C10.2798 9.375 10 9.65482 10 10V11.25C10 11.5952 10.2798 11.875 10.625 11.875H11.875C12.2202 11.875 12.5 11.5952 12.5 11.25V10C12.5 9.65482 12.2202 9.375 11.875 9.375H10.625ZM3.125 3.125C3.47018 3.125 3.75 2.84518 3.75 2.5C3.75 2.15482 3.47018 1.875 3.125 1.875C2.77982 1.875 2.5 2.15482 2.5 2.5C2.5 2.84518 2.77982 3.125 3.125 3.125ZM6.25 2.5C6.25 2.84518 5.97018 3.125 5.625 3.125C5.27982 3.125 5 2.84518 5 2.5C5 2.15482 5.27982 1.875 5.625 1.875C5.97018 1.875 6.25 2.15482 6.25 2.5ZM8.125 3.125C8.47018 3.125 8.75 2.84518 8.75 2.5C8.75 2.15482 8.47018 1.875 8.125 1.875C7.77982 1.875 7.5 2.15482 7.5 2.5C7.5 2.84518 7.77982 3.125 8.125 3.125Z" />
                        </svg>
                        <span>{__('Templates')}</span>
                    </div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { setTemp_filter('widgets'), setbuilder_filter('all') }}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.78322 0.363656C7.21362 0.0623758 7.78647 0.0623748 8.21687 0.363655L13.4247 4.00912C14.108 4.48746 14.1401 5.48816 13.4887 6.00924L13.2297 6.21642L13.4247 6.35287C14.108 6.83121 14.1401 7.83191 13.4887 8.35299L13.2297 8.56017L13.4247 8.69662C14.108 9.17496 14.1401 10.1757 13.4887 10.6967L11.0155 12.6753L9.06178 14.2383C8.14874 14.9687 6.85135 14.9687 5.93831 14.2383L3.98461 12.6753L1.51138 10.6967C0.860028 10.1757 0.892067 9.17496 1.57542 8.69662L1.77034 8.56017L1.51138 8.35299C0.860028 7.83191 0.892067 6.83121 1.57542 6.35287L1.77034 6.21642L1.51138 6.00924C0.860029 5.48816 0.892066 4.48746 1.57542 4.00912L6.78322 0.363656ZM2.78756 9.37394L2.29224 9.72065L4.76548 11.6992L6.71918 13.2622C7.1757 13.6274 7.82439 13.6274 8.28091 13.2622L10.2346 11.6992L12.7078 9.72066L12.2125 9.37394L11.0155 10.3316L9.06178 11.8945C8.14874 12.625 6.85135 12.625 5.93831 11.8945L3.98461 10.3316L2.78756 9.37394ZM11.0155 7.98783L12.2125 7.03019L12.7078 7.37691L10.2346 9.35549L8.28091 10.9185C7.82439 11.2837 7.1757 11.2837 6.71918 10.9185L4.76548 9.35549L2.29224 7.37691L2.78756 7.03019L3.98461 7.98783L5.93831 9.55079C6.85135 10.2812 8.14874 10.2812 9.06178 9.55079L11.0155 7.98783ZM12.7078 5.03316L7.50004 1.3877L2.29224 5.03316L4.76548 7.01174L6.71918 8.5747C7.1757 8.93992 7.82439 8.93992 8.28091 8.5747L10.2346 7.01174L12.7078 5.03316Z" />
                        </svg>
                        <span>{__('Widgets')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {wsData ?
                <div className='wkit-workspace-sigle-page'>
                    <div className='wkit-kit-box-wrapper'>
                        <div className="wkit-work-space">
                            <div className="wkit-work-left-column">
                                <div>
                                    {wsData.work_icon ?
                                        <img src={wsData.work_icon} alt="workspace-profile" className={"wkit-workspace-profile-img"} />
                                        :
                                        <div className={'wkit-profile-back wkit-profile-letter'}>{profile_Letter}</div>
                                    }
                                </div>
                                <div className="wkit-workspace-title">
                                    <span>{inp_name}</span>
                                    {wsData.roles == 'admin' &&
                                        <div className='wkit-workspace-edit-icon' onClick={() => { WKit_input_text() }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                <path d="M9.71667 5.51667L10.4833 6.28333L2.93333 13.8333H2.16667V13.0667L9.71667 5.51667ZM12.7167 0.5C12.5083 0.5 12.2917 0.583333 12.1333 0.741667L10.6083 2.26667L13.7333 5.39167L15.2583 3.86667C15.5833 3.54167 15.5833 3.01667 15.2583 2.69167L13.3083 0.741667C13.1417 0.575 12.9333 0.5 12.7167 0.5ZM9.71667 3.15833L0.5 12.375V15.5H3.625L12.8417 6.28333L9.71667 3.15833Z" fill="#19191B" />
                                            </svg>
                                        </div>
                                    }
                                </div>
                                {wsData.roles != 'subscriber' &&
                                    <div className={"wkit-text-field wkit-hide"}>
                                        <input type="text" className="btn-input" value={inp_name} onChange={(e) => setinp_name(e.target.value)} />
                                        <button className={'wkit-title-update-btn'} onClick={() => { WKit_input_text(inp_name) }}>Update</button>
                                    </div>
                                }
                                <div className='wkit-tooltip-dropdown-content'>
                                    {Type_dorpDown()}
                                    {Builder_filter()}
                                </div>
                            </div>
                            <div className="wkit-work-right-column">
                                <div className="img-group">
                                    {wsData.share_user &&
                                        <>
                                            {
                                                Object.values(wsData.share_user).map((data, index) => {
                                                    if (index < 4) {
                                                        if (data.user_profile) {
                                                            return (
                                                                <Fragment key={index}>
                                                                    <img src={data.user_profile} alt="ws-member" className="wkit-roundimg" />
                                                                </Fragment>
                                                            )
                                                        }
                                                    }
                                                })
                                            }
                                        </>

                                    }
                                    {Object.values(wsData?.share_user).length > 4 &&
                                        <div className="wkit-more-user-proflie">+{Object.values(wsData?.share_user).length - 4}</div>
                                    }
                                </div>
                                <a href={`${wdkitData.wdkit_server_url}admin/workspace/workspacetemplate/${wsData?.w_id}`} target="_blank" rel="noopener noreferrer">
                                    <div className='wkit-manage-member'>
                                        <span>{__('Manage Members')}</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="wdesign-kit-main">
                        {loading == false && (userData?.template && wsData?.work_templates) && Temp_filter == "templates" &&
                            Object.values(userData.template).filter((data) => {
                                if (builder_filter == "all") {
                                    return data
                                }
                                if (data.post_builder == builder_filter) {
                                    return data
                                }
                            }).map((data, index) => {
                                listLength = (listLength == '') ? 0 : listLength
                                if (wsData?.work_templates.length > 0 && wsData?.work_templates?.includes(data.id)) {
                                    listLength++;
                                    return (
                                        <Template_loop
                                            key={index}
                                            userData={userData}
                                            data={data}
                                            role={wsData?.roles}
                                            userinfo={props?.wdkit_meta?.userinfo}
                                            builder={userData.builder}
                                            favorite={userData.favoritetemplate}
                                            setloading={(val) => { setloading(val) }}
                                            UpdateUserData={(val) => (props.wdkit_set_meta(val.data))}
                                            handlerTempID={(val) => {
                                                wdkitData.use_editor == 'wdkit' ?
                                                    wdkitBuilderType(val, data.wp_post_type, data.type, Number(data.post_builder), userData.builder) : setDownloadTempId(val)
                                            }}
                                            type={(data.type == 'websitekit') ? data.type + '-view' : data.type} wsRoles={wsData.roles}
                                            width={'25%'}
                                            wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                            wsID={params.id}
                                            currentPage={activePage}
                                        />
                                    );
                                }
                            })
                        }
                        {loading == false && userData?.widgettemplate && wsData?.work_widgets && Temp_filter == "widgets" &&
                            Listdata.slice(start_id, end_id).map((data, index) => {
                                listLength = (listLength == '') ? 0 : listLength
                                if (wsData.work_widgets.includes(data.id)) {
                                    listLength++;
                                    return Widget_card(data, index)
                                }
                            })
                        }
                        {Popup_ws_data && OpenPopup &&
                            Manage_popup()
                        }
                    </div>
                    {loading == false && listLength <= 0 &&
                        <div className={'wkit-no-template-data'}>
                            <Wkit_availble_not page={Temp_filter} />
                        </div>
                    }
                    {loading == true &&
                        <Wkit_template_Skeleton />
                    }
                    {downTempId &&
                        <div className={"wkit-myupload-main wkit-model-transp wkit-popup-show"} >
                            <div className={"wkit-plugin-model-content wkit-import-template"}>
                                <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e); setSuccessImport(false), setDownloadTempId(""); }}><span>&times;</span></a>
                                {!successImport ?
                                    <Plugin_missing
                                        template_id={downTempId}
                                        handlerSuccessImport={(val, customMeta) => { setSuccessImport(val), setCustomMetaImport(customMeta) }}
                                        type={wdkitData.use_editor}
                                        templateData={userData.template}
                                        pluginData={userData.plugin}
                                    />
                                    :
                                    <Success_import_template
                                        template_id={downTempId}
                                        custom_meta_import={customMetaImport}
                                        handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId('') }}
                                        wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                    />
                                }
                            </div>
                        </div>
                    }
                    {openOuter &&
                        <div className='wkit-widget-options-outer' onClick={() => { setopenOuter(false), setOpenDropdown(-1) }}></div>
                    }
                </div>
                :
                <WS_single_skeleton />
            }
            <div className='wkit-wb-paginatelist'>
                {Math.ceil(Listdata.length / perPage) > 1 &&
                    <div className='wkit-pagination-main'>
                        <ReactPaginate
                            breakLabel={"..."}
                            nextLabel={">"}
                            pageRangeDisplayed={2}
                            pageCount={Math.ceil(Listdata.length / perPage)}
                            marginPagesDisplayed={1}
                            previousLabel={"<"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"wkit-pagination-item"}
                            previousClassName={"page-item kit-next-prev"}
                            previousLinkClassName={"wkit-pagination-item"}
                            nextClassName={"page-item kit-next-prev"}
                            nextLinkClassName={"wkit-pagination-item"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            containerClassName={"wkit-pagination"}
                            activeClassName={"active"}
                            onClick={(clickEvent) => {
                                window.scrollTo(0, 0);
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
    )
}
export default Workspace_single;