import { wdKit_Form_data, get_user_login, Wkit_template_Skeleton, Get_user_info_data, Wkit_availble_not, WkitLoader, CardRatings } from '../../helper/helper-function';
import { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from "react-router-dom";
import WS_single_skeleton from './single_workspace_header';
import Elementor_file_create from "../../widget-builder/file-creation/elementor_file";
import CreatFile from "../../widget-builder/file-creation/gutenberg_file";
import Bricks_file_create from '../../widget-builder/file-creation/bricks_file';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element;

const {
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
    const [BuilderArray, setBuilderArray] = useState([]);
    const [TemplateArray, setTemplateArray] = useState([]);

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
                props.wdkit_set_toast([__('Workspace Deactivated', 'wdesignkit'), __('This Workspace is Deactivated', 'wdesignkit'), '', 'danger']);

            }
        }

    }, [props.wdkit_meta]);

    /** Get setting panel data from redux */
    useEffect(() => {

        let builders = [];
        if (props?.wdkit_meta?.Setting?.elementor_builder) {
            builders.push('Elementor');
        }
        if (props?.wdkit_meta?.Setting?.gutenberg_builder) {
            builders.push('Gutenberg');
        }
        if (props?.wdkit_meta?.Setting?.bricks_builder) {
            builders.push('Bricks');
        }
        setBuilderArray(builders)


        let templates = [];
        if (props?.wdkit_meta?.Setting?.elementor_template) {
            templates.push('Elementor');
        }
        if (props?.wdkit_meta?.Setting?.gutenberg_template) {
            templates.push('Gutenberg');
        }
        setTemplateArray(templates)

    }, [props?.wdkit_meta?.Setting])

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

    /**
     * For handle workspace name
     *
     * @since 1.0.0
     * @version 1.0.6
     */
    const WKit_input_text = async (title_val) => {
        if (document.querySelector('.wkit-text-field.wkit-hide')) {
            document.querySelector('.wkit-text-field.wkit-hide').classList.remove("wkit-hide")
        } else {
            let oldTitle = wsData.work_title || inp_name;
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
                });
                props.wdkit_set_toast([result?.data?.message, result?.data?.description, '', 'success'])
                Update_List()
            } else {
                wsData.work_title = oldTitle;
                setwsData({ ...wsData });
                props.wdkit_set_toast([result?.data?.message, result?.data?.description, '', 'danger'])
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

    /** get builder icon tooltip of widget */
    const widget_builder_tooltip = (data) => {
        let index = props.wdkit_meta.widgetbuilder.findIndex((id) => id.w_id == data.builder);
        if (index > -1 && props.wdkit_meta?.widgetbuilder[index]?.builder_name) {
            return props.wdkit_meta.widgetbuilder[index].builder_name;
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
                    <span>
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                    </span>
                </a>
                <div className="popup-missing">
                    <div className="popup-header">{__('Please Confirm', 'wdesignkit')}</div>
                    <div className="popup-body">
                        <div className="wkit-popup-content-title">
                            {__('Are you sure want to permanently delete', 'wdesignkit')}
                        </div>
                        <div className="wkit-popup-buttons">
                            <button className="wkit-popup-confirm wkit-outer-btn-class" onClick={() => Popup_Close()}>
                                No
                            </button>
                            <button className="wkit-popup-cancel wkit-btn-class" onClick={() => Remove_widget(widgetId)}>
                                {loading == true ?
                                    <WkitLoader />
                                    :
                                    <span>{__('Yes', 'wdesignkit')}</span>
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

            var response = ''
            if (builder == "elementor") {
                response = await Elementor_file_create('private_download', data, html, css, js, "", image).then((res) => { return res })
            } else if (builder == "gutenberg") {
                response = await CreatFile('private_download', data, html, css, js, "", image).then((res) => { return res })
            } else if (builder == "bricks") {
                response = await Bricks_file_create('private_download', data, html, css, js, "", image).then((res) => { return res })
            }

            if (response?.api?.success == true) {
                let old = [...existingwidget]
                old.push(w_data.w_unique)
                setexistingwidget(old)
                props.wdkit_set_toast([__('Downloaded Successfully!', 'wdesignkit'), __('Start using or editing it further.', 'wdesignkit'), '', 'success'])
            }

            let new_data = await Get_user_info_data();
            if (new_data?.success) {
                props.wdkit_set_meta(new_data?.data);
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
            if (result.success) {
                Create_widget(result)
            } else {
                props.wdkit_set_toast([result.message, result.description, '', 'danger'])
                setDownload_index(-1);
            }
        })
    }

    const User_profile = (data) => {
        if (data?.user_id && wsData?.share_user?.[data.user_id]?.user_profile) {
            return wsData.share_user[data.user_id].user_profile
        } else {
            return
        }
    }

    const User_name = (data) => {
        if (data?.user_id && wsData?.share_user?.[data.user_id]?.full_name) {
            return wsData.share_user[data.user_id].full_name
        } else {
            return
        }
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

        const RemoveExtraSpace = (title) => {
            var FinalTitle = title.replace(/\s+/g, '-');
            FinalTitle = FinalTitle.replace(/[^\w-]+/g, '');
            FinalTitle = FinalTitle.toLowerCase();

            return FinalTitle;
        }

        return (
            <div className="wkit-widgetlist-grid-content" key={index}>
                {data.is_activated != 'active' &&
                    <Fragment>
                        <div className='wdkit-inner-boxed-deActivate'>
                            <div className='wdkit-inner-boxed-deActivate-h1'>{__('Credit Limit Reached!', 'wdesignkit')}</div>
                            <div className='wdkit-inner-boxed-deActivate-p'>{__('This Template got disabled until you have more credits to make it active.', 'wdesignkit')}</div>
                            <a href={`${wdkitData.wdkit_server_url}pricing`} target="_blank" rel="noopener noreferrer">
                                <button>{__('Buy Credits', 'wdesignkit')}</button>
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
                                        <img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/public.svg"} alt="public" draggable={false} />
                                        <span className="wkit-widget-icon-tooltip">{__('Public', 'wdesignkit')}</span>
                                    </Fragment>
                                }
                                {data.status == 'private' &&
                                    <Fragment>
                                        <img className="wkit-pin-img-temp" src={img_path + "/assets/images/svg/private.svg"} alt="private" draggable={false} />
                                        <span className="wkit-widget-icon-tooltip">{__('Private', 'wdesignkit')}</span>
                                    </Fragment>
                                }
                            </div>
                        </div>
                        <div>
                            <img className="wkit-widget-placeholder-img" src={img_path + 'assets/images/wkit-dummy-bg.png'} draggable={false} />
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
                        </div>
                    </div>
                    {data?.free_pro == 'pro' &&
                        <div className="wdkit-card-tag">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 16.5H5.25C4.9425 16.5 4.6875 16.245 4.6875 15.9375C4.6875 15.63 4.9425 15.375 5.25 15.375H12.75C13.0575 15.375 13.3125 15.63 13.3125 15.9375C13.3125 16.245 13.0575 16.5 12.75 16.5Z" fill="white" /><path d="M15.2622 4.14003L12.2622 6.28503C11.8647 6.57003 11.2947 6.39753 11.1222 5.94003L9.70468 2.16003C9.46468 1.50753 8.54218 1.50753 8.30218 2.16003L6.87718 5.93253C6.70468 6.39753 6.14218 6.57003 5.74468 6.27753L2.74468 4.13253C2.14468 3.71253 1.34968 4.30503 1.59718 5.00253L4.71718 13.74C4.82218 14.04 5.10718 14.235 5.42218 14.235H12.5697C12.8847 14.235 13.1697 14.0325 13.2747 13.74L16.3947 5.00253C16.6497 4.30503 15.8547 3.71253 15.2622 4.14003ZM10.8747 11.0625H7.12468C6.81718 11.0625 6.56218 10.8075 6.56218 10.5C6.56218 10.1925 6.81718 9.93753 7.12468 9.93753H10.8747C11.1822 9.93753 11.4372 10.1925 11.4372 10.5C11.4372 10.8075 11.1822 11.0625 10.8747 11.0625Z" fill="white" /></svg>
                            <span>{__('Pro', 'wdesignkit')}</span>
                        </div>
                    }
                    <div className='wkit-widget-card-bottom-part'>
                        <div className='wkit-widget-title-content'>
                            {data.status == 'public' ?
                                <a className='wkit-widget-title-heading' href={`${wdkitData.wdkit_server_url}widget/${RemoveExtraSpace(data.title)}/${data.id}`} target="_blank" rel="noopener noreferrer">
                                    <span>{data.title}</span>
                                </a>
                                :
                                <span className='wkit-widget-title-heading'>
                                    <span>{data.title}</span>
                                </span>
                            }
                            <div className='wkit-widget-activity-icons'>
                                <div className='wkit-rounding-user'>
                                    <img className="wkit-rounding-user-profile" src={User_profile(data)} alt="ws-member" />
                                    <span className="wkit-rounding-user-tooltip">{User_name(data)}</span>
                                </div>
                                <div className='wkit-widget-download-activity'>
                                    {(downloading == true && Download_index == index) ?
                                        <div className='plugin-download-icon'>
                                            <div className="wb-download-loader" style={{ display: 'flex' }} >
                                                <div className="wb-download-loader-circle"></div>
                                            </div>
                                        </div>
                                        : existingwidget.includes(data.w_unique) ?
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
                                                            <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.9531 2.66989C12.1378 2.48521 12.357 2.33873 12.5983 2.23878C12.8396 2.13884 13.0983 2.0874 13.3594 2.0874C13.6205 2.0874 13.8791 2.13884 14.1204 2.23878C14.3618 2.33873 14.5809 2.48521 14.7656 2.66989C14.9503 2.85456 15.0968 3.0738 15.1967 3.31508C15.2966 3.55637 15.3482 3.81497 15.3482 4.07614C15.3482 4.3373 15.2966 4.59592 15.1967 4.83719C15.0968 5.07848 14.9503 5.29771 14.7656 5.48239L5.27344 14.9745L1.40625 16.0292L2.46094 12.162L11.9531 2.66989Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                            <span>{__('Edit', 'wdesignkit')}</span>
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
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_6220_28330)"><path d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="clip0_6220_28330"><rect width="18" height="18" fill="white" /></clipPath></defs></svg>
                                                    <span>{__('Copy to Workspace', 'wdesignkit')}</span>
                                                </div>
                                                <div className='wkit-widget-option-item' onClick={() => {
                                                    setopenOuter(false);
                                                    setOpenDropdown(-1);
                                                    setOpenPopup('move');
                                                    setPopup_ws_data(data);
                                                    SelectWorkList(data);
                                                }}>
                                                    <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.625 6.75L2.375 9M2.375 9L4.625 11.25M2.375 9H17.3746M7.62482 3.75L9.87482 1.5M9.87482 1.5L12.1248 3.75M9.87482 1.5V16.5M12.1248 14.25L9.87482 16.5M9.87482 16.5L7.62482 14.25M15.1246 6.75L17.3746 9M17.3746 9L15.1246 11.25" stroke="#737373" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    <span>{__('Move from Workspace', 'wdesignkit')}</span>
                                                </div>
                                                <div className='wkit-widget-option-item' onClick={() => { setopenOuter(false), setOpenDropdown(-1), On_OpenPopup(), setwidgetId(data) }}>
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 5.50006H4.91667M4.91667 5.50006H14.25M4.91667 5.50006L4.91638 13.666C4.91638 13.9754 5.0393 14.2722 5.25809 14.491C5.47688 14.7098 5.77363 14.8327 6.08305 14.8327H11.9164C12.2258 14.8327 12.5225 14.7098 12.7413 14.491C12.9601 14.2722 13.083 13.9754 13.083 13.666V5.49935M6.66638 5.49935V4.33268C6.66638 4.02326 6.7893 3.72652 7.00809 3.50772C7.22688 3.28893 7.52363 3.16602 7.83305 3.16602H10.1664C10.4758 3.16602 10.7725 3.28893 10.9913 3.50772C11.2101 3.72652 11.333 4.02326 11.333 4.33268V5.49935" stroke="#737373" strokeWidth="1.3125" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                                    <span>{__('Remove', 'wdesignkit')}</span>
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
                                    <img src={img_path + "/assets/images/svg/eye.svg"} alt="wb-view-icon" />
                                    <label>{data?.views ? data?.views : 0}</label>
                                </div>
                                <hr className="wkit-icon-divider-hr" />
                                <div className="wkit-widget-info-icons">
                                    <img src={img_path + "/assets/images/svg/download-template.svg"} alt="wb-view-icon" />
                                    <label>{data?.download ? data?.download : 0}</label>
                                </div>
                            </div>
                            <div className="wkit-widget-builder-icon">
                                <img src={widget_builder(data)} />
                                <span className="wkit-widget-builder-tooltip">{!widget_builder_tooltip(data) ? __('') : __(widget_builder_tooltip(data))}</span>
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
                        <div className="wkit-ws-label-heading">{__('Copy to Workspace', 'wdesignkit')}</div>
                        <div className="wkit-ws-content dropdown-custom-width">
                            <select className="wkit-select-workspace" onChange={(e) => { setselectedWs(e.target.value) }}>
                                <option value={''}>{__('Select Workspace', 'wdesignkit')}</option>
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
                                    <button className='btn-workspace-add wkit-pink-btn-class'>{WkitLoader()}</button>
                                    :
                                    <button
                                        type="button"
                                        className='btn-workspace-add wkit-pink-btn-class'
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
        if (Temp_filter == 'widgets' && BuilderArray.length > 1) {
            return (
                <div className='wkit-single-workspace-filter wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                    <div className='wkit-custom-dropDown-header'>
                        <span>{builder_name(builder_filter)}</span>
                        <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                    </div>

                    <div className='wkit-custom-dropDown-content'>
                        <div className='wkit-drop-down-outer'></div>
                        <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('all') }}>
                            <label>{__('All', 'wdesignkit')}</label>
                        </div>
                        {
                            props?.wdkit_meta?.Setting?.elementor_builder &&
                            <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('elementor') }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                                    <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="white" />
                                    <path d="M26.6 0H1.4C0.64003 0 0 0.63998 0 1.4V26.6C0 27.36 0.639983 28 1.4 28H26.6C27.3601 28 28 27.36 28 26.6V1.4C28 0.63998 27.3601 0 26.6 0ZM10.28 20.2H7.80001V7.79999H10.28V20.2ZM20.24 20.2H12.76V17.72H20.24V20.2ZM20.24 15.24H12.76V12.76H20.24V15.24ZM20.24 10.28H12.76V7.79999H20.24V10.28Z" fill="#92003B" />
                                </svg>
                                <label>{__('Elementor', 'wdesignkit')}</label>
                            </div>
                        }
                        {
                            props?.wdkit_meta?.Setting?.gutenberg_builder &&
                            <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('gutenberg') }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                                    <path d="M26.6 0H1.4C0.640029 0 0 0.63998 0 1.4V26.6C0 27.3599 0.639982 28 1.4 28H26.6C27.3601 28 28 27.36 28 26.6V1.4C28 0.63998 27.3601 0 26.6 0Z" fill="#287CB2" />
                                    <path d="M10.8107 8.42658C8.67739 9.35411 7.86035 11.3416 8.01922 15.1621C8.11 17.1055 8.22348 17.8122 8.6093 18.5189C9.58523 20.374 11.1965 21.169 13.5569 20.9702C15.2363 20.8598 16.4392 20.2194 16.9839 19.2035C17.2108 18.7839 17.3924 17.7681 17.4605 16.6859C17.5512 14.9413 17.5739 14.8751 18.164 14.7426C19.0037 14.5659 20.4563 13.3734 20.4563 12.8433C20.4563 12.225 19.8435 12.3133 18.9584 13.0642C18.4591 13.4838 17.7782 13.7929 16.8931 13.9696C14.3739 14.4555 13.92 14.6321 13.2164 15.4051C12.4448 16.2663 12.3313 16.7743 12.876 16.9951C13.103 17.0835 13.4434 16.8626 13.8973 16.3326C14.5328 15.6038 15.7356 14.9634 16.008 15.2284C16.076 15.3167 16.1441 15.8909 16.1441 16.5534C16.1441 18.8943 15.1682 19.9323 13.0122 19.9323C11.6958 19.9323 10.6065 19.3139 9.92563 18.1656C9.51713 17.503 9.44903 17.0172 9.44903 14.6321C9.44903 11.4741 9.78943 10.4804 11.1285 9.61912C12.7625 8.55909 15.3044 9.15535 15.8945 10.7675C16.3938 12.0483 16.8477 12.3133 17.2789 11.5183C17.4832 11.165 17.4378 10.8779 17.0519 10.105C16.1441 8.24991 13.0576 7.43281 10.8107 8.42658Z" fill="white" />
                                </svg>
                                <label>{__('Gutenberg', 'wdesignkit')}</label>
                            </div>

                        }
                        {
                            props?.wdkit_meta?.Setting?.bricks_builder && Temp_filter == 'widgets' &&
                            <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('gutenberg') }}>
                                <img src={img_path + 'assets/images/wb-svg/bricks.svg'} />
                                <label>{__('Bricks', 'wdesignkit')}</label>
                            </div>

                        }

                    </div>

                </div>
            )
        }
        if (Temp_filter == 'templates' && TemplateArray.length > 1) {
            return (
                <div className='wkit-single-workspace-filter wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                    <div className='wkit-custom-dropDown-header'>
                        <span>{builder_name(builder_filter)}</span>
                        <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                    </div>

                    <div className='wkit-custom-dropDown-content'>
                        <div className='wkit-drop-down-outer'></div>
                        <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('all') }}>
                            <label>{__('All', 'wdesignkit')}</label>
                        </div>
                        {
                            props?.wdkit_meta?.Setting?.elementor_template &&
                            <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('elementor') }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                                    <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="white" />
                                    <path d="M26.6 0H1.4C0.64003 0 0 0.63998 0 1.4V26.6C0 27.36 0.639983 28 1.4 28H26.6C27.3601 28 28 27.36 28 26.6V1.4C28 0.63998 27.3601 0 26.6 0ZM10.28 20.2H7.80001V7.79999H10.28V20.2ZM20.24 20.2H12.76V17.72H20.24V20.2ZM20.24 15.24H12.76V12.76H20.24V15.24ZM20.24 10.28H12.76V7.79999H20.24V10.28Z" fill="#92003B" />
                                </svg>
                                <label>{__('Elementor', 'wdesignkit')}</label>
                            </div>
                        }
                        {
                            props?.wdkit_meta?.Setting?.gutenberg_template &&
                            <div className='wkit-custom-dropDown-options' onClick={() => { Change_builder('gutenberg') }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                                    <path d="M26.6 0H1.4C0.640029 0 0 0.63998 0 1.4V26.6C0 27.3599 0.639982 28 1.4 28H26.6C27.3601 28 28 27.36 28 26.6V1.4C28 0.63998 27.3601 0 26.6 0Z" fill="#287CB2" />
                                    <path d="M10.8107 8.42658C8.67739 9.35411 7.86035 11.3416 8.01922 15.1621C8.11 17.1055 8.22348 17.8122 8.6093 18.5189C9.58523 20.374 11.1965 21.169 13.5569 20.9702C15.2363 20.8598 16.4392 20.2194 16.9839 19.2035C17.2108 18.7839 17.3924 17.7681 17.4605 16.6859C17.5512 14.9413 17.5739 14.8751 18.164 14.7426C19.0037 14.5659 20.4563 13.3734 20.4563 12.8433C20.4563 12.225 19.8435 12.3133 18.9584 13.0642C18.4591 13.4838 17.7782 13.7929 16.8931 13.9696C14.3739 14.4555 13.92 14.6321 13.2164 15.4051C12.4448 16.2663 12.3313 16.7743 12.876 16.9951C13.103 17.0835 13.4434 16.8626 13.8973 16.3326C14.5328 15.6038 15.7356 14.9634 16.008 15.2284C16.076 15.3167 16.1441 15.8909 16.1441 16.5534C16.1441 18.8943 15.1682 19.9323 13.0122 19.9323C11.6958 19.9323 10.6065 19.3139 9.92563 18.1656C9.51713 17.503 9.44903 17.0172 9.44903 14.6321C9.44903 11.4741 9.78943 10.4804 11.1285 9.61912C12.7625 8.55909 15.3044 9.15535 15.8945 10.7675C16.3938 12.0483 16.8477 12.3133 17.2789 11.5183C17.4832 11.165 17.4378 10.8779 17.0519 10.105C16.1441 8.24991 13.0576 7.43281 10.8107 8.42658Z" fill="white" />
                                </svg>
                                <label>{__('Gutenberg', 'wdesignkit')}</label>
                            </div>

                        }

                    </div>

                </div>
            )
        }

    }



    /** filter drop-down for widget and template */
    const Type_dorpDown = () => {
        if (props?.wdkit_meta?.Setting?.builder == false) {
            return false;
        }
        return (
            <div className='wkit-single-workspace-filter wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }}>
                <div className='wkit-custom-dropDown-header'>

                    <span className='wdkit-single-workspace-dropdown'>
                        {Temp_filter == 'templates' ?
                            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M17.375 1.5H2.375L2.375 4.5H17.375V1.5ZM0.875 4.5V6V16.5C0.875 17.3284 1.54657 18 2.375 18H17.375C18.2034 18 18.875 17.3284 18.875 16.5V6V4.5V1.5C18.875 0.671573 18.2034 0 17.375 0H2.375C1.54657 0 0.875 0.671573 0.875 1.5V4.5ZM2.375 16.5H17.375V6H2.375L2.375 16.5ZM3.875 8.625C3.875 8.41789 4.04289 8.25 4.25 8.25H15.5C15.7071 8.25 15.875 8.41789 15.875 8.625V9.375C15.875 9.58211 15.7071 9.75 15.5 9.75H4.25C4.04289 9.75 3.875 9.58211 3.875 9.375V8.625ZM4.625 11.25C4.21079 11.25 3.875 11.5858 3.875 12V13.5C3.875 13.9142 4.21079 14.25 4.625 14.25H6.125C6.53921 14.25 6.875 13.9142 6.875 13.5V12C6.875 11.5858 6.53921 11.25 6.125 11.25H4.625ZM8.375 12C8.375 11.5858 8.71079 11.25 9.125 11.25H10.625C11.0392 11.25 11.375 11.5858 11.375 12V13.5C11.375 13.9142 11.0392 14.25 10.625 14.25H9.125C8.71079 14.25 8.375 13.9142 8.375 13.5V12ZM13.625 11.25C13.2108 11.25 12.875 11.5858 12.875 12V13.5C12.875 13.9142 13.2108 14.25 13.625 14.25H15.125C15.5392 14.25 15.875 13.9142 15.875 13.5V12C15.875 11.5858 15.5392 11.25 15.125 11.25H13.625ZM4.625 3.75C5.03921 3.75 5.375 3.41421 5.375 3C5.375 2.58579 5.03921 2.25 4.625 2.25C4.21079 2.25 3.875 2.58579 3.875 3C3.875 3.41421 4.21079 3.75 4.625 3.75ZM8.375 3C8.375 3.41421 8.03921 3.75 7.625 3.75C7.21079 3.75 6.875 3.41421 6.875 3C6.875 2.58579 7.21079 2.25 7.625 2.25C8.03921 2.25 8.375 2.58579 8.375 3ZM10.625 3.75C11.0392 3.75 11.375 3.41421 11.375 3C11.375 2.58579 11.0392 2.25 10.625 2.25C10.2108 2.25 9.875 2.58579 9.875 3C9.875 3.41421 10.2108 3.75 10.625 3.75Z" fill="#737373"></path></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.04331 0.48585C9.61718 0.0841431 10.381 0.0841441 10.9549 0.485851L17.8986 5.34646C18.8097 5.98426 18.8524 7.31853 17.984 8.0133L17.6387 8.28953L17.8986 8.47146C18.8097 9.10925 18.8524 10.4435 17.984 11.1383L17.6387 11.4145L17.8986 11.5965C18.8097 12.2343 18.8524 13.5685 17.984 14.2633L14.6863 16.9014L12.0814 18.9854C10.864 19.9593 9.13416 19.9593 7.91677 18.9854L5.31184 16.9014L2.01419 14.2633C1.14573 13.5685 1.18845 12.2343 2.09958 11.5965L2.35948 11.4145L2.01419 11.1383C1.14573 10.4435 1.18845 9.10925 2.09958 8.47146L2.35948 8.28953L2.01419 8.0133C1.14572 7.31852 1.18845 5.98425 2.09958 5.34646L3.05535 6.71185L6.35299 9.34997L8.95792 11.4339C9.56662 11.9209 10.4315 11.9209 11.0402 11.4339L13.6452 9.34997L16.9428 6.71185L9.99908 1.85124L10.477 1.16854L9.99908 1.85124L3.05535 6.71185L2.09958 5.34646L9.04331 0.48585ZM3.71577 12.4996L3.05535 12.9618L6.35299 15.6L8.95792 17.6839C9.56662 18.1709 10.4315 18.1709 11.0402 17.6839L13.6452 15.6L16.9428 12.9618L16.2824 12.4996L14.6863 13.7764L12.0814 15.8604C10.864 16.8343 9.13416 16.8343 7.91677 15.8604L5.31184 13.7764L3.71577 12.4996ZM14.6863 10.6514L16.2824 9.37456L16.9428 9.83685L13.6452 12.475L11.0402 14.5589C10.4315 15.0459 9.56662 15.0459 8.95792 14.5589L6.35299 12.475L3.05535 9.83685L3.71577 9.37456L5.31184 10.6514L7.91677 12.7354C9.13416 13.7093 10.864 13.7093 12.0814 12.7354L14.6863 10.6514Z" fill="#737373"></path></svg>}
                        {Temp_filter}
                    </span>
                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} />
                </div>
                <div className='wkit-custom-dropDown-content'>
                    <div className='wkit-drop-down-outer'></div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { setTemp_filter('templates'), setbuilder_filter('all') }}>
                        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M17.375 1.5H2.375L2.375 4.5H17.375V1.5ZM0.875 4.5V6V16.5C0.875 17.3284 1.54657 18 2.375 18H17.375C18.2034 18 18.875 17.3284 18.875 16.5V6V4.5V1.5C18.875 0.671573 18.2034 0 17.375 0H2.375C1.54657 0 0.875 0.671573 0.875 1.5V4.5ZM2.375 16.5H17.375V6H2.375L2.375 16.5ZM3.875 8.625C3.875 8.41789 4.04289 8.25 4.25 8.25H15.5C15.7071 8.25 15.875 8.41789 15.875 8.625V9.375C15.875 9.58211 15.7071 9.75 15.5 9.75H4.25C4.04289 9.75 3.875 9.58211 3.875 9.375V8.625ZM4.625 11.25C4.21079 11.25 3.875 11.5858 3.875 12V13.5C3.875 13.9142 4.21079 14.25 4.625 14.25H6.125C6.53921 14.25 6.875 13.9142 6.875 13.5V12C6.875 11.5858 6.53921 11.25 6.125 11.25H4.625ZM8.375 12C8.375 11.5858 8.71079 11.25 9.125 11.25H10.625C11.0392 11.25 11.375 11.5858 11.375 12V13.5C11.375 13.9142 11.0392 14.25 10.625 14.25H9.125C8.71079 14.25 8.375 13.9142 8.375 13.5V12ZM13.625 11.25C13.2108 11.25 12.875 11.5858 12.875 12V13.5C12.875 13.9142 13.2108 14.25 13.625 14.25H15.125C15.5392 14.25 15.875 13.9142 15.875 13.5V12C15.875 11.5858 15.5392 11.25 15.125 11.25H13.625ZM4.625 3.75C5.03921 3.75 5.375 3.41421 5.375 3C5.375 2.58579 5.03921 2.25 4.625 2.25C4.21079 2.25 3.875 2.58579 3.875 3C3.875 3.41421 4.21079 3.75 4.625 3.75ZM8.375 3C8.375 3.41421 8.03921 3.75 7.625 3.75C7.21079 3.75 6.875 3.41421 6.875 3C6.875 2.58579 7.21079 2.25 7.625 2.25C8.03921 2.25 8.375 2.58579 8.375 3ZM10.625 3.75C11.0392 3.75 11.375 3.41421 11.375 3C11.375 2.58579 11.0392 2.25 10.625 2.25C10.2108 2.25 9.875 2.58579 9.875 3C9.875 3.41421 10.2108 3.75 10.625 3.75Z" fill="#737373" />
                        </svg>
                        <span>{__('Templates', 'wdesignkit')}</span>
                    </div>
                    <div className='wkit-custom-dropDown-options' onClick={() => { setTemp_filter('widgets'), setbuilder_filter('all') }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.04331 0.48585C9.61718 0.0841431 10.381 0.0841441 10.9549 0.485851L17.8986 5.34646C18.8097 5.98426 18.8524 7.31853 17.984 8.0133L17.6387 8.28953L17.8986 8.47146C18.8097 9.10925 18.8524 10.4435 17.984 11.1383L17.6387 11.4145L17.8986 11.5965C18.8097 12.2343 18.8524 13.5685 17.984 14.2633L14.6863 16.9014L12.0814 18.9854C10.864 19.9593 9.13416 19.9593 7.91677 18.9854L5.31184 16.9014L2.01419 14.2633C1.14573 13.5685 1.18845 12.2343 2.09958 11.5965L2.35948 11.4145L2.01419 11.1383C1.14573 10.4435 1.18845 9.10925 2.09958 8.47146L2.35948 8.28953L2.01419 8.0133C1.14572 7.31852 1.18845 5.98425 2.09958 5.34646L3.05535 6.71185L6.35299 9.34997L8.95792 11.4339C9.56662 11.9209 10.4315 11.9209 11.0402 11.4339L13.6452 9.34997L16.9428 6.71185L9.99908 1.85124L10.477 1.16854L9.99908 1.85124L3.05535 6.71185L2.09958 5.34646L9.04331 0.48585ZM3.71577 12.4996L3.05535 12.9618L6.35299 15.6L8.95792 17.6839C9.56662 18.1709 10.4315 18.1709 11.0402 17.6839L13.6452 15.6L16.9428 12.9618L16.2824 12.4996L14.6863 13.7764L12.0814 15.8604C10.864 16.8343 9.13416 16.8343 7.91677 15.8604L5.31184 13.7764L3.71577 12.4996ZM14.6863 10.6514L16.2824 9.37456L16.9428 9.83685L13.6452 12.475L11.0402 14.5589C10.4315 15.0459 9.56662 15.0459 8.95792 14.5589L6.35299 12.475L3.05535 9.83685L3.71577 9.37456L5.31184 10.6514L7.91677 12.7354C9.13416 13.7093 10.864 13.7093 12.0814 12.7354L14.6863 10.6514Z" fill="#737373"></path>
                        </svg>
                        <span>{__('Widgets', 'wdesignkit')}</span>
                    </div>
                </div>
            </div>
        );
    }

    const Condition_check = (value) => {
        if (value.length <= 100) {
            return true;
        } else {
            props.wdkit_set_toast([__('Limit Reached', 'wdesignkit'), __('Limit Reached', 'wdesignkit'), '', 'danger'])
            return false;
        }
    }

    return (
        <div>
            {wsData ?
                <div className='wkit-workspace-sigle-page'>
                    <div className='wkit-kit-box-wrapper'>
                        <div className="wkit-work-space">
                            <div className="wkit-work-left-column">
                                <div className='wkit-img-name-edit'>
                                    {wsData.work_icon ?
                                        <img src={wsData.work_icon} alt="workspace-profile" className={"wkit-workspace-profile-img"} />
                                        :
                                        <div className={'wkit-profile-back wkit-profile-letter'}>{profile_Letter}</div>
                                    }
                                    <div className='wkit-ws-name-edit'>
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
                                                <input type="text" className="btn-input" value={inp_name} onChange={(e) => {
                                                    if (Condition_check(e.target.value)) {
                                                        (setinp_name(e.target.value))
                                                    }
                                                }} />
                                                <button className={'wkit-title-update-btn'} onClick={() => { WKit_input_text(inp_name) }}>{__('Update', 'wdesignkit')}</button>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='wkit-tooltip-dropdown-content'>
                                    {Type_dorpDown()}
                                    {/* {Builder_filter()} */}
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
                                    {/* {Object.values(wsData?.share_user).length > 4 && */}
                                    <div className="wkit-more-user-proflie">{Object.values(wsData?.share_user).length}</div>
                                    {/* } */}
                                </div>
                                <a href={`${wdkitData.wdkit_server_url}admin/workspace/workspacetemplate/${wsData?.w_id}`} target="_blank" rel="noopener noreferrer">
                                    <div className='wkit-manage-member'>
                                        <span>{__('Manage Members', 'wdesignkit')}</span>
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
                                            credits={props?.wdkit_meta?.credits}
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
                            <Wkit_availble_not page={Temp_filter} link={wdkitData.WDKIT_DOC_URL + 'documents/add-templates-and-widgets-in-workspace/'} />
                        </div>
                    }
                    {loading == true &&
                        <Wkit_template_Skeleton />
                    }
                    {downTempId &&
                        <div className={"wkit-myupload-main wkit-model-transp wkit-popup-show"} >
                            <div className={"wkit-plugin-model-content wkit-import-template"}>
                                <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e); setSuccessImport(false), setDownloadTempId(""); }}>
                                    <span>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                                    </span>
                                </a>
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
                            nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M0.412598 9.52417L4.48371 5.44417L0.412598 1.36417L1.66593 0.11084L6.99926 5.44417L1.66593 10.7775L0.412598 9.52417Z" fill="#8991A4" /></svg>}
                            pageRangeDisplayed={2}
                            pageCount={Math.ceil(Listdata.length / perPage)}
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
    )
}
export default Workspace_single;