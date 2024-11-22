import './myuploaded.scss';
import { useState, useEffect } from 'react';
const { Fragment } = wp.element;
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { Page_header, Wkit_availble_not, Wkit_template_Skeleton } from '../../helper/helper-function';
import { WKit_successfully_import_kit } from '../../helper/helper-function';

const {
    __,
} = wp.i18n;

const {
    form_data,
    Success_import_template,
    Template_loop,
    Plugin_missing,
    checkBuilder,
    loadingIcon,
    wkit_get_user_login
} = wp.wkit_Helper;

const Kit_Page = (props) => {
    const params = useParams();
    const location = useLocation();
    const navigation = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const yourQueryParam = queryParams.get('page');
    const yourQueryParamWSID = queryParams.get('wsID');

    const [kitData, setKitData] = useState("loading");
    const [downTempId, setDownloadTempId] = useState('');
    const [successImport, setSuccessImport] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [downloadMulti, setDownloadMulti] = useState({ 'pages': [], 'sections': [] });
    const [customMetaImport, setCustomMetaImport] = useState(false);
    const [loading, setloading] = useState(false);

    var builder_array = props.wdkit_meta?.builder ? props.wdkit_meta.builder : [];

    const kitDataApi = async (query) => {

        if (!query) return;
        let loginData = wkit_get_user_login()
        let userEmail = ''
        if (loginData && loginData.user_email) {
            userEmail = loginData.user_email
        }
        let form_arr = { 'type': 'kit_template', 'builder': window.wdkit_editor }
        form_arr = Object.assign({}, form_arr, query)
        let kit_data = await form_data(form_arr);
        if (kit_data?.success) {

            let images = Object.entries(kit_data?.kitimages);
            let responsiveImages = Object.entries(kit_data?.responsive_image);
            let templates = kit_data?.template;

            let final_data = [];

            if (templates?.length > 0) {
                await templates.map((data) => {
                    let index = images.findIndex((id) => id[0] == data.id)
                    let resImgIndex = responsiveImages.findIndex((id) => id[0] == data.id)
                    if (index > -1) {
                        let temp_data = Object.assign({}, data, { 'post_image': images[index][1], 'responsive_image': responsiveImages[resImgIndex][1] })
                        final_data.push(temp_data);
                    } else {
                        final_data.push(data);
                    }
                })
            }
            var kit_array = Object.assign({}, kit_data, { 'template': final_data })
        } else {
            var kit_array = [];
        }

        await setloading(false);
        return kit_array;
    };



    /**
     * Default all selected when page load
     * 
     * @since 1.0.23
     *
     */

    useEffect(() => {
        if (kitData !== 'loading') {
            SelectAllTemp()
        }
    }, [kitData])

    /** Get kit data from redux  */
    useEffect(() => {
        setloading(true);
        if (params && params.kit_id) {
            kitDataApi({ 'template_id': params.kit_id }).then(async (result) => {
                await Check_temp_status(result)
            })
        }
    }, []);

    /** list of template which are public or user's own template */
    const Check_temp_status = async (k_data) => {

        let temp_list = k_data?.template;
        let final_array = [];
        temp_list && temp_list.map(async (temp) => {
            if (temp.post_status == "publish") {
                final_array.push(temp);
            } else {
                if (props?.wdkit_meta?.userinfo?.id && temp.user_id == props?.wdkit_meta?.userinfo?.id) {
                    final_array.push(temp);
                }
            }
        })

        let f_data = Object.assign({}, k_data.data, { 'template': final_array });
        let kitdata = Object.assign({}, k_data, { 'data': f_data });

        await setKitData(kitdata);
    }

    const updateFavorite = (val) => {
        kitData.data.favorite = val;
        setKitData(kitData)
    }

    const GetFirstpathName = () => {
        let pathArray = location.pathname.split('/');
        if (pathArray[1] == 'manage_workspace') {
            return 'manage_workspace/workspace_template/' + yourQueryParamWSID;
        } else {
            return pathArray[1];
        }
    }

    /** remove download popup */
    const Wkit_popup_remove = (e) => {
        if (e) {
            e.currentTarget.closest('.wkit-model-transp.wkit-popup-show').innerHTML = '';
            setDownloadTempId('')
            setSuccessImport(false)
        }
    }

    useEffect(() => {
        if (kitData?.data?.template?.length > 0) {
            let totalTemp = kitData?.data?.template?.length;
            let selectedTemp = (downloadMulti.pages.length + downloadMulti.sections.length);
            let activatedTemp = kitData?.data?.template?.map(template => template.is_activated);
            let activetedPage = Array.isArray(kitData?.data?.pages) ? kitData?.data?.pages.map(pages => pages.is_activated) : [];
            let totalActived = [...activatedTemp, ...activetedPage];
            let totalActivedCount = totalActived.filter(item => item == 'active').length;
            if (totalTemp == selectedTemp || totalActivedCount == selectedTemp) {
                setSelectAll(true)
            } else {
                setSelectAll(false)
            }
        } else {
            setSelectAll(false)
        }

    }, [downloadMulti])

    /**Select All fuction */
    const SelectAllTemp = () => {
        const totalTemplates = kitData?.data?.template?.length;
        const selectedTemplates = downloadMulti.pages.length + downloadMulti.sections.length;
        const totalActiveTemplates = kitData?.data?.template?.filter(template => template.is_activated === 'active').length;

        if (selectAll || (totalActiveTemplates === selectedTemplates)) {
            setDownloadMulti({ pages: [], sections: [] });
        } else {
            const all_data = kitData?.data?.template;
            const templates = [];
            const sections = [];
            all_data.forEach((data) => {
                if (data.type === 'section' && data.is_activated == 'active') {
                    sections.push(data);
                } else if (data.type === 'pagetemplate' && data.is_activated == 'active') {
                    templates.push(data);
                }
            });
            setDownloadMulti({ 'pages': templates, 'sections': sections });
        }
    };

    /**Select All fuction */
    const SelectAllHTML = () => {
        return (
            <div className='wkit-kit-selectAll-btn'>
                <input
                    id='wkit-selectAll-kitTemp'
                    className='wkit-selectAll-check-box'
                    type='checkbox'
                    checked={selectAll}
                    onChange={() => { SelectAllTemp() }} />
                <label htmlFor='wkit-selectAll-kitTemp'>{__('Select All')}</label>
            </div>
        );
    };

    /** multiselect operation for tamplates */
    const multiSelect = (data, action) => {
        if (data && action == 'add') {
            if (data.type == 'pagetemplate') {
                downloadMulti.pages.push(data);
                setDownloadMulti({ 'pages': downloadMulti.pages, 'sections': downloadMulti.sections })
            } else if (data.type == 'section') {
                downloadMulti.sections.push(data);
                setDownloadMulti({ 'pages': downloadMulti.pages, 'sections': downloadMulti.sections })
            }
        } else if (data && action == 'remove') {
            if (data.type == 'pagetemplate') {
                setDownloadMulti({ 'pages': downloadMulti.pages.filter((e) => e.id != Number(data.id)), 'sections': downloadMulti.sections })
            } else if (data.type == 'section') {
                setDownloadMulti({ 'pages': downloadMulti.pages, 'sections': downloadMulti.sections.filter((e) => e.id != Number(data.id)) })
            }
        }
    }

    const handleSuccessFun = (val, customMeta) => {
        setDownloadTempId(Object.assign({}, downTempId))
        setCustomMetaImport(customMeta)
        setSuccessImport(val)
    }

    /** download selected template from kit */
    const DownloadTemp = () => {
        setDownloadTempId(downloadMulti)
    }

    return (
        <div className="wkit-myupload-main">
            <div className='wkit-kit-header'>
                <div className='wkit-header-content-inner'>
                    <div className='wkit-kit-header-back'>
                        <div onClick={() => { navigation(window.history.back()) }}>
                            <div className='wkit-kit-header-backbtn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M19 12H5" stroke="#C22076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19L5 12L12 5" stroke="#C22076" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <Page_header
                        loader={loading}
                        title={kitData?.kitdata?.title}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ width: '28px', minWidth: '22px' }}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.82914 8.8996L18.0599 6.27202C18.5305 6.16194 18.9808 6.51905 18.9808 7.0023V28.9997C18.9808 29.483 18.5305 29.8401 18.0599 29.73L6.82914 27.1025C6.48991 27.0231 6.25 26.7206 6.25 26.3722V9.62988C6.25 9.28149 6.48991 8.97897 6.82914 8.8996ZM4 9.62988C4 8.23631 4.95964 7.02623 6.31657 6.70876L17.5473 4.08119C19.4295 3.64083 21.2308 5.06931 21.2308 7.0023V7.24968H21.3262H28.9992C30.6561 7.24968 31.9992 8.59282 31.9992 10.2497V25.7502C31.9992 27.4071 30.6561 28.7502 28.9992 28.7502H21.3262H21.2308V28.9997C21.2308 30.9327 19.4295 32.3612 17.5473 31.9209L6.31657 29.2933C4.95964 28.9758 4 27.7657 4 26.3722V9.62988ZM21.3262 9.49968H28.9992C29.4135 9.49968 29.7492 9.83546 29.7492 10.2497V25.7502C29.7492 26.1644 29.4135 26.5002 28.9992 26.5002H21.3262V9.49968Z" fill="#040483" />
                        </svg>}
                        custom_dropdown={() => SelectAllHTML()}
                    />
                </div>
                {loading == false && kitData?.data?.template?.length > 0 && (downloadMulti?.pages?.length > 0 || downloadMulti?.sections?.length > 0) &&
                    <div className='wkit-download-all-temp wkit-btn-class' onClick={() => { DownloadTemp() }}>{'Download ( ' + (downloadMulti?.pages?.length + downloadMulti?.sections?.length) + '/' + (kitData?.data?.template?.length ? kitData?.data?.template?.length : 0) + ' )'}</div>
                }
            </div>
            {/* template design */}
            <div className="wdkit-loop">
                {(loading == false && kitData?.data?.template?.length > 0) && builder_array &&
                    <div className="wdesign-kit-main">
                        {Object.values(kitData.data.template).map((data, index) => {
                            return (
                                <Fragment key={index}>
                                    {(checkBuilder(data.post_builder, 'all', builder_array)) &&
                                        <Template_loop
                                            handler={(val) => updateFavorite(val)}
                                            handlerTempID={(val) => setDownloadTempId(val)}
                                            credits={props?.wdkit_meta?.credits}
                                            data={data}
                                            setLoading={(val) => { setloading(val) }}
                                            UpdateUserData={(val) => (props.wdkit_set_meta(val.data))}
                                            userinfo={props?.wdkit_meta?.userinfo}
                                            builder={props?.wdkit_meta?.builder}
                                            checklist={downloadMulti}
                                            favorite={kitData.data.favorite || []}
                                            type={'websitekit'}
                                            handlerMultiSelect={(data, action) => { multiSelect(data, action) }}
                                        />
                                    }
                                </Fragment>
                            );
                        })}
                    </div>
                }
                {loading == true &&
                    <Wkit_template_Skeleton />
                }
                {loading == false && (kitData?.data?.template == undefined || kitData?.data?.template?.length <= 0) &&
                    <Wkit_availble_not page={'template'} link={wdkitData.WDKIT_DOC_URL + 'documents/create-pagekit-from-sections-and-full-pages-for-elementor-or-gutenberg/'} />
                }
            </div>
            {
                downTempId &&
                <div className={"wkit-model-transp wkit-popup-show"} >
                    <div className={"wkit-plugin-model-content wkit-import-template"}>
                        <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e); setSuccessImport(false); setDownloadTempId(""); }}>
                            <span>
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                            </span>
                        </a>
                        {!successImport ?
                            <Plugin_missing
                                template_id={downTempId}
                                handlerSuccessImport={(val, customMeta) => handleSuccessFun(val, customMeta)}
                                type={"kit_page"}
                                templateData={kitData.data.template}
                                pluginData={props?.wdkit_meta?.plugin}
                            />
                            :
                            <WKit_successfully_import_kit
                                kit_id={params.kit_id}
                                template_id={downloadMulti}
                                custom_meta_import={customMetaImport}
                                template_list={kitData?.data?.template}
                                handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId('') }}
                            />
                        }
                    </div>
                </div>
            }
        </div >
    );
}

export default Kit_Page;