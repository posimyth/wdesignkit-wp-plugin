import "./myuploaded.scss";
import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Get_site_url, Page_header, Wkit_availble_not, Wkit_template_Skeleton } from "../../helper/helper-function";
import ReactPaginate from "react-paginate";
const { Fragment } = wp.element;
const { __ } = wp.i18n;

const {
    Success_import_template,
    Template_loop,
    Plugin_missing,
    checkBuilder,
    wkit_get_user_login,
    wkitGetBuilder,
} = wp.wkit_Helper;

const MyUploaded = (props) => {

    let data = wkit_get_user_login();
    if (!data) {
        props.wdkit_Login_Route('/my_uploaded');
        return <Navigate to="/login" />;
    }

    let location = useLocation();

    const [tab, setTab] = useState("pagetemplate");
    const [userData, setUserData] = useState("loading");
    const [downTempId, setDownloadTempId] = useState("");
    const [successImport, setSuccessImport] = useState(false);
    const [customMetaImport, setCustomMetaImport] = useState(false);
    const [favoriteActive, setFavActive] = useState(false);
    const [selectBuilder, setSelectBuilder] = useState("all");
    const [loading, setloading] = useState(false);
    const [DataArray, setDataArray] = useState([]);

    //pagination 
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [totalpage, settotalpage] = useState(2);
    const [start_id, setstart_id] = useState();
    const [end_id, setend_id] = useState();

    useEffect(() => {
        if (location.search && location.search != '') {
            setTab(location.search.slice(1))
        } else {
            setTab(tab);
        }
    }, [location.search]);

    let listLength = 0;

    /** Get Redux data for template  */
    useEffect(() => {
        setUserData(props?.wdkit_meta);
        CreateArray();
    }, [props.wdkit_meta]);

    /** set path for my_upload if not set */
    useEffect(() => {
        const updateType = async () => {
            if (location.search) {
                let type = location.search.slice(1);
                await setTab(type);
                window.location.hash = '/my_uploaded'
            }
        }
        updateType();
    }, [])

    /** call api if changes occur in filter or pagination */
    useEffect(() => {
        Update_data();
    }, [tab, DataArray, activePage])

    const yourStateData = location.state;
    useEffect(() => {
        if (yourStateData) {
            setActivePage(yourStateData);
            setTab("websitekit")
        }
    }, [yourStateData]);

    /** set data according to pagination */
    const Update_data = async () => {
        setloading(true);
        if (DataArray[tab] && props?.wdkit_meta?.template) {

            let start_id = (activePage - 1) * perPage;
            let end_id = start_id + perPage;

            await setstart_id(start_id);
            await setend_id(end_id);

            if (favoriteActive) {
                var fav_count = 0;
                userData?.favoritetemplate?.length > 0 && userData?.favoritetemplate.map((t_id) => {
                    let index = DataArray?.[tab]?.length > 0 && DataArray?.[tab].findIndex((data) => data.id == t_id)
                    if (index > -1) {
                        fav_count++;
                    }
                })
                await settotalpage(Math.ceil(fav_count / perPage));
            } else {
                await settotalpage(Math.ceil(DataArray[tab].length / perPage));
            }

            setTimeout(() => {
                setloading(false);
            }, 700);
        }
    }

    /** create separate array for filter */
    const CreateArray = async () => {
        let array = props?.wdkit_meta?.template;
        let template_array = [];
        let section_array = [];
        let kit_array = [];

        await array && array.map((data) => {
            if (data.user_id == props?.wdkit_meta?.userinfo?.id) {

                if (data.type == 'pagetemplate') {
                    template_array.push(data);
                } else if (data.type == 'section') {
                    section_array.push(data);
                } else if (data.type == 'websitekit') {
                    kit_array.push(data);
                }
            }
        })

        let final_array = {
            'pagetemplate': [...template_array],
            'section': [...section_array],
            'websitekit': [...kit_array]
        }
        setDataArray(final_array);
    }

    /** favourite and unfavourite event of template  */
    const updateFavorite = (val) => {
        userData.favoritetemplate = val;
        setUserData(userData);
    };

    /** close popup on click of ecs btn */
    function popup_close_esc() {
        window.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                if (document.querySelector(".wkit-model-transp.wkit-popup-show")) {
                    document
                        .querySelector(".wkit-model-transp.wkit-popup-show")
                        .classList.remove("wkit-popup-show");
                }
            } else if (event.key === "Escape") {
                document
                    .querySelector(".wkit-author-transp.wkit-popup-show")
                    .classList.remove("wkit-popup-show");
            }
        });
    }
    popup_close_esc();

    /** remove downlod popup  */
    const Wkit_popup_remove = (e) => {
        if (e) {
            e.currentTarget.closest(".wkit-model-transp.wkit-popup-show").innerHTML =
                "";
            setDownloadTempId("");
        }
    };


    const wdkitBuilderType = (id, post_type, type, temp_builder, builderList) => {
        if (id && post_type && temp_builder) {
            let download = [{ id: id, type: post_type }];
            if (builderList && temp_builder) {
                temp_builder = wkitGetBuilder(temp_builder, builderList);
            } else {
                temp_builder = "";
            }
            if (type == "section") {
                setDownloadTempId({
                    pages: [],
                    sections: download,
                    builder: temp_builder,
                });
            } else {
                setDownloadTempId({
                    pages: download,
                    sections: [],
                    builder: temp_builder,
                });
            }
        } else {
            setDownloadTempId(id);
        }
    };

    const Favourite_handler = () => {
        if (favoriteActive) {
            settotalpage(Math.ceil(DataArray[tab].length / perPage));
        } else {
            var fav_count = 0;
            userData?.favoritetemplate?.length > 0 && userData?.favoritetemplate.map((t_id) => {
                let index = DataArray?.[tab]?.length > 0 && DataArray?.[tab].findIndex((data) => data.id == t_id)
                if (index > -1) {
                    fav_count++;
                }
            })
            settotalpage(Math.ceil(fav_count / perPage));
        }
        setFavActive(!favoriteActive)
    }

    /**
     * 
     * @param {For check condition} type 
     * @param {In this parameter store array data page,section and kit} data 
     * @version 1.0.32 
     */
    const Manage_favourite_button = (type, data) => {
        if ('disable-btn' === type) {
            if (0 == data[tab]?.length) {
                return 'wkit-disable-btn-class';
            }
            return;
        } else if ('disable-element' === type) {
            if (0 == data[tab]?.length) {
                return 'wdkit-diabled-element';
            }
            return;
        }
    }

    /**
     *  
     * @param {In this parameter check which tab is open from page, section, or kit} data 
     * @version 1.0.35
     */
    const Handle_btn = (data) => {
            if (data === 'websitekit') {
                return 'Kit';
            } else {
                return 'Template';
            }
    }

    /** header tabing filter part */
    const Header_filter_part = () => {
        return (
            <div className="wkit-navbar">
                <div className="wkit-navbar-left-btn">
                    <button className={tab == "pagetemplate" ? "wdesignkit-menu tab-active" : "wdesignkit-menu"} onClick={() => { setActivePage(1); setTab("pagetemplate"); }}>
                        <div className="wdkit-img">
                            <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg"  >
                                <path fillRule="evenodd" clipRule="evenodd" d="M4 1.75C2.75736 1.75 1.75 2.75736 1.75 4V18C1.75 19.2426 2.75736 20.25 4 20.25H14C15.2426 20.25 16.25 19.2426 16.25 18V6.75H14C12.4812 6.75 11.25 5.51878 11.25 4V1.75H4ZM12.75 2.81066L15.1893 5.25H14C13.3096 5.25 12.75 4.69036 12.75 4V2.81066ZM0.25 4C0.25 1.92893 1.92893 0.25 4 0.25H12H12.3107L12.5303 0.46967L17.5303 5.46967L17.75 5.68934V6V18C17.75 20.0711 16.0711 21.75 14 21.75H4C1.92893 21.75 0.25 20.0711 0.25 18V4ZM4.25 11C4.25 10.5858 4.58579 10.25 5 10.25H10C10.4142 10.25 10.75 10.5858 10.75 11C10.75 11.4142 10.4142 11.75 10 11.75H5C4.58579 11.75 4.25 11.4142 4.25 11ZM5 14.75C4.58579 14.75 4.25 15.0858 4.25 15.5C4.25 15.9142 4.58579 16.25 5 16.25H13C13.4142 16.25 13.75 15.9142 13.75 15.5C13.75 15.0858 13.4142 14.75 13 14.75H5Z" className="wkit-svg-hover" />
                            </svg>
                        </div>
                        <div className="wdkit-filter-title">{__("Pages")}</div>
                    </button>
                    <button className={tab == "section" ? "wdesignkit-menu tab-active" : "wdesignkit-menu"} onClick={() => { setActivePage(1); setTab("section"); }}>
                        <div className="wdkit-img">
                            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                <path fillRule="evenodd" clipRule="evenodd" d="M1.5 1.5V20.5H8.5V1.5H1.5ZM1 0C0.447715 0 0 0.447716 0 1V21C0 21.5523 0.447715 22 1 22H9C9.55229 22 10 21.5523 10 21V1C10 0.447715 9.55228 0 9 0H1ZM13.5 1.5V8.5H20.5V1.5H13.5ZM13 0C12.4477 0 12 0.447715 12 1V9C12 9.55229 12.4477 10 13 10H21C21.5523 10 22 9.55228 22 9V1C22 0.447715 21.5523 0 21 0H13ZM12.7539 12.25C12.3397 12.25 12.0039 12.5858 12.0039 13C12.0039 13.4142 12.3397 13.75 12.7539 13.75H21.25C21.6642 13.75 22 13.4142 22 13C22 12.5858 21.6642 12.25 21.25 12.25H12.7539ZM12.0039 17C12.0039 16.5858 12.3397 16.25 12.7539 16.25H21.25C21.6642 16.25 22 16.5858 22 17C22 17.4142 21.6642 17.75 21.25 17.75H12.7539C12.3397 17.75 12.0039 17.4142 12.0039 17ZM12.7539 20.25C12.3397 20.25 12.0039 20.5858 12.0039 21C12.0039 21.4142 12.3397 21.75 12.7539 21.75H21.25C21.6642 21.75 22 21.4142 22 21C22 20.5858 21.6642 20.25 21.25 20.25H12.7539Z" className="wkit-svg-hover" />
                            </svg>
                        </div>
                        <div className="wdkit-filter-title">{__("Sections")}</div>
                    </button>
                    <div className="wdkit-menu-disable-button">
                        {wdkitData.use_editor !== 'wdkit' &&
                            <span className="wdkit-kit-disable-tooltip">
                                Our Pagekits can only be imported from the plugin dashboard, <a href={Get_site_url() + '/admin.php?page=wdesign-kit#/browse'} target="_blank" rel="noopener noreferrer">click here</a> to open the dashboard.
                            </span>
                        }
                        <button className={`${tab === "websitekit" ? "wdesignkit-menu tab-active" : "wdesignkit-menu"} ${wdkitData.use_editor !== 'wdkit' ? 'wdesignkit-menu-disable' : ''}`}
                            onClick={() => { setActivePage(1); setTab("websitekit"); }}
                        >
                            <div className="wdkit-img">
                                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                    <path fillRule="evenodd" clipRule="evenodd" d="M1.87873 4.07646L9.87873 2.07646C10.1943 1.99757 10.5 2.23625 10.5 2.56153V2.99998V4.49998V17.5V19V19.4384C10.5 19.7637 10.1943 20.0024 9.87873 19.9235L1.87873 17.9235C1.65615 17.8679 1.5 17.6679 1.5 17.4384V4.56153C1.5 4.3321 1.65615 4.13211 1.87873 4.07646ZM12 19V19.4384C12 20.7396 10.7772 21.6943 9.51493 21.3787L1.51493 19.3787C0.624594 19.1561 0 18.3562 0 17.4384V4.56153C0 3.6438 0.624595 2.84383 1.51493 2.62125L9.51493 0.621247C10.7772 0.305674 12 1.26039 12 2.56153V2.99998H17.5C18.6046 2.99998 19.5 3.89541 19.5 4.99998V17C19.5 18.1045 18.6046 19 17.5 19H12ZM12 4.49998V17.5H17.5C17.7761 17.5 18 17.2761 18 17V4.99998C18 4.72384 17.7761 4.49998 17.5 4.49998H12Z" className="wkit-svg-hover" />
                                </svg>
                            </div>
                            <div className="wdkit-filter-title">{__("Kits")}</div>
                        </button>
                    </div>
                </div>
                <div className={`wkit-navbar-right-btn ${Manage_favourite_button('disable-btn', DataArray)}`}>
                    <div className={`wdkit-favourite-btn ${Manage_favourite_button('disable-element', DataArray)}`} onClick={() => { Favourite_handler(); }}>
                        {favoriteActive ?
                            <svg className="wkit-active-favourite-svg" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.99888 2.24221C10.4655 0.525545 13.1822 -0.174455 15.3822 1.32555C16.5489 2.12555 17.2822 3.47555 17.3322 4.89221C17.4405 8.12555 14.5822 10.7172 10.2072 14.6839L10.1155 14.7672C9.48221 15.3505 8.50721 15.3505 7.87388 14.7755L7.79054 14.7005L7.74021 14.6548C3.39357 10.7056 0.549324 8.12146 0.665542 4.90055C0.715542 3.47555 1.44888 2.12555 2.61554 1.32555C4.81554 -0.182788 7.53221 0.525545 8.99888 2.24221Z" fill="#040483"></path></svg>
                            :
                            <svg className="wkit-svg-hover" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.6602 3.98968C17.0202 2.18968 13.7602 3.02968 12.0002 5.08968C10.2402 3.02968 6.98021 2.17968 4.34021 3.98968C2.94021 4.94968 2.06021 6.56968 2.00021 8.27968C1.86021 12.1597 5.30021 15.2697 10.5502 20.0397L10.6502 20.1297C11.4102 20.8197 12.5802 20.8197 13.3402 20.1197L13.4502 20.0197C18.7002 15.2597 22.1302 12.1497 22.0002 8.26968C21.9402 6.56968 21.0602 4.94968 19.6602 3.98968ZM12.1002 18.5497L12.0002 18.6497L11.9002 18.5497C7.14021 14.2397 4.00021 11.3897 4.00021 8.49968C4.00021 6.49968 5.50021 4.99968 7.50021 4.99968C9.04021 4.99968 10.5402 5.98968 11.0702 7.35968H12.9402C13.4602 5.98968 14.9602 4.99968 16.5002 4.99968C18.5002 4.99968 20.0002 6.49968 20.0002 8.49968C20.0002 11.3897 16.8602 14.2397 12.1002 18.5497Z" fill="#040483" /></svg>
                        }
                        <span className="wdkit-favourite-btn-title">{__("Favourites")}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wkit-myupload-main">
            {window.wdkit_editor == 'wdkit' &&
                <Page_header
                    title={'My Templates'}
                    svg={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 20H20M9.5 15.5V9.5H5L12 2.5L19 9.5H14.5V15.5H9.5Z" stroke="#040483" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>}
                />
            }
            {Header_filter_part()}
            {/* template design */}
            <div className="wdkit-loop">
                {loading == false && DataArray[tab]?.length > 0 &&
                    <div className="wdesign-kit-main">
                        {Object.values(DataArray[tab]).slice(start_id, end_id).map((data, index) => {
                            if (data.user_id == props?.wdkit_meta?.userinfo?.id) {
                                listLength = (listLength == '') ? 0 : listLength
                                return (
                                    <Fragment key={index}>
                                        {tab == "websitekit" ? ((!favoriteActive && data.type === tab && checkBuilder(data.post_builder, selectBuilder)) ||
                                            (favoriteActive && userData.favoritetemplate.includes(Number(data.id))
                                                && checkBuilder(data.post_builder, selectBuilder))) &&
                                            (listLength++,
                                                <Template_loop
                                                    userData={userData}
                                                    userinfo={props?.wdkit_meta?.userinfo}
                                                    handler={(val) => updateFavorite(val)}
                                                    handlerTempID={(val) => setDownloadTempId(val)}
                                                    data={data}
                                                    credits={props?.wdkit_meta?.credits}
                                                    builder={userData.builder}
                                                    currentPage={activePage}
                                                    setLoading={(val) => { setloading(val) }}
                                                    UpdateUserData={(val) => (props.wdkit_set_meta(val.data))}
                                                    favorite={userData.favoritetemplate}
                                                    type={tab + "-view"}
                                                    width={'24%'}
                                                    wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                                />)
                                            : ((!favoriteActive && data.type === tab && checkBuilder(data.post_builder, selectBuilder)) ||
                                                (favoriteActive && userData.favoritetemplate.includes(Number(data.id))
                                                    && checkBuilder(data.post_builder, selectBuilder))) && (
                                                listLength++,
                                                <Template_loop
                                                    userData={userData}
                                                    userinfo={props?.wdkit_meta?.userinfo}
                                                    handler={(val) => updateFavorite(val)}
                                                    credits={props?.wdkit_meta?.credits}
                                                    handlerTempID={(val) => {
                                                        wdkitData.use_editor == "wdkit"
                                                            ? wdkitBuilderType(val, data.wp_post_type, data.type, Number(data.post_builder), userData.builder) : setDownloadTempId(val);
                                                    }}
                                                    UpdateUserData={(val) => (props.wdkit_set_meta(val.data))}
                                                    setLoading={(val) => { setloading(val) }}
                                                    data={data}
                                                    builder={userData.builder}
                                                    currentPage={activePage}
                                                    favorite={userData.favoritetemplate}
                                                    type={tab}
                                                    handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId("") }}
                                                    width={'24%'}
                                                    wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                                />
                                            )}
                                    </Fragment>
                                );
                            }
                        })}
                    </div>
                }
                {loading == true &&
                    <Wkit_template_Skeleton />
                }
                {loading == false && listLength <= 0 &&
                    <Wkit_availble_not page={Handle_btn(tab)}
                        link={tab === "websitekit"
                            ? `${wdkitData.WDKIT_DOC_URL}docs/create-pagekit-from-sections-and-full-pages-for-elementor-or-gutenberg/`
                            : `${wdkitData.WDKIT_DOC_URL}documents/export-templates-from-your-elementor-site-to-cloud/`}
                    />
                }
            </div>

            {downTempId && (
                <div className={"wkit-model-transp wkit-popup-show"}>
                    <div className={"wkit-plugin-model-content wkit-import-template"}>
                        <a className={"wkit-plugin-popup-close"} onClick={(e) => { Wkit_popup_remove(e); setSuccessImport(false), setDownloadTempId(""); }}>
                            <span>
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black"></path></svg>
                            </span>
                        </a>
                        {!successImport ? (
                            <Plugin_missing
                                template_id={downTempId}
                                handlerSuccessImport={(val, customMeta) => {
                                    setSuccessImport(val)
                                    setCustomMetaImport(customMeta)
                                }}
                                type={wdkitData.use_editor}
                                templateData={userData.template}
                                pluginData={userData.plugin}
                            />
                        ) : (
                            <Fragment>
                                <Success_import_template
                                    template_id={downTempId}
                                    custom_meta_import={customMetaImport}
                                    template_list={DataArray[tab]}
                                    handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId(""); }}
                                    wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                />
                            </Fragment>
                        )}
                    </div>
                </div>
            )}
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
                            forcePages={activePage - 1}
                            onPageActive={() => { }}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

export default MyUploaded;