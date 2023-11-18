import '../style/setting_panel.scss'
import Popup_data_container from '../redux-container/popup_data_container';
import CreatFile from '../file-creation/gutenberg_file';
import Elementor_file_create from '../file-creation/elementor_file';
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';
import { get_user_login, wdKit_Form_data } from '../../helper/helper-function';

const Widget_header = (props) => {

    const [btn, setbtn] = useState(false);
    const [onload, setonload] = useState('onload');
    const [SaveLable, setSaveLable] = useState('Save');
    const [WStatus, setWStatus] = useState('default');
    const [flag, setflag] = useState('none');

    const [scroll, setscroll] = useState("");
    const [Dropdown, setDropdown] = useState(false);
    const [inputOpen, setinputOpen] = useState(false);
    const [w_version, setw_version] = useState(props?.widgetdata?.WcardData?.widgetdata?.widget_version);
    const [version_details, setversion_details] = useState(['']);
    const [open, setopen] = useState(false);
    const [error_msg, seterror_msg] = useState('');
    const inputRefValue = useRef();
    const inpref = useRef(null);
    const [WkitWidgetName, setWkitWidgetName] = useState(props.widgetdata.WcardData.widgetdata.name);
    const [inp_length, setinp_length] = useState(props.widgetdata.WcardData.widgetdata.name.length);
    const [loader, setloader] = useState(false);

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

        if (redux_data?.current && props?.widgetdata && (redux_data.current != JSON.stringify(data_obj))) {

            setWStatus('change')
        } else {
            if (WStatus != 'default') {
                setWStatus('update')
            }
        }

        window.onbeforeunload = function (e) {
            if (btn != false) {
                return 'Are you sure you want to leave page';
            }
        };
    }, [props.widgetdata])

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
            icon = <img className='wkit-wb-save-icon' src={img_path + 'assets/images/wb-svg/save 1.svg'} />;
            classType = '';
        } else if (WStatus == 'update') {
            text = 'Saved';
            icon = <img className='wkit-wb-save-success-icon' src={`${img_path}assets/images/wb-svg/${props.widgetdata.WcardData.widgetdata.type}-save.svg`} />;
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
                onClick={() => { Publish_widget(props.widgetdata, 'update') }}
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
            if (img_link && icon_link) {
                CreatFile(type, widget_data, html_editor, css_editor, js_editor, old_folder, img_link, icon_link);
            } else if (img_link && !icon_link) {
                CreatFile(type, widget_data, html_editor, css_editor, js_editor, old_folder, img_link);
            } else if (!img_link && icon_link) {
                CreatFile(type, widget_data, html_editor, css_editor, js_editor, old_folder, "", icon_link);
            } else {
                CreatFile(type, widget_data, html_editor, css_editor, js_editor, old_folder);
            }
        }
        setTimeout(() => {
            setWStatus('update');
            let data_obj = { "CardItems": props.widgetdata?.CardItems, "WcardData": props.widgetdata?.WcardData, "Editor_data": props.widgetdata?.Editor_data, "Editor_code": props.widgetdata?.Editor_code }
            redux_data.current = JSON.stringify(data_obj);
        }, 1000)

        return responses;
    }

    const Show_livePreview = () => {
        window.scrollTo({ top: Number(scroll), behavior: 'smooth' })
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
        var pattern = /^[a-zA-Z0-9-_ ]+$/;

        if (pattern.test(e.target.value) || e.target.value == "") {
            setWkitWidgetName(e.target.value);
            const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "name": e.target.value });
            props.addTowidgethandler(add_val)
        } else {
            // Show_toast('enter valid character for name', 'danger')
        }
    }

    const widgetNamecheck = (e) => {
        if (e.target.value == "" || !isNaN(inputRefValue.current.value.charAt(0))) {
            inpref.current;
            const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "name": inpref.current });
            props.addTowidgethandler(add_val)
            setWkitWidgetName(inpref.current)
            // Show_toast("First character of name must be alphabet", "danger");
        } else {
            const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "name": e.target.value });
            props.addTowidgethandler(add_val)
            setWkitWidgetName(e.target.value)
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

        let w_card = Object.assign({}, props.widgetdata.WcardData, { "widgetdata": widget_data })
        let new_data = Object.assign({}, props.widgetdata, { "WcardData": w_card })
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

        const add_val = Object.assign({}, props.widgetdata.WcardData.widgetdata, { "widget_version": w_version });
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

    return (
        <>
            <div className="wkit-wb-head-wrapper">
                <div className="wkit-wb-left-hand-side">
                    <img className='wkit-wb-plus-icon wkit-elementor-icon' src={img_path + 'assets/images/wb-svg/elementor_icon.svg'} />
                    <img className='wkit-wb-plus-icon wkit-gutenberg-icon' src={img_path + 'assets/images/wb-svg/gutenberg_icon.svg'} />
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
                    <a className='wkit-wb-setting-panel-link' onClick={() => { Show_livePreview() }}>Live Preview</a>
                    <div className='wkit-wb-setting-panel-link wkit-wb-dropdown' onClick={() => { setDropdown(!Dropdown) }}>
                        <span className='output'>{props.widgetdata.WcardData.widgetdata.publish_type}</span>
                        <svg width="10" height="10" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z" className='wkit-wb-down-arrow' />
                        </svg>
                        <div className={Dropdown == true ? 'wkit-wb-dropdown-content wkit-wb-show' : 'wkit-wb-dropdown-content'} id='mySelect'>
                            <div className='wkit-dropdown-item' value="draft" name="Draft" onClick={() => { Change_publish_type('Draft') }}>Draft</div>
                            <div className='wkit-dropdown-item' value="publish" name="Publish" onClick={() => Change_publish_type('Publish')}>Publish</div>
                        </div>
                    </div>
                    <img className='wkit-wb-setting-icon' src={img_path + 'assets/images/wb-png/settings.png'} onClick={() => { setopen('widget_info') }} />
                    {props.widgetdata?.WcardData?.widgetdata?.allow_push != false &&
                        <button className={`wkit-wb-sync-btn ${get_user_login() ? '' : 'wkit-block-btn'}`} onClick={() => { setopen('version_info') }} >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14.6875 13.75H10.625V7.75898L12.6832 9.8168C12.8014 9.92906 12.9587 9.99072 13.1217 9.98863C13.2847 9.98655 13.4404 9.92088 13.5556 9.80563C13.6709 9.69038 13.7365 9.53466 13.7386 9.37169C13.7407 9.20871 13.6791 9.05137 13.5668 8.9332L10.4418 5.8082C10.3246 5.69108 10.1657 5.62529 10 5.62529C9.83431 5.62529 9.6754 5.69108 9.5582 5.8082L6.4332 8.9332C6.32094 9.05137 6.25928 9.20871 6.26137 9.37169C6.26345 9.53466 6.32912 9.69038 6.44437 9.80563C6.55962 9.92088 6.71534 9.98655 6.87831 9.98863C7.04129 9.99072 7.19863 9.92906 7.3168 9.8168L9.375 7.75898V13.75H5.3125C4.73253 13.7494 4.17649 13.5187 3.76639 13.1086C3.35629 12.6985 3.12562 12.1425 3.125 11.5625V3.4375C3.12562 2.85753 3.35629 2.30149 3.76639 1.89139C4.17649 1.48129 4.73253 1.25062 5.3125 1.25H14.6875C15.2675 1.25062 15.8235 1.48129 16.2336 1.89139C16.6437 2.30149 16.8744 2.85753 16.875 3.4375V11.5625C16.8744 12.1425 16.6437 12.6985 16.2336 13.1086C15.8235 13.5187 15.2675 13.7494 14.6875 13.75ZM10.625 18.125C10.625 18.2908 10.5592 18.4497 10.4419 18.5669C10.3247 18.6842 10.1658 18.75 10 18.75C9.83424 18.75 9.67527 18.6842 9.55806 18.5669C9.44085 18.4497 9.375 18.2908 9.375 18.125V13.75H10.625V18.125Z" fill="white" />
                            </svg>
                            <label>Push</label>
                        </button>
                    }
                    {Save_btn_content()}
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
                        <div className='wkit-wb-version-popup' style={{ width: '50%' }}>
                            <a className="close" onClick={(e) => { (e.target.closest('.overlay').click()) }}>&times;</a>
                            <div className="wb-version-detail">
                                <div className="wb-version-header">
                                    <label>Add Sync details</label>
                                </div>
                                <div className="wb-version-body">
                                    <div className='wb-version-wrap'>
                                        <div className="wb-version-number">
                                            <label className='wb-version-label'>Current Version</label>
                                            <input className="wb-version-input" type="text" defaultValue={props?.widgetdata?.WcardData?.widgetdata?.widget_version ? props?.widgetdata?.WcardData?.widgetdata?.widget_version : '1.0.0'} disabled />
                                        </div>
                                        <div className="wb-version-detais">
                                            <label className='wb-version-label'>Latest Version</label>
                                            <input className="wb-version-input" type="text"
                                                defaultValue={props?.widgetdata?.WcardData?.widgetdata?.widget_version ? '' : '1.0.0'}
                                                onChange={(e) => {
                                                    setw_version(e.target.value);
                                                    if (props?.widgetdata?.WcardData?.widgetdata?.widget_version >= e.target.value) {
                                                        seterror_msg(`version ${e.target.value} is already available`)
                                                    } else {
                                                        seterror_msg('')
                                                    }
                                                }}
                                                disabled={props?.widgetdata?.WcardData?.widgetdata?.widget_version ? false : true} />
                                            <div className="wb-error-message">{error_msg}</div>
                                        </div>
                                    </div>
                                    <div className="wb-version-changes">
                                        <label className='wb-version-label'>Changelog</label>
                                        {version_details.map((val, index) => {
                                            return (
                                                <div className='wb-version-wrap'>
                                                    <textarea className="wb-version-detail-input" value={val} placeholder='Please enter description' rows="2" onChange={(e) => { Update_changelog(e, index) }} />
                                                    {/* <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => { Delete_changelog(index) }} style={{ cursor: 'pointer' }}>
                                                        <path d="M1.55005 5.24756H3.65005H20.4501" stroke="#808B93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M6.79978 5.24687V3.14687C6.79978 2.58992 7.02103 2.05578 7.41486 1.66195C7.80868 1.26812 8.34283 1.04688 8.89978 1.04688H13.0998C13.6567 1.04688 14.1909 1.26812 14.5847 1.66195C14.9785 2.05578 15.1998 2.58992 15.1998 3.14687V5.24687M18.3498 5.24687V19.9469C18.3498 20.5038 18.1285 21.038 17.7347 21.4318C17.3409 21.8256 16.8067 22.0469 16.2498 22.0469H5.74978C5.19283 22.0469 4.65868 21.8256 4.26486 21.4318C3.87103 21.038 3.64978 20.5038 3.64978 19.9469V5.24687H18.3498Z" stroke="#808B93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M11.0001 10.4971V16.7971" stroke="#808B93" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg> */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" onClick={() => { Delete_changelog(index) }} fill="black">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.89978 1.92188C8.57488 1.92188 8.2633 2.05094 8.03359 2.28066L8.03358 2.28067C7.80384 2.51041 7.67478 2.82199 7.67478 3.14687V4.37187H14.3248V3.14687C14.3248 2.82204 14.1957 2.51043 13.966 2.28064C13.7363 2.05095 13.4247 1.92188 13.0998 1.92188H8.89978ZM16.0748 4.37187V3.14687C16.0748 2.3578 15.7613 1.60113 15.2034 1.04326C14.6455 0.485289 13.8887 0.17188 13.0998 0.17188H8.89978C8.11078 0.17188 7.35406 0.485298 6.79613 1.04324C6.23822 1.60115 5.92478 2.35785 5.92478 3.14687V4.37187H3.64978C3.63803 4.37187 3.62634 4.3721 3.61471 4.37256H1.55005C1.0668 4.37256 0.675049 4.76431 0.675049 5.24756C0.675049 5.73081 1.0668 6.12256 1.55005 6.12256H2.77478V19.9469C2.77478 20.7358 3.08821 21.4926 3.64617 22.0505C4.20403 22.6084 4.96072 22.9219 5.74978 22.9219H16.2498C17.0388 22.9219 17.7955 22.6084 18.3534 22.0505C18.9113 21.4926 19.2248 20.7359 19.2248 19.9469V6.12256H20.4501C20.9333 6.12256 21.3251 5.73081 21.3251 5.24756C21.3251 4.76431 20.9333 4.37256 20.4501 4.37256H18.3849C18.3732 4.3721 18.3615 4.37187 18.3498 4.37187H16.0748ZM4.52478 19.9469V6.12256H17.4748V19.9469C17.4748 20.2717 17.3457 20.5834 17.116 20.8131C16.8863 21.0428 16.5746 21.1719 16.2498 21.1719H5.74978C5.42494 21.1719 5.11333 21.0428 4.88356 20.8131L4.26572 21.4309L4.88355 20.8131C4.65385 20.5834 4.52478 20.2718 4.52478 19.9469ZM11.8751 10.4971C11.8751 10.0139 11.4833 9.6221 11.0001 9.6221C10.5169 9.6221 10.1251 10.0139 10.1251 10.4971V16.7971C10.1251 17.2803 10.5169 17.6721 11.0001 17.6721C11.4833 17.6721 11.8751 17.2803 11.8751 16.7971V10.4971Z" />
                                                    </svg>
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
                                <div className="wb-quickedit-footer">
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