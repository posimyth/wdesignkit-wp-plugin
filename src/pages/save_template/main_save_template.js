import './save_template.scss';
import React, { useEffect, useState } from "react";
import SaveTemplateSkeleton from './save_template_skeleton';
const { Fragment } = wp.element;
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { WkitLoader } from '../../helper/helper-function';

const {
    get_userinfo,
    form_data,
    Add_workspace,
    loadingIcon,
    select_WorkSpace,
    wkit_getCategoryList,
    wkit_get_user_login,
} = wp.wkit_Helper

const {
    __,
} = wp.i18n;

const Save_template = (props) => {

    const navigation = useNavigate();

    let data = wkit_get_user_login()
    if (!data) {
        props.wdkit_Login_Route('save_template');
        return <Navigate to='/login' />
    }

    /** Ajax/Api Call*/
    const OnSaveTemplate = async (query) => {

        if (!query) return;

        let userEmail = '',
            loginData = wkit_get_user_login();

        if (loginData && loginData.user_email) {
            userEmail = loginData.user_email
        }

        let form_arr = {
            'type': 'save_template',
            'email': userEmail,
            'builder': window.wdkit_editor
        }

        form_arr = Object.assign({}, form_arr, query)

        let result = await form_data(form_arr).then((res) => {
            if (res?.data?.success) {
                props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'success']);
                return res;
            } else {
                props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'success']);
                return res;
            }
        })

        return result;
    };

    const location = useLocation();

    const [select_type, setSelectType] = useState("my_upload");
    const [save_section, setsave_section] = useState(false);
    const [temp_name, setTempName] = useState("");
    const [temp_type, setTempType] = useState('pagetemplate');
    const [category, setCategory] = useState("");
    const [pluginCheck, setPluginCheck] = useState([]);
    const [errorTextMsg, setErrorTextmsg] = useState("");
    const [errorSelectMsg, setErrorSelectmsg] = useState("");
    const [userData, setUserData] = useState("loading");
    const [categoryData, setCategoryData] = useState("");
    const [selectWork, setSelectWork] = useState([]);
    const [successMsg, setSuccessMsg] = useState(false);
    const [isSaving, setSaving] = useState(false);
    const [isaddWs, setaddWS] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [errorMsg, setErorrMsg] = useState("");
    const [save_id, setsave_id] = useState("");
    const [save_editurl, setsave_editurl] = useState("");

    useEffect(() => {

        if (location.pathname && location.pathname.search('save_template') > -1) {
        } else {
            navigation('/save_template')
        }
    }, [])

    /** Default select Elementor plugin if user save template from Elementor page */
    useEffect(() => {
        if (window.wdkit_editor == 'elementor') {
            if (userData?.plugin?.length > 0) {
                let index = userData?.plugin.findIndex((id) => id.original_slug == 'elementor')
                if (index > -1) {
                    setPluginCheck([userData?.plugin[index].p_id])
                }
            }
        }
    }, [window.wdkit_editor, userData?.plugin])

    /** to set poper path for save-template */
    useEffect(() => {

        if (location.pathname && location.pathname == '/save_template/section') {
            setTempType('section');
            setsave_section(true)
        } else {
            setTempType('pagetemplate');
        }
    }, [location.pathname])

    /** get meta data from redux */
    useEffect(() => {
        setLoading(true);
        setUserData(props.wdkit_meta);

        if (props?.wdkit_meta?.category && props?.wdkit_meta?.userinfo) {
            setCategoryData(wkit_getCategoryList(props.wdkit_meta.category))
            setLoading(false);
        }

        setSelectWork(select_WorkSpace(props?.wdkit_meta, '', 'all'))
    }, [props.wdkit_meta]);

    /** for remove success message popup after save template */
    const Wkit_popup_remove = () => {
        document.querySelector('.wkit-sucessfully-save-to-cloud.wkit-popup-show').classList.remove('wkit-popup-show');
        if (select_type == 'my_upload') {
            navigation(`/my_uploaded?${temp_type}`)
        } else {
            navigation('/manage_workspace/workspace_template/' + Number(select_type))
        }
    }

    /** main function to save template on server */
    const clickData = async () => {
        setErrorTextmsg('')
        setErrorSelectmsg('')

        if (!temp_name) {
            setErrorTextmsg('wkit-error-red');

            props.wdkit_set_toast(['Enter Template Name', 'Title can not be empty!', '', 'danger']);
            return;
        }

        if (!select_type) {
            setErrorSelectmsg('wkit-error-red')
            return;
        }

        let content = '',
            data = {},
            settings = {};

        if (window.wdkit_editor == 'gutenberg') {
            if (save_section) {
                content = localStorage.getItem("wdkit_section");
            } else {
                content = await wp.data.select("core/editor").getEditedPostContent()
            }

            data = {
                'file_type': 'wp_block',
                title: temp_name,
                content: content,
            };
        } else if (window.wdkit_editor == 'elementor') {
            let temp_type = '';
            if (save_section) {
                content = localStorage.getItem("wdkit_section");
                content = [JSON.parse(content)]
            } else {
                var win,
                    ele,
                    preview,
                    element,
                    firstEle,
                    config, doc, library,
                    getData = null;
                if (window && (win = window)) {
                    if (win && (ele = win.elementor)) {
                        if (ele && (preview = ele.previewView)) {
                            if (preview && (element = preview.el)) {
                                if (element && (firstEle = element.firstElementChild)) {
                                    if (firstEle) {
                                        getData = firstEle
                                    }
                                }
                            }
                        }
                    }
                }

                if (getData != null) {
                    if (ele) {
                        if (config = ele.config) {
                            if (config !== null && (doc = config.document)) {
                                if (null != getData && getData.model) {
                                    content = [getData.model.toJSON({
                                        remove: ["default"],
                                    }),]
                                } else {
                                    content = ele.elements.toJSON({
                                        remove: ["default"],
                                    });

                                    if (window.elementor.documents) {
                                        var documents = window.elementor.documents
                                        if (documents.getCurrent()) {
                                            var current = documents.getCurrent()
                                            temp_type = (current && current.config && current.config.type) ? current.config.type : '';
                                            if (current.container && current.container.settings) {
                                                settings = current.container.settings.toJSON({
                                                    remove: ['default']
                                                })
                                                settings.post_status = 'publish';
                                                settings.post_title = temp_name;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            data = {
                'file_type': 'elementor',
                title: temp_name,
                content: content,
                el_type: temp_type,
                settings: settings,
            };
        }

        if (!content || !data) {
            setErorrMsg("Page Content is empty")
            return;
        }

        setSaving(true)

        /**Call Function*/
        var result = await OnSaveTemplate(
            {
                'title': temp_name,
                'type_upload': select_type,
                'template_type': temp_type,
                'wp_post_type': wdkitData.post_type || 'page',
                'category': category,
                'data': JSON.stringify(data),
                'plugins': JSON.stringify(pluginCheck)
            }
        );

        let TemplateID = (result.data && result.data.id) ? result.data.id : '';
        let TemplateEditUrl = (result.data && result.data.editpage) ? result.data.editpage : '';

        setsave_id(TemplateID)
        setsave_editurl(TemplateEditUrl)

        if (result && result.success) {
            await get_userinfo().then(res => props.wdkit_set_meta(res.data))
            setSuccessMsg(true)

            setTimeout(() => {
                setSuccessMsg(false);
            }, 5000);
        }

        setSaving(false)
    }

    /** to handle check and uncheck event for selected plugin */
    const handlePluginChecked = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setPluginCheck([...pluginCheck, value]);
        } else {
            setPluginCheck(pluginCheck.filter((e) => e !== value));
        }
    }

    /** Popup for successfully upload message */
    const Acknowlage_popup = () => {

        return (
            <div className="wkit-model-transp wkit-sucessfully-save-to-cloud wkit-popup-show">
                <div className='wkit-plugin-model-content'>
                    <a className="wkit-plugin-popup-close" onClick={() => { Wkit_popup_remove(); }}>&times;</a>
                    <div className='wkit-successfully-imported'>
                        <div><img src={wdkitData.WDKIT_URL + "assets/images/jpg/successfully.png"} alt="gutenberg" /></div>
                        <div className="wkit-text-center">
                            <div className="wkit-success-heading">{__('Successfully Uploaded')}</div>
                            <div className="wkit-desc">{__('To Edit fully visit WdesignKit admin and make it live.')}</div>
                        </div>
                        {save_id &&
                            <button type='submit' className='wkit-save-btn'>
                                <a href={save_editurl} target="_blank" rel="noopener noreferrer">{__('Edit Fully')}</a>
                            </button>
                        }
                    </div>
                </div>
            </div>
        );
    }

    /** plugin selectiom list for template or section */
    const Plugin_selection = () => {
        if (userData?.plugin?.length > 0) {
            return (
                <Fragment>
                    <label className={"wkit-label-heading"}>{__('Plugins Used')}</label>
                    <div className='wkit-save-plugin-wrapper'>
                        {Object.values(userData?.plugin).map((data, index) => {
                            if (window.wdkit_editor != 'wdkit') {
                                if (window.wdkit_editor == 'elementor') {
                                    var builder_id = '1001';
                                } else if (window.wdkit_editor == 'gutenberg') {
                                    var builder_id = '1002';
                                }
                                if (builder_id == data.plugin_builder || data.plugin_builder == 0) {
                                    return (
                                        <div className="wkit-plugin-list" key={index}>
                                            <input type="checkbox" id={"plugin_" + data.p_id} name={"selectPlugin"} className='save-wkit-check' value={data.p_id} onChange={handlePluginChecked} checked={pluginCheck.includes(data.p_id) ? true : null} />
                                            <label htmlFor={"plugin_" + data.p_id}>
                                                <div className="wkit-plugin-image">
                                                    <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} style={{ width: '30px' }} alt="wkit-logo-img" />
                                                </div>
                                                <div className="wkit-plugin-text">{data.plugin_name}</div>
                                            </label>
                                        </div>
                                    );
                                }
                            } else {
                                return (
                                    <div className="wkit-plugin-list" key={index}>
                                        <input type="checkbox" id={"plugin_" + data.p_id} name={"selectPlugin"} className='save-wkit-check' value={data.p_id} onChange={handlePluginChecked} />
                                        <label htmlFor={"plugin_" + data.p_id}>
                                            <div className="wkit-plugin-image">
                                                <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} style={{ width: '30px' }} alt="wkit-logo-img" />
                                            </div>
                                            <div className="wkit-plugin-text">{data.plugin_name}</div>
                                        </label>
                                    </div>
                                );

                            }
                        })
                        }
                    </div>
                </Fragment>
            );
        } else {
            if (userData?.plugin?.length == 0) {
                return <div className={'wkit-no-template-data'}>{__('No Plugin List')}</div>
            } else {
                return <div className={'wkit-save-skeleton'}><SaveTemplateSkeleton /></div>
            }

        }
    }

    return (
        <>
            {Loading &&
                <div className={'wkit-save-skeleton'}>
                    {/* {loadingIcon()} */}
                    <SaveTemplateSkeleton />
                </div>
            }
            {!Loading &&
                <div className="wkit-select-main">
                    <div className={"wkit-save-heading"}>{__('Save Template')}</div>
                    <div className={"wkit-select-template"}>
                        <div className={"wkit-col wkit-flex-wrap-none wkit-col-gap"}>
                            <div className='kit-field-wrap'>
                                <label className={"wkit-label-heading"}>{__("Template Name")}</label>
                                <input type={"text"} placeholder={__('Enter Template Name')} className={"wkit-input-filed " + errorTextMsg} value={temp_name} onChange={(ev) => setTempName(ev.target.value)} />
                            </div>
                            <div className='kit-field-wrap'>
                                <label className={"wkit-label-heading"}>{__("Select Workspace")}</label>
                                <div className='wkit-saveTemplate-dowpDown'>
                                    <select className={"wkit-select " + errorSelectMsg} value={select_type} onChange={(ev) => setSelectType(ev.target.value)}>
                                        <option value={'my_upload'}>{__('My Upload')}</option>
                                        <optgroup label={__("My Workspace")}>
                                            {selectWork &&
                                                selectWork.map((item, index) => {
                                                    return <option key={index} value={item.w_id}>{item.title}</option>
                                                })
                                            }
                                        </optgroup>
                                    </select>
                                    <svg width="12" height="10" viewBox="0 0 12 8" fill="#878787" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={"wkit-col wkit-flex-wrap-none wkit-col-gap"}>
                            <div className='kit-field-wrap'>
                                <label className={"wkit-label-heading"}>{__("Template Type")}</label>
                                <div className='wkit-saveTemplate-dowpDown'>
                                    <select className={"wkit-select " + errorSelectMsg} value={temp_type} onChange={(ev) => { setTempType(ev.target.value), setCategory('') }}>
                                        <option value={'pagetemplate'}>{__('Page Template')}</option>
                                        <option value={'section'}>{__('Section')}</option>
                                    </select>
                                    <svg width="12" height="10" viewBox="0 0 12 8" fill="#878787" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z" />
                                    </svg>
                                </div>
                            </div>
                            <div className='kit-field-wrap'>
                                <label className={"wkit-label-heading"}>{__("Category")}</label>
                                <div className='wkit-saveTemplate-dowpDown'>
                                    <select className={"wkit-select"} value={category} onChange={(ev) => setCategory(ev.target.value)}>
                                        <option value={''}>{__('Select Category')}</option>
                                        {temp_type == 'pagetemplate' && categoryData &&
                                            Object.entries(categoryData['Page Templates']).map(([key, val], index) => {
                                                return <option key={index} value={val.term_id}>{val.term_name}</option>
                                            })
                                        }
                                        {temp_type == 'section' && categoryData &&
                                            Object.entries(categoryData['Sections']).map(([key, val], index) => {
                                                return <option key={index} value={val.term_id}>{val.term_name}</option>
                                            })
                                        }
                                    </select>
                                    <svg width="12" height="10" viewBox="0 0 12 8" fill="#878787" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.87998 1.28957L5.99998 5.16957L2.11998 1.28957C1.72998 0.89957 1.09998 0.89957 0.70998 1.28957C0.31998 1.67957 0.31998 2.30957 0.70998 2.69957L5.29998 7.28957C5.68998 7.67957 6.31998 7.67957 6.70998 7.28957L11.3 2.69957C11.69 2.30957 11.69 1.67957 11.3 1.28957C10.91 0.90957 10.27 0.89957 9.87998 1.28957Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <a className={"wkit-workspace"} onClick={() => setaddWS(!isaddWs)}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M8 0H6V6H0V8H6V14H8V8H14V6H8V0Z" fill="#040483" />
                            </svg>
                            {__('Add New Workspace')}
                        </a>
                    </div>
                    {isaddWs &&
                        <Add_workspace
                            type={'saveTemp'}
                            closePopUp={() => { setaddWS(false) }}
                            UpdateUserData={(res) => { props.wdkit_set_meta(res.data) }}
                            setLoading={(val) => { (setLoading(val)) }}
                            Toast={(title, subTitle, type) => props.wdkit_set_toast([title, subTitle, '', type])}
                        />
                    }
                    {Plugin_selection()}
                    {errorMsg != '' &&
                        <div className={'wkit-error-msg wkit-mb-10 wkit-mt-15 text-center'}>{errorMsg}</div>
                    }
                    <div className='wkit-btn-right'>
                        {isSaving ?
                            <button type="button" className={"wkit-save-btn"} >{WkitLoader()}</button>
                            :
                            <button type="button" className={"wkit-save-btn"} onClick={() => clickData()}>{__('Save Template')}</button>
                        }
                    </div>
                    {successMsg &&
                        Acknowlage_popup()
                    }
                </div>
            }
        </>
    );
}

export default Save_template;