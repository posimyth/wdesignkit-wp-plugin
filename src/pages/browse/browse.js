import axios from 'axios';
import { useState, useEffect, useMemo, useRef } from 'react';
import { DebounceInput } from 'react-debounce-input'
import ReactPaginate from 'react-paginate';
import { json, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Wkit_template_Skeleton, Wkit_browse_template_Skeleton, Wkit_availble_not, Get_site_url } from '../../helper/helper-function';
import { Wkit_Filter_Template } from './mobile-filter-template';
import '../browse/browse.scss'
import Browse_template_skeleton from './browse-template-skeleton';
import { __ } from '@wordpress/i18n';

const { Fragment } = wp.element;

const {
    Template_loop,
    Plugin_missing,
    Success_import_template,
    wkit_getCategoryList,
    form_data,
    wkit_get_user_login,
    wkitGetBuilder,
    checkBuilder,
} = wp.wkit_Helper;

let controller = new AbortController();

const Browse = (props) => {

    const history = useNavigate();
    var img_path = wdkitData.WDKIT_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [browseData, setBrowseData] = useState("loading");
    const [categoryData, setCategoryData] = useState([]);
    const [filterToggle, setFilterToggle] = useState(true);
    const [accordionToggle, setAccordionToggle] = useState(['free_pro', 'type', 'plugins', 'category-0', 'tags']);
    const [pluginCheck, setPluginCheck] = useState([]);
    const [tagCheck, setTagCheck] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchvalue, setsearchvalue] = useState('');
    const [categoryCheck, setCategoryCheck] = useState([]);
    const [freeProCheck, setFreeProCheck] = useState('');
    const [selectBuilder, setSelectBuilder] = useState('');
    const [downTempId, setDownloadTempId] = useState('');
    const [successImport, setSuccessImport] = useState(false);
    const [customMetaImport, setCustomMetaImport] = useState(false);
    const [searchTag, setSearchTag] = useState('');
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(12);
    const [searchTagList, setSearchTagList] = useState({})
    const inputRef = useRef(null);
    const [PageTypeCheck, setPageTypeCheck] = useState([]);
    const [BuilderArray, setBuilderArray] = useState([]);
    const [filterArgs, setFilterArgs] = useState({
        'type': 'browse_page',
        'builder': '',
        'buildertype': window.wdkit_editor,
        'perpage': perPage,
        'page': activePage,
    });

    const location = useLocation();

    let data = wkit_get_user_login();
    if (!data && Object.values(props).length > 0) {
        props.wdkit_Login_Route('/browse');
    }

    /** Set browse in path of url if not */
    useEffect(() => {

        if (location?.pathname != '/browse') {
            window.location.hash = '#/browse';
        }

        if (location.search == '') {
            if (window.wdkit_editor == 'wdkit') {

                let newObj = {
                    'type': 'browse_page',
                    'builder': '',
                    'buildertype': window.wdkit_editor,
                    'perpage': perPage,
                    'page': activePage,
                    'page_type': JSON.stringify(['websitekit'])
                };
                setPageTypeCheck(['websitekit']);
                setFilterArgs(newObj);

                const querystring = new URLSearchParams(URL_data(newObj)).toString();
                history(`/browse?${querystring}`);
            }
        } else {
            const queryParams = new URLSearchParams(location.search);
            const newFilterArgs = {};
            Array.from(queryParams?.entries()).map(([key, value]) => {
                newFilterArgs[key] = value;
            });

            setFilterArgs(prevFilterArgs => ({ ...prevFilterArgs, ...newFilterArgs }));

            if (newFilterArgs.search) {
                setsearchvalue(newFilterArgs.search);
                setSearchQuery(newFilterArgs.search);
            }
            if (newFilterArgs.builder) {
                setSelectBuilder(newFilterArgs.builder);
            }
            if (newFilterArgs.free_pro) {
                setFreeProCheck(newFilterArgs.free_pro);
            }
            if (newFilterArgs.page_type) {
                setPageTypeCheck(JSON.parse(newFilterArgs.page_type));
            }
            if (newFilterArgs.plugin) {
                setPluginCheck(JSON.parse(newFilterArgs.plugin));
            }
            if (newFilterArgs.category) {
                setCategoryCheck(JSON.parse(newFilterArgs.category));
            }
            if (newFilterArgs.tag) {
                setTagCheck(JSON.parse(newFilterArgs.tag));
            }

        }

    }, [])

    let label_val = {
        'websitekit': __('Page Kits', 'wdesignkit'),
        'section': __('Sections', 'wdesignkit'),
        'pagetemplate': __('Full Pages', 'wdesignkit')
    }

    useEffect(() => {
        let builders = [];
        if (props?.wdkit_meta?.Setting?.elementor_template) {
            builders.push(1001);
        }
        if (props?.wdkit_meta?.Setting?.gutenberg_template) {
            builders.push(1002);
        }
        setBuilderArray(builders);

    }, [props?.wdkit_meta?.Setting])

    const Mobile_filter = () => {
        if (document.querySelector(".wkit-mobile-filter-main")) {
            document.querySelector(".wkit-mobile-filter-main").classList.add("wkit-filter-menu-show");
        }
    }

    /** main filter function for templates */
    const BrowseFilter = async () => {
        setIsLoading(true)

        if (BuilderArray.length > 0) {

            if (window.wdkit_editor == 'wdkit') {
                if (selectBuilder) {
                    var api_data = Object.assign({}, filterArgs, { builder: JSON.stringify([selectBuilder]) });
                } else {
                    var api_data = Object.assign({}, filterArgs, { builder: JSON.stringify(BuilderArray) });
                }
            } else {
                var api_data = Object.assign({}, filterArgs, { builder: '' });

                if (PageTypeCheck.length < 1) {
                    var api_data = Object.assign({}, api_data, { page_type: JSON.stringify(['pagetemplate', 'section']) });
                } else {
                    var api_data = Object.assign({}, api_data, { page_type: JSON.stringify([PageTypeCheck]) });
                }
            }

            if (controller) {
                controller.abort();
            }

            controller = new AbortController();

            let form = new FormData();
            form.append('action', 'get_wdesignkit');
            form.append('kit_nonce', wdkitData.kit_nonce);

            Object.entries(api_data).forEach(([key, val]) => {
                form.append(key, val);
            });

            var res = await axios.post(ajaxurl, form, { signal: controller.signal })
                .then(result => { setBrowseData(result.data); return result.data; });
            if (categoryData == '' && res?.category) {
                setCategoryData(wkit_getCategoryList(res?.category))
                if (Object.keys(searchTagList).length === 0) {
                    setSearchTagList(res.tags)
                }
            }
            setIsLoading(false)
        }
    }

    /** Call BrowseFilter function on change of filter panel  */
    useMemo(() => {
        BrowseFilter()
    }, [filterArgs, BuilderArray]);

    /** Search tag from Tag-list for filter  */
    const browseTagList = (val) => {
        setSearchTag(val);
        if (val) {
            setSearchTagList(browseData?.tags?.filter(
                data => data.tag_name.toLowerCase().includes(val.toLowerCase())
            ))
        } else {
            setSearchTagList(browseData?.tags)
        }
    }

    /** for toggel event of filter sections */
    const AccordionFun = (type) => {
        if (accordionToggle?.includes(type)) {
            var arr = accordionToggle.filter(item => item !== type)
            setAccordionToggle(arr)
        } else {
            setAccordionToggle([...accordionToggle, type])
        }
    }

    /**
     * Filter function for remove unnecessary items before send in URL 
     * 
     * @data original data in Object format 
     * @version 1.0.39
     * 
    */
    const URL_data = (data) => {
        return Object.fromEntries(Object.entries(data).filter(([key, value]) => value.length > 1 && value !== "[]" && key !== 'type' && key !== 'page' && key !== 'perpage' && key !== 'buildertype'));
    }

    /**
     * Filter function for set new filter value in filterArgs
     * 
     * @since 1.0.0
     * @version 1.0.6
     * 
    */
    const handleFilterChecked = async (e, filter = 'plugins') => {
        const { value, checked } = e.target;

        if ('builder' === filter) {
            if (checked) {
                var newdata = Object.assign({}, filterArgs, { 'builder': value }, { 'page': 1 });
                setSelectBuilder(value);
                setActivePage(1);
                setFilterArgs(newdata)
            } else {
                var newdata = Object.assign({}, filterArgs, { 'builder': '' }, { 'page': 1 });
                setSelectBuilder('');
                setActivePage(1);
                setFilterArgs(newdata);
            }
        }

        if ('plugins' === filter) {
            if (checked) {
                var pluginList = [...pluginCheck, Number(value)]
                setPluginCheck(pluginList);
                var newdata = Object.assign({}, filterArgs, { 'plugin': JSON.stringify(pluginList) }, { 'page': 1 });
                setActivePage(1);
            } else {
                var pluginList = pluginCheck?.filter((e) => e !== Number(value));
                setPluginCheck(pluginList)
                setActivePage(1);
                var newdata = Object.assign({}, filterArgs, { 'plugin': JSON.stringify(pluginList) }, { 'page': 1 });
            }
        }

        if ('tags' === filter) {
            if (checked) {
                var tagList = [...tagCheck, Number(value)];
                await setTagCheck(tagList)
                var newdata = Object.assign({}, filterArgs, { 'tag': JSON.stringify(tagList) }, { 'page': 1 });
                setActivePage(1);
            } else {
                var tagList = tagCheck.filter((e) => e !== Number(value));
                await setTagCheck(tagList)
                var newdata = Object.assign({}, filterArgs, { 'tag': JSON.stringify(tagList) }, { 'page': 1 });
                setActivePage(1);
            }
        }

        if ('category' === filter) {
            if (checked) {
                var catList = [...categoryCheck, Number(value)];
                setCategoryCheck(catList)
                var newdata = Object.assign({}, filterArgs, { 'category': JSON.stringify(catList) }, { 'page': 1 });
                setActivePage(1);
            } else {
                var catList = categoryCheck?.filter((e) => e !== Number(value))
                setCategoryCheck(catList)
                var newdata = Object.assign({}, filterArgs, { 'category': JSON.stringify(catList) }, { 'page': 1 });
                setActivePage(1);
            }
        }

        if ('search' === filter) {
            var newdata = Object.assign({}, filterArgs, { 'search': searchQuery, 'page': 1 });
            setActivePage(1);
        }

        if ('free_pro' === filter) {
            if (checked) {
                var newdata = Object.assign({}, filterArgs, { 'free_pro': value }, { 'page': 1 });
                setFreeProCheck(value);
                setActivePage(1);
            } else {
                var newdata = Object.assign({}, filterArgs, { 'free_pro': '' }, { 'page': 1 });
                setFreeProCheck('');
                setActivePage(1);
            }
        }

        if ('pageType' === filter) {
            var pageTypeList = [value]

            setPageTypeCheck(value);
            setCategoryCheck([]);
            var newdata = Object.assign({}, filterArgs, { 'page_type': JSON.stringify(pageTypeList) }, { 'search': searchQuery }, { 'category': [] }, { 'page': 1 });
            setActivePage(1);
        }
        var newdata = Object.assign({}, newdata, { 'search': searchQuery });
        setFilterArgs(newdata);
        setsearchvalue(searchQuery);

        const querystring = new URLSearchParams(URL_data(newdata)).toString();
        history(`/browse?${querystring}`);
    }

    /** Arrow up icon function */
    const arrowUp = () => {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L5.72241 7.71186L9.44482 4" stroke="#9C9CD1" strokeWidth="1.11356" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    /** Arrow down icon function */
    const arrowDown = () => {
        return (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.44482 7.71191L5.72241 4.00005L2 7.71191" stroke="#9C9CD1" strokeWidth="1.11356" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    }

    /** for close download template popup */
    const Wkit_popup_remove = (e) => {
        if (e) {
            e.currentTarget.closest('.wkit-model-transp.wkit-popup-show').innerHTML = '';
            setDownloadTempId('')
        }
    }

    /**
     * Filter Panel
     * 
     * @since 1.0.0
     * @version 1.0.6
     * 
    */
    const FilterPanel = () => {

        if (filterToggle) {
            return (
                <div className="wkit-browse-inner-column">
                    <div className='wkit-expand-filter'>
                        <div className="wkit-left-main-title">{__('Filters', 'wdesignkit')}</div>
                        <div style={{ cursor: 'pointer' }} onClick={() => { setFilterToggle(!filterToggle) }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.64182 7.47781L6.76141 4.58998L9.64924 1.70215C9.93877 1.41262 9.93877 0.944928 9.64924 0.655403C9.35972 0.365878 8.89202 0.365878 8.6025 0.655403L5.195 4.06289C4.90548 4.35242 4.90548 4.82011 5.195 5.10964L8.6025 8.51713C8.89202 8.80666 9.35972 8.80666 9.64924 8.51713C9.93134 8.23503 9.93134 7.75991 9.64182 7.47781ZM1.69843 0.135742C2.10673 0.135742 2.4408 0.46981 2.4408 0.878115V8.30184C2.4408 8.71015 2.10673 9.04422 1.69843 9.04422C1.29012 9.04422 0.956055 8.71015 0.956055 8.30184V0.878115C0.956055 0.46981 1.29012 0.135742 1.69843 0.135742Z" fill="#19191B" />
                            </svg>
                        </div>
                    </div>

                    {SearchFilter()}
                    {BuilderFilter()}
                    <div className="filter-wrapper">
                        {FreeProFilter()}
                        <hr />
                        {PageTypeFilter()}
                        <hr />

                        {PluginFilter()}

                        <hr />

                        {CategoryFilter()}
                        {TagFilter()}
                    </div>
                </div>
            );
        } else {
            return (
                <div className='filter-abosulte' onClick={() => { setFilterToggle(!filterToggle) }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.724998 7.9175L3.635 5L0.7175 2.0825C0.425 1.79 0.425 1.3175 0.7175 1.025C1.01 0.7325 1.4825 0.7325 1.775 1.025L5.2175 4.4675C5.51 4.76 5.51 5.2325 5.2175 5.525L1.775 8.9675C1.4825 9.26 1.01 9.26 0.7175 8.9675C0.4325 8.6825 0.432499 8.2025 0.724998 7.9175ZM8.75 0.5C8.3375 0.5 8 0.8375 8 1.25V8.75C8 9.1625 8.3375 9.5 8.75 9.5C9.1625 9.5 9.5 9.1625 9.5 8.75V1.25C9.5 0.8375 9.1625 0.5 8.75 0.5Z" fill="white" />
                    </svg>
                    {__('Filters', 'wdesignkit')}
                </div>
            );
        }
    }

    /**
     * Search Filter Html Part 
     * 
     * @since 1.0.2
    */
    const handleKeyPress = (e) => {
        if ('Enter' === e.key) {
            handleFilterChecked(e, 'search');
            inputRef.current.blur();
        }
    };

    /**search filter html part */
    const SearchFilter = () => {
        return (
            <Fragment>
                <div className='wkit-wb-filterTitle'>{__('Search', 'wdesignkit')}</div>
                <div className='wkit-search-filter'>
                    <div className='wkit-browse-search-inner'>
                        <input
                            className='wkit-browse-search'
                            placeholder={__('Search Templates', 'wdesignkit')}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value) }}
                            onKeyDown={handleKeyPress}
                            ref={inputRef}
                        />
                        <span className="wkit_search_button wkit-btn-class" onClick={(e) => { handleFilterChecked(e, 'search') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none">
                                <path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Fragment>
        )
    }

    const checkBuilderActivation = (id) => {
        if (id == 0) {
            return true;
        }

        if (BuilderArray.includes(id)) {
            return true;
        } else {
            return false;
        }
    }

    /** builder filter html part */
    const BuilderFilter = (e) => {
        if (wdkitData.use_editor != 'wdkit') {
            return false;
        }
        if (BuilderArray.length <= 1) {
            return false;
        }

        return (
            <Fragment>
                <div className='wkit-wb-filterTitle'>{__('Page Builder', 'wdesignkit')}</div>
                <div className='wkit-choose-builder-wrap wkit-mt-15 wkit-justify-left'>
                    {(browseData?.builder.length > 0) &&
                        Object.values(browseData?.builder)?.map((data, index) => {
                            if (checkBuilderActivation(data.p_id)) {
                                return (
                                    <div className='wkit-wb-widgetType' key={index}>
                                        <div className='wkit-select-builder-list'>
                                            <input
                                                type="checkbox"
                                                className='wkit-builder-radio'
                                                id={"select_builder_" + data.original_slug}
                                                value={data.p_id}
                                                onChange={(e) => { handleFilterChecked(e, 'builder') }}
                                                checked={filterArgs.builder == data.p_id ? true : false}
                                            />
                                            <label className="wkit-builder-label" htmlFor={"select_builder_" + data.original_slug}>
                                                {data.plugin_icon != '' &&
                                                    <img className={`wkit-browse-filter-builder ${filterArgs.builder == data.p_id ? 'wkit-select-builder' : ''}`} src={data.plugin_icon} draggable={false} />
                                                }
                                                <span className='wkit-builder-toolTip'>{data.original_slug}</span>
                                            </label>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </Fragment>
        );
    }

    /** free pro filter html part */
    const FreeProFilter = (e) => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => AccordionFun('free_pro')}>
                    <div className="wkit-filter-heading">{__('Free / Pro', 'wdesignkit')}</div>
                    <div className="wkit-arrow-down">
                        {(accordionToggle?.includes('free_pro')) ? arrowDown() : arrowUp()}
                    </div>
                </div>
                {accordionToggle?.includes('free_pro') &&
                    <div className='wkit-freePro-wrap wkit-accordion-content'>
                        <label htmlFor='wkit-free-btn-label' className='wkit-select-freePro-type'>
                            <input
                                type="checkbox"
                                className='wkit-check-box wkit-freePro-radio-inp'
                                id='wkit-free-btn-label'
                                value={'free'}
                                onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                                checked={filterArgs.free_pro == 'free' ? true : false}
                            />
                            <span className='wkit-freePro-label'>{__('Free', 'wdesignkit')}</span>
                        </label>
                        <label htmlFor='wkit-pro-btn-label' className='wkit-select-freePro-type'>
                            <input
                                type="checkbox"
                                className='wkit-check-box wkit-freePro-radio-inp'
                                id='wkit-pro-btn-label'
                                value={'pro'}
                                onChange={(e) => { handleFilterChecked(e, 'free_pro') }}
                                checked={filterArgs.free_pro == 'pro' ? true : false}
                            />
                            <span className='wkit-freePro-label'>{__('Pro', 'wdesignkit')}</span>
                        </label>
                    </div>
                }
            </Fragment>
        );
    }

    /**
     * Page Type filter html Part 
     * 
     * @since 1.0.0
     * @version 1.0.6
     * 
    */
    const PageTypeFilter = () => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => AccordionFun('type')}>
                    <div className="wkit-filter-heading">{__('Type', 'wdesignkit')}</div>
                    <div className="wkit-arrow-down">
                        {(accordionToggle?.includes('type')) ? arrowDown() : arrowUp()}
                    </div>
                </div>

                {accordionToggle?.includes('type') &&
                    <div className='wkit-accordion-content'>
                        <div className='wkit-pageType-wrap'>
                            <label htmlFor={'wkit_paget_type_pagetemplate'} className='wkit-pageType-list'>
                                <input type="radio" value={'pagetemplate'} className='wkit-styled-type-radio' id={'wkit_paget_type_pagetemplate'} name={"selectPageType"} onChange={(e) => handleFilterChecked(e, 'pageType')} checked={PageTypeCheck.includes('pagetemplate') ? true : false} />
                                <span className='wkit-type-selection'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 12 14" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.08325 1.60382C2.35838 1.60382 1.77075 2.19145 1.77075 2.91632V11.083C1.77075 11.8079 2.35838 12.3955 3.08325 12.3955H8.91659C9.64146 12.3955 10.2291 11.8079 10.2291 11.083V4.52049H8.91659C8.03063 4.52049 7.31242 3.80228 7.31242 2.91632V1.60382H3.08325ZM8.18742 2.22254L9.61037 3.64549H8.91659C8.51388 3.64549 8.18742 3.31903 8.18742 2.91632V2.22254ZM0.895752 2.91632C0.895752 1.7082 1.87513 0.728821 3.08325 0.728821H7.74992H7.93114L8.05928 0.856962L10.9759 3.77363L11.1041 3.90177V4.08299V11.083C11.1041 12.2911 10.1247 13.2705 8.91659 13.2705H3.08325C1.87513 13.2705 0.895752 12.2911 0.895752 11.083V2.91632ZM3.22909 6.99965C3.22909 6.75803 3.42496 6.56215 3.66659 6.56215H6.58325C6.82488 6.56215 7.02075 6.75803 7.02075 6.99965C7.02075 7.24128 6.82488 7.43715 6.58325 7.43715H3.66659C3.42496 7.43715 3.22909 7.24128 3.22909 6.99965ZM3.66659 9.18715C3.42496 9.18715 3.22909 9.38303 3.22909 9.62465C3.22909 9.86628 3.42496 10.0622 3.66659 10.0622H8.33325C8.57488 10.0622 8.77075 9.86628 8.77075 9.62465C8.77075 9.38303 8.57488 9.18715 8.33325 9.18715H3.66659Z" fill="black" />
                                    </svg>
                                    <span>{__("Full Pages", 'wdesignkit')}</span>
                                </span>
                            </label>
                            <label htmlFor={"wkit_paget_type_section"} className='wkit-pageType-list'>
                                <input type="radio" value={'section'} className='wkit-styled-type-radio' id={'wkit_paget_type_section'} name={"selectPageType"} onChange={(e) => handleFilterChecked(e, 'pageType')} checked={PageTypeCheck.includes('section') ? true : false} />
                                <span className='wkit-type-selection'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 14 14" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M1.45825 1.45868V12.542H5.54159V1.45868H1.45825ZM1.16659 0.583679C0.844419 0.583679 0.583252 0.844846 0.583252 1.16701V12.8337C0.583252 13.1558 0.84442 13.417 1.16659 13.417H5.83325C6.15542 13.417 6.41659 13.1558 6.41659 12.8337V1.16701C6.41659 0.844846 6.15542 0.583679 5.83325 0.583679H1.16659ZM8.45825 1.45868V5.54201H12.5416V1.45868H8.45825ZM8.16659 0.583679C7.84442 0.583679 7.58325 0.844847 7.58325 1.16701V5.83368C7.58325 6.15585 7.84442 6.41701 8.16659 6.41701H12.8333C13.1554 6.41701 13.4166 6.15585 13.4166 5.83368V1.16701C13.4166 0.844846 13.1554 0.583679 12.8333 0.583679H8.16659ZM8.02303 7.72951C7.78141 7.72951 7.58553 7.92539 7.58553 8.16701C7.58553 8.40864 7.78141 8.60451 8.02303 8.60451H12.9791C13.2207 8.60451 13.4166 8.40864 13.4166 8.16701C13.4166 7.92539 13.2207 7.72951 12.9791 7.72951H8.02303ZM7.58553 10.5003C7.58553 10.2587 7.78141 10.0628 8.02303 10.0628H12.9791C13.2207 10.0628 13.4166 10.2587 13.4166 10.5003C13.4166 10.742 13.2207 10.9378 12.9791 10.9378H8.02303C7.78141 10.9378 7.58553 10.742 7.58553 10.5003ZM8.02303 12.3962C7.78141 12.3962 7.58553 12.5921 7.58553 12.8337C7.58553 13.0753 7.78141 13.2712 8.02303 13.2712H12.9791C13.2207 13.2712 13.4166 13.0753 13.4166 12.8337C13.4166 12.5921 13.2207 12.3962 12.9791 12.3962H8.02303Z" fill="black" />
                                    </svg>
                                    <span>{__("Sections", 'wdesignkit')}</span>
                                </span>
                            </label>
                            <div className='wkit-pagetype-disabled'>
                                {wdkitData.use_editor !== 'wdkit' &&
                                    <span className='wkit-pageType-list-tooltip'>
                                        {__('Our Pagekits can only be imported from the plugin dashboard,', 'wdesignkit')} <a href={Get_site_url() + '/admin.php?page=wdesign-kit#/browse'} target="_blank" rel="noopener noreferrer">{__('click here', 'wdesignkit')}</a> {__('to open the dashboard.', 'wdesignkit')}

                                    </span>
                                }
                                <label htmlFor={'wkit_page_type_websitekit'} className={wdkitData.use_editor !== 'wdkit' ? 'wkit-pageType-list wkit-pageType-list-disabled' : 'wkit-pageType-list'}>
                                    <input type="radio" value={'websitekit'} className='wkit-styled-type-radio' id={'wkit_page_type_websitekit'} name={"selectPageType"} onChange={(e) => { handleFilterChecked(e, 'pageType') }} checked={PageTypeCheck.includes('websitekit') ? true : false} />
                                    <span className='wkit-type-selection'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M3.68292 4.61448L9.90514 3.05893C10.1506 2.99757 10.3883 3.18321 10.3883 3.4362V16.5627C10.3883 16.8157 10.1506 17.0013 9.90514 16.94L3.68292 15.3844C3.5098 15.3411 3.38835 15.1856 3.38835 15.0071V4.99176C3.38835 4.81331 3.50979 4.65776 3.68292 4.61448ZM2.22168 4.99176C2.22168 4.27797 2.70748 3.65577 3.39996 3.48265L9.62218 1.92709C10.604 1.68165 11.555 2.4242 11.555 3.4362V3.77592H11.5553H15.8331C16.6922 3.77592 17.3887 4.47236 17.3887 5.33147V14.6648C17.3887 15.5239 16.6922 16.2204 15.8331 16.2204H11.5553H11.555V16.5627C11.555 17.5747 10.604 18.3172 9.62218 18.0718L3.39996 16.5162C2.70748 16.3431 2.22168 15.7209 2.22168 15.0071V4.99176ZM11.5553 4.94258H15.8331C16.0479 4.94258 16.222 5.11669 16.222 5.33147V14.6648C16.222 14.8796 16.0479 15.0537 15.8331 15.0537H11.5553V4.94258Z" fill="black" />
                                        </svg>
                                        <span>{__("Page Kits", 'wdesignkit')}</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                }
            </Fragment>
        );
    }

    /** plugin filter html part */
    const PluginFilter = () => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => AccordionFun('plugins')}>
                    <div className="wkit-filter-heading">{__('Plugins', 'wdesignkit')}</div>
                    <div className="wkit-arrow-down">
                        {(accordionToggle?.includes('plugins')) ? arrowDown() : arrowUp()}
                    </div>
                </div>
                {accordionToggle?.includes('plugins') &&
                    <div className='wkit-accordion-content'>
                        <div className='wkit-plugin-wrap'>
                            {Object.values(browseData?.plugin)?.map((data, index) => {
                                if (window.wdkit_editor != 'wdkit') {
                                    if (window.wdkit_editor == 'elementor') {
                                        var builder_id = '1001';
                                    } else if (window.wdkit_editor == 'gutenberg') {
                                        var builder_id = '1002';
                                    } else {
                                        var builder_id = '0';
                                    }

                                    if (builder_id == data.plugin_builder || data.plugin_builder == 0) {
                                        return (
                                            <label htmlFor={"plugin_" + data.p_id} className='wkit-plugin-name' key={index}>
                                                <input type="checkbox" value={data.p_id} className='wkit-check-box wkit-styled-checkbox' id={"plugin_" + data.p_id} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'plugins')} checked={pluginCheck.includes(Number(data.p_id)) ? true : false} />
                                                <span className='wkit-plugin-selection-temp'>
                                                    <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} alt="tpae-logo" draggable={false} />
                                                    <span>{data.plugin_name}</span>
                                                </span>
                                            </label>
                                        )
                                    }
                                } else {
                                    if (checkBuilderActivation(data.plugin_builder) && (filterArgs.builder == data.plugin_builder || filterArgs.builder == '' || data.plugin_builder == 0)) {
                                        return (
                                            <label htmlFor={"plugin_" + data.p_id} className='wkit-plugin-name' key={index}>
                                                <input type="checkbox" value={data.p_id} className='wkit-check-box wkit-styled-checkbox' id={"plugin_" + data.p_id} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'plugins')} checked={pluginCheck.includes(Number(data.p_id)) ? 'checked' : ''} />
                                                <span className='wkit-plugin-selection-temp'>
                                                    <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} alt="tpae-logo" draggable={false} />
                                                    <span>{data.plugin_name}</span>
                                                </span>
                                            </label>
                                        )
                                    }
                                }
                            })
                            }
                        </div>
                    </div>
                }
            </Fragment>
        );
    }

    /** Category filter html part */
    const CategoryFilter = () => {
        if (Object.values(categoryData).length <= 0) {
            return false;
        }

        return (
            <Fragment>
                {Object.entries(categoryData)?.map(([key, val], index) => {


                    var Check_kit = '';
                    if ((wdkitData.use_editor !== 'wdkit' && key == 'Website Kits')) {
                        Check_kit = 'Website Kits';
                    }

                    if (PageTypeCheck == key.split(' ').join('').toLowerCase().slice(0, -1)) {

                        /**
                         * 
                         * @param {This parameter takes name to return data} key 
                         * @version 1.0.35 
                         */
                        const handle_name = (key) => {
                            if ('Website Kits' === key) {
                                return 'Page Kits'
                            } else {
                                return key
                            }
                        }

                        return (
                            <Fragment key={index} >
                                <div className={('Website Kits' === Check_kit) ? 'wkit-filter-container' : ''}>
                                    {'Website Kits' === Check_kit &&
                                        <span className='wkit-pageType-mobile-tooltip'>
                                            {__('Our Pagekits can only be imported from the plugin dashboard,', 'wdesignkit')} <a href={'/admin.php?page=wdesign-kit#/browse'} target="_blank" rel="noopener noreferrer">{__('click here', 'wdesignkit')}</a> {__('to open the dashboard.', 'wdesignkit')}
                                        </span>
                                    }
                                    <div className={'Website Kits' === Check_kit ? 'wkit-filter-accordion wkit-filter-accordion-disable' : 'wkit-filter-accordion'} onClick={() => AccordionFun('category-' + index)}>
                                        <div className="wkit-filter-heading">{handle_name(key)}</div>
                                        <div className="wkit-arrow-down">
                                            {(accordionToggle?.includes('category-' + index)) ? arrowDown() : arrowUp()}
                                        </div>
                                    </div>
                                </div>
                                {(accordionToggle?.includes('category-' + index)) &&
                                    <div className='wkit-accordion-content'>
                                        <div className='wkit-plugin-wrap'>
                                            {Object.entries(val)?.map(([keyChild, valChild], index) => {
                                                return (
                                                    <label htmlFor={"category_" + keyChild} className='wkit-plugin-name' key={index}>
                                                        <input type="checkbox" value={keyChild} className='wkit-check-box wkit-styled-checkbox' id={"category_" + keyChild} name={"selectPlugin"} onChange={(e) => handleFilterChecked(e, 'category')} checked={categoryCheck.includes(Number(keyChild)) ? 'checked' : ''} />
                                                        <span>{valChild.term_name}</span>
                                                    </label>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                }
                                <hr />
                            </Fragment>
                        );
                    }
                })}
            </Fragment>
        );
    }

    /** Tag filter html part */
    const TagFilter = () => {
        return (
            <Fragment>
                <div className='wkit-filter-accordion' onClick={() => AccordionFun('tags')}>
                    <div className="wkit-filter-heading">{__('Tags', 'wdesignkit')}</div>
                    <div className="wkit-arrow-down">
                        {(accordionToggle?.includes('tags')) ? arrowDown() : arrowUp()}
                    </div>
                </div>
                {(accordionToggle?.includes('tags')) &&
                    <div className='wkit-accordion-content'>
                        <div className='wkit-browse-search-inner'>
                            <DebounceInput
                                className='wkit-browse-search'
                                placeholder={__('Search Tags', 'wdesignkit')}
                                name="wkit-search"
                                type="text"
                                minLength={0}
                                debounceTimeout={500}
                                onChange={(e) => { browseTagList(e.target.value) }}
                                value={searchTag}
                            />
                            <button type="submit" className="wkit_search_button wkit-btn-class">
                                <svg className="wkit-search-icon" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none">
                                    <path d="M14.4299 5.92969L20.4999 11.9997L14.4299 18.0697" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                        {Object.values(searchTagList)?.length > 0 &&
                            <div className='wkit-browse-tag'>
                                {browseData.tags.map((data, index) => {
                                    if (tagCheck.includes(data?.tag_id)) {
                                        return (
                                            <div className='wkit-tag-filter-list' key={index}>
                                                <input type="checkbox" value={data.tag_id} className='wkit-tag-checkbox' id={"tag_" + data.tag_id} name={"selectTags"} onChange={(e) => handleFilterChecked(e, 'tags')} checked={tagCheck.includes(Number(data.tag_id)) ? 'checked' : ''} />
                                                <span className="wkit-browse-tag-name wkit-active-tag">{data.tag_name}
                                                    <label htmlFor={"tag_" + data.tag_id}
                                                        className='wkit-browse-tag-remove'>
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="white"></path></svg>
                                                    </label>
                                                </span>
                                            </div>
                                        )
                                    }
                                })}
                                {Object.values(searchTagList)?.map((data, index) => {
                                    if (index < (5 + tagCheck.length) && !tagCheck.includes(data?.tag_id)) {
                                        return (
                                            <div className='wkit-tag-filter-list' key={index}>
                                                <input type="checkbox" value={data.tag_id} className='wkit-tag-checkbox' id={"tag_" + data.tag_id} name={"selectTags"} onChange={(e) => handleFilterChecked(e, 'tags')} checked={tagCheck.includes(Number(data.tag_id)) ? 'checked' : ''} />
                                                <label className="wkit-browse-tag-name" htmlFor={"tag_" + data.tag_id}>{data.tag_name}</label>
                                            </div>
                                        )
                                    }
                                })
                                }
                            </div>
                        }
                    </div>
                }
            </Fragment>
        );
    }

    const TemplateList = () => {
        return (
            <Fragment>
                {(isLoading == false && browseData?.template.length > 0) &&
                    <div className={!filterToggle ? "wkit-browse-filter-close wdesign-kit-main" : 'wdesign-kit-main'}>
                        {Object.values(browseData.template).map((data, index) => {
                            return (
                                <Fragment key={index}>
                                    {(data.is_activated == 'active' && wdkitData.use_editor == 'wdkit' && checkBuilder(data.post_builder, 'all', browseData?.builder) || wdkitData.use_editor != 'wdkit') &&
                                        <Template_loop
                                            data={data}
                                            builder={browseData.builder}
                                            currentPage={activePage}
                                            credits={props?.wdkit_meta?.credits}
                                            handlerTempID={(val) => {
                                                if (wdkitData.use_editor == 'wdkit') {
                                                    wdkitBuilderType(val, data.wp_post_type, data.type, Number(data.post_builder), browseData.builder)
                                                } else {
                                                    setDownloadTempId(val)
                                                }
                                            }}
                                            type={data.type == 'websitekit' ? data.type + '-view' : data.type}
                                            filter={'browse'}
                                            width={'24%'}
                                            wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                        />
                                    }
                                </Fragment>
                            );
                        })}
                    </div>
                }
            </Fragment>
        );
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

    const Pagination = () => {
        if (browseData?.template.length > 0 && browseData?.totalpage > 1) {
            return (
                <div className='wkit-pagination-main'>
                    <ReactPaginate
                        breakLabel={"..."}
                        nextLabel={<svg xmlns="http://www.w3.org/2000/svg" width="7" height="11" viewBox="0 0 7 11" fill="none">
                            <path d="M0.412598 9.52417L4.48371 5.44417L0.412598 1.36417L1.66593 0.11084L6.99926 5.44417L1.66593 10.7775L0.412598 9.52417Z" fill="#8991A4" />
                        </svg>}
                        pageRangeDisplayed={2}
                        pageCount={browseData.totalpage}
                        marginPagesDisplayed={1}
                        previousLabel={<svg xmlns="http://www.w3.org/2000/svg" width="8" height="11" viewBox="0 0 8 11" fill="none">
                            <path d="M7.47754 1.36352L3.40643 5.44352L7.47754 9.52352L6.22421 10.7769L0.890873 5.44352L6.22421 0.110189L7.47754 1.36352Z" fill="#8991A4" />
                        </svg>}
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
                                filterArgs['page'] = (clickEvent.nextSelectedPage + 1);
                                setFilterArgs({ ...filterArgs })
                                setActivePage(clickEvent.nextSelectedPage + 1)
                            }
                        }}
                        forcePage={activePage - 1}
                        onPageActive={() => { }}
                    />
                    {/* <div className='wkit-action'>
                        <select value={perPage} onChange={(e) => { setPerPage(e.target.value); setActivePage(1); filterArgs['perpage'] = e.target.value; filterArgs['page'] = 1; setFilterArgs({ ...filterArgs }); }} className='wkit-select wkit-pagination-select'>
                            <option value={10}>{10}</option>
                            <option value={15}>{15}</option>
                            <option value={20}>{20}</option>
                        </select>
                    </div> */}
                </div>
            );
        }
    }

    const GetBuilderName = (id) => {
        let builder_list = browseData?.builder;
        let index = builder_list.findIndex((builder) => builder.p_id == id);

        if (index > -1) {
            return builder_list[index].original_slug;
        }
    }

    const FilterArray = () => {
        const Remove_filter = (id, type) => {
            let removedObj;
            if (type == 'plugin') {
                let array = [...pluginCheck];
                array = array.filter((e) => e !== Number(id))
                setPluginCheck(array)
                removedObj = Object.assign({}, filterArgs, { 'plugin': JSON.stringify(array) })
            } else if (type == 'category') {
                let array = [...categoryCheck];
                array = array.filter((e) => e !== Number(id))
                setCategoryCheck(array)
                removedObj = Object.assign({}, filterArgs, { 'category': JSON.stringify(array) })
            } else if (type == 'tag') {
                let array = [...tagCheck];
                array = array.filter((e) => e !== Number(id))
                setTagCheck(array)
                removedObj = Object.assign({}, filterArgs, { 'tag': JSON.stringify(array) })
            } else if (type == 'page_type') {
                setPageTypeCheck([]);
                removedObj = Object.assign({}, filterArgs, { 'page_type': '' })
            } else if (type == 'search') {
                setsearchvalue('')
                setSearchQuery('')
                removedObj = Object.assign({}, filterArgs, { 'search': '' })
            } else if (type == 'builder') {
                setSelectBuilder('');
                removedObj = Object.assign({}, filterArgs, { 'builder': '' })
            } else if (type == 'free_pro') {
                setFreeProCheck('');
                removedObj = Object.assign({}, filterArgs, { 'free_pro': '' })
            }

            setFilterArgs(removedObj);
            const querystring = new URLSearchParams(URL_data(removedObj)).toString();
            history(`/browse?${querystring}`);
        }

        const ResetFilter = () => {
            setPluginCheck([]);
            setTagCheck([]);
            setCategoryCheck([]);
            setPageTypeCheck([]);
            setFreeProCheck('');
            setsearchvalue('')
            setSearchQuery('')
            setSelectBuilder('')
            setFilterArgs(Object.assign({}, filterArgs, {
                'type': 'browse_page',
                'builder': '',
                'buildertype': window.wdkit_editor,
                'perpage': perPage,
                'page_type': '',
                'page': activePage,
                'category': '',
                'tag': '',
                'search': '',
                'free_pro': '',
                'plugin': ''
            }))
            history('/browse');
        }

        return (
            <div className='wkit-free-dropdown-mixed'>
                {/* Applied Filter*/}
                {(freeProCheck != '' || pluginCheck.length > 0 || categoryCheck.length > 0 || tagCheck.length > 0 || searchvalue != '' || selectBuilder != '' || PageTypeCheck != 0) &&
                    <div className={"wkit-browse-applied-filter"}>
                        <Fragment>
                            <label className={"applied-filter-text"}>{__('Applied Filter :', 'wdesignkit')}</label>
                            {freeProCheck != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{freeProCheck}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'free_pro')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                    </button>
                                </div>
                            }
                            {searchvalue != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{searchvalue}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'search')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                    </button>
                                </div>
                            }
                            {selectBuilder != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{GetBuilderName(selectBuilder)}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'builder')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                    </button>
                                </div>
                            }
                            {pluginCheck.length > 0 &&
                                Object.values(browseData?.plugin)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {pluginCheck?.includes(data.p_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <img src={data.plugin_icon ? data.plugin_icon : wdkitData.WDKIT_URL + "assets/images/placeholder.jpg"} alt="tpae-logo" />
                                                        <span>{data.plugin_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.p_id, 'plugin') }}>
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                                    </button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            {PageTypeCheck != '' &&
                                <div className={"wkit-applied-list"}>
                                    <label>
                                        <span>{label_val?.[PageTypeCheck]}</span>
                                    </label>
                                    <button onClick={(e) => Remove_filter(e, 'page_type')}>
                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                    </button>
                                </div>
                            }
                            {categoryCheck.length > 0 &&
                                Object.values(browseData?.category)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {categoryCheck.includes(data.term_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <span>{data.term_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.term_id, 'category') }}>
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                                    </button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            {tagCheck?.length > 0 &&
                                Object.values(browseData?.tags)?.map((data, index) => {
                                    return (
                                        <Fragment key={index}>
                                            {tagCheck.includes(data?.tag_id) &&
                                                <div className={"wkit-applied-list"}>
                                                    <label>
                                                        <span>{data.tag_name}</span>
                                                    </label>
                                                    <button onClick={() => { Remove_filter(data.tag_id, 'tag') }}>
                                                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.40091 15.2558C1.66182 15.5169 2.01481 15.6637 2.38274 15.6637C2.75067 15.6637 3.10366 15.5169 3.36456 15.2558L8.29499 10.2193L13.2254 15.2558C13.5884 15.6217 14.118 15.7645 14.6141 15.6306C15.1103 15.4967 15.4981 15.1062 15.6309 14.6064C15.7639 14.1067 15.6221 13.5733 15.2588 13.2076L10.2587 8.24141L15.2588 3.27521C15.5659 2.91424 15.6703 2.42082 15.5365 1.96497C15.4027 1.50913 15.0485 1.15236 14.5959 1.01757C14.1431 0.882762 13.6535 0.987976 13.2949 1.29727L8.29499 6.26348L3.36455 1.29727C3.00619 0.987976 2.51632 0.882762 2.06375 1.01757C1.61119 1.15237 1.257 1.50911 1.12317 1.96497C0.989339 2.42082 1.0938 2.91424 1.40087 3.27521L6.3313 8.24141L1.40087 13.2076C1.11968 13.4728 0.959961 13.8436 0.959961 14.2316C0.959961 14.6198 1.11968 14.9904 1.40087 15.2557L1.40091 15.2558Z" fill="black" /></svg>
                                                    </button>
                                                </div>
                                            }
                                        </Fragment>)
                                })
                            }
                            <button className={"wdkit-reset-all-filters wkit-btn-class"} onClick={() => { ResetFilter() }}>
                                {__('Clear All', 'wdesignkit')}
                            </button>
                        </Fragment>
                    </div>
                }
            </div>
        );
    }

    return (
        <div className={`wkit-browse-main ${isLoading == true ? 'wkit-temp-skeleton' : ''} ${browseData?.template ? '' : 'wkit-skeleton'}`}>
            {(browseData?.template) ?
                <Fragment>
                    <div className={"wkit-browse-column " + (!filterToggle ? "wkit-browse-column-collapse" : '')}>
                        {FilterPanel()}
                    </div>
                    <div className='filter-abosulte wkit-browse-mobile-filter' onClick={() => { Mobile_filter() }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.724998 7.9175L3.635 5L0.7175 2.0825C0.425 1.79 0.425 1.3175 0.7175 1.025C1.01 0.7325 1.4825 0.7325 1.775 1.025L5.2175 4.4675C5.51 4.76 5.51 5.2325 5.2175 5.525L1.775 8.9675C1.4825 9.26 1.01 9.26 0.7175 8.9675C0.4325 8.6825 0.432499 8.2025 0.724998 7.9175ZM8.75 0.5C8.3375 0.5 8 0.8375 8 1.25V8.75C8 9.1625 8.3375 9.5 8.75 9.5C9.1625 9.5 9.5 9.1625 9.5 8.75V1.25C9.5 0.8375 9.1625 0.5 8.75 0.5Z" fill="white" />
                        </svg>
                        {__('Filters', 'wdesignkit')}
                    </div>
                    <Wkit_Filter_Template
                        filter_type={'template'}
                        filter_data={filterArgs}
                        setfilter_data={(new_data) => { setFilterArgs(new_data) }}
                        setcategory_check={(cat_data) => { setCategoryCheck(cat_data) }}
                        setfreePro_check={(free_pro) => { setFreeProCheck(free_pro) }}
                        settag_check={(cat_data) => { setTagCheck(cat_data) }}
                        setplugin_check={(plugin_data) => { setPluginCheck(plugin_data) }}
                        setbuilder_check={(builder_data) => { setSelectBuilder(builder_data) }}
                        setpageType_check={(page_type_data) => { setPageTypeCheck(page_type_data) }}
                        setsearch_check={(search_data) => { setsearchvalue(search_data) }}
                        category_list={categoryData}
                        searchvalue={searchvalue}
                        builder_list={browseData?.builder}
                        plugin_list={browseData?.plugin}
                        tag_list={browseData?.tags}
                        BuilderArray={BuilderArray}
                    />
                    <div className="wkit-browse-right-column">
                        {FilterArray()}
                        <div className="wdkit-loop">
                            {TemplateList()}
                            {isLoading == true && <Browse_template_skeleton cards={true} />}
                            {isLoading == false && browseData?.template.length <= 0 && <Wkit_availble_not page={'template'} link={wdkitData.WDKIT_DOC_URL + 'docs/export-templates-from-elementor-site-to-cloud'} />}
                            {Pagination()}
                        </div>
                    </div>
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
                                        type={wdkitData?.use_editor}
                                        templateData={browseData?.template}
                                        pluginData={browseData?.plugin}
                                        pageNow={'browse'}
                                        navigation={history} />
                                    :
                                    <Success_import_template
                                        template_id={downTempId}
                                        custom_meta_import={customMetaImport}
                                        template_list={browseData?.template}
                                        handlerAfterSuccessImported={() => { setSuccessImport(false), setDownloadTempId('') }}
                                        wdkit_set_toast={(title, subtitle, icon, type) => { props.wdkit_set_toast([title, subtitle, icon, type]) }}
                                    />
                                }
                            </div>
                        </div>
                    }
                </Fragment>
                :
                <Browse_template_skeleton cards={true} filter={true} filterArgs={filterArgs} />
            }
        </div>

    );
}
export default Browse;