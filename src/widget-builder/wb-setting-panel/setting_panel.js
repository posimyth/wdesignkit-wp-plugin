import '../style/setting_panel.scss'
import Popup_data_container from '../redux-container/popup_data_container';
import CreatFile from '../file-creation/gutenberg_file';
import Elementor_file_create from '../file-creation/elementor_file';
import Bricks_file_create from '../file-creation/bricks_file';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { get_user_login, loadingIcon, wdKit_Form_data } from '../../helper/helper-function';

const Widget_header = (props) => {

    const [btn, setbtn] = useState(false);
    const [WStatus, setWStatus] = useState('default');

    const [scroll, setscroll] = useState("");
    const [Dropdown, setDropdown] = useState(false);
    const [inputOpen, setinputOpen] = useState(false);
    const [w_version, setw_version] = useState('');
    const [version_details, setversion_details] = useState(['']);
    const [open, setopen] = useState(false);
    const [error_msg, seterror_msg] = useState('');
    const inputRefValue = useRef();
    const inpref = useRef(null);
    const [WkitWidgetName, setWkitWidgetName] = useState(props.widgetdata.WcardData.widgetdata.name);
    const [inp_length, setinp_length] = useState(props.widgetdata.WcardData.widgetdata.name.length);
    const [loader, setloader] = useState(false);
    const navigate = useNavigate();

    const old_name = useParams();
    var old_folder = old_name.id;

    var img_path = wdkitData.WDKIT_URL;
    const redux_data = useRef("");

    useEffect(() => {
        let data_obj = { "CardItems": props.widgetdata?.CardItems, "WcardData": props.widgetdata?.WcardData, "Editor_data": props.widgetdata?.Editor_data, "Editor_code": props.widgetdata?.Editor_code }

        redux_data.current = JSON.stringify(data_obj);
        if (document.querySelector('.wkit-wb-live-preview') &&
            document.querySelector('.wkit-wb-live-preview').getBoundingClientRect() &&
            document.querySelector('.wkit-wb-live-preview').getBoundingClientRect().top) {
            setscroll(document.querySelector('.wkit-wb-live-preview').getBoundingClientRect().top);
        }
    }, [])

    useEffect(() => {
        let data_obj = { "CardItems": props.widgetdata?.CardItems, "WcardData": props.widgetdata?.WcardData, "Editor_data": props.widgetdata?.Editor_data, "Editor_code": props.widgetdata?.Editor_code }

        if (redux_data?.current && props?.widgetdata && (redux_data.current !== JSON.stringify(data_obj))) {

            setWStatus('change')

        } else {
            if (WStatus != 'default') {
                setWStatus('update')

            }
        }
    }, [props.widgetdata])

    useEffect(() => {
        // const handleKeyPress = async (event) => {
        //     if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 's') {s
        //         await Publish_widget(props.widgetdata, 'update');
        //     }
        // };

        // document.addEventListener('keydown', handleKeyPress);

        if (window.location.hash.search('#/widget-listing/builder') > -1) {
            window.onbeforeunload = function (e) {
                if (WStatus == 'change') {
                    return 'Are you sure you want to leave page';
                }
            };
        }
    })

    const keyUniqueID = () => {
        let date = new Date();
        let year = date.getFullYear().toString().slice(-2);
        let number = Math.random();
        number.toString(36);
        let uid = number.toString(36).substr(2, 6);
        return uid + year;
    }

    const Save_btn_content = () => {
        var text = 'Save';
        var icon = '';
        var classType = '';

        if (WStatus == 'default') {
            text = 'Save';
            icon = '';
            classType = 'wdkit-disable';
        } else if (WStatus == 'change') {
            text = 'Save';
            icon = <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" className='wkit-wb-save-icon'><path d="M15.8333 17.8125H4.16667C3.72464 17.8125 3.30072 17.6413 2.98816 17.3365C2.67559 17.0318 2.5 16.6185 2.5 16.1875V4.8125C2.5 4.38152 2.67559 3.9682 2.98816 3.66345C3.30072 3.3587 3.72464 3.1875 4.16667 3.1875H13.3333L17.5 7.25V16.1875C17.5 16.6185 17.3244 17.0318 17.0118 17.3365C16.6993 17.6413 16.2754 17.8125 15.8333 17.8125Z" stroke="white" strokeWidth="0.78125" strokeLinecap="round" strokeLinejoin="round" /><path d="M14.1673 17.8125V11.3125H5.83398V17.8125" stroke="white" strokeWidth="0.78125" strokeLinecap="round" strokeLinejoin="round" /><path d="M5.83398 3.1875V7.25H12.5007" stroke="white" strokeWidth="0.78125" strokeLinecap="round" strokeLinejoin="round" /></svg>;
            classType = '';
        } else if (WStatus == 'update') {
            text = 'Saved';
            icon = '';
            classType = 'wdkit-saved';
        } else if (WStatus == 'loading') {
            text = '';
            icon = <div className="wkit-publish-loader">
                <div className="wb-loader-circle"></div>
            </div>;
            classType = '';
        }

        return (
            <button className={`wkit-wb-publish-btn ${classType}`}
                onClick={() => {
                    Publish_widget(props.widgetdata, 'update').then((res) => {
                        if (res.api.success) {
                            props.wdkit_set_toast(['Update Saved Successfully', 'Success! Update Saved', '', 'success']);
                        } else {
                            props.wdkit_set_toast(['Fail to Save', 'Fail! Can not Saved', '', 'danger']);
                        }
                    })
                }}
                disabled={WStatus != 'change' ? true : false}
            >
                {icon}
                {text}
            </button>
        );
    }

    const Publish_widget = async (widget_data, type) => {
        setWStatus('loading');

        var editor_html = ace.edit("editor-html", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/html"
        });
        var editor_css = ace.edit("editor-css", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/css"
        });
        var editor_js = ace.edit("editor-js", {
            theme: "ace/theme/cobalt",
            mode: "ace/mode/javascript"
        });

        let html_editor = JSON.stringify(editor_html.getValue())
        let css_editor = JSON.stringify(editor_css.getValue())
        let js_editor = JSON.stringify(editor_js.getValue())
        var responses = '';
        var img_link = '';

        if (props?.widgetdata?.WcardData?.widgetdata?.w_image) {
            let img = props.widgetdata.WcardData.widgetdata.w_image;
            if (typeof img == 'object') {
                img_link = img;
            }
        }

        var icon_link = '';

        if (props?.widgetdata?.WcardData?.widgetdata?.w_icon) {
            let img = props.widgetdata.WcardData.widgetdata.w_icon;
            if (typeof img == 'object') {
                icon_link = img;
            }
        }

        if (props.widgetdata.WcardData.widgetdata.type == "elementor") {
            if (img_link) {
                await Elementor_file_create(type, widget_data, html_editor, css_editor, js_editor, old_folder, img_link)
                    .then((response) => { responses = response });
            } else {
                await Elementor_file_create(type, widget_data, html_editor, css_editor, js_editor, old_folder, "")
                    .then((response) => { responses = response });
            }

        } else if (props.widgetdata.WcardData.widgetdata.type == "gutenberg") {
            if (img_link) {
                await CreatFile(type, widget_data, html_editor, css_editor, js_editor, old_folder, img_link)
                    .then((response) => { responses = response });
            } else {
                await CreatFile(type, widget_data, html_editor, css_editor, js_editor, old_folder, "")
                    .then((response) => { responses = response });
            }

        } else if (props.widgetdata.WcardData.widgetdata.type == "bricks") {
            if (img_link) {
                await Bricks_file_create(type, widget_data, html_editor, css_editor, js_editor, old_folder, img_link)
                    .then((response) => { responses = response });
            } else {
                await Bricks_file_create(type, widget_data, html_editor, css_editor, js_editor, old_folder, "")
                    .then((response) => { responses = response });
            }
        }
        setTimeout(() => {
            setWStatus('update');
            let data_obj = { "CardItems": props.widgetdata?.CardItems, "WcardData": props.widgetdata?.WcardData, "Editor_data": props.widgetdata?.Editor_data, "Editor_code": props.widgetdata?.Editor_code }
            redux_data.current = JSON.stringify(data_obj);
        }, 1000)

        return responses;
    }

    const Change_publish_type = (value) => {
        const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "publish_type": value });
        props.addTowidgethandler(add_val)
    }

    const Close_popup = (e, btn) => {
        if (e && e.target && Object.values(e.target.classList) && Object.values(e.target.classList).includes('overlay')) {
            setopen("")
            seterror_msg("")
        } else if (btn == "click") {
            setopen("")
            seterror_msg("")
        }
    }

    const changeEditorName = (e) => {
        var pattern = /^[a-zA-Z][a-zA-Z0-9\s]{0,23}$/;

        if (pattern.test(e.target.value) || e.target.value == "") {
            setWkitWidgetName(e.target.value);
            const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "name": e.target.value });
            props.addTowidgethandler(add_val);
            return true;
        } else {
            return false;
        }
    }

    const widgetNamecheck = (e) => {
        let new_name = e.target.value.trim();
        if (new_name == "") {
            inpref.current;
            const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "name": inpref.current });
            props.addTowidgethandler(add_val)
            setWkitWidgetName(inpref.current)
        } else {
            const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "name": new_name });
            props.addTowidgethandler(add_val)
            setWkitWidgetName(new_name)
        }
    }

    const getFocusValue = (e) => {
        inpref.current = e.target.value;
    }

    const WkitNameEdit = (e) => {
        setinputOpen(!inputOpen);
        setTimeout(() => {
            inputRefValue.current.focus();
        }, 0)
    }

    const Update_version = async () => {
        let widgetList = props.wdkit_meta.widgettemplate;

        setloader(true);
        if (widgetList.length > 0) {
            let index = widgetList.findIndex((id) => id.w_unique == props.widgetdata.WcardData.widgetdata.widget_id)

            if (version_details.length > 1) {
                var updated_version = version_details;
            } else if (version_details.length == 1 && version_details[0]) {
                var updated_version = version_details;
            } else {
                var updated_version = [];
            }
            if (index > -1) {
                var widget_data = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "widget_version": w_version ? w_version : '1.0.0', "version_detail": updated_version })
            } else {
                var widget_data = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "widget_version": w_version ? w_version : '1.0.0', "version_detail": updated_version })
            }
        } else {
            var widget_data = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "widget_version": w_version ? w_version : '1.0.0', "version_detail": updated_version })
        }

        let w_card = Object.assign({}, props.widgetdata.WcardData, { "widgetdata": widget_data }),
            new_data = Object.assign({}, props.widgetdata, { "WcardData": w_card })
        var responses = '';

        await Publish_widget(new_data, 'sync').then((res) => { responses = res })
        if (responses && responses.ajax) {
            if (responses?.ajax?.data?.success == true) {
                setopen('')
                seterror_msg('')
                props.wdkit_set_toast(['Widget synced', 'Widget synced', '', 'success']);
            } else {
                props.wdkit_set_toast(['Operation fail', 'Something went wrong', '', 'danger']);
                seterror_msg(responses?.ajax?.data?.message)
            }
        }

        const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "widget_version": w_version ? w_version : '1.0.0' });
        props.addTowidgethandler(add_val)
        setversion_details([''])
        setloader(false)
    }

    const Add_changelog = () => {
        let data = [...version_details];
        data.push("")
        setversion_details(data)
    }

    const Update_changelog = (e, index) => {
        let data = [...version_details];
        data[index] = e.target.value;
        setversion_details(data)
    }

    const Delete_changelog = (index) => {
        let data = [...version_details];
        if (data.length > 1) {
            data.splice(index, 1);
            setversion_details(data)
        } else if (data.length == 1) {
            data[index] = '';
            setversion_details(data)
        }
    }

    /**
     * Rander Icon
     * 
     * @since 1.0.4
     * @version 1.0.6
     */
    const PublishIcon = () => {
        return (
            <svg width="22" height="21" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 15.5C13.5749 15.5 16.5 12.5749 16.5 9C16.5 5.42505 13.5749 2.5 10 2.5C6.42505 2.5 3.5 5.42505 3.5 9C3.5 12.5749 6.42505 15.5 10 15.5ZM10 15.5C10.3744 14.3767 11.1035 13.4108 11.9461 12.579C12.2432 12.2855 12.4274 11.878 12.4274 11.4274V10.6183H11.7138C11.1593 10.6183 10.6525 10.305 10.4046 9.80913C10.1566 9.31324 9.64978 9 9.09536 9L8.38174 8.99999M10 15.5L9.70819 14.9164C9.36798 14.236 9.19086 13.4588 9.19086 12.6981C9.19086 12.4025 9.07346 12.1191 8.86446 11.9101L8.38174 11.4274L8.62288 11.1862C8.96207 10.847 9.04617 10.3289 8.83164 9.8998L8.38174 8.99999M10.8091 2.55008L11.2541 3.88452C11.4328 4.40938 11.0426 4.95435 10.4881 4.95435H10C9.55312 4.95435 9.19087 5.3166 9.19087 5.76348V6.03621C9.19087 6.34055 9.04329 6.64368 8.7742 6.78169C8.12209 7.11613 7.81916 7.87482 8.14691 8.53032L8.38174 8.99999M8.38174 8.99999L6.54429 7.77503C6.20484 7.54871 6.07753 7.09868 6.27394 6.74107C6.544 6.24928 6.27423 5.64117 5.73592 5.50658L4.69419 5.25292M14.3076 4.16833L14.106 4.77315C14.0663 4.89231 13.9994 5.0006 13.9106 5.08941L13.4735 5.5265C13.3218 5.67824 13.2365 5.88403 13.2365 6.09864V6.57263C13.2365 7.01948 13.5988 7.38175 14.0457 7.38175C14.4925 7.38175 14.8548 7.744 14.8548 8.19088V8.809C14.8548 8.93461 14.8255 9.05848 14.7694 9.17085L14.6311 9.44727C14.3622 9.98526 14.7533 10.6183 15.3549 10.6183H16.2961" stroke="#737373" strokeWidth="1.04" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    /**
     * Rander Icon
     * 
     * @since 1.0.4
     */
    const DraftIcon = () => {
        return (
            <svg width="22" height="21" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.07617 1.99365C5.10968 1.99365 4.32617 2.77646 4.32617 3.7421V14.2452C4.32617 15.2108 5.10968 15.9937 6.07617 15.9937H13.8509C14.8174 15.9937 15.6009 15.2108 15.6009 14.2452V12.9321C15.6009 12.6469 15.3018 12.4605 15.0456 12.5859C14.9609 12.6273 14.9009 12.7098 14.9009 12.804V14.2452C14.9009 14.8246 14.4308 15.2943 13.8509 15.2943H6.07617C5.49627 15.2943 5.02617 14.8246 5.02617 14.2452V3.7421C5.02617 3.16272 5.49627 2.69303 6.07617 2.69303H13.8509C14.4308 2.69303 14.9009 3.16272 14.9009 3.7421V5.70935C14.9009 6.0407 15.2484 6.25736 15.5463 6.11169C15.5791 6.09565 15.6009 6.06285 15.6009 6.02635V3.7421C15.6009 2.77646 14.8174 1.99365 13.8509 1.99365H6.07617Z" fill="#737373" />
                <path fillRule="evenodd" clipRule="evenodd" d="M12.6095 14.3274C12.3766 14.481 12.0662 14.314 12.0666 14.0352L12.0685 12.4696L14.9529 7.11972C15.2279 6.60964 15.8648 6.4189 16.3753 6.69369C16.8858 6.96847 17.0768 7.6047 16.8017 8.11479L13.9172 13.4644L12.6095 14.3274ZM13.3845 12.9778L12.7673 13.385L12.7683 12.6461L15.5692 7.45142C15.6609 7.28139 15.8731 7.21781 16.0433 7.3094C16.2134 7.401 16.2771 7.6131 16.1854 7.78313L13.3845 12.9778Z" fill="#737373" />
                <path d="M7.12619 6.19614C6.93289 6.19614 6.77619 6.35269 6.77619 6.54582C6.77619 6.73896 6.93289 6.89552 7.12619 6.89552H12.7262C12.9195 6.89552 13.0762 6.73896 13.0762 6.54582C13.0762 6.35269 12.9195 6.19614 12.7262 6.19614H7.12619Z" fill="#737373" />
                <path d="M6.77619 4.44768C6.77619 4.25455 6.93289 4.098 7.12619 4.098H12.7262C12.9195 4.098 13.0762 4.25455 13.0762 4.44768C13.0762 4.64081 12.9195 4.79737 12.7262 4.79737H7.12619C6.93289 4.79737 6.77619 4.64081 6.77619 4.44768Z" fill="#737373" />
                <path d="M7.12619 8.29427C6.93289 8.29427 6.77619 8.45086 6.77619 8.64399C6.77619 8.83712 6.93289 8.99364 7.12619 8.99364H12.7262C12.9195 8.99364 13.0762 8.83712 13.0762 8.64399C13.0762 8.45086 12.9195 8.29427 12.7262 8.29427H7.12619Z" fill="#737373" />
                <path d="M6.77619 10.7421C6.77619 10.549 6.93289 10.3924 7.12619 10.3924H11.3262C11.5195 10.3924 11.6762 10.549 11.6762 10.7421C11.6762 10.9352 11.5195 11.0918 11.3262 11.0918H7.12619C6.93289 11.0918 6.77619 10.9352 6.77619 10.7421Z" fill="#737373" />
                <path d="M7.12619 12.4906C6.93289 12.4906 6.77619 12.6471 6.77619 12.8402C6.77619 13.0334 6.93289 13.1899 7.12619 13.1899H11.3262C11.5195 13.1899 11.6762 13.0334 11.6762 12.8402C11.6762 12.6471 11.5195 12.4906 11.3262 12.4906H7.12619Z" fill="#737373" />
            </svg>
        )
    }

    const handleVersionInputChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9.]*$/;

        if (value == '') {
            seterror_msg('');
        } else if (!regex.test(value)) {
            seterror_msg(`You can enter only number here`);
            return;
        }

        setw_version(e.target.value);
        if (props?.widgetdata?.WcardData?.widgetdata?.widget_version >= e.target.value) {
            seterror_msg(`Version ${e.target.value} is already available`)
        } else {
            seterror_msg('')
        }
    };

    const handleBackbtn = () => {
        if ((WStatus == 'update' || WStatus == 'default') || confirm('Changes you made may not be saved.')) {
            navigate('/widget-listing');
        }
    }

    return (
        <>
            <div className='wkit-widget-edit-setting-panel'>
                <div className='wkit-widget-back-btn'>
                    <div className='wkit-back-btn-icon' onClick={() => { handleBackbtn() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5" stroke="#C22076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 19L5 12L12 5" stroke="#C22076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className="wkit-wb-head-wrapper">
                    <div className="wkit-wb-left-hand-side">
                        <img className='wkit-wb-plus-icon wkit-elementor-icon' src={img_path + 'assets/images/wb-svg/elementor.svg'} draggable="false" />
                        <img className='wkit-wb-plus-icon wkit-gutenberg-icon' src={img_path + 'assets/images/wb-svg/gutenberg.svg'} draggable="false" />
                        <img className='wkit-wb-plus-icon wkit-bricks-icon' src={img_path + 'assets/images/wb-svg/bricks.svg'} draggable="false" />

                        <div className="wkit-wb-widget-title">
                            <span className="wkit-wb-widgetTitle" style={{ display: inputOpen && 'none' }}>{props.widgetdata.WcardData.widgetdata.name}</span>
                            <input className='wkit-wb-widget-title-inp' type="text"
                                value={WkitWidgetName}
                                onChange={(e) => { changeEditorName(e), setinp_length(e.target.value.length) }}
                                ref={inputRefValue}
                                style={{ 'pointerEvents': !inputOpen && 'none', display: inputOpen && 'flex' }}
                                onBlur={(e) => { widgetNamecheck(e), setinputOpen(!inputOpen) }}
                                onFocus={(e) => { getFocusValue(e) }} />
                            {!inputOpen &&
                                <a>
                                    <img className="wkit-wb-edit-nameIcon" onClick={(e) => { WkitNameEdit(e); }} src={img_path + 'assets/images/wb-svg/pencil.svg'} />
                                </a>
                            }
                        </div>
                    </div>
                    <div className="wkit-wb-right-hand-side">
                        <div className='wkit-wb-setting-panel-link wkit-wb-dropdown' onClick={() => { setDropdown(!Dropdown) }}>
                            {props.widgetdata.WcardData.widgetdata.publish_type == 'Publish' ?
                                <PublishIcon />
                                :
                                <DraftIcon />
                            }

                            <span className='output'>{props.widgetdata.WcardData.widgetdata.publish_type}</span>
                            <svg width="10" height="10" viewBox="0 0 12 8" fill="black" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z" className='wkit-wb-down-arrow' />
                            </svg>
                            <div className={Dropdown == true ? 'wkit-wb-dropdown-content wkit-wb-show' : 'wkit-wb-dropdown-content'} id='mySelect'>
                                <div className='wkit-dropdown-outerContent'></div>
                                <div className='wkit-dropdown-item' value="draft" name="Draft" onClick={() => { Change_publish_type('Draft') }}>
                                    <DraftIcon />
                                    <span>Draft</span>
                                </div>
                                <div className='wkit-dropdown-item' value="publish" name="Publish" onClick={() => Change_publish_type('Publish')}>
                                    <PublishIcon />
                                    <span>Publish</span>
                                </div>
                            </div>
                        </div>
                        <svg className='wkit-wb-setting-icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" onClick={() => { setopen('widget_info') }}>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15V15Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {props.widgetdata?.WcardData?.widgetdata?.allow_push != false &&
                            <button className={`wkit-wb-sync-btn ${get_user_login() ? '' : 'wkit-block-btn'}`} onClick={() => { setopen('version_info') }} >
                                <div className='wkit-wb-sync-btn-tooltip'>
                                    <span>Push widget on Cloud and Sync it</span>
                                    <div className='wkit-wb-sync-tooltip-icon'></div>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M14.6875 13.75H10.625V7.75898L12.6832 9.8168C12.8014 9.92906 12.9587 9.99072 13.1217 9.98863C13.2847 9.98655 13.4404 9.92088 13.5556 9.80563C13.6709 9.69038 13.7365 9.53466 13.7386 9.37169C13.7407 9.20871 13.6791 9.05137 13.5668 8.9332L10.4418 5.8082C10.3246 5.69108 10.1657 5.62529 10 5.62529C9.83431 5.62529 9.6754 5.69108 9.5582 5.8082L6.4332 8.9332C6.32094 9.05137 6.25928 9.20871 6.26137 9.37169C6.26345 9.53466 6.32912 9.69038 6.44437 9.80563C6.55962 9.92088 6.71534 9.98655 6.87831 9.98863C7.04129 9.99072 7.19863 9.92906 7.3168 9.8168L9.375 7.75898V13.75H5.3125C4.73253 13.7494 4.17649 13.5187 3.76639 13.1086C3.35629 12.6985 3.12562 12.1425 3.125 11.5625V3.4375C3.12562 2.85753 3.35629 2.30149 3.76639 1.89139C4.17649 1.48129 4.73253 1.25062 5.3125 1.25H14.6875C15.2675 1.25062 15.8235 1.48129 16.2336 1.89139C16.6437 2.30149 16.8744 2.85753 16.875 3.4375V11.5625C16.8744 12.1425 16.6437 12.6985 16.2336 13.1086C15.8235 13.5187 15.2675 13.7494 14.6875 13.75ZM10.625 18.125C10.625 18.2908 10.5592 18.4497 10.4419 18.5669C10.3247 18.6842 10.1658 18.75 10 18.75C9.83424 18.75 9.67527 18.6842 9.55806 18.5669C9.44085 18.4497 9.375 18.2908 9.375 18.125V13.75H10.625V18.125Z" fill="white" />
                                </svg>
                                <span>Push</span>
                            </button>
                        }
                        {Save_btn_content()}
                    </div>
                </div>
            </div>
            {open == "widget_info" ? <div id="wkit-wb-popup-open" className="overlay" onClick={(e) => { Close_popup(e) }}>
                <div className="wkit-wb-popup">
                    <Popup_data_container Close_popup={(e) => Close_popup(e, 'click')} />
                </div>
            </div> : ""}
            {open == "version_info" ?
                <div id="wkit-wb-popup-open" className="overlay" onClick={(e) => { Close_popup(e) }}>
                    <div className='wkit-version-popup-inside'>
                        <div className='wkit-wb-version-popup'>
                            <div className="wb-version-detail">
                                <div className="wb-version-header">
                                    <label>Add Sync Details</label>
                                    <div className="wkit-popup-close-icon" onClick={(e) => { (e.target.closest('.overlay').click()) }} >
                                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="wb-version-body">
                                    <div className='wb-version-wrap wb-widget-sync-details'>
                                        <div className="wb-version-number">
                                            <span className='wb-version-label'>Current Version</span>
                                            <input style={{ 'cursor': 'not-allowed' }} className="wb-version-input" type="text" defaultValue={props?.widgetdata?.WcardData?.widgetdata?.widget_version ? props?.widgetdata?.WcardData?.widgetdata?.widget_version : '1.0.0'} disabled />
                                        </div>
                                        <div className="wb-version-detais">
                                            <span className='wb-version-label'>Latest Version</span>
                                            <input className="wb-version-input" type="text"
                                                value={props?.widgetdata?.WcardData?.widgetdata?.widget_version ? w_version : '1.0.0'}
                                                onChange={(e) => { handleVersionInputChange(e) }}
                                                disabled={props?.widgetdata?.WcardData?.widgetdata?.widget_version ? false : true} />
                                            <p className="wb-error-message">{error_msg}</p>
                                        </div>
                                    </div>
                                    <span className='wb-version-label wb-label-separate'>Changelog</span>
                                    <div className="wb-version-changes">
                                        {version_details.map((val, index) => {
                                            return (
                                                <div className='wb-version-wrap'>
                                                    <textarea className="wb-version-detail-input" value={val} placeholder='Please enter description' rows="2" onChange={(e) => { Update_changelog(e, index) }} />
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" onClick={() => { Delete_changelog(index) }} fill="black"><path fillRule="evenodd" clipRule="evenodd" d="M8.89978 1.92188C8.57488 1.92188 8.2633 2.05094 8.03359 2.28066L8.03358 2.28067C7.80384 2.51041 7.67478 2.82199 7.67478 3.14687V4.37187H14.3248V3.14687C14.3248 2.82204 14.1957 2.51043 13.966 2.28064C13.7363 2.05095 13.4247 1.92188 13.0998 1.92188H8.89978ZM16.0748 4.37187V3.14687C16.0748 2.3578 15.7613 1.60113 15.2034 1.04326C14.6455 0.485289 13.8887 0.17188 13.0998 0.17188H8.89978C8.11078 0.17188 7.35406 0.485298 6.79613 1.04324C6.23822 1.60115 5.92478 2.35785 5.92478 3.14687V4.37187H3.64978C3.63803 4.37187 3.62634 4.3721 3.61471 4.37256H1.55005C1.0668 4.37256 0.675049 4.76431 0.675049 5.24756C0.675049 5.73081 1.0668 6.12256 1.55005 6.12256H2.77478V19.9469C2.77478 20.7358 3.08821 21.4926 3.64617 22.0505C4.20403 22.6084 4.96072 22.9219 5.74978 22.9219H16.2498C17.0388 22.9219 17.7955 22.6084 18.3534 22.0505C18.9113 21.4926 19.2248 20.7359 19.2248 19.9469V6.12256H20.4501C20.9333 6.12256 21.3251 5.73081 21.3251 5.24756C21.3251 4.76431 20.9333 4.37256 20.4501 4.37256H18.3849C18.3732 4.3721 18.3615 4.37187 18.3498 4.37187H16.0748ZM4.52478 19.9469V6.12256H17.4748V19.9469C17.4748 20.2717 17.3457 20.5834 17.116 20.8131C16.8863 21.0428 16.5746 21.1719 16.2498 21.1719H5.74978C5.42494 21.1719 5.11333 21.0428 4.88356 20.8131L4.26572 21.4309L4.88355 20.8131C4.65385 20.5834 4.52478 20.2718 4.52478 19.9469ZM11.8751 10.4971C11.8751 10.0139 11.4833 9.6221 11.0001 9.6221C10.5169 9.6221 10.1251 10.0139 10.1251 10.4971V16.7971C10.1251 17.2803 10.5169 17.6721 11.0001 17.6721C11.4833 17.6721 11.8751 17.2803 11.8751 16.7971V10.4971Z" /></svg>
                                                </div>
                                            );
                                        })
                                        }
                                    </div>
                                    <button className='wkit-add-log-btn' onClick={() => { Add_changelog() }}>
                                        <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.5 0.546875H5.5V6.04688H0V7.04688H5.5V12.5469H6.5V7.04688H12V6.04688H6.5V0.546875Z" />
                                        </svg>
                                        <label>Add more</label>
                                    </button>
                                </div>
                                <div className="wb-quickedit-footer wb-add-widget-footer">
                                    <div className="wb-add-widget-cancelBtn">
                                        <button onClick={(e) => { (e.target.closest('.overlay').click()) }} > Cancel </button>
                                    </div>
                                    <button
                                        className={`wb-version-popup-btn`}
                                        style={{ cursor: (props?.widgetdata?.WcardData?.widgetdata?.widget_version < w_version || !props?.widgetdata?.WcardData?.widgetdata?.widget_version) ? '' : "no-drop" }}
                                        disabled={(props?.widgetdata?.WcardData?.widgetdata?.widget_version < w_version || !props?.widgetdata?.WcardData?.widgetdata?.widget_version) ? false : true}
                                        onClick={(e) => { Update_version() }}>
                                        {loader == true &&
                                            <div className="wkit-publish-loader">
                                                <div className="wb-loader-circle"></div>
                                            </div>
                                        }
                                        {loader == false &&
                                            <span>Update</span>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : ""}
        </>
    );
}
export default Widget_header;