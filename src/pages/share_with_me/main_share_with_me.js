import { useState, useEffect } from 'react';
const { Fragment } = wp.element;
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Wkit_template_Skeleton, wdKit_Form_data, get_user_login, Wkit_availble_not, Show_toast, Widget_card, Page_header } from '../../helper/helper-function';
import Post_notFound from '../reuable/post_notFound';
import ReactPaginate from 'react-paginate';
import './share_with_me.scss'

const {
    __,
} = wp.i18n;
const {
    form_data,
    Template_loop,
    checkBuilder,
    loadingIcon,
    Plugin_missing,
    Success_import_template,
    wkit_get_user_login,
    wkitGetBuilder
} = wp.wkit_Helper;

const Share_with_me = (props) => {

    var img_path = wdkitData.WDKIT_URL;

    let data = wkit_get_user_login()
    if (!data) {
        props.wdkit_Login_Route('share_with_me');
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
    const [loading, setloading] = useState(false);

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
        setuserData(props?.wdkit_meta);
    }, [props?.wdkit_meta])

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
                if (selectType == 'widgets' && res.data?.data?.content) {
                    let widget = res?.data?.content.filter((data) => {
                        if (userData?.Setting[`${builder_name(data.builder)}_builder`]) {
                            return data
                        }
                    })

                    let final_data = Object.assign({}, res.data, { 'content': widget }, { 'total': widget.length })
                    await setShareData(final_data);
                } else {
                    await setShareData(res);
                }

                if (selectType == 'widgets') {
                    const WidgetListdata = async (browse_data) => {
                        if (browse_data) {

                            let array = [];

                            let form_arr = { 'type': 'wkit_get_widget_list' }
                            await wdKit_Form_data(form_arr)
                                .then((response) => {
                                    const data = response;
                                    data.map(async (data) => {
                                        let index = browse_data?.findIndex((id) => id.w_unique == data.widgetdata.widget_id);
                                        if (index > -1) {
                                            array.push(data.widgetdata.widget_id);
                                        }
                                    })
                                })
                            setexistingwidget(array);
                        }
                    }
                    WidgetListdata(shareData?.data?.content)
                }

                let Total = (res?.data?.data?.total) ? res.data.data.total : 0
                settotalpage(Math.ceil(Total / perPage))
            })
        }
        setloading(false);

    };

    /** call function after pagination and filter */
    useEffect(() => {
        sharewithTempApi()
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
            <div className='wkit-custom-dropDown' onClick={(e) => { Drop_down_toggle(e) }} style={{ width: '150px' }}>
                <div className='wkit-custom-dropDown-header'>
                    <label>{selectType}</label>
                    <img src={img_path + 'assets/images/wb-svg/controller-open.svg'} style={{ width: '15px' }} />
                </div>
                <div className='wkit-custom-dropDown-content'>
                    <div className='wkit-drop-down-outer'></div>
                    <div className='wkit-custom-dropDown-options' onClick={(e) => { setselectType('templates') }}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.75 1.25H1.25V3.75H13.75V1.25ZM0 3.75V5V13.75C0 14.4404 0.559644 15 1.25 15H13.75C14.4404 15 15 14.4404 15 13.75V5V3.75V1.25C15 0.559644 14.4404 0 13.75 0H1.25C0.559644 0 0 0.559644 0 1.25V3.75ZM1.25 13.75H13.75V5H1.25L1.25 13.75ZM2.5 7.1875C2.5 7.01491 2.63991 6.875 2.8125 6.875H12.1875C12.3601 6.875 12.5 7.01491 12.5 7.1875V7.8125C12.5 7.98509 12.3601 8.125 12.1875 8.125H2.8125C2.63991 8.125 2.5 7.98509 2.5 7.8125V7.1875ZM3.125 9.375C2.77982 9.375 2.5 9.65482 2.5 10V11.25C2.5 11.5952 2.77982 11.875 3.125 11.875H4.375C4.72018 11.875 5 11.5952 5 11.25V10C5 9.65482 4.72018 9.375 4.375 9.375H3.125ZM6.25 10C6.25 9.65482 6.52982 9.375 6.875 9.375H8.125C8.47018 9.375 8.75 9.65482 8.75 10V11.25C8.75 11.5952 8.47018 11.875 8.125 11.875H6.875C6.52982 11.875 6.25 11.5952 6.25 11.25V10ZM10.625 9.375C10.2798 9.375 10 9.65482 10 10V11.25C10 11.5952 10.2798 11.875 10.625 11.875H11.875C12.2202 11.875 12.5 11.5952 12.5 11.25V10C12.5 9.65482 12.2202 9.375 11.875 9.375H10.625ZM3.125 3.125C3.47018 3.125 3.75 2.84518 3.75 2.5C3.75 2.15482 3.47018 1.875 3.125 1.875C2.77982 1.875 2.5 2.15482 2.5 2.5C2.5 2.84518 2.77982 3.125 3.125 3.125ZM6.25 2.5C6.25 2.84518 5.97018 3.125 5.625 3.125C5.27982 3.125 5 2.84518 5 2.5C5 2.15482 5.27982 1.875 5.625 1.875C5.97018 1.875 6.25 2.15482 6.25 2.5ZM8.125 3.125C8.47018 3.125 8.75 2.84518 8.75 2.5C8.75 2.15482 8.47018 1.875 8.125 1.875C7.77982 1.875 7.5 2.15482 7.5 2.5C7.5 2.84518 7.77982 3.125 8.125 3.125Z" />
                        </svg>
                        <span>Templates</span>
                    </div>
                    <div className='wkit-custom-dropDown-options' onClick={(e) => { setselectType('widgets') }}>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="#19191B" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.78322 0.363656C7.21362 0.0623758 7.78647 0.0623748 8.21687 0.363655L13.4247 4.00912C14.108 4.48746 14.1401 5.48816 13.4887 6.00924L13.2297 6.21642L13.4247 6.35287C14.108 6.83121 14.1401 7.83191 13.4887 8.35299L13.2297 8.56017L13.4247 8.69662C14.108 9.17496 14.1401 10.1757 13.4887 10.6967L11.0155 12.6753L9.06178 14.2383C8.14874 14.9687 6.85135 14.9687 5.93831 14.2383L3.98461 12.6753L1.51138 10.6967C0.860028 10.1757 0.892067 9.17496 1.57542 8.69662L1.77034 8.56017L1.51138 8.35299C0.860028 7.83191 0.892067 6.83121 1.57542 6.35287L1.77034 6.21642L1.51138 6.00924C0.860029 5.48816 0.892066 4.48746 1.57542 4.00912L6.78322 0.363656ZM2.78756 9.37394L2.29224 9.72065L4.76548 11.6992L6.71918 13.2622C7.1757 13.6274 7.82439 13.6274 8.28091 13.2622L10.2346 11.6992L12.7078 9.72066L12.2125 9.37394L11.0155 10.3316L9.06178 11.8945C8.14874 12.625 6.85135 12.625 5.93831 11.8945L3.98461 10.3316L2.78756 9.37394ZM11.0155 7.98783L12.2125 7.03019L12.7078 7.37691L10.2346 9.35549L8.28091 10.9185C7.82439 11.2837 7.1757 11.2837 6.71918 10.9185L4.76548 9.35549L2.29224 7.37691L2.78756 7.03019L3.98461 7.98783L5.93831 9.55079C6.85135 10.2812 8.14874 10.2812 9.06178 9.55079L11.0155 7.98783ZM12.7078 5.03316L7.50004 1.3877L2.29224 5.03316L4.76548 7.01174L6.71918 8.5747C7.1757 8.93992 7.82439 8.93992 8.28091 8.5747L10.2346 7.01174L12.7078 5.03316Z" />
                        </svg>
                        <span>Widgets</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wkit-myupload-main">
            <Page_header
                title={'Shared With Me'}
                svg={<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27 24.121C25.86 24.121 24.84 24.571 24.06 25.276L13.365 19.051C13.44 18.706 13.5 18.361 13.5 18.001C13.5 17.641 13.44 17.296 13.365 16.951L23.94 10.786C24.75 11.536 25.815 12.001 27 12.001C29.49 12.001 31.5 9.99098 31.5 7.50098C31.5 5.01098 29.49 3.00098 27 3.00098C24.51 3.00098 22.5 5.01098 22.5 7.50098C22.5 7.86098 22.56 8.20598 22.635 8.55098L12.06 14.716C11.25 13.966 10.185 13.501 9 13.501C6.51 13.501 4.5 15.511 4.5 18.001C4.5 20.491 6.51 22.501 9 22.501C10.185 22.501 11.25 22.036 12.06 21.286L22.74 27.526C22.665 27.841 22.62 28.171 22.62 28.501C22.62 30.916 24.585 32.881 27 32.881C29.415 32.881 31.38 30.916 31.38 28.501C31.38 26.086 29.415 24.121 27 24.121ZM27 6.00098C27.825 6.00098 28.5 6.67598 28.5 7.50098C28.5 8.32598 27.825 9.00098 27 9.00098C26.175 9.00098 25.5 8.32598 25.5 7.50098C25.5 6.67598 26.175 6.00098 27 6.00098ZM9 19.501C8.175 19.501 7.5 18.826 7.5 18.001C7.5 17.176 8.175 16.501 9 16.501C9.825 16.501 10.5 17.176 10.5 18.001C10.5 18.826 9.825 19.501 9 19.501ZM27 30.031C26.175 30.031 25.5 29.356 25.5 28.531C25.5 27.706 26.175 27.031 27 27.031C27.825 27.031 28.5 27.706 28.5 28.531C28.5 29.356 27.825 30.031 27 30.031Z" fill="#040483" />
                </svg>}
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
                                                    userinfo = {props?.wdkit_meta?.userinfo}
                                                    data={data}
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
                    <Wkit_availble_not page={selectType} />
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
                        <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e), setSuccessImport(false), setDownloadTempId('') }}><span>&times;</span></a>
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
                            nextLabel={">"}
                            pageRangeDisplayed={2}
                            pageCount={totalpage}
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
    );
}

export default Share_with_me;