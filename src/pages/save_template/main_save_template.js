import './save_template.scss';
import React, { useEffect, useState } from "react";
import SaveTemplateSkeleton from './save_template_skeleton';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Template_loop, WkitLoader } from '../../helper/helper-function';

const { Fragment } = wp.element;

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
        props.wdkit_Login_Route('/save_template');

        return <Navigate to='/login' />
    }

    const location = useLocation();
    var img_path = wdkitData.WDKIT_URL;

    const [isChecked, setChecked] = useState(false);
    const [select_type, setSelectType] = useState("my_upload");
    const [save_section, setsave_section] = useState(false);
    const [temp_name, setTempName] = useState("");
    const [find_template, setfind_template] = useState("");
    const [FindTemplateList, setFindTemplateList] = useState([]);
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
    const [save_id, setsave_id] = useState("");
    const [save_editurl, setsave_editurl] = useState("");
    const [tempLoader, setTempLoader] = useState(false);
    const [onloadState, setonloadState] = useState(false);
    const [selectedTemplate, setselectedTemplate] = useState('');
    const [replacingTemp, setreplacingTemp] = useState(false);
    const [searchTemp, setsearchTemp] = useState('');
    const [confirmPopup, setconfirmPopup] = useState('');

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

    useEffect(() => {
        if (location.pathname && location.pathname.search('save_template') > -1) {
        } else {
            navigation('/save_template')
        }
    }, [])

    useEffect(() => {
        if (isChecked) {
            FindExistingTemp();
        }
    }, [isChecked])

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
    const clickData = async (save_type) => {
        setErrorTextmsg('')
        setErrorSelectmsg('')

        if ((save_type == 'new_temp') && !temp_name) {
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
            props.wdkit_set_toast(['Page Content is empty', 'Page should have some content', '', 'danger'])
            return;
        }

        setSaving(true)

        /**Call Function*/
        if ('new_temp' == save_type) {
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
        } else if ('replace_temp' == save_type) {
            var result = await ReplaceTemp(JSON.stringify(data));
            return;
        }

        let TemplateID = (result.data && result.data.id) ? result.data.id : '';
        let TemplateEditUrl = (result.data && result.data.editpage) ? result.data.editpage : '';

        setsave_id(TemplateID)
        setsave_editurl(TemplateEditUrl)

        if (result && result.success) {
            await get_userinfo().then(res => props.wdkit_set_meta(res.data))
            setSuccessMsg(true)

            setTimeout(() => {
                setSuccessMsg(false);
                navigation(`/my_uploaded?${temp_type}`)
            }, 5000);
        }

        setSaving(false)
    }

    const ReplaceTemp = async (temp_data) => {

        let loginData = wkit_get_user_login();

        let form_arr = {
            'type': 'update_template',
            'token': loginData.token,
            'data': temp_data,
            'id': selectedTemplate.id,
        }

        form_arr = Object.assign({}, form_arr)

        let result = await form_data(form_arr).then((res) => {
            if (res?.data?.success) {
                props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'success']);
                setreplacingTemp(false);
                setconfirmPopup(false);
                navigation(`/my_uploaded`)

                return res;
            } else {
                props.wdkit_set_toast([res?.data?.message, res?.data?.description, '', 'success']);
                setreplacingTemp(false);
                setconfirmPopup(false);
                return res;
            }
        })

        return result;
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
                    <a className="wkit-plugin-popup-close" onClick={() => { Wkit_popup_remove(); }}>
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                    </a>
                    <div className="popup-header">Upload Template</div>
                    <div className='wkit-successfully-imported'>
                        <svg class="wkit-success-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M37.8721 23.3124L37.8604 23.3181C36.4893 24.3696 35.9084 26.1589 36.3965 27.8147L36.4022 27.8263C37.1807 30.4581 35.252 33.1129 32.5098 33.1827H32.4982C30.767 33.2292 29.2449 34.3329 28.6697 35.9654V35.9712C27.7518 38.5622 24.6264 39.5788 22.3664 38.016C20.9632 37.0578 19.1081 37.0078 17.6317 38.016H17.6259C15.3661 39.573 12.2405 38.5621 11.3284 35.9653C10.7481 34.3288 9.22824 33.229 7.49996 33.1826H7.48832C4.74629 33.1128 2.81746 30.458 3.59598 27.8263L3.60176 27.8146C4.08965 26.1588 3.50871 24.3695 2.13777 23.3181L2.12613 23.3123C-0.052461 21.6391 -0.052461 18.3626 2.12613 16.6895L2.13777 16.6837C3.50871 15.6322 4.08965 13.8428 3.59598 12.1871V12.1755C2.8116 9.54385 4.74621 6.88885 7.48832 6.81916H7.49996C9.22535 6.77267 10.7532 5.66885 11.3284 4.03642V4.03064C12.2404 1.43963 15.3661 0.422987 17.6259 1.9858H17.6317C19.055 2.9676 20.9372 2.9676 22.3664 1.9858C24.6491 0.409471 27.7572 1.45517 28.6697 4.03064V4.03642C29.2449 5.66306 30.7669 6.77275 32.4982 6.81916H32.5098C35.2519 6.88885 37.1807 9.54385 36.4022 12.1755L36.3965 12.1871C35.9084 13.8428 36.4893 15.6322 37.8604 16.6837L37.8721 16.6895C40.0507 18.3626 40.0507 21.6392 37.8721 23.3124Z" fill="#3EB655"></path><path d="M19.9994 30.821C25.976 30.821 30.821 25.976 30.821 19.9994C30.821 14.0227 25.976 9.17773 19.9994 9.17773C14.0227 9.17773 9.17773 14.0227 9.17773 19.9994C9.17773 25.976 14.0227 30.821 19.9994 30.821Z" fill="#8BD399"></path><path opacity="0.1" d="M28.3088 13.0728C26.437 11.533 24.0423 10.6074 21.4316 10.6074C15.4551 10.6074 10.6074 15.4551 10.6074 21.4316C10.6074 24.0423 11.533 26.437 13.0727 28.3088C10.6945 26.325 9.17969 23.3409 9.17969 19.9998C9.17969 14.0231 14.0232 9.17969 19.9998 9.17969C23.3409 9.17969 26.325 10.6945 28.3088 13.0728Z" fill="black"></path><path d="M17.4247 24.2359L15.0317 21.69C14.405 21.0231 14.4373 19.9746 15.104 19.3479C15.7706 18.7204 16.8196 18.7541 17.4458 19.4205L18.5881 20.6353L23.4438 15.0855C24.0457 14.3967 25.0926 14.3269 25.7819 14.9296C26.4706 15.5323 26.5401 16.5789 25.9377 17.2676L19.8787 24.1923C19.2333 24.9292 18.0941 24.9485 17.4247 24.2359Z" fill="white"></path></svg>
                        <div className="wkit-text-center">
                            <div className="wkit-success-heading wkit-get-success">{__('Successfully Uploaded')}</div>
                            <div className="wkit-desc">{__('To Edit fully visit WdesignKit admin and make it live.')}</div>
                        </div>
                        {save_id &&
                            <button type='submit' className='wkit-save-btn wkit-btn-class'>
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

    /**
     * Find Existing Temp
     * 
     * @since 1.0.0
     * @version 1.0.6 
    */
    const FindExistingTemp = async () => {
        setsearchTemp(find_template)
        setselectedTemplate('')
        setTempLoader(true);
        setonloadState(true);
        let loginData = wkit_get_user_login();

        let form_arr = {
            'type': 'find_template',
            'token': loginData?.token,
            'u_id': props?.wdkit_meta?.userinfo?.id,
            'search': find_template,
            'builder': window.wdkit_editor,
            'parpage': 12
        }

        let result = await form_data(form_arr).then((res) => {
            if (res?.data?.success) {
                let data = res?.data?.posts;
                if (data) {
                    setFindTemplateList(res?.data?.posts)
                }
                return res;
            } else {
                return res;
            }
        })

        setTempLoader(false);

    }

    /**
     * Select save template
     * 
     * @since 1.0.0
     * @version 1.0.6 
    */
    const Select_save_template = () => {
        return (
            <div className='wkit-switch-setting-wrap'>
                <div className='wdkit-switch-text' style={{ color: isChecked ? '#19191B' : '#C22076' }}>{__('New Template')}</div>
                <label className="wdkit-switch">
                    <input type="checkbox" checked={isChecked} onChange={() => setChecked(!isChecked)} />
                    <span className="wdkit-slider round"></span>
                </label>
                <div className='wdkit-switch-text' style={{ color: isChecked ? '#C22076' : '#19191B' }}>{__('Existing Template')}</div>
            </div>
        )
    }

    const SelectRpTemp = (temp_id) => {
        if (temp_id && props?.wdkit_meta?.template?.length > 0) {
            let tempList = props?.wdkit_meta?.template;
            let index = tempList.findIndex((id) => id.id == temp_id);

            if (index > -1) {
                let selectedTemp = tempList[index];
                setselectedTemplate(selectedTemp);
            } else {
                setselectedTemplate('');
                props.wdkit_set_toast(['Template Not Found', 'selected Template is Not Found', '', 'danger'])
            }
        }
    }

    const Showtemp = () => {
        let builder = selectedTemplate.post_builder;
        let type = selectedTemplate.type;
        return (
            <Template_loop
                data={selectedTemplate}
                builder={builder}
                currentPage={1}
                type={type == 'websitekit' ? type + '-view' : type}
                width={'24%'}
            />
        );
    }

    const Replace_template = () => {
        return (
            <div className='wkit-model-transp wkit-popup-show'>
                <div className='wkit-plugin-model-content'>
                    <a className={"wkit-plugin-popup-close"} onClick={(e) => { setconfirmPopup(false); }}>
                        <span>
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                        </span>
                    </a>
                    <div className="popup-missing">
                        <div className="popup-header">{__('Please Confirm')}</div>
                        <div className="popup-body">
                            <div className="wkit-popup-content-title">
                                {__('Are you sure you want to replace this template ?')}
                            </div>
                            <div className="wkit-popup-buttons">
                                <button className="wkit-popup-confirm wkit-outer-btn-class" onClick={() => { setconfirmPopup(false); }}>
                                    <span>{__('No')}</span>
                                </button>
                                {replacingTemp ?
                                    <button className="wkit-popup-cancel wkit-btn-class">
                                        {WkitLoader()}
                                    </button>
                                    :
                                    <button className="wkit-popup-cancel wkit-btn-class" onClick={() => { setreplacingTemp(true); clickData('replace_temp') }}>
                                        <span>{__('Yes')}</span>
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const Condition_check = (value) => {
        if (value.length <= 100) {
            return true;
        } else {
            props.wdkit_set_toast(['Limit Reached', 'Limit Reached', '', 'danger'])
            return false;
        }
    }

    const Existing_template = () => {

        return (
            <Fragment>
                <div className={"wkit-existing-template"}>
                    <div className='wkit-search-template'>
                        <label className={"wkit-label-heading"}>{__("Search Template")}</label>
                        <div className='wkit-search-template-input' >
                            <input type="text" placeholder={__('Search Template')} className='wkit-existing-temp-search' value={find_template} onChange={(e) => setfind_template(e.target.value)} />
                            {tempLoader ?
                                <button className="wkit-find-template-btn wkit-btn-class">
                                    {WkitLoader()}
                                </button>
                                :
                                <button type="submit" className="wkit-find-template-btn wkit-btn-class" onClick={() => { FindExistingTemp() }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M21.0004 20.9984L16.6504 16.6484" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            }
                        </div>
                        {onloadState &&
                            <Fragment>
                                <div className='wkit-find-temp-list-content'>
                                    <ul className="wkit-find-temp-list">
                                        <span className='wkit-Flist-notice'>{searchTemp ? `Search "${searchTemp}"` : 'Recently added'}</span>
                                        {tempLoader == false ?
                                            <Fragment>
                                                {FindTemplateList?.length > 0 ?
                                                    FindTemplateList.map((item) => {
                                                        return (
                                                            <li className="kit-page-list" key={item.id} onClick={() => { SelectRpTemp(item.id) }}>
                                                                <div className='wkit-existing-temp-detail'>
                                                                    <img src={item.image_url} alt={item.title} />
                                                                    <span className='section-page-post-type'>{item.title}</span>
                                                                </div>
                                                                <div className='wkit-existing-temp-meta'>
                                                                    <div className="wkit-temp-meta-content">
                                                                        {'section' === item.type ?
                                                                            <img className={"wkit-temp-meta-content-img"} src={img_path + "assets/images/svg/sections.svg"} alt="section" />
                                                                            :
                                                                            ('pagetemplate' === item.type ?
                                                                                <img className={"wkit-temp-meta-content-img"} src={img_path + "assets/images/svg/pages.svg"} alt="page" />
                                                                                :
                                                                                <img className={"wkit-temp-meta-content-img"} src={img_path + "assets/images/svg/websitekit.svg"} alt="kit" />
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={"wkit-temp-meta-content"}>
                                                                        {"publish" === item.post_status ?
                                                                            <img className={"wkit-temp-meta-content-img"} src={img_path + "assets/images/svg/public.svg"} alt="public" />
                                                                            :
                                                                            <img className={"wkit-temp-meta-content-img"} src={img_path + "assets/images/svg/private.svg"} alt="private" />
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })
                                                    :
                                                    <div className='wkit-no-data'>
                                                        <img src={img_path + "assets/images/jpg/empty-dog.png"} alt="no-data" />
                                                        <span>{__('Search Template can not found')}</span>
                                                    </div>
                                                }
                                            </Fragment>
                                            :
                                            WkitLoader()
                                        }
                                    </ul>
                                </div>
                            </Fragment>
                        }
                    </div>
                    <div className='wkit-select-template'>
                        {selectedTemplate ?
                            <div className='wkit-selected-template-content'>
                                <span className='wkit-selected-template-info'>{__('Do you want to replace this?')}</span>
                                <div className='wkit-selected-template'>{Showtemp()}</div>
                                <div className="wkit-quickedit-note">
                                    <span>
                                        <b>{__('Note : ')}</b>{__('Replacing the template will erase the current design. This action cannot be undone, and the old design will be permanently lost.')}
                                    </span>
                                </div>
                            </div>
                            :
                            <div className='wkit-selected-img'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="38" viewBox="0 0 39 38" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M36.5 2H2.5L2.5 36H36.5V2ZM2.5 0C1.39543 0 0.5 0.89543 0.5 2V36C0.5 37.1046 1.39543 38 2.5 38H36.5C37.6046 38 38.5 37.1046 38.5 36V2C38.5 0.895431 37.6046 0 36.5 0H2.5ZM20.0833 12.6667H3.66667V10.6667H35.3333V12.6667H31.5833V21.793C31.5833 22.7514 30.5152 23.3231 29.7177 22.7914L25.8333 20.2019L21.949 22.7914C21.1515 23.3231 20.0833 22.7514 20.0833 21.793V12.6667ZM22.0833 12.6667V20.2981L25.2232 18.2049C25.5927 17.9586 26.074 17.9586 26.4435 18.2049L29.5833 20.2981V12.6667H22.0833ZM9 6.33333C9 6.6555 8.73883 6.91667 8.41667 6.91667C8.0945 6.91667 7.83333 6.6555 7.83333 6.33333C7.83333 6.01117 8.0945 5.75 8.41667 5.75C8.73883 5.75 9 6.01117 9 6.33333ZM10 6.33333C10 7.20778 9.29112 7.91667 8.41667 7.91667C7.54222 7.91667 6.83333 7.20778 6.83333 6.33333C6.83333 5.45888 7.54222 4.75 8.41667 4.75C9.29112 4.75 10 5.45888 10 6.33333ZM14.75 6.91667C15.0722 6.91667 15.3333 6.6555 15.3333 6.33333C15.3333 6.01117 15.0722 5.75 14.75 5.75C14.4278 5.75 14.1667 6.01117 14.1667 6.33333C14.1667 6.6555 14.4278 6.91667 14.75 6.91667ZM14.75 7.91667C15.6245 7.91667 16.3333 7.20778 16.3333 6.33333C16.3333 5.45888 15.6245 4.75 14.75 4.75C13.8755 4.75 13.1667 5.45888 13.1667 6.33333C13.1667 7.20778 13.8755 7.91667 14.75 7.91667ZM6.83333 21.1667C6.83333 20.6144 7.28105 20.1667 7.83333 20.1667H12.1667C12.719 20.1667 13.1667 20.6144 13.1667 21.1667C13.1667 21.719 12.719 22.1667 12.1667 22.1667H7.83333C7.28105 22.1667 6.83333 21.719 6.83333 21.1667ZM7.83333 28.0833C7.28105 28.0833 6.83333 28.531 6.83333 29.0833C6.83333 29.6356 7.28105 30.0833 7.83333 30.0833H26.4167C26.969 30.0833 27.4167 29.6356 27.4167 29.0833C27.4167 28.531 26.969 28.0833 26.4167 28.0833H7.83333Z" fill="#D9D9EC" />
                                </svg>
                            </div>
                        }

                    </div>
                </div>
                {selectedTemplate &&
                    <div className="wkit-replace-button">
                        <button className="wkit-btn-class" onClick={() => { setconfirmPopup(true) }}>{__('Replace')}</button>
                    </div>
                }
            </Fragment>
        )
    }

    return (
        <>
            {Loading &&
                <div className={'wkit-save-skeleton'}>
                    <SaveTemplateSkeleton />
                </div>
            }
            {!Loading &&
                <Fragment>
                    <div className="wkit-select-main">
                        <Select_save_template />
                        <div style={{ display: (isChecked ? '' : 'none') }} >
                            {Existing_template()}
                        </div>
                        <div className='wkit-save-temp-content' style={isChecked ? { display: 'none' } : {}}>
                            <div className={"wkit-save-heading"}>{__('Save Template')}</div>
                            <div className={"wkit-select-template"}>
                                <div className={"wkit-col wkit-flex-wrap-none wkit-col-gap"}>
                                    <div className='kit-field-wrap'>
                                        <label className={"wkit-label-heading"}>{__("Template Name")}</label>
                                        <input type={"text"} placeholder={__('Enter Template Name')}
                                            className={"wkit-input-filed " + errorTextMsg}
                                            value={temp_name}
                                            onChange={(ev) => {
                                                if (Condition_check(ev.target.value)) {
                                                    setTempName(ev.target.value)
                                                }
                                            }} />
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
                            <div className='wkit-btn-right'>
                                {isSaving ?
                                    <button type="button" className={"wkit-save-btn wkit-btn-class"} >{WkitLoader()}</button>
                                    :
                                    <div className={!temp_name.trim() ? 'wkit-disable-btn-class' : ''}>
                                        <button type="button" className={`wkit-save-btn wkit-btn-class`}
                                        disabled={!temp_name.trim() ? true : false}
                                        onClick={() => clickData('new_temp')}>{__('Save Template')}</button>
                                    </div>
                                }
                            </div>
                            {successMsg &&
                                Acknowlage_popup()
                            }
                        </div>
                    </div>
                    {confirmPopup &&
                        <Replace_template />
                    }
                </Fragment>
            }
        </>
    );
}

export default Save_template;